package com.ehr.backend.entity;

import com.ehr.backend.enums.AccessMode;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "access_logs")
@Getter
@Setter
@NoArgsConstructor
public class AccessLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long patientId;

    private String action;

    @Enumerated(EnumType.STRING)
    private AccessMode accessMode;

    private String ipAddress;

    @Column(length = 500)
    private String userAgent;

    private LocalDateTime timestamp = LocalDateTime.now();

    @Column(length = 1000)
    private String details;
}
