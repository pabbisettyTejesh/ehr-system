package com.ehr.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DoctorListItemResponse {
    private Long id;
    private String fullName;
    private String specialization;
    private String defaultHospitalName;
    private String approvalStatus;
}
