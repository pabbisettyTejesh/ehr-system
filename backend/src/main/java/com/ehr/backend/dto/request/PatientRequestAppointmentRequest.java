package com.ehr.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PatientRequestAppointmentRequest {
    @NotNull(message = "Doctor ID is required")
    private Long doctorId;
    
    @NotNull(message = "Requested date is required")
    private LocalDateTime requestedDate;
    
    private String reason;
}
