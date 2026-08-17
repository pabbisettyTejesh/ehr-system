package com.ehr.backend.service;

import com.ehr.backend.dto.request.DoctorRegisterRequest;
import com.ehr.backend.dto.request.LoginRequest;
import com.ehr.backend.dto.request.PatientRegisterRequest;
import com.ehr.backend.dto.response.AuthResponse;
import com.ehr.backend.entity.DoctorProfile;
import com.ehr.backend.entity.PatientProfile;
import com.ehr.backend.entity.User;
import com.ehr.backend.enums.AccountStatus;
import com.ehr.backend.enums.ApprovalStatus;
import com.ehr.backend.enums.Role;
import com.ehr.backend.exception.BadRequestException;
import com.ehr.backend.repository.DoctorProfileRepository;
import com.ehr.backend.repository.PatientProfileRepository;
import com.ehr.backend.repository.UserRepository;
import com.ehr.backend.security.JwtUtil;
import com.ehr.backend.util.PatientUidGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final PatientUidGenerator patientUidGenerator;

    @Transactional
    public AuthResponse registerPatient(PatientRegisterRequest req) {
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

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getRole().name(),
                profile.getPatientUid(), null);
    }

    @Transactional
    public AuthResponse registerDoctor(DoctorRegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        User user = new User();
        user.setEmail(req.getEmail());
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        user.setRole(Role.DOCTOR);
        user.setPhone(req.getPhone());
        user.setAccountStatus(AccountStatus.ACTIVE);
        user = userRepository.save(user);

        DoctorProfile profile = new DoctorProfile();
        profile.setUserId(user.getId());
        profile.setFullName(req.getFullName());
        profile.setSpecialization(req.getSpecialization());
        profile.setLicenseNumber(req.getLicenseNumber());
        profile.setQualification(req.getQualification());
        profile.setExperienceYears(req.getExperienceYears());
        profile.setDefaultHospitalName(req.getDefaultHospitalName());
        profile.setApprovalStatus(ApprovalStatus.PENDING_APPROVAL);
        doctorProfileRepository.save(profile);

        // No token issued yet -- doctor cannot use dashboard until approved.
        return new AuthResponse(null, user.getId(), user.getEmail(), user.getRole().name(),
                null, profile.getApprovalStatus().name());
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Invalid email or password");
        }

        if (user.getAccountStatus() != AccountStatus.ACTIVE) {
            throw new BadRequestException("Account is not active");
        }

        String patientUid = null;
        String approvalStatus = null;

        if (user.getRole() == Role.PATIENT) {
            patientUid = patientProfileRepository.findByUserId(user.getId())
                    .map(PatientProfile::getPatientUid).orElse(null);
        } else if (user.getRole() == Role.DOCTOR) {
            DoctorProfile dp = doctorProfileRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new BadRequestException("Doctor profile not found"));
            approvalStatus = dp.getApprovalStatus().name();
            if (dp.getApprovalStatus() != ApprovalStatus.ACTIVE) {
                throw new BadRequestException("Doctor account is not yet approved by admin (status: "
                        + dp.getApprovalStatus() + ")");
            }
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getRole().name(),
                patientUid, approvalStatus);
    }
}
