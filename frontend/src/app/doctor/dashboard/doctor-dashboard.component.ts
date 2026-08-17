import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container">
      <span class="page-eyebrow">Doctor portal</span>
      <h1>Your practice, today</h1>
      <p style="color:var(--ink-soft); margin-bottom:28px;">Appointed patients, encounters, and clinical records.</p>

      <div class="dash-grid">
        <a class="card" routerLink="/doctor/patients">
          <h3>
            <span class="icon-circle bg-accent-doctor">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </span>
            My Appointed Patients
          </h3>
          <p>Patients linked to you via appointment</p>
        </a>

        <a class="card" routerLink="/doctor/search-patient">
          <h3>
            <span class="icon-circle bg-accent-doctor">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/></svg>
            </span>
            Search Patient
          </h3>
          <p>Search by Patient UID (limited view)</p>
        </a>

        <a class="card" routerLink="/doctor/create-encounter">
          <h3>
            <span class="icon-circle bg-accent-doctor">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/><circle cx="17.5" cy="16.5" r="3.5" fill="var(--doctor-soft)"/></svg>
            </span>
            Create Encounter
          </h3>
          <p>Log a new consultation or visit</p>
        </a>

        <a class="card" routerLink="/doctor/medical-record">
          <h3>
            <span class="icon-circle bg-accent-doctor">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2h6a1 1 0 0 1 1 1v1h-8V3a1 1 0 0 1 1-1Z"/><path d="M6 4h12v17a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4Z"/><path d="M9 12h6M9 16h4"/></svg>
            </span>
            Add Medical Record
          </h3>
          <p>Diagnosis, symptoms, clinical notes</p>
        </a>

        <a class="card" routerLink="/doctor/prescription">
          <h3>
            <span class="icon-circle bg-accent-doctor">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="9" width="18" height="9" rx="2"/><path d="M8 9V6a4 4 0 0 1 8 0v3"/></svg>
            </span>
            Create Prescription
          </h3>
          <p>Add medicines for an encounter</p>
        </a>

        <a class="card" routerLink="/doctor/allergies">
          <h3>
            <span class="icon-circle bg-accent-doctor">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v4M12 17h.01"/></svg>
            </span>
            Manage Allergies
          </h3>
          <p>Add or update allergy records</p>
        </a>

        <a class="card" routerLink="/doctor/reports">
          <h3>
            <span class="icon-circle bg-accent-doctor">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 3h11l5 5v13H4z"/><path d="M15 3v5h5"/></svg>
            </span>
            Reports
          </h3>
          <p>Add report metadata</p>
        </a>

        <a class="card emergency-card" routerLink="/doctor/emergency-access">
          <h3>
            <span class="icon-circle" style="background:#fff;color:var(--critical);">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4M12 17h.01"/></svg>
            </span>
            Emergency Access
          </h3>
          <p style="color:#9A3412;">Critical, read-only data by Patient UID</p>
        </a>
      </div>
    </div>
  `
})
export class DoctorDashboardComponent {}
