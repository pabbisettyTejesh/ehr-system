import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientApiService } from '../../core/services/patient.service';
import { Prescription } from '../../core/models/models';

@Component({
  selector: 'app-patient-prescriptions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="list-header">
        <h1>My Prescriptions</h1>
        <img src="assets/illustrations/prescription.svg" alt="" loading="lazy">
      </div>
      <div class="card" *ngFor="let p of prescriptions">
        <div style="display:flex; justify-content:space-between;">
          <span style="font-size:12px;color:var(--ink-soft);">{{ p.createdAt | date:'medium' }}</span>
          <span class="badge active">{{ p.status }}</span>
        </div>
        <table style="margin-top:8px;">
          <thead><tr><th>Medicine</th><th>Dosage</th><th>Frequency</th><th>Duration</th></tr></thead>
          <tbody>
            <tr *ngFor="let item of p.items">
              <td>{{ item.medicineName }}</td>
              <td>{{ item.dosage }}</td>
              <td>{{ item.frequency }}</td>
              <td>{{ item.duration }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card empty-state" *ngIf="prescriptions.length === 0">
        <img src="assets/illustrations/empty-state.svg" alt="No prescriptions found" loading="lazy">
        <p>No prescriptions yet.</p>
      </div>
    </div>
  `
})
export class PatientPrescriptionsComponent implements OnInit {
  prescriptions: Prescription[] = [];
  constructor(private api: PatientApiService) {}
  ngOnInit() { this.api.getPrescriptions().subscribe(p => this.prescriptions = p); }
}
