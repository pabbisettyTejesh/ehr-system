package com.ehr.backend.controller;

import com.ehr.backend.dto.request.DoctorRegisterRequest;
import com.ehr.backend.dto.request.LoginRequest;
import com.ehr.backend.dto.request.PatientRegisterRequest;
import com.ehr.backend.dto.response.AuthResponse;
import com.ehr.backend.security.CurrentUserService;
import com.ehr.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final CurrentUserService currentUserService;

    @PostMapping("/register/patient")
    public ResponseEntity<AuthResponse> registerPatient(@RequestBody PatientRegisterRequest req) {
        return ResponseEntity.ok(authService.registerPatient(req));
    }

    @PostMapping("/register/doctor")
    public ResponseEntity<AuthResponse> registerDoctor(@RequestBody DoctorRegisterRequest req) {
        return ResponseEntity.ok(authService.registerDoctor(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        return ResponseEntity.ok(new Object() {
            public final Long userId = currentUserService.getUserId();
            public final String email = currentUserService.getEmail();
            public final String role = currentUserService.getRole();
        });
    }
}
