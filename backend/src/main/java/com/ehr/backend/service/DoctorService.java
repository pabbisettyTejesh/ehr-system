package com.ehr.backend.service;

import com.ehr.backend.dto.request.*;
import com.ehr.backend.entity.*;
import com.ehr.backend.enums.*;
import com.ehr.backend.exception.AccessDeniedCustomException;
import com.ehr.backend.exception.BadRequestException;
import com.ehr.backend.exception.ResourceNotFoundException;
import com.ehr.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorProfileRepository doctorProfileRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final AppointmentRepository appointmentRepository;
    private final EncounterRepository encounterRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final PrescriptionItemRepository prescriptionItemRepository;
    private final AllergyRepository allergyRepository;
    private final ReportRepository reportRepository;

    private static final List<AppointmentStatus> VALID_ACCESS_STATUSES =
            List.of(AppointmentStatus.SCHEDULED, AppointmentStatus.ACTIVE);

    public DoctorProfile getProfileByUserId(Long userId) {
        return doctorProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found"));
    }

    /**
     * Core rule (17.1): full access only if an active/scheduled appointment
     * links this doctor to this patient, and (if set) current time is within
     * the appointment's access window.
     */
    public void assertHasFullAccess(Long doctorProfileId, Long patientProfileId) {
        Appointment appt = appointmentRepository
                .findFirstByDoctorIdAndPatientIdAndStatusIn(doctorProfileId, patientProfileId, VALID_ACCESS_STATUSES)
                .orElseThrow(() -> new AccessDeniedCustomException(
                        "No valid appointment/link found for this patient. Full access denied."));

        LocalDateTime now = LocalDateTime.now();
        if (appt.getAccessStartTime() != null && now.isBefore(appt.getAccessStartTime())) {
            throw new AccessDeniedCustomException("Appointment access window has not started yet.");
        }
        if (appt.getAccessEndTime() != null && now.isAfter(appt.getAccessEndTime())) {
            throw new AccessDeniedCustomException("Appointment access window has expired.");
        }
    }

    public List<Appointment> getMyAppointedPatients(Long doctorProfileId) {
        return appointmentRepository.findByDoctorIdAndStatusIn(doctorProfileId, VALID_ACCESS_STATUSES);
    }

    /** Same as above but enriched with patient name/UID so the frontend
     *  can show a searchable dropdown instead of asking for a raw ID. */
    public List<com.ehr.backend.dto.response.AppointedPatientResponse> getMyAppointedPatientsDetailed(Long doctorProfileId) {
        List<Appointment> appts = appointmentRepository.findByDoctorIdAndStatusIn(doctorProfileId, VALID_ACCESS_STATUSES);
        List<com.ehr.backend.dto.response.AppointedPatientResponse> result = new java.util.ArrayList<>();
        for (Appointment a : appts) {
            PatientProfile p = patientProfileRepository.findById(a.getPatientId()).orElse(null);
            result.add(new com.ehr.backend.dto.response.AppointedPatientResponse(
                    a.getId(), a.getPatientId(),
                    p != null ? p.getPatientUid() : null,
                    p != null ? p.getFullName() : "Unknown",
                    a.getStatus().name(), a.getAppointmentDate(), a.getAccessEndTime(),
                    a.getMeetingLink()
            ));
        }
        return result;
    }

    /** Doctor's own encounters, enriched with patient name/UID so they can
     *  be picked from a dropdown when adding a medical record or prescription. */
    public List<com.ehr.backend.dto.response.EncounterSummaryResponse> getMyEncountersDetailed(Long doctorProfileId) {
        List<Encounter> encounters = encounterRepository.findByDoctorId(doctorProfileId);
        List<com.ehr.backend.dto.response.EncounterSummaryResponse> result = new java.util.ArrayList<>();
        for (Encounter e : encounters) {
            PatientProfile p = patientProfileRepository.findById(e.getPatientId()).orElse(null);
            result.add(new com.ehr.backend.dto.response.EncounterSummaryResponse(
                    e.getId(), e.getPatientId(),
                    p != null ? p.getPatientUid() : null,
                    p != null ? p.getFullName() : "Unknown",
                    e.getHospitalName(), e.getVisitDate(), e.getVisitType().name(), e.getChiefComplaint()
            ));
        }
        // Most recent first -- the encounter you just created is usually the one you want next.
        result.sort((a, b) -> b.getId().compareTo(a.getId()));
        return result;
    }

    /** Limited-visibility search by Patient UID -- does NOT grant full access. */
    public PatientProfile searchPatientByUid(String patientUid) {
        return patientProfileRepository.findByPatientUid(patientUid)
                .orElseThrow(() -> new ResourceNotFoundException("No patient found with that UID"));
    }

    public PatientProfile getFullPatientSummary(Long doctorProfileId, Long patientProfileId) {
        assertHasFullAccess(doctorProfileId, patientProfileId);
        return patientProfileRepository.findById(patientProfileId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
    }

    public com.ehr.backend.dto.response.PatientFullDataResponse getPatientFullData(Long doctorProfileId, Long patientId) {
        assertHasFullAccess(doctorProfileId, patientId);
        
        PatientProfile profile = patientProfileRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
                
        List<Encounter> encounters = encounterRepository.findByPatientId(patientId);
        List<MedicalRecord> medicalRecords = medicalRecordRepository.findByPatientId(patientId);
        List<Prescription> prescriptions = prescriptionRepository.findByPatientId(patientId);
        List<Allergy> allergies = allergyRepository.findByPatientId(patientId);
        List<Report> reports = reportRepository.findByPatientId(patientId);
        
        return new com.ehr.backend.dto.response.PatientFullDataResponse(
                profile, encounters, medicalRecords, prescriptions, allergies, reports
        );
    }

    @Transactional
    public Encounter createEncounter(Long doctorProfileId, CreateEncounterRequest req) {
        assertHasFullAccess(doctorProfileId, req.getPatientId());

        Encounter e = new Encounter();
        e.setAppointmentId(req.getAppointmentId());
        e.setPatientId(req.getPatientId());
        e.setDoctorId(doctorProfileId);
        e.setHospitalName(req.getHospitalName());
        e.setDepartmentName(req.getDepartmentName());
        e.setVisitDate(LocalDateTime.now());
        try {
            e.setVisitType(req.getVisitType() != null ? VisitType.valueOf(req.getVisitType()) : VisitType.NORMAL);
        } catch (IllegalArgumentException ex) {
            e.setVisitType(VisitType.NORMAL);
        }
        e.setChiefComplaint(req.getChiefComplaint());
        e.setSummary(req.getSummary());
        return encounterRepository.save(e);
    }

    public List<Encounter> getMyEncounters(Long doctorProfileId) {
        return encounterRepository.findByDoctorId(doctorProfileId);
    }

    private Long getOrCreateTodayEncounter(Long patientId, Long doctorId) {
        java.time.LocalDate today = java.time.LocalDate.now();
        List<Encounter> patientEncounters = encounterRepository.findByPatientId(patientId);
        
        for (Encounter e : patientEncounters) {
            if (e.getDoctorId().equals(doctorId) && e.getVisitDate().toLocalDate().equals(today)) {
                return e.getId();
            }
        }

        Encounter newEncounter = new Encounter();
        newEncounter.setPatientId(patientId);
        newEncounter.setDoctorId(doctorId);
        newEncounter.setVisitDate(java.time.LocalDateTime.now());
        newEncounter.setVisitType(com.ehr.backend.enums.VisitType.NORMAL);
        newEncounter.setHospitalName("Auto-Generated Session");
        newEncounter.setChiefComplaint("Clinical Session");
        newEncounter = encounterRepository.save(newEncounter);
        return newEncounter.getId();
    }

    @Transactional
    public MedicalRecord addMedicalRecord(Long doctorProfileId, CreateMedicalRecordRequest req) {
        assertHasFullAccess(doctorProfileId, req.getPatientId());

        MedicalRecord mr = new MedicalRecord();
        mr.setEncounterId(getOrCreateTodayEncounter(req.getPatientId(), doctorProfileId));
        mr.setPatientId(req.getPatientId());
        mr.setDoctorId(doctorProfileId);
        mr.setDiagnosis(req.getDiagnosis());
        mr.setSymptoms(req.getSymptoms());
        mr.setClinicalNotes(req.getClinicalNotes());
        mr.setTreatmentPlan(req.getTreatmentPlan());
        mr.setRecordStatus(RecordStatus.ACTIVE);
        return medicalRecordRepository.save(mr);
    }

    @Transactional
    public Prescription createPrescription(Long doctorProfileId, CreatePrescriptionRequest req) {
        assertHasFullAccess(doctorProfileId, req.getPatientId());

        // Allergy safety check -- warn via exception message is avoided; we just
        // flag matches. Frontend can also proactively check /doctor/allergies.
        List<Allergy> activeAllergies = allergyRepository
                .findByPatientIdAndStatus(req.getPatientId(), AllergyStatus.ACTIVE);

        Prescription p = new Prescription();
        p.setEncounterId(getOrCreateTodayEncounter(req.getPatientId(), doctorProfileId));
        p.setPatientId(req.getPatientId());
        p.setDoctorId(doctorProfileId);
        p.setStatus(PrescriptionStatus.ACTIVE);
        p = prescriptionRepository.save(p);

        StringBuilder allergyWarning = new StringBuilder();
        for (var itemDto : req.getItems()) {
            PrescriptionItem item = new PrescriptionItem();
            item.setPrescriptionId(p.getId());
            item.setMedicineName(itemDto.getMedicineName());
            item.setDosage(itemDto.getDosage());
            item.setFrequency(itemDto.getFrequency());
            item.setDuration(itemDto.getDuration());
            item.setInstructions(itemDto.getInstructions());
            prescriptionItemRepository.save(item);

            for (Allergy allergy : activeAllergies) {
                if (allergy.getAllergenName() != null && itemDto.getMedicineName() != null
                        && itemDto.getMedicineName().toLowerCase().contains(allergy.getAllergenName().toLowerCase())) {
                    allergyWarning.append("Warning: ").append(itemDto.getMedicineName())
                            .append(" may conflict with known allergy to ")
                            .append(allergy.getAllergenName()).append(". ");
                }
            }
        }

        if (allergyWarning.length() > 0) {
            // In a fuller implementation this would be returned as a structured
            // warning object instead of thrown; kept simple for MVP.
            System.out.println("ALLERGY WARNING for patient " + req.getPatientId() + ": " + allergyWarning);
        }

        return p;
    }

    @Transactional
    public Prescription markPrescriptionStatus(Long doctorProfileId, Long prescriptionId, PrescriptionStatus status) {
        Prescription p = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found"));
        assertHasFullAccess(doctorProfileId, p.getPatientId());
        p.setStatus(status);
        return prescriptionRepository.save(p);
    }

    @Transactional
    public Allergy addOrUpdateAllergy(Long doctorProfileId, CreateAllergyRequest req) {
        assertHasFullAccess(doctorProfileId, req.getPatientId());

        Allergy allergy = new Allergy();
        allergy.setPatientId(req.getPatientId());
        allergy.setAllergenName(req.getAllergenName());
        allergy.setReaction(req.getReaction());
        try {
            allergy.setSeverity(Severity.valueOf(req.getSeverity()));
        } catch (Exception e) {
            allergy.setSeverity(Severity.LOW);
        }
        allergy.setStatus(AllergyStatus.ACTIVE);
        allergy.setRecordedByDoctorId(doctorProfileId);
        allergy.setNotes(req.getNotes());
        return allergyRepository.save(allergy);
    }

    @Transactional
    public Allergy updateAllergy(Long doctorProfileId, Long allergyId, UpdateAllergyRequest req) {
        Allergy allergy = allergyRepository.findById(allergyId)
                .orElseThrow(() -> new ResourceNotFoundException("Allergy record not found"));
        assertHasFullAccess(doctorProfileId, allergy.getPatientId());

        if (req.getAllergenName() != null) allergy.setAllergenName(req.getAllergenName());
        if (req.getReaction() != null) allergy.setReaction(req.getReaction());
        if (req.getSeverity() != null) {
            try {
                allergy.setSeverity(Severity.valueOf(req.getSeverity()));
            } catch (Exception ignored) {}
        }
        if (req.getStatus() != null) {
            try {
                AllergyStatus newStatus = AllergyStatus.valueOf(req.getStatus());
                allergy.setStatus(newStatus);
                if (newStatus == AllergyStatus.RESOLVED) {
                    allergy.setResolvedAt(LocalDateTime.now());
                }
            } catch (Exception ignored) {}
        }
        if (req.getNotes() != null) allergy.setNotes(req.getNotes());

        return allergyRepository.save(allergy);
    }

    @Transactional
    public Report addReport(Long doctorProfileId, CreateReportRequest req, Long uploadedByUserId) {
        assertHasFullAccess(doctorProfileId, req.getPatientId());

        Report r = new Report();
        r.setEncounterId(getOrCreateTodayEncounter(req.getPatientId(), doctorProfileId));
        r.setPatientId(req.getPatientId());
        r.setUploadedByUserId(uploadedByUserId);
        r.setReportName(req.getReportName());
        r.setReportType(req.getReportType());
        r.setHospitalName(req.getHospitalName());
        r.setVisibility(ReportVisibility.NORMAL);
        return reportRepository.save(r);
    }

    @Transactional
    public Appointment updateMeetingLink(Long doctorProfileId, Long appointmentId, UpdateAppointmentMeetingLinkRequest req) {
        Appointment appt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        if (!appt.getDoctorId().equals(doctorProfileId)) {
            throw new AccessDeniedCustomException("You can only add meeting links to your own appointments.");
        }
        appt.setMeetingLink(req.getMeetingLink());
        return appointmentRepository.save(appt);
    }

    @Transactional
    public Appointment generateMeetingLink(Long doctorProfileId, Long appointmentId) {
        Appointment appt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        if (!appt.getDoctorId().equals(doctorProfileId)) {
            throw new AccessDeniedCustomException("You can only generate meeting links for your own appointments.");
        }
        
        // Generate a unique Jitsi Meet link
        String uniqueId = java.util.UUID.randomUUID().toString();
        String link = "https://meet.jit.si/EHR-Consult-" + uniqueId;
        
        appt.setMeetingLink(link);
        return appointmentRepository.save(appt);
    }

    @Transactional
    public Appointment deleteMeetingLink(Long doctorProfileId, Long appointmentId) {
        Appointment appt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        if (!appt.getDoctorId().equals(doctorProfileId)) {
            throw new AccessDeniedCustomException("You can only delete meeting links for your own appointments.");
        }
        appt.setMeetingLink(null);
        return appointmentRepository.save(appt);
    }
}
