import { Component, OnInit } from '@angular/core';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';
import { CommonModule } from '@angular/common';
import { PatientApiService } from '../../core/services/patient.service';
import { ReportItem } from '../../core/models/models';
import { EmptyStateComponent } from '../../shared/empty-state/empty-state.component';
import { SkeletonComponent } from '../../shared/skeleton/skeleton.component';

@Component({
  selector: 'app-patient-reports',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe, EmptyStateComponent, SkeletonComponent],
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
        
        <!-- Skeleton Loading -->
        <div *ngIf="loading" style="padding: 24px;">
          <app-skeleton type="row" height="60px" *ngFor="let i of [1,2,3]"></app-skeleton>
        </div>

        <table *ngIf="!loading && reports.length > 0">
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
        <app-empty-state 
          *ngIf="!loading && reports.length === 0" 
          iconName="scrollText" 
          title="No Reports" 
          message="No reports uploaded yet." 
          theme="patient">
        </app-empty-state>
      </div>
    </div>
  `
})
export class PatientReportsComponent implements OnInit {
  icons = ICONS;
  reports: ReportItem[] = [];
  loading = true;
  constructor(private api: PatientApiService) {}
  ngOnInit() { 
    this.api.getReports().subscribe(r => {
      this.reports = r;
      this.loading = false;
    }); 
  }
}
