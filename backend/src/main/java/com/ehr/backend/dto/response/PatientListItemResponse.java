package com.ehr.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PatientListItemResponse {
    private Long id;
    private String patientUid;
    private String fullName;
    private String city;
}
