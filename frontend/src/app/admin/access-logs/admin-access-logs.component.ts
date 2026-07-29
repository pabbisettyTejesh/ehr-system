import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminApiService } from '../../core/services/admin.service';
import { AccessLog } from '../../core/models/models';

@Component({
  selector: 'app-admin-access-logs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>All Access Logs</h1>
      <div class="card">
        <table>
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
        <p *ngIf="logs.length === 0">No logs yet.</p>
      </div>
    </div>
  `
})
export class AdminAccessLogsComponent implements OnInit {
  logs: AccessLog[] = [];
  constructor(private api: AdminApiService) {}
  ngOnInit() { this.api.getAccessLogs().subscribe(l => this.logs = l); }
}
