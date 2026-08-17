package com.ehr.backend.repository;

import com.ehr.backend.entity.DoctorProfile;
import com.ehr.backend.enums.ApprovalStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DoctorProfileRepository extends JpaRepository<DoctorProfile, Long> {
    Optional<DoctorProfile> findByUserId(Long userId);
    List<DoctorProfile> findByApprovalStatus(ApprovalStatus status);
}
