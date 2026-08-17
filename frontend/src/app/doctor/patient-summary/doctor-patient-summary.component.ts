import { Component, OnInit } from '@angular/core';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DoctorApiService } from '../../core/services/doctor.service';
import { PatientProfile } from '../../core/models/models';

@Component({
  selector: 'app-doctor-patient-summary',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  template: `
    <div class="container form-page">
      <div class="page-header">
        <span class="icon-circle bg-accent-doctor">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.userRound | safeHtml"></svg>
        </span>
        <div>
          <span class="page-eyebrow">Doctor · Full access</span>
          <h1>Patient Summary</h1>
        </div>
      </div>

      <div class="card" *ngIf="profile">
        <p style="margin-top:0;"><span class="uid">{{ profile.patientUid }}</span></p>
        <table>
          <tbody>
            <tr><th style="width:180px;">Name</th><td>{{ profile.fullName }}</td></tr>
            <tr><th>Gender</th><td>{{ profile.gender }}</td></tr>
            <tr><th>Blood Group</th><td>{{ profile.bloodGroup }}</td></tr>
            <tr><th>Address</th><td>{{ profile.address }}, {{ profile.city }}</td></tr>
            <tr><th>Emergency Contact</th><td>{{ profile.emergencyContactName }} ({{ profile.emergencyContactPhone }})</td></tr>
          </tbody>
        </table>
      </div>
      <div class="card" *ngIf="error">
        <p class="error-text" style="margin:0;">{{ error }}</p>
      </div>
    </div>
  `
})
export class DoctorPatientSummaryComponent implements OnInit {
  icons = ICONS;
  profile: PatientProfile | null = null;
  error = '';

  constructor(private route: ActivatedRoute, private api: DoctorApiService) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('patientId'));
    this.api.getPatientSummary(id).subscribe({
      next: (p) => this.profile = p,
      error: (err) => this.error = err?.error?.message || 'Access denied'
    });
  }
}
