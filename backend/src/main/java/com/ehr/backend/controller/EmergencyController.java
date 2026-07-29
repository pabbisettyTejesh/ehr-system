package com.ehr.backend.controller;

import com.ehr.backend.dto.request.EmergencyAccessRequest;
import com.ehr.backend.security.CurrentUserService;
import com.ehr.backend.service.DoctorService;
import com.ehr.backend.service.EmergencyAccessService;
import com.ehr.backend.util.RequestUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/emergency")
@RequiredArgsConstructor
public class EmergencyController {

    private final EmergencyAccessService emergencyAccessService;
    private final DoctorService doctorService;
    private final CurrentUserService currentUserService;

    @PostMapping("/access")
    public ResponseEntity<?> emergencyAccess(@RequestBody EmergencyAccessRequest req, HttpServletRequest request) {
        Long doctorUserId = currentUserService.getUserId();
        Long doctorProfileId = doctorService.getProfileByUserId(doctorUserId).getId();

        var result = emergencyAccessService.getEmergencyData(
                doctorUserId, doctorProfileId, req,
                RequestUtil.getClientIp(request), RequestUtil.getUserAgent(request));

        return ResponseEntity.ok(result);
    }
}
