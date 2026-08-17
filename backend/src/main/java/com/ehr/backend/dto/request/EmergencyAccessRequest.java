package com.ehr.backend.dto.request;

import lombok.Data;

@Data
public class EmergencyAccessRequest {
    private String patientUid;
    private String reason;
}
