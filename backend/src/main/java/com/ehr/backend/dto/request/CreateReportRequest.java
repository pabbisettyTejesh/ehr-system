package com.ehr.backend.dto.request;

import lombok.Data;

@Data
public class CreateReportRequest {
    private Long patientId;
    private String reportName;
    private String reportType;
    private String hospitalName;
}
