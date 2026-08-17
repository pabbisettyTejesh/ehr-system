package com.ehr.backend.repository;

import com.ehr.backend.entity.PatientProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PatientProfileRepository extends JpaRepository<PatientProfile, Long> {
    Optional<PatientProfile> findByUserId(Long userId);
    Optional<PatientProfile> findByPatientUid(String patientUid);
    boolean existsByPatientUid(String patientUid);
}
