import { Component, OnInit } from '@angular/core';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DoctorApiService } from '../../core/services/doctor.service';
import { PatientFullDataResponse } from '../../core/models/models';

@Component({
  selector: 'app-doctor-patient-summary',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe, RouterLink],
  template: `
    <div class="container form-page" style="max-width: 1100px;">
      
      <button class="btn secondary" (click)="goBack()" style="margin-bottom: 20px; display: inline-flex; align-items: center; gap: 8px;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px;"><path d="m15 18-6-6 6-6"/></svg>
        Go Back
      </button>

      <!-- Loading & Error States -->
      <ng-template #loading>
        <div class="card" *ngIf="!error" style="text-align: center; padding: 48px;">
          <div class="spinner"></div>
          <p style="color: var(--ink-soft); margin-top: 16px;">Loading secure patient session...</p>
        </div>
        <div class="card" *ngIf="error" style="border-left: 4px solid var(--critical);">
          <p class="error-text" style="margin:0;">{{ error }}</p>
        </div>
      </ng-template>

      <div *ngIf="data; else loading">
        
        <!-- Premium Patient ID Card Header -->
        <div class="patient-id-card">
          <div class="id-card-content">
            <div class="avatar-large">
              {{ data.profile.fullName.charAt(0) }}
            </div>
            <div class="id-card-info">
              <span class="patient-uid-badge">{{ data.profile.patientUid }}</span>
              <h1 class="patient-name">{{ data.profile.fullName }}</h1>
              <div class="vitals-row">
                <div class="vital-chip">
                  <span class="vital-label">Gender</span>
                  <span class="vital-value">{{ data.profile.gender }}</span>
                </div>
                <div class="vital-chip">
                  <span class="vital-label">Blood Group</span>
                  <span class="vital-value" [class.critical-text]="data.profile.bloodGroup.includes('-')">{{ data.profile.bloodGroup }}</span>
                </div>
                <div class="vital-chip">
                  <span class="vital-label">Emergency Contact</span>
                  <span class="vital-value">{{ data.profile.emergencyContactName }} ({{ data.profile.emergencyContactPhone }})</span>
                </div>
              </div>
            </div>
          </div>
          <button class="btn danger outline" (click)="closeSession()" style="align-self: flex-start;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px; margin-right: 6px;" [innerHTML]="icons.power | safeHtml"></svg>
            End Session
          </button>
        </div>

        <!-- Floating Quick Action Bar -->
        <div class="quick-action-bar">
          <a [routerLink]="['/doctor/prescription']" [queryParams]="{patientId: data.profile.id}" class="action-btn primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.pill | safeHtml"></svg>
            Write Prescription
          </a>
          <a [routerLink]="['/doctor/medical-record']" [queryParams]="{patientId: data.profile.id}" class="action-btn secondary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.notebookText | safeHtml"></svg>
            Add Clinical Note
          </a>
          <a [routerLink]="['/doctor/reports']" [queryParams]="{patientId: data.profile.id}" class="action-btn secondary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.scrollText | safeHtml"></svg>
            Upload Report
          </a>
          <a [routerLink]="['/doctor/allergies']" [queryParams]="{patientId: data.profile.id}" class="action-btn secondary warning">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.triangleAlert | safeHtml"></svg>
            Log Allergy
          </a>
        </div>

        <div class="workspace-grid">
          
          <!-- LEFT COLUMN: Timeline & Clinical Data -->
          <div class="workspace-main">
            
            <!-- Clinical Encounters Timeline -->
            <div class="premium-card">
              <div class="premium-card-header">
                <h3>Clinical Timeline</h3>
                <a [routerLink]="['/doctor/create-encounter']" [queryParams]="{patientId: data.profile.id}" class="text-link">Log Past Visit</a>
              </div>
              
              <div class="timeline" *ngIf="data.encounters.length > 0">
                <div class="timeline-item" *ngFor="let e of data.encounters">
                  <div class="timeline-marker"></div>
                  <div class="timeline-content">
                    <div class="timeline-head">
                      <strong>{{ e.visitDate | date:'mediumDate' }}</strong>
                      <span class="badge" [class.active]="e.visitType === 'ONLINE'">{{ e.visitType || 'GENERAL' }}</span>
                    </div>
                    <p class="timeline-desc">{{ e.chiefComplaint || 'No chief complaint recorded.' }}</p>
                    <span class="timeline-meta">{{ e.hospitalName || 'Unknown Facility' }}</span>
                  </div>
                </div>
              </div>
              <div class="empty-state" *ngIf="data.encounters.length === 0">
                No encounters recorded yet.
              </div>
            </div>

            <!-- Active Prescriptions -->
            <div class="premium-card">
              <div class="premium-card-header">
                <h3>Prescription History</h3>
              </div>
              <div class="list-group" *ngIf="data.prescriptions.length > 0">
                <div class="list-item" *ngFor="let p of data.prescriptions">
                  <div class="item-icon bg-accent-doctor">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.pill | safeHtml"></svg>
                  </div>
                  <div class="item-body">
                    <strong>{{ p.items.length }} medication(s) prescribed</strong>
                    <span>{{ p.createdAt | date:'longDate' }}</span>
                  </div>
                  <div class="item-action">
                    <span class="badge" [class.active]="p.status === 'ACTIVE'" [class.rejected]="p.status === 'STOPPED' || p.status === 'COMPLETED'">{{ p.status }}</span>
                  </div>
                </div>
              </div>
              <div class="empty-state" *ngIf="data.prescriptions.length === 0">
                No prescriptions found.
              </div>
            </div>

            <!-- Medical Records -->
            <div class="premium-card">
              <div class="premium-card-header">
                <h3>Clinical Notes & Records</h3>
              </div>
              <div class="list-group" *ngIf="data.medicalRecords.length > 0">
                <div class="list-item" *ngFor="let m of data.medicalRecords">
                  <div class="item-icon" style="background: var(--bg-soft);">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--ink-soft);" [innerHTML]="icons.fileText | safeHtml"></svg>
                  </div>
                  <div class="item-body">
                    <strong>{{ m.diagnosis }}</strong>
                    <span>{{ m.treatmentPlan }}</span>
                  </div>
                  <div class="item-action" style="font-size: 13px; color: var(--ink-soft);">
                    {{ m.createdAt | date:'mediumDate' }}
                  </div>
                </div>
              </div>
              <div class="empty-state" *ngIf="data.medicalRecords.length === 0">
                No clinical notes found.
              </div>
            </div>

            <!-- Lab Reports -->
            <div class="premium-card">
              <div class="premium-card-header">
                <h3>Lab & Diagnostics Reports</h3>
              </div>
              <table class="premium-table" *ngIf="data.reports.length > 0">
                <thead><tr><th>Date</th><th>Report Name</th><th>Type</th><th>Hospital</th></tr></thead>
                <tbody>
                  <tr *ngFor="let r of data.reports">
                    <td>{{ r.uploadedAt | date:'mediumDate' }}</td>
                    <td><strong>{{ r.reportName }}</strong></td>
                    <td><span class="badge">{{ r.reportType }}</span></td>
                    <td>{{ r.hospitalName }}</td>
                  </tr>
                </tbody>
              </table>
              <div class="empty-state" *ngIf="data.reports.length === 0" style="border-top: none;">
                No lab reports found.
              </div>
            </div>

          </div>
          
          <!-- RIGHT COLUMN: Side context -->
          <div class="workspace-side">
            
            <!-- Allergies Alert Box -->
            <div class="premium-card allergy-card" [class.has-allergies]="data.allergies.length > 0">
              <div class="premium-card-header" style="border: none; padding-bottom: 0;">
                <h3 style="color: var(--warn); display: flex; align-items: center; gap: 8px;">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px;" [innerHTML]="icons.triangleAlert | safeHtml"></svg>
                  Allergy Alerts
                </h3>
              </div>
              <div *ngIf="data.allergies.length > 0" style="padding: 16px;">
                <div class="allergy-tag" *ngFor="let a of data.allergies" [class.critical]="a.severity === 'CRITICAL'">
                  <strong>{{ a.allergenName }}</strong>
                  <span>{{ a.reaction }}</span>
                </div>
              </div>
              <div class="empty-state" *ngIf="data.allergies.length === 0" style="border: none;">
                No known allergies.
              </div>
            </div>

            <!-- Demographics context -->
            <div class="premium-card">
              <div class="premium-card-header">
                <h3>Location & Contact</h3>
              </div>
              <div style="padding: 16px; display: flex; flex-direction: column; gap: 12px; font-size: 14px;">
                <div>
                  <strong style="display: block; color: var(--ink-soft); font-size: 12px; text-transform: uppercase;">Address</strong>
                  <span>{{ data.profile.address }}, {{ data.profile.city }}</span>
                </div>
                <div>
                  <strong style="display: block; color: var(--ink-soft); font-size: 12px; text-transform: uppercase;">Contact</strong>
                  <span>{{ data.profile.emergencyContactPhone || 'Not provided' }} (Emergency)</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Spinner */
    .spinner {
      width: 40px; height: 40px;
      border: 4px solid var(--line);
      border-top-color: var(--accent-doctor);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Patient ID Card */
    .patient-id-card {
      background: var(--bg);
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.02);
    }
    .id-card-content {
      display: flex;
      gap: 24px;
      align-items: center;
    }
    .avatar-large {
      width: 72px; height: 72px;
      border-radius: 16px;
      background: var(--accent-doctor);
      color: white;
      display: flex; align-items: center; justify-content: center;
      font-size: 32px; font-weight: 600;
      box-shadow: 0 4px 12px rgba(100, 108, 255, 0.2);
    }
    .id-card-info {
      display: flex; flex-direction: column; gap: 4px;
    }
    .patient-uid-badge {
      font-family: monospace; font-size: 12px; color: var(--ink-soft);
      background: var(--bg-soft); padding: 2px 8px; border-radius: 4px; align-self: flex-start;
    }
    .patient-name {
      margin: 0; font-size: 24px; font-weight: 700; color: var(--ink);
    }
    .vitals-row {
      display: flex; gap: 16px; margin-top: 8px; flex-wrap: wrap;
    }
    .vital-chip {
      display: flex; gap: 6px; align-items: center;
      background: var(--bg-soft); padding: 4px 12px; border-radius: 20px;
      font-size: 13px;
    }
    .vital-label { color: var(--ink-soft); }
    .vital-value { font-weight: 600; color: var(--ink); }
    .critical-text { color: var(--critical); }

    /* Quick Action Bar */
    .quick-action-bar {
      display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap;
    }
    .action-btn {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 16px; border-radius: 8px;
      font-size: 14px; font-weight: 500; text-decoration: none;
      transition: all 0.2s ease; cursor: pointer;
    }
    .action-btn svg { width: 18px; height: 18px; }
    .action-btn.primary { background: var(--ink); color: #fff; }
    .action-btn.primary:hover { opacity: 0.9; transform: translateY(-1px); }
    .action-btn.secondary { background: var(--bg); border: 1px solid var(--line); color: var(--ink); }
    .action-btn.secondary:hover { background: var(--bg-soft); }
    .action-btn.warning { color: var(--warn); border-color: rgba(245, 158, 11, 0.3); background: rgba(245, 158, 11, 0.05); }
    .action-btn.warning:hover { background: rgba(245, 158, 11, 0.1); }

    /* Workspace Grid */
    .workspace-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
    }
    @media (max-width: 900px) {
      .workspace-grid { grid-template-columns: 1fr; }
      .patient-id-card { flex-direction: column; align-items: flex-start; gap: 16px; }
    }
    
    .workspace-main { display: flex; flex-direction: column; gap: 24px; }
    .workspace-side { display: flex; flex-direction: column; gap: 24px; }

    /* Premium Cards */
    .premium-card {
      background: var(--bg); border: 1px solid var(--line); border-radius: 12px;
      overflow: hidden;
    }
    .premium-card-header {
      padding: 16px 20px; border-bottom: 1px solid var(--line);
      display: flex; justify-content: space-between; align-items: center;
    }
    .premium-card-header h3 { margin: 0; font-size: 16px; font-weight: 600; }
    .text-link { color: var(--accent-doctor); text-decoration: none; font-size: 13px; font-weight: 500; }
    .text-link:hover { text-decoration: underline; }

    .empty-state {
      padding: 32px 20px; text-align: center; color: var(--ink-soft); font-size: 14px;
      border-top: 1px solid var(--line);
    }

    /* Timeline */
    .timeline {
      padding: 20px; display: flex; flex-direction: column; gap: 0;
    }
    .timeline-item {
      display: flex; gap: 16px; position: relative; padding-bottom: 24px;
    }
    .timeline-item:last-child { padding-bottom: 0; }
    .timeline-item:not(:last-child)::before {
      content: ''; position: absolute; left: 5px; top: 12px; bottom: -12px;
      width: 2px; background: var(--line);
    }
    .timeline-marker {
      width: 12px; height: 12px; border-radius: 50%;
      background: var(--accent-doctor);
      margin-top: 4px; z-index: 1;
      box-shadow: 0 0 0 4px var(--bg);
    }
    .timeline-content { flex: 1; }
    .timeline-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px; }
    .timeline-head strong { font-size: 15px; }
    .timeline-desc { margin: 0 0 4px 0; font-size: 14px; color: var(--ink); }
    .timeline-meta { font-size: 13px; color: var(--ink-soft); }

    /* List Groups */
    .list-group { display: flex; flex-direction: column; }
    .list-item {
      display: flex; align-items: center; gap: 16px;
      padding: 16px 20px; border-bottom: 1px solid var(--line);
    }
    .list-item:last-child { border-bottom: none; }
    .item-icon {
      width: 40px; height: 40px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
    }
    .item-icon svg { width: 20px; height: 20px; }
    .item-icon.bg-accent-doctor { color: white; }
    .item-body { flex: 1; display: flex; flex-direction: column; gap: 4px; }
    .item-body strong { font-size: 15px; color: var(--ink); }
    .item-body span { font-size: 13px; color: var(--ink-soft); }

    /* Tables */
    .premium-table { width: 100%; border-collapse: collapse; text-align: left; }
    .premium-table th, .premium-table td { padding: 12px 20px; border-bottom: 1px solid var(--line); font-size: 14px; }
    .premium-table th { color: var(--ink-soft); font-weight: 500; font-size: 13px; }
    .premium-table tr:last-child td { border-bottom: none; }

    /* Allergy Cards */
    .allergy-card { background: rgba(245, 158, 11, 0.02); border-color: rgba(245, 158, 11, 0.2); }
    .allergy-card.has-allergies { background: rgba(220, 38, 38, 0.02); border-color: rgba(220, 38, 38, 0.2); }
    .allergy-tag {
      padding: 12px; background: var(--bg); border: 1px solid var(--line); border-radius: 8px; margin-bottom: 8px;
      display: flex; flex-direction: column; gap: 4px;
    }
    .allergy-tag:last-child { margin-bottom: 0; }
    .allergy-tag.critical { border-left: 3px solid var(--critical); }
    .allergy-tag strong { font-size: 14px; color: var(--ink); }
    .allergy-tag span { font-size: 13px; color: var(--ink-soft); }
  `]
})
export class DoctorPatientSummaryComponent implements OnInit {
  icons = ICONS;
  data: PatientFullDataResponse | null = null;
  error = '';
  patientId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private api: DoctorApiService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('patientId'));
    if (!id) {
      this.error = 'Invalid patient ID.';
      return;
    }
    this.patientId = id;
    this.loadData();
  }

  loadData() {
    this.api.getPatientFullData(this.patientId).subscribe({
      next: (d) => {
        // Sort encounters by date descending
        d.encounters.sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime());
        this.data = d;
      },
      error: (err) => this.error = err?.error?.message || 'Access denied. You do not have permission to view this patient.'
    });
  }

  goBack() {
    this.location.back();
  }

  closeSession() {
    this.router.navigate(['/doctor/patients']);
  }
}
