import { Component, OnInit } from '@angular/core';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';
import { CommonModule } from '@angular/common';
import { PatientApiService } from '../../core/services/patient.service';
import { ReportItem } from '../../core/models/models';

@Component({
  selector: 'app-patient-reports',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  template: `
    <div class="container">
      <div class="page-header">
        <span class="icon-circle bg-accent-patient">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.scrollText | safeHtml"></svg>
        </span>
        <div>
          <span class="page-eyebrow">Patient Portal</span>
          <h1>My Reports</h1>
        </div>
      </div>
      <div class="card">
        <table *ngIf="reports.length > 0">
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
        <div class="empty-state" *ngIf="reports.length === 0">
          <img src="assets/illustrations/empty-state.svg" alt="No reports uploaded yet." loading="lazy">
          <p>No reports uploaded yet.</p>
        </div>
      </div>
    </div>
  `
})
export class PatientReportsComponent implements OnInit {
  icons = ICONS;
  reports: ReportItem[] = [];
  constructor(private api: PatientApiService) {}
  ngOnInit() { this.api.getReports().subscribe(r => this.reports = r); }
}
