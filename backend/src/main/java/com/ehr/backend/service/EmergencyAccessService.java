package com.ehr.backend.service;

import com.ehr.backend.dto.request.EmergencyAccessRequest;
import com.ehr.backend.dto.response.EmergencyAccessResponse;
import com.ehr.backend.entity.*;
import com.ehr.backend.enums.AllergyStatus;
import com.ehr.backend.enums.ApprovalStatus;
import com.ehr.backend.enums.PrescriptionStatus;
import com.ehr.backend.exception.AccessDeniedCustomException;
import com.ehr.backend.exception.BadRequestException;
import com.ehr.backend.exception.ResourceNotFoundException;
import com.ehr.backend.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmergencyAccessService {

    private final PatientProfileRepository patientProfileRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final AllergyRepository allergyRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final PrescriptionItemRepository prescriptionItemRepository;
    private final EmergencyAccessLogRepository emergencyAccessLogRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Rule 17.2: doctor must be ACTIVE and must supply a reason. Patient UID
     * alone never grants full access -- only this restricted critical-data set.
     */
    @Transactional
    public EmergencyAccessResponse getEmergencyData(Long doctorUserId, Long doctorProfileId,
                                                      EmergencyAccessRequest req,
                                                      String ipAddress, String userAgent) {

        DoctorProfile doctor = doctorProfileRepository.findById(doctorProfileId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found"));

        if (doctor.getApprovalStatus() != ApprovalStatus.ACTIVE) {
            throw new AccessDeniedCustomException("Doctor account is not active");
        }

        if (req.getReason() == null || req.getReason().isBlank()) {
            throw new BadRequestException("Emergency access reason is mandatory");
        }

        PatientProfile patient = patientProfileRepository.findByPatientUid(req.getPatientUid())
                .orElseThrow(() -> new ResourceNotFoundException("No patient found with that UID"));

        EmergencyAccessResponse resp = new EmergencyAccessResponse();
        resp.setPatientName(patient.getFullName());
        resp.setAge(calculateAge(patient.getDateOfBirth()));
        resp.setGender(patient.getGender());
        resp.setBloodGroup(patient.getBloodGroup());
        resp.setEmergencyContactName(patient.getEmergencyContactName());
        resp.setEmergencyContactPhone(patient.getEmergencyContactPhone());

        List<Allergy> activeAllergies = allergyRepository
                .findByPatientIdAndStatus(patient.getId(), AllergyStatus.ACTIVE);
        resp.setActiveAllergies(activeAllergies.stream().map(a -> {
            var s = new EmergencyAccessResponse.AllergySummary();
            s.setAllergenName(a.getAllergenName());
            s.setSeverity(a.getSeverity() != null ? a.getSeverity().name() : null);
            s.setReaction(a.getReaction());
            return s;
        }).collect(Collectors.toList()));

        // Critical summary only: pull diagnosis lines flagged as chronic-style records.
        List<MedicalRecord> records = medicalRecordRepository.findByPatientId(patient.getId());
        resp.setChronicConditions(records.stream()
                .map(MedicalRecord::getDiagnosis)
                .filter(d -> d != null && !d.isBlank())
                .distinct()
                .limit(10)
                .collect(Collectors.toList()));

        // Current active medications only (no full prescription history).
        List<Prescription> activePrescriptions = prescriptionRepository
                .findByPatientIdAndStatus(patient.getId(), PrescriptionStatus.ACTIVE);
        resp.setCurrentMedications(activePrescriptions.stream()
                .flatMap(p -> prescriptionItemRepository.findByPrescriptionId(p.getId()).stream())
                .map(item -> item.getMedicineName() + " " + (item.getDosage() != null ? item.getDosage() : ""))
                .collect(Collectors.toList()));

        // Major past surgeries -- best-effort extraction from treatment plans.
        resp.setPastMajorSurgeries(records.stream()
                .map(MedicalRecord::getTreatmentPlan)
                .filter(t -> t != null && t.toLowerCase().contains("surgery"))
                .distinct()
                .limit(10)
                .collect(Collectors.toList()));

        // Mandatory logging of every emergency access.
        EmergencyAccessLog log = new EmergencyAccessLog();
        log.setDoctorId(doctorProfileId);
        log.setPatientId(patient.getId());
        log.setReason(req.getReason());
        log.setIpAddress(ipAddress);
        log.setUserAgent(userAgent);
        try {
            log.setCriticalDataSnapshot(objectMapper.writeValueAsString(resp));
        } catch (Exception ignored) {}
        emergencyAccessLogRepository.save(log);

        return resp;
    }

    private Integer calculateAge(LocalDate dob) {
        if (dob == null) return null;
        return Period.between(dob, LocalDate.now()).getYears();
    }
}
