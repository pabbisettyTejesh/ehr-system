package com.ehr.backend.dto.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CreatePatientByAdminRequest {
    private String email;
    private String password;
    private String phone;
    private String fullName;
    private LocalDate dateOfBirth;
    private String gender;
    private String bloodGroup;
    private String address;
    private String city;
    private String emergencyContactName;
    private String emergencyContactPhone;
}
