package com.ehr.backend.controller;

import com.ehr.backend.dto.request.*;
import com.ehr.backend.entity.PatientProfile;
import com.ehr.backend.enums.AccessMode;
import com.ehr.backend.enums.PrescriptionStatus;
import com.ehr.backend.security.CurrentUserService;
import com.ehr.backend.service.AccessLogService;
import com.ehr.backend.service.DoctorService;
import com.ehr.backend.util.RequestUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/doctor")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;
    private final CurrentUserService currentUserService;
    private final AccessLogService accessLogService;

    private Long myDoctorProfileId() {
        return doctorService.getProfileByUserId(currentUserService.getUserId()).getId();
    }

    @GetMapping("/patients/search")
    public ResponseEntity<?> searchPatient(@RequestParam String patientUid) {
        PatientProfile p = doctorService.searchPatientByUid(patientUid);
        // Limited visibility: only return non-clinical identifiers.
        return ResponseEntity.ok(new Object() {
            public final Long id = p.getId();
            public final String patientUid = p.getPatientUid();
            public final String fullName = p.getFullName();
            public final String gender = p.getGender();
        });
    }

    @GetMapping("/appointments")
    public ResponseEntity<?> myAppointedPatients() {
        return ResponseEntity.ok(doctorService.getMyAppointedPatients(myDoctorProfileId()));
    }

    @GetMapping("/patients")
    public ResponseEntity<?> myAppointedPatientsAlias() {
        return ResponseEntity.ok(doctorService.getMyAppointedPatients(myDoctorProfileId()));
    }

    @GetMapping("/patients/detailed")
    public ResponseEntity<?> myAppointedPatientsDetailed() {
        return ResponseEntity.ok(doctorService.getMyAppointedPatientsDetailed(myDoctorProfileId()));
    }

    @GetMapping("/encounters/detailed")
    public ResponseEntity<?> myEncountersDetailed() {
        return ResponseEntity.ok(doctorService.getMyEncountersDetailed(myDoctorProfileId()));
    }

    @GetMapping("/patients/{patientId}/summary")
    public ResponseEntity<?> patientSummary(@PathVariable Long patientId, HttpServletRequest request) {
        Long doctorId = myDoctorProfileId();
        var summary = doctorService.getFullPatientSummary(doctorId, patientId);
        accessLogService.log(currentUserService.getUserId(), patientId, "VIEW_MEDICAL_HISTORY",
                AccessMode.APPOINTED_DOCTOR_ACCESS, RequestUtil.getClientIp(request),
                RequestUtil.getUserAgent(request), "Doctor viewed full patient summary");
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/patients/{patientId}/full-data")
    public ResponseEntity<?> patientFullData(@PathVariable Long patientId, HttpServletRequest request) {
        Long doctorId = myDoctorProfileId();
        var fullData = doctorService.getPatientFullData(doctorId, patientId);
        accessLogService.log(currentUserService.getUserId(), patientId, "VIEW_MEDICAL_HISTORY",
                AccessMode.APPOINTED_DOCTOR_ACCESS, RequestUtil.getClientIp(request),
                RequestUtil.getUserAgent(request), "Doctor viewed full patient session data");
        return ResponseEntity.ok(fullData);
    }

    @PostMapping("/encounters")
    public ResponseEntity<?> createEncounter(@RequestBody CreateEncounterRequest req, HttpServletRequest request) {
        Long doctorId = myDoctorProfileId();
        var encounter = doctorService.createEncounter(doctorId, req);
        accessLogService.log(currentUserService.getUserId(), req.getPatientId(), "CREATE_ENCOUNTER",
                AccessMode.APPOINTED_DOCTOR_ACCESS, RequestUtil.getClientIp(request),
                RequestUtil.getUserAgent(request), null);
        return ResponseEntity.ok(encounter);
    }

    @GetMapping("/encounters")
    public ResponseEntity<?> myEncounters() {
        return ResponseEntity.ok(doctorService.getMyEncounters(myDoctorProfileId()));
    }

    @PostMapping("/medical-records")
    public ResponseEntity<?> addMedicalRecord(@RequestBody CreateMedicalRecordRequest req, HttpServletRequest request) {
        Long doctorId = myDoctorProfileId();
        var record = doctorService.addMedicalRecord(doctorId, req);
        accessLogService.log(currentUserService.getUserId(), req.getPatientId(), "CREATE_MEDICAL_RECORD",
                AccessMode.APPOINTED_DOCTOR_ACCESS, RequestUtil.getClientIp(request),
                RequestUtil.getUserAgent(request), null);
        return ResponseEntity.ok(record);
    }

    @PostMapping("/prescriptions")
    public ResponseEntity<?> createPrescription(@RequestBody CreatePrescriptionRequest req, HttpServletRequest request) {
        Long doctorId = myDoctorProfileId();
        var prescription = doctorService.createPrescription(doctorId, req);
        accessLogService.log(currentUserService.getUserId(), req.getPatientId(), "CREATE_PRESCRIPTION",
                AccessMode.APPOINTED_DOCTOR_ACCESS, RequestUtil.getClientIp(request),
                RequestUtil.getUserAgent(request), null);
        return ResponseEntity.ok(prescription);
    }

    @PutMapping("/prescriptions/{prescriptionId}/status")
    public ResponseEntity<?> updatePrescriptionStatus(@PathVariable Long prescriptionId,
                                                        @RequestParam String status) {
        Long doctorId = myDoctorProfileId();
        return ResponseEntity.ok(doctorService.markPrescriptionStatus(
                doctorId, prescriptionId, PrescriptionStatus.valueOf(status)));
    }

    @PostMapping("/allergies")
    public ResponseEntity<?> addAllergy(@RequestBody CreateAllergyRequest req, HttpServletRequest request) {
        Long doctorId = myDoctorProfileId();
        var allergy = doctorService.addOrUpdateAllergy(doctorId, req);
        accessLogService.log(currentUserService.getUserId(), req.getPatientId(), "UPDATE_ALLERGY",
                AccessMode.APPOINTED_DOCTOR_ACCESS, RequestUtil.getClientIp(request),
                RequestUtil.getUserAgent(request), null);
        return ResponseEntity.ok(allergy);
    }

    @PutMapping("/allergies/{allergyId}")
    public ResponseEntity<?> updateAllergy(@PathVariable Long allergyId, @RequestBody UpdateAllergyRequest req) {
        Long doctorId = myDoctorProfileId();
        return ResponseEntity.ok(doctorService.updateAllergy(doctorId, allergyId, req));
    }

    @PostMapping("/reports")
    public ResponseEntity<?> addReport(@RequestBody CreateReportRequest req) {
        Long doctorId = myDoctorProfileId();
        return ResponseEntity.ok(doctorService.addReport(doctorId, req, currentUserService.getUserId()));
    }

    @PutMapping("/appointments/{appointmentId}/meeting-link")
    public ResponseEntity<?> updateMeetingLink(@PathVariable Long appointmentId, @RequestBody UpdateAppointmentMeetingLinkRequest req) {
        Long doctorId = myDoctorProfileId();
        return ResponseEntity.ok(doctorService.updateMeetingLink(doctorId, appointmentId, req));
    }

    @PostMapping("/appointments/{appointmentId}/generate-meeting")
    public ResponseEntity<?> generateMeetingLink(@PathVariable Long appointmentId) {
        Long doctorId = myDoctorProfileId();
        return ResponseEntity.ok(doctorService.generateMeetingLink(doctorId, appointmentId));
    }

    @DeleteMapping("/appointments/{appointmentId}/meeting-link")
    public ResponseEntity<?> deleteMeetingLink(@PathVariable Long appointmentId) {
        Long doctorId = myDoctorProfileId();
        return ResponseEntity.ok(doctorService.deleteMeetingLink(doctorId, appointmentId));
    }
}
