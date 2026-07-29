package com.ehr.backend.dto.request;

import lombok.Data;

@Data
public class CreateEncounterRequest {
    private Long patientId;
    private Long appointmentId;
    private String hospitalName;
    private String departmentName;
    private String visitType;
    private String chiefComplaint;
    private String summary;
}
