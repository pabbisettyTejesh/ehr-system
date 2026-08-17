package com.ehr.backend.repository;

import com.ehr.backend.entity.Prescription;
import com.ehr.backend.enums.PrescriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByPatientId(Long patientId);
    List<Prescription> findByPatientIdAndStatus(Long patientId, PrescriptionStatus status);
    List<Prescription> findByEncounterId(Long encounterId);
}
