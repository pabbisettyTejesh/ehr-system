package com.ehr.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateAppointmentMeetingLinkRequest {
    @NotBlank(message = "Meeting link cannot be empty")
    private String meetingLink;
}
