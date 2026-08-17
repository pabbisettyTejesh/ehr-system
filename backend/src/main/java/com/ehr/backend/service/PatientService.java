package com.ehr.backend.service;

import com.ehr.backend.dto.request.UpdatePatientProfileRequest;
import com.ehr.backend.entity.*;
import com.ehr.backend.enums.AccessMode;
import com.ehr.backend.exception.ResourceNotFoundException;
import com.ehr.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientProfileRepository patientProfileRepository;
    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final AllergyRepository allergyRepository;
    private final ReportRepository reportRepository;
    private final AccessLogRepository accessLogRepository;
    private final EmergencyAccessLogRepository emergencyAccessLogRepository;

    public PatientProfile getProfileByUserId(Long userId) {
        return patientProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));
    }

    @Transactional
    public PatientProfile updateProfile(Long userId, UpdatePatientProfileRequest req) {
        PatientProfile profile = getProfileByUserId(userId);
        if (req.getFullName() != null) profile.setFullName(req.getFullName());
        if (req.getGender() != null) profile.setGender(req.getGender());
        if (req.getBloodGroup() != null) profile.setBloodGroup(req.getBloodGroup());
        if (req.getAddress() != null) profile.setAddress(req.getAddress());
        if (req.getCity() != null) profile.setCity(req.getCity());
        if (req.getEmergencyContactName() != null) profile.setEmergencyContactName(req.getEmergencyContactName());
        if (req.getEmergencyContactPhone() != null) profile.setEmergencyContactPhone(req.getEmergencyContactPhone());
        patientProfileRepository.save(profile);

        if (req.getPhone() != null) {
            User user = userRepository.findById(userId).orElseThrow();
            user.setPhone(req.getPhone());
            userRepository.save(user);
        }
        return profile;
    }

    public List<Appointment> getMyAppointments(Long patientProfileId) {
        return appointmentRepository.findByPatientId(patientProfileId);
    }

    public List<MedicalRecord> getMyMedicalHistory(Long patientProfileId) {
        return medicalRecordRepository.findByPatientId(patientProfileId);
    }

    public List<Prescription> getMyPrescriptions(Long patientProfileId) {
        return prescriptionRepository.findByPatientId(patientProfileId);
    }

    public List<Allergy> getMyAllergies(Long patientProfileId) {
        return allergyRepository.findByPatientId(patientProfileId);
    }

    public List<Report> getMyReports(Long patientProfileId) {
        return reportRepository.findByPatientId(patientProfileId);
    }

    public List<AccessLog> getMyAccessLogs(Long patientProfileId) {
        return accessLogRepository.findByPatientId(patientProfileId);
    }

    public List<EmergencyAccessLog> getMyEmergencyLogs(Long patientProfileId) {
        return emergencyAccessLogRepository.findByPatientId(patientProfileId);
    }
}
