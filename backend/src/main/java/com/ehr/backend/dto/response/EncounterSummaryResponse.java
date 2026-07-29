package com.ehr.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class EncounterSummaryResponse {
    private Long id;
    private Long patientId;
    private String patientUid;
    private String patientName;
    private String hospitalName;
    private LocalDateTime visitDate;
    private String visitType;
    private String chiefComplaint;
}
