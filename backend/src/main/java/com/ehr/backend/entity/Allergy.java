package com.ehr.backend.entity;

import com.ehr.backend.enums.AllergyStatus;
import com.ehr.backend.enums.Severity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "allergies")
@Getter
@Setter
@NoArgsConstructor
public class Allergy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long patientId;

    private String allergenName;
    private String reaction;

    @Enumerated(EnumType.STRING)
    private Severity severity;

    @Enumerated(EnumType.STRING)
    private AllergyStatus status = AllergyStatus.ACTIVE;

    private Long recordedByDoctorId;
    private LocalDateTime recordedAt = LocalDateTime.now();
    private LocalDateTime resolvedAt;

    @Column(length = 1000)
    private String notes;
}
