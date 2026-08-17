package com.ehr.backend.entity;

import com.ehr.backend.enums.VisitType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "encounters")
@Getter
@Setter
@NoArgsConstructor
public class Encounter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long appointmentId;

    @Column(nullable = false)
    private Long patientId;

    @Column(nullable = false)
    private Long doctorId;

    private String hospitalName;
    private String departmentName;
    private LocalDateTime visitDate = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    private VisitType visitType = VisitType.NORMAL;

    @Column(length = 1000)
    private String chiefComplaint;

    @Column(length = 2000)
    private String summary;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
