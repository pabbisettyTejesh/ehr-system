package com.ehr.backend.controller;

import com.ehr.backend.dto.request.UpdatePatientProfileRequest;
import com.ehr.backend.dto.request.PatientRequestAppointmentRequest;
import com.ehr.backend.entity.PatientProfile;
import com.ehr.backend.security.CurrentUserService;
import com.ehr.backend.service.AccessLogService;
import com.ehr.backend.service.PatientService;
import com.ehr.backend.enums.AccessMode;
import com.ehr.backend.util.RequestUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patient")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;
    private final CurrentUserService currentUserService;
    private final AccessLogService accessLogService;

    private PatientProfile currentProfile() {
        return patientService.getProfileByUserId(currentUserService.getUserId());
    }

    private void logSelf(String action, Long patientId, HttpServletRequest request) {
        accessLogService.log(currentUserService.getUserId(), patientId, action, AccessMode.SELF_ACCESS,
                RequestUtil.getClientIp(request), RequestUtil.getUserAgent(request), null);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(HttpServletRequest request) {
        PatientProfile p = currentProfile();
        logSelf("VIEW_PROFILE", p.getId(), request);
        return ResponseEntity.ok(p);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UpdatePatientProfileRequest req) {
        return ResponseEntity.ok(patientService.updateProfile(currentUserService.getUserId(), req));
    }

    @GetMapping("/appointments")
    public ResponseEntity<?> getAppointments() {
        return ResponseEntity.ok(patientService.getMyAppointments(currentProfile().getId()));
    }

    @PostMapping("/appointments/request")
    public ResponseEntity<?> requestAppointment(@RequestBody PatientRequestAppointmentRequest req) {
        return ResponseEntity.ok(patientService.requestAppointment(currentProfile().getId(), currentUserService.getUserId(), req));
    }

    @GetMapping("/doctors/active")
    public ResponseEntity<?> getActiveDoctors() {
        return ResponseEntity.ok(patientService.getActiveDoctors());
    }

    @GetMapping("/medical-history")
    public ResponseEntity<?> getMedicalHistory(HttpServletRequest request) {
        PatientProfile p = currentProfile();
        logSelf("VIEW_MEDICAL_HISTORY", p.getId(), request);
        return ResponseEntity.ok(patientService.getMyMedicalHistory(p.getId()));
    }

    @GetMapping("/prescriptions")
    public ResponseEntity<?> getPrescriptions() {
        return ResponseEntity.ok(patientService.getMyPrescriptions(currentProfile().getId()));
    }

    @GetMapping("/allergies")
    public ResponseEntity<?> getAllergies() {
        return ResponseEntity.ok(patientService.getMyAllergies(currentProfile().getId()));
    }

    @GetMapping("/reports")
    public ResponseEntity<?> getReports(HttpServletRequest request) {
        PatientProfile p = currentProfile();
        logSelf("VIEW_REPORT", p.getId(), request);
        return ResponseEntity.ok(patientService.getMyReports(p.getId()));
    }

    @GetMapping("/access-logs")
    public ResponseEntity<?> getAccessLogs() {
        return ResponseEntity.ok(patientService.getMyAccessLogs(currentProfile().getId()));
    }

    @GetMapping("/emergency-logs")
    public ResponseEntity<?> getEmergencyLogs() {
        return ResponseEntity.ok(patientService.getMyEmergencyLogs(currentProfile().getId()));
    }
}
