package com.ehr.backend.dto.request;

import lombok.Data;

@Data
public class UpdateAllergyRequest {
    private String allergenName;
    private String reaction;
    private String severity;
    private String status;
    private String notes;
}
