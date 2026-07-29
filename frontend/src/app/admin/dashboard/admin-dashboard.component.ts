import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container">
      <span class="page-eyebrow">Admin portal</span>
      <h1>System overview</h1>
      <p style="color:var(--ink-soft); margin-bottom:28px;">Approvals, access links, and audit visibility.</p>

      <div class="dash-grid">
        <a class="card" routerLink="/admin/pending-doctors">
          <h3>
            <span class="icon-circle bg-accent-admin">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>
            </span>
            Pending Doctor Approvals
          </h3>
          <p>Approve or reject new doctors</p>
        </a>

        <a class="card" routerLink="/admin/create-patient">
          <h3>
            <span class="icon-circle bg-accent-admin">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg>
            </span>
            Create Patient
          </h3>
          <p>Register a patient on their behalf</p>
        </a>

        <a class="card" routerLink="/admin/create-appointment">
          <h3>
            <span class="icon-circle bg-accent-admin">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18M12 14v4M10 16h4"/></svg>
            </span>
            Create Appointment
          </h3>
          <p>Link a doctor to a patient</p>
        </a>

        <a class="card" routerLink="/admin/manage-appointments">
          <h3>
            <span class="icon-circle bg-accent-admin">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l2 2 4-4"/><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18"/></svg>
            </span>
            Manage Appointments
          </h3>
          <p>View and cancel appointments</p>
        </a>

        <a class="card" routerLink="/admin/manage-users">
          <h3>
            <span class="icon-circle bg-accent-admin">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/><path d="m17 8 2 2 3-3" stroke="var(--admin)"/></svg>
            </span>
            Manage Users
          </h3>
          <p>Deactivate accounts</p>
        </a>

        <a class="card" routerLink="/admin/access-logs">
          <h3>
            <span class="icon-circle bg-accent-admin">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/></svg>
            </span>
            Access Logs
          </h3>
          <p>All system access activity</p>
        </a>

        <a class="card" routerLink="/admin/emergency-logs">
          <h3>
            <span class="icon-circle bg-accent-admin">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4M12 17h.01"/></svg>
            </span>
            Emergency Logs
          </h3>
          <p>All emergency access records</p>
        </a>
      </div>
    </div>
  `
})
export class AdminDashboardComponent {}
