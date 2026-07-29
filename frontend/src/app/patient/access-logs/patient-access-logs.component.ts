import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientApiService } from '../../core/services/patient.service';
import { AccessLog, EmergencyAccessLog } from '../../core/models/models';

@Component({
  selector: 'app-patient-access-logs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Access Logs</h1>
      <div class="card">
        <h3>Normal Access</h3>
        <table>
          <thead><tr><th>Action</th><th>Mode</th><th>Timestamp</th></tr></thead>
          <tbody>
            <tr *ngFor="let l of logs">
              <td>{{ l.action }}</td>
              <td>{{ l.accessMode }}</td>
              <td>{{ l.timestamp | date:'medium' }}</td>
            </tr>
          </tbody>
        </table>
        <p *ngIf="logs.length === 0">No access logs yet.</p>
      </div>
      <div class="card">
        <h3>Emergency Access</h3>
        <table>
          <thead><tr><th>Doctor ID</th><th>Reason</th><th>Viewed At</th></tr></thead>
          <tbody>
            <tr *ngFor="let l of emergencyLogs">
              <td>{{ l.doctorId }}</td>
              <td>{{ l.reason }}</td>
              <td>{{ l.viewedAt | date:'medium' }}</td>
            </tr>
          </tbody>
        </table>
        <p *ngIf="emergencyLogs.length === 0">No emergency access recorded.</p>
      </div>
    </div>
  `
})
export class PatientAccessLogsComponent implements OnInit {
  logs: AccessLog[] = [];
  emergencyLogs: EmergencyAccessLog[] = [];
  constructor(private api: PatientApiService) {}
  ngOnInit() {
    this.api.getAccessLogs().subscribe(l => this.logs = l);
    this.api.getEmergencyLogs().subscribe(l => this.emergencyLogs = l);
  }
}
