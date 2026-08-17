import { Component, OnInit } from '@angular/core';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';
import { CommonModule } from '@angular/common';
import { AdminApiService } from '../../core/services/admin.service';
import { AccessLog } from '../../core/models/models';

@Component({
  selector: 'app-admin-access-logs',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  template: `
    <div class="container">
      <div class="page-header">
        <span class="icon-circle bg-accent-admin">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.shieldCheck | safeHtml"></svg>
        </span>
        <div>
          <span class="page-eyebrow">Admin Portal</span>
          <h1>All Access Logs</h1>
        </div>
      </div>
      <div class="card">
        <table *ngIf="logs.length > 0">
          <thead><tr><th>User</th><th>Patient</th><th>Action</th><th>Mode</th><th>Timestamp</th></tr></thead>
          <tbody>
            <tr *ngFor="let l of logs">
              <td>{{ l.userId }}</td>
              <td>{{ l.patientId }}</td>
              <td>{{ l.action }}</td>
              <td>{{ l.accessMode }}</td>
              <td>{{ l.timestamp | date:'medium' }}</td>
            </tr>
          </tbody>
        </table>
        <div class="empty-state" *ngIf="logs.length === 0">
          <img src="assets/illustrations/empty-state.svg" alt="No logs yet." loading="lazy">
          <p>No logs yet.</p>
        </div>
      </div>
    </div>
  `
})
export class AdminAccessLogsComponent implements OnInit {
  icons = ICONS;
  logs: AccessLog[] = [];
  constructor(private api: AdminApiService) {}
  ngOnInit() { this.api.getAccessLogs().subscribe(l => this.logs = l); }
}
