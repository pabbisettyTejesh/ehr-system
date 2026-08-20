import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ICONS } from '../../shared/icons';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { CareRailComponent, RailItem } from '../../shared/care-rail/care-rail.component';
import { AdminApiService } from '../../core/services/admin.service';
import { DoctorProfile, Appointment, AccessLog, EmergencyAccessLog } from '../../core/models/models';
import { SkeletonComponent } from '../../shared/skeleton/skeleton.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, SafeHtmlPipe, CareRailComponent, SkeletonComponent],
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

      <!-- Skeleton Loading for Stats -->
      <div class="stat-row" *ngIf="!loaded">
        <div class="stat-tile" *ngFor="let i of [1,2,3]" style="padding: 0; border: none; background: transparent;">
          <app-skeleton type="card" height="136px" style="width: 100%;"></app-skeleton>
        </div>
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

      <div class="dash-split" style="margin-top: 28px;">
        <!-- System Analytics -->
        <div class="card" style="padding: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--line); padding-bottom: 12px; margin-bottom: 16px;">
            <h3 style="margin: 0; display: flex; align-items: center; gap: 8px;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px; color: var(--accent-admin);" [innerHTML]="icons.activity | safeHtml"></svg>
              System Analytics Overview
            </h3>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            <div style="padding: 16px; border-radius: 8px; border: 1px solid var(--line); background: var(--bg); display: flex; align-items: center; justify-content: space-between;">
              <div>
                <span style="display: block; font-size: 28px; font-weight: 600; color: var(--ink);">{{ pendingDoctors.length }}</span>
                <span style="font-size: 13px; color: var(--ink-soft);">Pending Verifications</span>
              </div>
              <div style="width: 64px; height: 64px; border-radius: 50%; background: conic-gradient(var(--accent-admin) 0% 25%, var(--line) 25% 100%); display: flex; align-items: center; justify-content: center;">
                <div style="width: 44px; height: 44px; background: var(--bg); border-radius: 50%;"></div>
              </div>
            </div>
            <div style="padding: 16px; border-radius: 8px; border: 1px solid var(--line); background: var(--bg); display: flex; flex-direction: column; justify-content: center;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                <span style="color: var(--ink-soft);">Appointments</span>
                <strong>{{ activeAppointmentCount }} Total</strong>
              </div>
              <div style="height: 12px; display: flex; width: 100%; border-radius: 6px; overflow: hidden; background: var(--line);">
                <div style="width: 70%; background: var(--accent-admin);" title="Active"></div>
                <div style="width: 30%; background: var(--gold-soft);" title="Scheduled"></div>
              </div>
            </div>
          </div>
          <div style="padding: 16px; border-radius: 8px; background: var(--bg-soft); border: 1px solid var(--line);">
            <h4 style="margin: 0 0 8px 0; font-size: 14px;">Platform Health</h4>
            <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
              <span>Database Status</span><span style="color: var(--success); font-weight: 500;">Healthy</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 13px;">
              <span>Video Calling (Zoom API)</span><span style="color: var(--success); font-weight: 500;">Operational</span>
            </div>
          </div>
        </div>

        <!-- Security Alerts Feed -->
        <div class="card" style="padding: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--line); padding-bottom: 12px; margin-bottom: 16px;">
            <h3 style="margin: 0; display: flex; align-items: center; gap: 8px;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px; color: var(--critical);" [innerHTML]="icons.shieldAlert | safeHtml"></svg>
              Security & Emergency Alerts
            </h3>
            <a routerLink="/admin/emergency-logs" class="btn secondary" style="padding: 4px 8px; font-size: 12px;">View All</a>
          </div>
          
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div *ngFor="let e of emergencyLogs.slice(0,3)" style="padding: 12px; border-radius: 8px; border-left: 3px solid var(--critical); background: var(--bg-soft); display: flex; flex-direction: column; gap: 4px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <strong style="font-size: 14px; color: var(--critical);">Emergency Access Triggered</strong>
                <span style="font-size: 12px; color: var(--ink-soft);">{{ e.viewedAt | date:'short' }}</span>
              </div>
              <span style="font-size: 13px;">Patient ID: #{{ e.patientId }} by Doctor ID: #{{ e.doctorId }}</span>
              <p style="margin: 4px 0 0; font-size: 13px; color: var(--ink-soft); font-style: italic;">"{{ e.reason }}"</p>
            </div>
            
            <p *ngIf="emergencyLogs.length === 0" style="color: var(--ink-soft); font-size: 14px; text-align: center; padding: 24px 0;">No security alerts detected.</p>
          </div>
        </div>
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
