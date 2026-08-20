package com.ehr.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ApproveAppointmentRequest {
    @NotNull(message = "Access start time is required")
    private LocalDateTime accessStartTime;
    
    @NotNull(message = "Access end time is required")
    private LocalDateTime accessEndTime;
}
