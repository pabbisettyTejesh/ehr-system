package com.ehr.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "emergency_access_logs")
@Getter
@Setter
@NoArgsConstructor
public class EmergencyAccessLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long doctorId;

    @Column(nullable = false)
    private Long patientId;

    @Column(length = 1000)
    private String reason;

    private LocalDateTime viewedAt = LocalDateTime.now();

    private String ipAddress;

    @Column(length = 500)
    private String userAgent;

    @Column(length = 4000)
    private String criticalDataSnapshot;
}
