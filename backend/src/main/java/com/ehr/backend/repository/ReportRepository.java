package com.ehr.backend.repository;

import com.ehr.backend.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByPatientId(Long patientId);
    List<Report> findByEncounterId(Long encounterId);
}
