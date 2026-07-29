import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorApiService } from '../../core/services/doctor.service';

@Component({
  selector: 'app-doctor-search-patient',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container form-page">
      <div class="page-header">
        <span class="icon-circle bg-accent-doctor">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/></svg>
        </span>
        <div>
          <span class="page-eyebrow">Doctor · Limited visibility</span>
          <h1>Search Patient</h1>
        </div>
      </div>

      <div class="card">
        <div class="form-group">
          <label>Patient UID</label>
          <input [(ngModel)]="patientUid" name="patientUid" placeholder="PAT-2026-000001">
        </div>
        <button class="btn" (click)="search()">Search</button>
        <p class="error-text" *ngIf="error">{{ error }}</p>

        <div class="result-panel" *ngIf="result" style="margin-top:20px;">
          <h3 style="margin-bottom:4px;">{{ result.fullName }}</h3>
          <p style="margin:0 0 10px; color:var(--ink-soft);">
            <span class="uid">{{ result.patientUid }}</span> &nbsp;·&nbsp; {{ result.gender }}
          </p>
          <p style="color:var(--ink-soft); font-size:13px;">
            Full medical data requires a valid appointment/link with this patient —
            an unappointed doctor cannot view clinical details.
          </p>
        </div>
      </div>
    </div>
  `
})
export class DoctorSearchPatientComponent {
  patientUid = '';
  result: any = null;
  error = '';

  constructor(private api: DoctorApiService) {}

  search() {
    this.error = '';
    this.result = null;
    this.api.searchPatient(this.patientUid).subscribe({
      next: (r) => this.result = r,
      error: (err) => this.error = err?.error?.message || 'Patient not found'
    });
  }
}
