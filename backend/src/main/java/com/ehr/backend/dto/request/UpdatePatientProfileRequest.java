package com.ehr.backend.dto.request;

import lombok.Data;

@Data
public class UpdatePatientProfileRequest {
    private String fullName;
    private String gender;
    private String bloodGroup;
    private String address;
    private String city;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String phone;
}
