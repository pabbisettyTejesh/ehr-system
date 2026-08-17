import { Component } from '@angular/core';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ICONS } from '../../shared/icons';
import { EmergencyApiService } from '../../core/services/emergency.service';
import { EmergencyAccessResult } from '../../core/models/models';

@Component({
  selector: 'app-doctor-emergency-access',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeHtmlPipe],
  template: `
    <div class="container form-page">
      <div class="page-header">
        <span class="icon-circle" style="background:var(--critical-soft); color:var(--critical);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.siren | safeHtml"></svg>
        </span>
        <div>
          <span class="page-eyebrow" style="color:var(--critical);">Doctor · Bypasses appointment access</span>
          <h1 style="color:var(--critical);">Emergency Access</h1>
        </div>
        <img src="assets/illustrations/emergency.svg" alt="" width="80" height="65" style="margin-left:auto; width:80px; height:auto;" loading="lazy">
      </div>

      <div class="card emergency-card">
        <p style="font-size:13px; color:#5c1a24; margin-top:0;">
          Returns critical, read-only data only. A reason is mandatory and every
          access is logged and later visible to the patient and admin.
        </p>
        <div class="form-group">
          <label>Patient UID</label>
          <input [(ngModel)]="patientUid" name="patientUid" placeholder="PAT-2026-000001">
        </div>
        <div class="form-group">
          <label>Reason (mandatory)</label>
          <textarea [(ngModel)]="reason" name="reason" rows="2" placeholder="e.g. Patient unconscious, brought to ER"></textarea>
        </div>
        <button class="btn danger" (click)="submit()">Get Emergency Data</button>
        <p class="error-text" *ngIf="error">{{ error }}</p>
      </div>

      <div class="card" *ngIf="result">
        <h3 style="margin-bottom:2px;">{{ result.patientName }}</h3>
        <p style="color:var(--ink-soft); margin-top:0;">{{ result.age }} yrs · {{ result.gender }} · {{ result.bloodGroup }}</p>
        <p><strong>Emergency Contact:</strong> {{ result.emergencyContactName }} — {{ result.emergencyContactPhone }}</p>

        <h4 style="margin-bottom:6px;">Active Allergies</h4>
        <p *ngIf="result.activeAllergies.length === 0" style="color:var(--ink-soft); font-size:13.5px;">None recorded.</p>
        <span class="badge" *ngFor="let a of result.activeAllergies" [class]="a.severity.toLowerCase()" style="margin:0 6px 6px 0;">
          {{ a.allergenName }} · {{ a.reaction }}
        </span>

        <h4 style="margin-bottom:6px; margin-top:16px;">Chronic Conditions</h4>
        <ul style="margin-top:4px;"><li *ngFor="let c of result.chronicConditions">{{ c }}</li></ul>

        <h4 style="margin-bottom:6px;">Current Medications</h4>
        <ul style="margin-top:4px;"><li *ngFor="let m of result.currentMedications">{{ m }}</li></ul>

        <h4 style="margin-bottom:6px;">Past Major Surgeries</h4>
        <ul style="margin-top:4px;"><li *ngFor="let s of result.pastMajorSurgeries">{{ s }}</li></ul>
      </div>
    </div>
  `
})
export class DoctorEmergencyAccessComponent {
  icons = ICONS;
  patientUid = '';
  reason = '';
  result: EmergencyAccessResult | null = null;
  error = '';

  constructor(private api: EmergencyApiService) {}

  submit() {
    this.error = ''; this.result = null;
    this.api.requestAccess(this.patientUid, this.reason).subscribe({
      next: (r) => this.result = r,
      error: (err) => this.error = err?.error?.message || 'Emergency access failed'
    });
  }
}
