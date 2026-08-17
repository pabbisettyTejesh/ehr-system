import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminApiService } from '../../core/services/admin.service';
import { EmergencyAccessLog } from '../../core/models/models';

@Component({
  selector: 'app-admin-emergency-logs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>All Emergency Access Logs</h1>
      <div class="card">
        <table>
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
        <p *ngIf="logs.length === 0">No emergency access recorded.</p>
      </div>
    </div>
  `
})
export class AdminEmergencyLogsComponent implements OnInit {
  logs: EmergencyAccessLog[] = [];
  constructor(private api: AdminApiService) {}
  ngOnInit() { this.api.getEmergencyLogs().subscribe(l => this.logs = l); }
}
