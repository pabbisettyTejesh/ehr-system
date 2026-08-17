import { Component, OnInit } from '@angular/core';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DoctorApiService } from '../../core/services/doctor.service';
import { AppointedPatient } from '../../core/models/models';

@Component({
  selector: 'app-doctor-patients',
  standalone: true,
  imports: [CommonModule, RouterLink, SafeHtmlPipe],
  template: `
    <div class="container">
      <div class="page-header">
        <span class="icon-circle bg-accent-doctor">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.users | safeHtml"></svg>
        </span>
        <div>
          <span class="page-eyebrow">Doctor</span>
          <h1>My Appointed Patients</h1>
        </div>
      </div>

      <div class="card">
        <p style="font-size:13px; color:var(--ink-soft); margin-top:0;">
          These are the only patients you currently have full clinical access to.
          Their <strong>Patient ID</strong> (used across encounter/prescription/allergy forms) is shown below.
        </p>
        <table *ngIf="patients.length > 0">
          <thead><tr><th>Patient</th><th>UID</th><th>Patient ID</th><th>Access Until</th><th></th></tr></thead>
          <tbody>
            <tr *ngFor="let a of patients">
              <td>{{ a.patientName }}</td>
              <td><span class="uid">{{ a.patientUid }}</span></td>
              <td><span class="uid">{{ a.patientId }}</span></td>
              <td>{{ a.accessEndTime | date:'medium' }}</td>
              <td><a [routerLink]="['/doctor/patient-summary', a.patientId]" class="btn secondary">View Summary</a></td>
            </tr>
          </tbody>
        </table>
        <div class="empty-state" *ngIf="patients.length === 0">
          <img src="assets/illustrations/empty-state.svg" alt="No appointed patients yet — ask an admin to create an appointment linking you to a patient." loading="lazy">
          <p>No appointed patients yet — ask an admin to create an appointment linking you to a patient.</p>
        </div>
      </div>
    </div>
  `
})
export class DoctorPatientsComponent implements OnInit {
  icons = ICONS;
  patients: AppointedPatient[] = [];
  constructor(private api: DoctorApiService) {}
  ngOnInit() { this.api.getMyPatientsDetailed().subscribe(p => this.patients = p); }
}
