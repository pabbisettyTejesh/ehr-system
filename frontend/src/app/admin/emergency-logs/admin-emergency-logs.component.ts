import { Component, OnInit } from '@angular/core';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';
import { CommonModule } from '@angular/common';
import { AdminApiService } from '../../core/services/admin.service';
import { EmergencyAccessLog } from '../../core/models/models';

@Component({
  selector: 'app-admin-emergency-logs',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  template: `
    <div class="container">
      <div class="page-header">
        <span class="icon-circle bg-accent-admin">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.siren | safeHtml"></svg>
        </span>
        <div>
          <span class="page-eyebrow">Admin Portal</span>
          <h1>All Emergency Access Logs</h1>
        </div>
        <img src="assets/illustrations/emergency.svg" alt="" style="margin-left:auto; width:80px; height:auto;" loading="lazy">
      </div>
      <div class="card">
        <table *ngIf="logs.length > 0">
          <thead><tr><th>Doctor ID</th><th>Patient ID</th><th>Reason</th><th>Viewed At</th></tr></thead>
          <tbody>
            <tr *ngFor="let l of logs">
              <td>{{ l.doctorId }}</td>
              <td>{{ l.patientId }}</td>
              <td>{{ l.reason }}</td>
              <td>{{ l.viewedAt | date:'medium' }}</td>
            </tr>
          </tbody>
        </table>
        <div class="empty-state" *ngIf="logs.length === 0">
          <img src="assets/illustrations/empty-state.svg" alt="No emergency access recorded." loading="lazy">
          <p>No emergency access recorded.</p>
        </div>
      </div>
    </div>
  `
})
export class AdminEmergencyLogsComponent implements OnInit {
  icons = ICONS;
  logs: EmergencyAccessLog[] = [];
  constructor(private api: AdminApiService) {}
  ngOnInit() { this.api.getEmergencyLogs().subscribe(l => this.logs = l); }
}
