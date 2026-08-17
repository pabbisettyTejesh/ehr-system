package com.ehr.backend.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class EmergencyAccessResponse {
    private String patientName;
    private Integer age;
    private String gender;
    private String bloodGroup;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private List<AllergySummary> activeAllergies;
    private List<String> chronicConditions;
    private List<String> currentMedications;
    private List<String> pastMajorSurgeries;

    @Data
    public static class AllergySummary {
        private String allergenName;
        private String severity;
        private String reaction;
    }
}
