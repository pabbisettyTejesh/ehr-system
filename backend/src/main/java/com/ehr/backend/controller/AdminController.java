package com.ehr.backend.controller;

import com.ehr.backend.dto.request.CreateAppointmentRequest;
import com.ehr.backend.dto.request.CreatePatientByAdminRequest;
import com.ehr.backend.dto.response.MessageResponse;
import com.ehr.backend.security.CurrentUserService;
import com.ehr.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final CurrentUserService currentUserService;

    @GetMapping("/doctors/pending")
    public ResponseEntity<?> pendingDoctors() {
        return ResponseEntity.ok(adminService.getPendingDoctors());
    }

    @GetMapping("/doctors")
    public ResponseEntity<?> allDoctors() {
        return ResponseEntity.ok(adminService.getAllDoctorsForSelection());
    }

    @GetMapping("/patients")
    public ResponseEntity<?> allPatients() {
        return ResponseEntity.ok(adminService.getAllPatientsForSelection());
    }

    @PutMapping("/doctors/{doctorId}/approve")
    public ResponseEntity<?> approveDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(adminService.approveDoctor(doctorId, currentUserService.getUserId()));
    }

    @PutMapping("/doctors/{doctorId}/reject")
    public ResponseEntity<?> rejectDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(adminService.rejectDoctor(doctorId, currentUserService.getUserId()));
    }

    @PostMapping("/patients")
    public ResponseEntity<?> createPatient(@RequestBody CreatePatientByAdminRequest req) {
        return ResponseEntity.ok(adminService.createPatient(req));
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{userId}/deactivate")
    public ResponseEntity<?> deactivateUser(@PathVariable Long userId) {
        return ResponseEntity.ok(adminService.deactivateUser(userId));
    }

    @PostMapping("/appointments")
    public ResponseEntity<?> createAppointment(@RequestBody CreateAppointmentRequest req) {
        return ResponseEntity.ok(adminService.createAppointment(req, currentUserService.getUserId()));
    }

    @GetMapping("/appointments")
    public ResponseEntity<?> getAllAppointments() {
        return ResponseEntity.ok(adminService.getAllAppointments());
    }

    @PutMapping("/appointments/{appointmentId}/cancel")
    public ResponseEntity<?> cancelAppointment(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(adminService.cancelAppointment(appointmentId));
    }

    @GetMapping("/access-logs")
    public ResponseEntity<?> getAllAccessLogs() {
        return ResponseEntity.ok(adminService.getAllAccessLogs());
    }

    @GetMapping("/emergency-logs")
    public ResponseEntity<?> getAllEmergencyLogs() {
        return ResponseEntity.ok(adminService.getAllEmergencyLogs());
    }
}
