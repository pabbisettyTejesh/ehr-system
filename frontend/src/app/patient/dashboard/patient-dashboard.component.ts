import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container">
      <span class="page-eyebrow">Patient portal</span>
      <h1>Welcome back</h1>
      <p style="color:var(--ink-soft); margin-bottom:28px;">Your unified health record, all in one place.</p>

      <div class="dash-grid">
        <a class="card" routerLink="/patient/profile">
          <h3>
            <span class="icon-circle bg-accent-patient">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>
            </span>
            My Profile
          </h3>
          <p>View and update your basic info</p>
        </a>

        <a class="card" routerLink="/patient/appointments">
          <h3>
            <span class="icon-circle bg-accent-patient">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>
            </span>
            Appointments
          </h3>
          <p>See scheduled doctor appointments</p>
        </a>

        <a class="card" routerLink="/patient/medical-history">
          <h3>
            <span class="icon-circle bg-accent-patient">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h12l4 4v12H4z"/><path d="M9 9h6M9 13h6M9 17h3"/></svg>
            </span>
            Medical History
          </h3>
          <p>Timeline of diagnoses & clinical notes</p>
        </a>

        <a class="card" routerLink="/patient/prescriptions">
          <h3>
            <span class="icon-circle bg-accent-patient">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="9" width="18" height="9" rx="2"/><path d="M8 9V6a4 4 0 0 1 8 0v3"/></svg>
            </span>
            Prescriptions
          </h3>
          <p>Current & past medicines</p>
        </a>

        <a class="card" routerLink="/patient/allergies">
          <h3>
            <span class="icon-circle bg-accent-patient">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v4M12 17h.01"/></svg>
            </span>
            Allergies
          </h3>
          <p>Known allergies & severity</p>
        </a>

        <a class="card" routerLink="/patient/reports">
          <h3>
            <span class="icon-circle bg-accent-patient">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 3h11l5 5v13H4z"/><path d="M15 3v5h5"/></svg>
            </span>
            Reports
          </h3>
          <p>Lab & medical report metadata</p>
        </a>

        <a class="card" routerLink="/patient/access-logs">
          <h3>
            <span class="icon-circle bg-accent-patient">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/></svg>
            </span>
            Access & Emergency Logs
          </h3>
          <p>Who accessed your data, and when</p>
        </a>
      </div>
    </div>
  `
})
export class PatientDashboardComponent {}
