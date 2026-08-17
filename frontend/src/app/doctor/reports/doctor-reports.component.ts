import { Component, OnInit } from '@angular/core';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorApiService } from '../../core/services/doctor.service';
import { AppointedPatient, EncounterSummary } from '../../core/models/models';

@Component({
  selector: 'app-doctor-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeHtmlPipe],
  template: `
    <div class="container form-page">
      <div class="page-header">
        <span class="icon-circle bg-accent-doctor">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.scrollText | safeHtml"></svg>
        </span>
        <div>
          <span class="page-eyebrow">Doctor · Appointed patients only</span>
          <h1>Add Report Metadata</h1>
        </div>
      </div>

      <div class="card">
        <div class="form-group">
          <label>Patient</label>
          <select [(ngModel)]="form.patientId" name="patientId">
            <option [ngValue]="null" disabled>Select a patient…</option>
            <option *ngFor="let p of myPatients" [ngValue]="p.patientId">
              {{ p.patientName }} — {{ p.patientUid }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Encounter (optional)</label>
          <select [(ngModel)]="form.encounterId" name="encounterId">
            <option [ngValue]="null">No specific encounter</option>
            <option *ngFor="let e of encounters" [ngValue]="e.id">
              {{ e.patientName }} — {{ e.visitDate | date:'MMM d, y' }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Report Name</label>
          <input [(ngModel)]="form.reportName" name="reportName">
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label>Report Type</label>
            <input [(ngModel)]="form.reportType" name="reportType" placeholder="Blood Test, X-Ray, ...">
          </div>
          <div class="form-group">
            <label>Hospital/Clinic</label>
            <input [(ngModel)]="form.hospitalName" name="hospitalName">
          </div>
        </div>
        <button class="btn" (click)="submit()" [disabled]="!form.patientId">Add Report</button>
        <p class="success-text" *ngIf="saved">Report metadata saved.</p>
        <p class="error-text" *ngIf="error">{{ error }}</p>
        <p style="font-size:12px; color:var(--ink-soft); margin-top:14px;">
          File upload is optional for MVP — this is metadata-only by default.
        </p>
      </div>
    </div>
  `
})
export class DoctorReportsComponent implements OnInit {
  icons = ICONS;
  myPatients: AppointedPatient[] = [];
  encounters: EncounterSummary[] = [];
  form: any = { patientId: null, encounterId: null, reportName: '', reportType: '', hospitalName: '' };
  saved = false;
  error = '';

  constructor(private api: DoctorApiService) {}

  ngOnInit() {
    this.api.getMyPatientsDetailed().subscribe(p => this.myPatients = p);
    this.api.getMyEncountersDetailed().subscribe(e => this.encounters = e);
  }

  submit() {
    this.error = ''; this.saved = false;
    this.api.addReport(this.form).subscribe({
      next: () => this.saved = true,
      error: (err) => this.error = err?.error?.message || 'Failed to save report'
    });
  }
}
