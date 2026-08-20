package com.ehr.backend.service;

import com.ehr.backend.dto.request.CreateAppointmentRequest;
import com.ehr.backend.dto.request.CreatePatientByAdminRequest;
import com.ehr.backend.dto.request.ApproveAppointmentRequest;
import com.ehr.backend.dto.response.AuthResponse;
import com.ehr.backend.entity.*;
import com.ehr.backend.enums.*;
import com.ehr.backend.exception.BadRequestException;
import com.ehr.backend.exception.ResourceNotFoundException;
import com.ehr.backend.repository.*;
import com.ehr.backend.util.PatientUidGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final AppointmentRepository appointmentRepository;
    private final AccessLogRepository accessLogRepository;
    private final EmergencyAccessLogRepository emergencyAccessLogRepository;
    private final PasswordEncoder passwordEncoder;
    private final PatientUidGenerator patientUidGenerator;

    public List<DoctorProfile> getPendingDoctors() {
        return doctorProfileRepository.findByApprovalStatus(ApprovalStatus.PENDING_APPROVAL);
    }

    /** All doctors (any status) -- used to populate the "Doctor" dropdown
     *  when creating an appointment, since only ACTIVE ones are selectable
     *  but admin should see why a doctor is missing (pending/rejected). */
    public List<com.ehr.backend.dto.response.DoctorListItemResponse> getAllDoctorsForSelection() {
        return doctorProfileRepository.findAll().stream()
                .map(d -> new com.ehr.backend.dto.response.DoctorListItemResponse(
                        d.getId(), d.getFullName(), d.getSpecialization(),
                        d.getDefaultHospitalName(), d.getApprovalStatus().name()))
                .collect(java.util.stream.Collectors.toList());
    }

    /** All patients -- used to populate the "Patient" dropdown when
     *  creating an appointment. */
    public List<com.ehr.backend.dto.response.PatientListItemResponse> getAllPatientsForSelection() {
        return patientProfileRepository.findAll().stream()
                .map(p -> new com.ehr.backend.dto.response.PatientListItemResponse(
                        p.getId(), p.getPatientUid(), p.getFullName(), p.getCity()))
                .collect(java.util.stream.Collectors.toList());
    }


    @Transactional
    public DoctorProfile approveDoctor(Long doctorProfileId, Long adminUserId) {
        DoctorProfile dp = doctorProfileRepository.findById(doctorProfileId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found"));
        dp.setApprovalStatus(ApprovalStatus.ACTIVE);
        dp.setApprovedByAdminId(adminUserId);
        dp.setApprovedAt(LocalDateTime.now());
        return doctorProfileRepository.save(dp);
    }

    @Transactional
    public DoctorProfile rejectDoctor(Long doctorProfileId, Long adminUserId) {
        DoctorProfile dp = doctorProfileRepository.findById(doctorProfileId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found"));
        dp.setApprovalStatus(ApprovalStatus.REJECTED);
        dp.setApprovedByAdminId(adminUserId);
        dp.setApprovedAt(LocalDateTime.now());
        return doctorProfileRepository.save(dp);
    }

    @Transactional
    public AuthResponse createPatient(CreatePatientByAdminRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        User user = new User();
        user.setEmail(req.getEmail());
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        user.setRole(Role.PATIENT);
        user.setPhone(req.getPhone());
        user.setAccountStatus(AccountStatus.ACTIVE);
        user = userRepository.save(user);

        PatientProfile profile = new PatientProfile();
        profile.setUserId(user.getId());
        profile.setPatientUid(patientUidGenerator.generate());
        profile.setFullName(req.getFullName());
        profile.setDateOfBirth(req.getDateOfBirth());
        profile.setGender(req.getGender());
        profile.setBloodGroup(req.getBloodGroup());
        profile.setAddress(req.getAddress());
        profile.setCity(req.getCity());
        profile.setEmergencyContactName(req.getEmergencyContactName());
        profile.setEmergencyContactPhone(req.getEmergencyContactPhone());
        patientProfileRepository.save(profile);

        return new AuthResponse(null, user.getId(), user.getEmail(), user.getRole().name(),
                profile.getPatientUid(), null);
    }

    @Transactional
    public Appointment createAppointment(CreateAppointmentRequest req, Long adminUserId) {
        patientProfileRepository.findById(req.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        DoctorProfile doctor = doctorProfileRepository.findById(req.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        if (doctor.getApprovalStatus() != ApprovalStatus.ACTIVE) {
            throw new BadRequestException("Doctor is not active/approved");
        }

        Appointment appt = new Appointment();
        appt.setPatientId(req.getPatientId());
        appt.setDoctorId(req.getDoctorId());
        appt.setCreatedByUserId(adminUserId);
        appt.setAppointmentDate(req.getAppointmentDate() != null ? req.getAppointmentDate() : LocalDateTime.now());
        appt.setReason(req.getReason());
        appt.setStatus(AppointmentStatus.ACTIVE);
        appt.setAccessStartTime(appt.getAppointmentDate());

        int validDays = req.getAccessValidDays() != null ? req.getAccessValidDays() : 30;
        appt.setAccessEndTime(appt.getAppointmentDate().plusDays(validDays));

        return appointmentRepository.save(appt);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }
    
    public List<Appointment> getPendingAppointments() {
        return appointmentRepository.findAll().stream()
                .filter(a -> a.getStatus() == AppointmentStatus.REQUESTED)
                .collect(java.util.stream.Collectors.toList());
    }

    @Transactional
    public Appointment approveAppointmentRequest(Long appointmentId, ApproveAppointmentRequest req) {
        Appointment appt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        if (appt.getStatus() != AppointmentStatus.REQUESTED) {
            throw new BadRequestException("Appointment is not in REQUESTED status");
        }
        appt.setStatus(AppointmentStatus.SCHEDULED); // Or ACTIVE based on your flow
        appt.setAccessStartTime(req.getAccessStartTime());
        appt.setAccessEndTime(req.getAccessEndTime());
        return appointmentRepository.save(appt);
    }

    @Transactional
    public Appointment rejectAppointmentRequest(Long appointmentId) {
        Appointment appt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        if (appt.getStatus() != AppointmentStatus.REQUESTED) {
            throw new BadRequestException("Appointment is not in REQUESTED status");
        }
        appt.setStatus(AppointmentStatus.CANCELLED);
        return appointmentRepository.save(appt);
    }

    @Transactional
    public Appointment cancelAppointment(Long appointmentId) {
        Appointment appt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        appt.setStatus(AppointmentStatus.CANCELLED);
        return appointmentRepository.save(appt);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User deactivateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setAccountStatus(AccountStatus.DEACTIVATED);
        user.setActive(false);
        return userRepository.save(user);
    }

    public List<AccessLog> getAllAccessLogs() {
        return accessLogRepository.findAll();
    }

    public List<EmergencyAccessLog> getAllEmergencyLogs() {
        return emergencyAccessLogRepository.findAll();
    }
}
