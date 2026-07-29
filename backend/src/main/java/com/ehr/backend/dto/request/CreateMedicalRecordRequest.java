package com.ehr.backend.dto.request;

import lombok.Data;

@Data
public class CreateMedicalRecordRequest {
    private Long encounterId;
    private Long patientId;
    private String diagnosis;
    private String symptoms;
    private String clinicalNotes;
    private String treatmentPlan;
}
