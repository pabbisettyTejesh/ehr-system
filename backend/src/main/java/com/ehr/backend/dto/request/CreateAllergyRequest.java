package com.ehr.backend.dto.request;

import lombok.Data;

@Data
public class CreateAllergyRequest {
    private Long patientId;
    private String allergenName;
    private String reaction;
    private String severity;
    private String notes;
}
