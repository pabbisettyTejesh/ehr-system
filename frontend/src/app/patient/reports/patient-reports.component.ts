import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientApiService } from '../../core/services/patient.service';
import { ReportItem } from '../../core/models/models';

@Component({
  selector: 'app-patient-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>My Reports</h1>
      <div class="card">
        <table>
          <thead><tr><th>Report Name</th><th>Type</th><th>Hospital</th><th>Uploaded</th></tr></thead>
          <tbody>
            <tr *ngFor="let r of reports">
              <td>{{ r.reportName }}</td>
              <td>{{ r.reportType }}</td>
              <td>{{ r.hospitalName }}</td>
              <td>{{ r.uploadedAt | date:'medium' }}</td>
            </tr>
          </tbody>
        </table>
        <p *ngIf="reports.length === 0">No reports uploaded yet.</p>
      </div>
    </div>
  `
})
export class PatientReportsComponent implements OnInit {
  reports: ReportItem[] = [];
  constructor(private api: PatientApiService) {}
  ngOnInit() { this.api.getReports().subscribe(r => this.reports = r); }
}
