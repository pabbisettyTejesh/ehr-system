import { Component, OnInit } from '@angular/core';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';
import { CommonModule } from '@angular/common';
import { AdminApiService } from '../../core/services/admin.service';
import { DoctorProfile } from '../../core/models/models';
import { EmptyStateComponent } from '../../shared/empty-state/empty-state.component';
import { SkeletonComponent } from '../../shared/skeleton/skeleton.component';

@Component({
  selector: 'app-admin-pending-doctors',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe, EmptyStateComponent, SkeletonComponent],
  template: `
    <div class="container" style="max-width: 1000px;">
      <div class="page-header" style="border-bottom: none; margin-bottom: 0;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <span class="icon-circle bg-accent-admin">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.userCheck | safeHtml"></svg>
          </span>
          <div>
            <span class="page-eyebrow">Admin Portal</span>
            <h1>Pending Doctor Approvals</h1>
          </div>
        </div>
      </div>

      <p style="font-size: 14px; color: var(--ink-soft); margin-bottom: 32px; padding-left: 56px;">
        Review and verify the credentials of newly registered doctors before granting them system access.
      </p>

      <!-- Skeleton Loading -->
      <div *ngIf="loading" class="approval-grid">
        <app-skeleton type="card" height="240px" *ngFor="let i of [1,2,3]"></app-skeleton>
      </div>

      <div class="approval-grid" *ngIf="!loading && doctors.length > 0">
        <div class="verify-card" *ngFor="let d of doctors">
          <div class="verify-header">
            <div class="avatar-sm bg-accent-admin">{{ d.fullName.charAt(0) }}</div>
            <div class="verify-info">
              <h3>{{ d.fullName }}</h3>
              <span class="specialty-badge">{{ d.specialization }}</span>
            </div>
          </div>
          
          <div class="verify-body">
            <div class="detail-row">
              <span class="detail-label">License Number</span>
              <span class="detail-value" style="font-family: monospace;">{{ d.licenseNumber }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Affiliated Hospital</span>
              <span class="detail-value">{{ d.defaultHospitalName }}</span>
            </div>
          </div>
          
          <div class="verify-footer">
            <button class="btn success action-btn" (click)="approve(d)">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Approve
            </button>
            <button class="btn danger outline action-btn" (click)="reject(d)">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              Reject
            </button>
          </div>
        </div>
      </div>

      <app-empty-state 
        *ngIf="!loading && doctors.length === 0" 
        iconName="userCheck" 
        title="All Caught Up" 
        message="All clear! There are no pending doctor registrations at this time." 
        theme="admin">
      </app-empty-state>
    </div>
  `,
  styles: [`
    .approval-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px;
    }
    .verify-card {
      background: var(--bg); border: 1px solid var(--line); border-radius: 12px;
      overflow: hidden; display: flex; flex-direction: column;
      box-shadow: 0 4px 12px rgba(0,0,0,0.02); transition: all 0.2s ease;
    }
    .verify-card:hover {
      box-shadow: 0 8px 24px rgba(0,0,0,0.06); transform: translateY(-2px);
      border-color: var(--accent-admin);
    }
    .verify-header {
      padding: 20px; display: flex; gap: 16px; align-items: center;
      border-bottom: 1px solid var(--line); background: var(--bg-soft);
    }
    .avatar-sm {
      width: 48px; height: 48px; border-radius: 12px; color: white;
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; font-weight: 600;
    }
    .verify-info h3 { margin: 0 0 6px 0; font-size: 16px; color: var(--ink); }
    .specialty-badge {
      background: var(--bg); border: 1px solid var(--line); padding: 4px 10px;
      border-radius: 20px; font-size: 12px; color: var(--ink-soft);
    }
    .verify-body {
      padding: 20px; display: flex; flex-direction: column; gap: 12px; flex: 1;
    }
    .detail-row { display: flex; justify-content: space-between; align-items: center; }
    .detail-label { color: var(--ink-soft); font-size: 13px; }
    .detail-value { color: var(--ink); font-size: 14px; font-weight: 500; text-align: right; }
    
    .verify-footer {
      padding: 16px 20px; border-top: 1px solid var(--line);
      display: flex; gap: 12px;
    }
    .action-btn { flex: 1; display: flex; justify-content: center; align-items: center; gap: 6px; }
  `]
})
export class AdminPendingDoctorsComponent implements OnInit {
  icons = ICONS;
  doctors: DoctorProfile[] = [];
  loading = true;
  constructor(private api: AdminApiService) {}

  ngOnInit() { this.load(); }
  load() { 
    this.api.getPendingDoctors().subscribe(d => {
      this.doctors = d;
      this.loading = false;
    }); 
  }

  approve(d: DoctorProfile) { this.api.approveDoctor(d.id).subscribe(() => this.load()); }
  reject(d: DoctorProfile) { this.api.rejectDoctor(d.id).subscribe(() => this.load()); }
}
