package com.ehr.backend.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class CreatePrescriptionRequest {
    private Long patientId;
    private List<PrescriptionItemDto> items;

    @Data
    public static class PrescriptionItemDto {
        private String medicineName;
        private String dosage;
        private String frequency;
        private String duration;
        private String instructions;
    }
}
