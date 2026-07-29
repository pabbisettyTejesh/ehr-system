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
      <h1>Medical History Timeline</h1>
      <div class="card" *ngFor="let r of records">
        <p style="font-size:12px;color:#6b7280;">{{ r.createdAt | date:'medium' }}</p>
        <h3>{{ r.diagnosis || 'No diagnosis recorded' }}</h3>
        <p><strong>Symptoms:</strong> {{ r.symptoms }}</p>
        <p><strong>Clinical Notes:</strong> {{ r.clinicalNotes }}</p>
        <p><strong>Treatment Plan:</strong> {{ r.treatmentPlan }}</p>
      </div>
      <p *ngIf="records.length === 0">No medical records yet.</p>
    </div>
  `
})
export class PatientMedicalHistoryComponent implements OnInit {
  records: MedicalRecord[] = [];
  constructor(private api: PatientApiService) {}
  ngOnInit() { this.api.getMedicalHistory().subscribe(r => this.records = r); }
}
