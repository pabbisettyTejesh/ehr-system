package com.ehr.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AppointedPatientResponse {
    private Long appointmentId;
    private Long patientId;
    private String patientUid;
    private String patientName;
    private String status;
    private LocalDateTime appointmentDate;
    private LocalDateTime accessEndTime;
}
