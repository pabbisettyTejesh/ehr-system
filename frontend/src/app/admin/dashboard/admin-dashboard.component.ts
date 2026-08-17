import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ICONS } from '../../shared/icons';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { CareRailComponent, RailItem } from '../../shared/care-rail/care-rail.component';
import { AdminApiService } from '../../core/services/admin.service';
import { DoctorProfile, Appointment, AccessLog, EmergencyAccessLog } from '../../core/models/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, SafeHtmlPipe, CareRailComponent],
  template: `
    <div class="container">
      <div class="dash-hero">
        <div>
          <span class="page-eyebrow">Admin portal</span>
          <h1>System overview</h1>
          <p style="color:var(--ink-soft);">Approvals, access links, and audit visibility.</p>
        </div>
        <img src="assets/illustrations/admin-dashboard.svg" alt="Healthcare administration control center with analytics and access control" width="420" height="300" loading="eager">
      </div>

      <div class="stat-row" *ngIf="loaded">
        <div class="stat-tile">
          <div class="stat-top">
            <span class="stat-label">Pending approvals</span>
            <span class="stat-icon-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.userCheck | safeHtml"></svg></span>
          </div>
          <div class="stat-num">{{ pendingDoctors.length }}</div>
          <div class="stat-sub">doctors awaiting review</div>
        </div>
        <div class="stat-tile">
          <div class="stat-top">
            <span class="stat-label">Appointments</span>
            <span class="stat-icon-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.listChecks | safeHtml"></svg></span>
          </div>
          <div class="stat-num">{{ activeAppointmentCount }}</div>
          <div class="stat-sub">active / scheduled</div>
        </div>
        <div class="stat-tile" [class.critical]="emergencyLogs.length > 0">
          <div class="stat-top">
            <span class="stat-label">Emergency pulls</span>
            <span class="stat-icon-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.siren | safeHtml"></svg></span>
          </div>
          <div class="stat-num">{{ emergencyLogs.length }}</div>
          <div class="stat-sub">all time</div>
        </div>
      </div>

      <div class="dash-split">
        <div>
          <div class="panel-title"><h3>Care Rail</h3><span class="mono">system activity</span></div>
          <app-care-rail [items]="railItems"></app-care-rail>
        </div>
        <div>
          <div class="panel-title"><h3>Quick actions</h3></div>
          <div class="qa-list">
            <a class="qa-item" routerLink="/admin/pending-doctors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.userCheck | safeHtml"></svg>
              Review pending doctors
            </a>
            <a class="qa-item" routerLink="/admin/create-appointment">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.calendarPlus | safeHtml"></svg>
              Create appointment
            </a>
            <a class="qa-item" routerLink="/admin/manage-users">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.users | safeHtml"></svg>
              Manage users
            </a>
          </div>
          <div class="mini-emergency">
            <strong>Emergency access, audited</strong>
            <p>Every emergency pull is reason-logged here and cross-visible to the patient's own access log.</p>
          </div>
        </div>
      </div>

      <div class="dash-grid" style="margin-top:28px;">
        <a class="card" routerLink="/admin/pending-doctors">
          <h3>
            <span class="icon-circle bg-accent-admin">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.userCheck | safeHtml"></svg>
            </span>
            Pending Doctor Approvals
          </h3>
          <p>Approve or reject new doctors</p>
        </a>

        <a class="card" routerLink="/admin/create-patient">
          <h3>
            <span class="icon-circle bg-accent-admin">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.userPlus | safeHtml"></svg>
            </span>
            Create Patient
          </h3>
          <p>Register a patient on their behalf</p>
        </a>

        <a class="card" routerLink="/admin/create-appointment">
          <h3>
            <span class="icon-circle bg-accent-admin">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.calendarPlus | safeHtml"></svg>
            </span>
            Create Appointment
          </h3>
          <p>Link a doctor to a patient</p>
        </a>

        <a class="card" routerLink="/admin/manage-appointments">
          <h3>
            <span class="icon-circle bg-accent-admin">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.listChecks | safeHtml"></svg>
            </span>
            Manage Appointments
          </h3>
          <p>View and cancel appointments</p>
        </a>

        <a class="card" routerLink="/admin/manage-users">
          <h3>
            <span class="icon-circle bg-accent-admin">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.users | safeHtml"></svg>
            </span>
            Manage Users
          </h3>
          <p>Deactivate accounts</p>
        </a>

        <a class="card" routerLink="/admin/access-logs">
          <h3>
            <span class="icon-circle bg-accent-admin">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.shieldCheck | safeHtml"></svg>
            </span>
            Access Logs
          </h3>
          <p>All system access activity</p>
        </a>

        <a class="card" routerLink="/admin/emergency-logs">
          <h3>
            <span class="icon-circle bg-accent-admin">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.siren | safeHtml"></svg>
            </span>
            Emergency Logs
          </h3>
          <p>All emergency access records</p>
        </a>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  icons = ICONS;
  loaded = false;
  pendingDoctors: DoctorProfile[] = [];
  activeAppointmentCount = 0;
  emergencyLogs: EmergencyAccessLog[] = [];
  railItems: RailItem[] = [];

  constructor(private api: AdminApiService) {}

  ngOnInit() {
    forkJoin({
      pendingDoctors: this.api.getPendingDoctors(),
      appointments: this.api.getAllAppointments(),
      accessLogs: this.api.getAccessLogs(),
      emergencyLogs: this.api.getEmergencyLogs()
    }).subscribe(({ pendingDoctors, appointments, accessLogs, emergencyLogs }) => {
      this.pendingDoctors = pendingDoctors;
      this.emergencyLogs = emergencyLogs;
      this.activeAppointmentCount = appointments.filter(a => a.status === 'SCHEDULED' || a.status === 'ACTIVE').length;
      this.railItems = this.buildRail(accessLogs, emergencyLogs);
      this.loaded = true;
    });
  }

  private buildRail(accessLogs: AccessLog[], emergencyLogs: EmergencyAccessLog[]): RailItem[] {
    const items: RailItem[] = [];
    for (const l of accessLogs) {
      items.push({
        date: l.timestamp, type: 'access', tagLabel: 'Access log',
        title: `${l.action} · patient #${l.patientId}`,
        detail: `${l.accessMode} · user #${l.userId}`
      });
    }
    for (const e of emergencyLogs) {
      items.push({
        date: e.viewedAt, type: 'allergy', tagLabel: 'Emergency access',
        title: `Emergency pull · patient #${e.patientId}`,
        detail: e.reason
      });
    }
    return items
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8);
  }
}
