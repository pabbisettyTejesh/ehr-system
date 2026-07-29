package com.ehr.backend.repository;

import com.ehr.backend.entity.EmergencyAccessLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmergencyAccessLogRepository extends JpaRepository<EmergencyAccessLog, Long> {
    List<EmergencyAccessLog> findByPatientId(Long patientId);
    List<EmergencyAccessLog> findByDoctorId(Long doctorId);
}
