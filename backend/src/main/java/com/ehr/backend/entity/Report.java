package com.ehr.backend.entity;

import com.ehr.backend.enums.ReportVisibility;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Getter
@Setter
@NoArgsConstructor
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true)
    private Long encounterId;

    @Column(nullable = false)
    private Long patientId;

    private Long uploadedByUserId;

    private String reportName;
    private String reportType;
    private String hospitalName;

    private String filePath;
    private String fileName;

    private LocalDateTime uploadedAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    private ReportVisibility visibility = ReportVisibility.NORMAL;
}
