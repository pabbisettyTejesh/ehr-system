import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientApiService } from '../../core/services/patient.service';
import { MedicalRecord } from '../../core/models/models';

@Component({
  selector: 'app-patient-medical-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="list-header">
        <h1>Medical History Timeline</h1>
        <img src="assets/illustrations/medical-record.svg" alt="" loading="lazy">
      </div>
      <div class="card" *ngFor="let r of records">
        <p style="font-size:12px;color:var(--ink-soft);">{{ r.createdAt | date:'medium' }}</p>
        <h3>{{ r.diagnosis || 'No diagnosis recorded' }}</h3>
        <p><strong>Symptoms:</strong> {{ r.symptoms }}</p>
        <p><strong>Clinical Notes:</strong> {{ r.clinicalNotes }}</p>
        <p><strong>Treatment Plan:</strong> {{ r.treatmentPlan }}</p>
      </div>
      <div class="card empty-state" *ngIf="records.length === 0">
        <img src="assets/illustrations/empty-state.svg" alt="No medical records found" loading="lazy">
        <p>No medical records yet.</p>
      </div>
    </div>
  `
})
export class PatientMedicalHistoryComponent implements OnInit {
  records: MedicalRecord[] = [];
  constructor(private api: PatientApiService) {}
  ngOnInit() { this.api.getMedicalHistory().subscribe(r => this.records = r); }
}
