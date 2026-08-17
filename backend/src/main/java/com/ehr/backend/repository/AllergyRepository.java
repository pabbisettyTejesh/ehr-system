package com.ehr.backend.repository;

import com.ehr.backend.entity.Allergy;
import com.ehr.backend.enums.AllergyStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AllergyRepository extends JpaRepository<Allergy, Long> {
    List<Allergy> findByPatientId(Long patientId);
    List<Allergy> findByPatientIdAndStatus(Long patientId, AllergyStatus status);
}
