package com.ehr.backend.util;

import com.ehr.backend.repository.PatientProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.Year;

@Component
@RequiredArgsConstructor
public class PatientUidGenerator {

    private final PatientProfileRepository patientProfileRepository;

    // Generates PAT-YYYY-000001 style sequential UID
    public synchronized String generate() {
        int year = Year.now().getValue();
        long count = patientProfileRepository.count() + 1;
        String uid;
        do {
            uid = String.format("PAT-%d-%06d", year, count);
            count++;
        } while (patientProfileRepository.existsByPatientUid(uid));
        return uid;
    }
}
