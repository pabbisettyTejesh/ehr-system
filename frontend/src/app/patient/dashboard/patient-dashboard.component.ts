import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ICONS } from '../../shared/icons';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { CareRailComponent, RailItem, RailEventType } from '../../shared/care-rail/care-rail.component';
import { PatientApiService } from '../../core/services/patient.service';
import { Appointment, MedicalRecord, Prescription, Allergy, ReportItem, AccessLog } from '../../core/models/models';
import { SkeletonComponent } from '../../shared/skeleton/skeleton.component';

const TAG_LABEL: Record<RailEventType, string> = {
  encounter: 'Encounter', prescription: 'Prescription', report: 'Report', allergy: 'Allergy', access: 'Access log'
};

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, SafeHtmlPipe, CareRailComponent, SkeletonComponent],
  template: `
    <div class="container">
      <div class="dash-hero">
        <div>
          <span class="page-eyebrow">Patient portal</span>
          <h1>Welcome back</h1>
          <p style="color:var(--ink-soft);">Your unified health record, all in one place.</p>
        </div>
        <img src="assets/illustrations/patient-dashboard.svg" alt="Patient viewing their personal health record on a phone" width="420" height="300" loading="eager">
      </div>

      <!-- Skeleton Loading for Stats -->
      <div class="stat-row" *ngIf="!loaded">
        <div class="stat-tile" *ngFor="let i of [1,2,3,4]" style="padding: 0; border: none; background: transparent;">
          <app-skeleton type="card" height="136px" style="width: 100%;"></app-skeleton>
        </div>
      </div>

      <div class="stat-row" *ngIf="loaded">
        <div class="stat-tile">
          <div class="stat-top">
            <span class="stat-label">Next visit</span>
            <span class="stat-icon-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.calendar | safeHtml"></svg></span>
          </div>
          <div class="stat-num" style="font-size:18px;">{{ nextVisit ? (nextVisit.appointmentDate | date:'d MMM') : 'None' }}</div>
          <div class="stat-sub">{{ nextVisit ? nextVisit.reason : 'No upcoming appointment' }}</div>
        </div>
        <div class="stat-tile">
          <div class="stat-top">
            <span class="stat-label">Prescriptions</span>
            <span class="stat-icon-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.pill | safeHtml"></svg></span>
          </div>
          <div class="stat-num">{{ activePrescriptionCount }}</div>
          <div class="stat-sub">active</div>
        </div>
        <div class="stat-tile" [class.critical]="highAllergyCount > 0">
          <div class="stat-top">
            <span class="stat-label">Allergy alert</span>
            <span class="stat-icon-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.triangleAlert | safeHtml"></svg></span>
          </div>
          <div class="stat-num">{{ highAllergyCount }}{{ highAllergyCount > 0 ? ' high' : '' }}</div>
          <div class="stat-sub">{{ highAllergyLabel }}</div>
        </div>
        <div class="stat-tile">
          <div class="stat-top">
            <span class="stat-label">Record views</span>
            <span class="stat-icon-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.shieldCheck | safeHtml"></svg></span>
          </div>
          <div class="stat-num">{{ accessLogCount }}</div>
          <div class="stat-sub">this week</div>
        </div>
      </div>

      <div class="dash-split">
        <div>
          <div class="panel-title"><h3>Care Rail</h3><span class="mono">recent activity</span></div>
          <app-care-rail [items]="railItems"></app-care-rail>
        </div>
        <div>
          <div class="panel-title"><h3>Quick actions</h3></div>
          <div class="qa-list">
            <a class="qa-item" routerLink="/patient/profile">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.userRound | safeHtml"></svg>
              View profile
            </a>
            <a class="qa-item" routerLink="/patient/reports">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.scrollText | safeHtml"></svg>
              View reports
            </a>
            <a class="qa-item" routerLink="/patient/appointments">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.calendar | safeHtml"></svg>
              View appointments
            </a>
          </div>
          <div class="mini-emergency">
            <strong>Emergency access is live</strong>
            <p>If a doctor pulls your record under emergency mode, it appears on this rail within minutes, tagged and reasoned.</p>
          </div>
        </div>
      </div>

      <div class="dash-split" style="margin-top: 28px;">
        <!-- Next Appointment Countdown / Info -->
        <div class="card" style="padding: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--line); padding-bottom: 12px; margin-bottom: 16px;">
            <h3 style="margin: 0; display: flex; align-items: center; gap: 8px;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px; color: var(--accent-patient);" [innerHTML]="icons.calendar | safeHtml"></svg>
              Next Upcoming Appointment
            </h3>
          </div>
          
          <div *ngIf="nextVisit" style="display: flex; flex-direction: column; gap: 16px;">
            <div style="padding: 16px; border-radius: 8px; border: 1px solid var(--line); background: var(--bg); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
              <div>
                <strong style="display: block; font-size: 16px; margin-bottom: 4px;">{{ nextVisit.appointmentDate | date:'fullDate' }}</strong>
                <span style="font-size: 14px; color: var(--ink-soft); display: block; margin-bottom: 4px;">{{ nextVisit.appointmentDate | date:'shortTime' }}</span>
                <span class="badge" style="background: var(--bg-soft);">Reason: {{ nextVisit.reason }}</span>
              </div>
              <div style="text-align: right;">
                <p style="margin: 0 0 8px 0; font-size: 13px; color: var(--ink-soft);">Status: {{ nextVisit.status }}</p>
                <a *ngIf="nextVisit.meetingLink" [href]="nextVisit.meetingLink" target="_blank" class="btn primary" style="padding: 6px 16px; font-size: 14px; display: inline-flex; align-items: center; gap: 6px;">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px;" [innerHTML]="icons.video | safeHtml"></svg>
                  Join Call
                </a>
              </div>
            </div>
          </div>
          
          <div *ngIf="!nextVisit" style="text-align: center; padding: 32px 0;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 48px; height: 48px; color: var(--line); margin-bottom: 12px;" [innerHTML]="icons.calendar | safeHtml"></svg>
            <p style="color: var(--ink-soft); font-size: 15px; margin: 0;">You have no upcoming appointments.</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PatientDashboardComponent implements OnInit {
  icons = ICONS;
  loaded = false;

  nextVisit: Appointment | null = null;
  activePrescriptionCount = 0;
  highAllergyCount = 0;
  highAllergyLabel = 'None recorded';
  accessLogCount = 0;
  railItems: RailItem[] = [];

  constructor(private api: PatientApiService) {}

  ngOnInit() {
    forkJoin({
      appointments: this.api.getAppointments(),
      history: this.api.getMedicalHistory(),
      prescriptions: this.api.getPrescriptions(),
      allergies: this.api.getAllergies(),
      reports: this.api.getReports(),
      logs: this.api.getAccessLogs()
    }).subscribe(({ appointments, history, prescriptions, allergies, reports, logs }) => {
      this.computeStats(appointments, prescriptions, allergies, logs);
      this.railItems = this.buildRail(history, prescriptions, reports, allergies, logs);
      this.loaded = true;
    });
  }

  private computeStats(appointments: Appointment[], prescriptions: Prescription[], allergies: Allergy[], logs: AccessLog[]) {
    const now = Date.now();
    this.nextVisit = appointments
      .filter(a => (a.status === 'SCHEDULED' || a.status === 'ACTIVE') && new Date(a.appointmentDate).getTime() >= now)
      .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())[0] ?? null;

    this.activePrescriptionCount = prescriptions.filter(p => p.status === 'ACTIVE').length;

    const highAllergies = allergies.filter(a => a.status === 'ACTIVE' && (a.severity === 'HIGH' || a.severity === 'CRITICAL'));
    this.highAllergyCount = highAllergies.length;
    this.highAllergyLabel = highAllergies.length
      ? highAllergies.map(a => a.allergenName).join(', ')
      : 'None recorded';

    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
    this.accessLogCount = logs.filter(l => new Date(l.timestamp).getTime() >= weekAgo).length;
  }

  private buildRail(
    history: MedicalRecord[], prescriptions: Prescription[], reports: ReportItem[],
    allergies: Allergy[], logs: AccessLog[]
  ): RailItem[] {
    const items: RailItem[] = [];

    for (const r of history) {
      items.push({
        date: r.createdAt, type: 'encounter', tagLabel: TAG_LABEL.encounter,
        title: r.diagnosis || 'Medical record updated',
        detail: r.clinicalNotes || r.symptoms || 'Clinical note added to your record.'
      });
    }
    for (const p of prescriptions) {
      const first = p.items?.[0]?.medicineName;
      items.push({
        date: p.createdAt, type: 'prescription', tagLabel: TAG_LABEL.prescription,
        title: 'Prescription ' + p.status.toLowerCase(),
        detail: first ? `${first}${p.items.length > 1 ? ` +${p.items.length - 1} more` : ''}` : 'Prescription updated.'
      });
    }
    for (const rep of reports) {
      items.push({
        date: rep.uploadedAt, type: 'report', tagLabel: TAG_LABEL.report,
        title: rep.reportName, detail: `${rep.reportType} · ${rep.hospitalName}`
      });
    }
    for (const a of allergies) {
      items.push({
        date: a.recordedAt, type: 'allergy', tagLabel: TAG_LABEL.allergy,
        title: `Allergy flagged — ${a.allergenName}`,
        detail: `${a.severity} severity · ${a.reaction}`
      });
    }
    for (const l of logs) {
      items.push({
        date: l.timestamp, type: 'access', tagLabel: TAG_LABEL.access,
        title: 'Record accessed',
        detail: `${l.action} · ${l.accessMode}`
      });
    }

    return items
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8);
  }
}
