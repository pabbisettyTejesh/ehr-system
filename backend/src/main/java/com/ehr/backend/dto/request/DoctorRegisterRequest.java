package com.ehr.backend.dto.request;

import lombok.Data;

@Data
public class DoctorRegisterRequest {
    private String email;
    private String password;
    private String phone;
    private String fullName;
    private String specialization;
    private String licenseNumber;
    private String qualification;
    private Integer experienceYears;
    private String defaultHospitalName;
}
