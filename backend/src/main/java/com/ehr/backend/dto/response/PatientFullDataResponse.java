package com.ehr.backend.dto.response;

import com.ehr.backend.entity.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientFullDataResponse {
    private PatientProfile profile;
    private List<Encounter> encounters;
    private List<MedicalRecord> medicalRecords;
    private List<Prescription> prescriptions;
    private List<Allergy> allergies;
    private List<Report> reports;
}
