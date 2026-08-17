package com.ehr.backend.repository;

import com.ehr.backend.entity.Appointment;
import com.ehr.backend.enums.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByDoctorId(Long doctorId);
    List<Appointment> findByPatientId(Long patientId);

    Optional<Appointment> findFirstByDoctorIdAndPatientIdAndStatusIn(
            Long doctorId, Long patientId, List<AppointmentStatus> statuses);

    List<Appointment> findByDoctorIdAndStatusIn(Long doctorId, List<AppointmentStatus> statuses);
}
