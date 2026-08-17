import { Component, OnInit } from '@angular/core';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';
import { CommonModule } from '@angular/common';
import { PatientApiService } from '../../core/services/patient.service';
import { AccessLog, EmergencyAccessLog } from '../../core/models/models';

@Component({
  selector: 'app-patient-access-logs',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  template: `
    <div class="container">
      <div class="page-header">
        <span class="icon-circle bg-accent-patient">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.shieldCheck | safeHtml"></svg>
        </span>
        <div>
          <span class="page-eyebrow">Patient Portal</span>
          <h1>Access Logs</h1>
        </div>
      </div>
      <div class="card">
        <h3>Normal Access</h3>
        <table *ngIf="logs.length > 0">
          <thead><tr><th>Action</th><th>Mode</th><th>Timestamp</th></tr></thead>
          <tbody>
            <tr *ngFor="let l of logs">
              <td>{{ l.action }}</td>
              <td>{{ l.accessMode }}</td>
              <td>{{ l.timestamp | date:'medium' }}</td>
            </tr>
          </tbody>
        </table>
        <div class="empty-state" *ngIf="logs.length === 0">
          <img src="assets/illustrations/empty-state.svg" alt="No access logs yet." loading="lazy">
          <p>No access logs yet.</p>
        </div>
      </div>
      <div class="card">
        <h3>Emergency Access</h3>
        <table *ngIf="emergencyLogs.length > 0">
          <thead><tr><th>Doctor ID</th><th>Reason</th><th>Viewed At</th></tr></thead>
          <tbody>
            <tr *ngFor="let l of emergencyLogs">
              <td>{{ l.doctorId }}</td>
              <td>{{ l.reason }}</td>
              <td>{{ l.viewedAt | date:'medium' }}</td>
            </tr>
          </tbody>
        </table>
        <div class="empty-state" *ngIf="emergencyLogs.length === 0">
          <img src="assets/illustrations/empty-state.svg" alt="No emergency access recorded." loading="lazy">
          <p>No emergency access recorded.</p>
        </div>
      </div>
    </div>
  `
})
export class PatientAccessLogsComponent implements OnInit {
  icons = ICONS;
  logs: AccessLog[] = [];
  emergencyLogs: EmergencyAccessLog[] = [];
  constructor(private api: PatientApiService) {}
  ngOnInit() {
    this.api.getAccessLogs().subscribe(l => this.logs = l);
    this.api.getEmergencyLogs().subscribe(l => this.emergencyLogs = l);
  }
}
