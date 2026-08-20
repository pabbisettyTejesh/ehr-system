import { Component, OnInit } from '@angular/core';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';
import { CommonModule } from '@angular/common';
import { PatientApiService } from '../../core/services/patient.service';
import { AccessLog, EmergencyAccessLog } from '../../core/models/models';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { EmptyStateComponent } from '../../shared/empty-state/empty-state.component';
import { SkeletonComponent } from '../../shared/skeleton/skeleton.component';

@Component({
  selector: 'app-patient-access-logs',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe, PaginationComponent, EmptyStateComponent, SkeletonComponent],
  template: `
    <div class="container" style="max-width: 900px;">
      <div class="page-header" style="border-bottom: none; margin-bottom: 0;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <span class="icon-circle bg-accent-patient">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.shieldCheck | safeHtml"></svg>
          </span>
          <div>
            <span class="page-eyebrow">Data Privacy & Security</span>
            <h1>My Audit Trail</h1>
          </div>
        </div>
      </div>
      
      <p style="font-size: 14px; color: var(--ink-soft); margin-bottom: 32px; padding-left: 56px;">
        Track exactly who has accessed your medical records and when. Your data security is our top priority.
      </p>

      <div class="stacked-layout">
        <!-- Emergency Access (High Priority) -->
        <div class="card" style="padding: 0; overflow: hidden; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 12px; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.05);">
          <div style="padding: 16px 24px; border-bottom: 1px solid rgba(239, 68, 68, 0.2); background: var(--warn-bg); display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0; font-size: 16px; color: var(--warn); display: flex; align-items: center; gap: 8px;">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              Emergency Overrides
            </h3>
            <span style="font-size: 12px; color: #991b1b; font-weight: 600;">{{ emergencyLogs.length }} Events</span>
          </div>
          
          <!-- Skeleton Loading -->
          <div *ngIf="loading" class="timeline-container" style="padding: 24px;">
            <app-skeleton type="row" height="80px" *ngFor="let i of [1,2]"></app-skeleton>
          </div>

          <div class="timeline-container" *ngIf="!loading && emergencyLogs.length > 0" style="padding: 24px;">
            <div class="timeline-event" *ngFor="let l of paginatedEmergencyLogs">
              <div class="timeline-dot" style="background: var(--warn); box-shadow: 0 0 0 4px var(--warn-bg);"></div>
              <div class="timeline-content">
                <span class="timestamp">{{ l.viewedAt | date:'medium' }}</span>
                <p style="margin: 4px 0 8px; font-size: 14px; color: var(--ink);"><strong>Doctor {{ l.doctorId }}</strong> bypassed standard appointment controls.</p>
                <div class="reason-box">
                  <strong>Justification:</strong> {{ l.reason }}
                </div>
              </div>
            </div>
          </div>
          
          <div class="pagination-wrapper" *ngIf="!loading && emergencyLogs.length > 0">
            <app-pagination 
              [totalItems]="emergencyLogs.length" 
              [pageSize]="pageSizeEmergency" 
              [currentPage]="currentPageEmergency" 
              (pageChange)="currentPageEmergency = $event">
            </app-pagination>
          </div>
          
          <app-empty-state 
            *ngIf="!loading && emergencyLogs.length === 0" 
            iconName="shieldCheck" 
            title="No Emergency Overrides" 
            message="No emergency overrides recorded." 
            theme="patient">
          </app-empty-state>
        </div>

        <!-- Normal Access (Standard Log) -->
        <div class="card" style="padding: 0; overflow: hidden; border: 1px solid var(--line); border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
          <div style="padding: 16px 24px; border-bottom: 1px solid var(--line); background: var(--paper); display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0; font-size: 16px; color: var(--ink); display: flex; align-items: center; gap: 8px;">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12h4l2-9 5 18 3-9h5"></path></svg>
              Standard Activity
            </h3>
            <span style="font-size: 12px; color: var(--ink-soft); font-weight: 500;">{{ logs.length }} Events</span>
          </div>
          
          <!-- Skeleton Loading -->
          <div *ngIf="loading" class="timeline-container" style="padding: 24px;">
            <app-skeleton type="row" height="80px" *ngFor="let i of [1,2,3]"></app-skeleton>
          </div>

          <div class="timeline-container" *ngIf="!loading && logs.length > 0" style="padding: 24px;">
            <div class="timeline-event" *ngFor="let l of paginatedLogs">
              <div class="timeline-dot" style="background: var(--accent-patient); box-shadow: 0 0 0 4px rgba(16,185,129,0.1);"></div>
              <div class="timeline-content">
                <span class="timestamp">{{ l.timestamp | date:'medium' }}</span>
                <p style="margin: 4px 0 8px; font-size: 14px; color: var(--ink);">
                  <strong>{{ l.action }}</strong> executed via <span class="mode-tag">{{ l.accessMode || 'SYSTEM' }}</span> access.
                </p>
              </div>
            </div>
          </div>
          
          <div class="pagination-wrapper" *ngIf="!loading && logs.length > 0">
            <app-pagination 
              [totalItems]="logs.length" 
              [pageSize]="pageSizeNormal" 
              [currentPage]="currentPageNormal" 
              (pageChange)="currentPageNormal = $event">
            </app-pagination>
          </div>
          
          <app-empty-state 
            *ngIf="!loading && logs.length === 0" 
            iconName="info" 
            title="No Standard Activity" 
            message="No standard access activity yet." 
            theme="patient">
          </app-empty-state>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stacked-layout { display: flex; flex-direction: column; gap: 32px; }
    
    .timeline-container { display: flex; flex-direction: column; gap: 24px; position: relative; }
    .timeline-container::before { content: ''; position: absolute; left: 27px; top: 24px; bottom: 24px; width: 2px; background: var(--line); }
    
    .timeline-event { display: flex; gap: 16px; position: relative; z-index: 1; }
    
    .timeline-dot { width: 10px; height: 10px; border-radius: 50%; margin-top: 6px; flex-shrink: 0; }
    
    .timeline-content { flex: 1; background: var(--surface); border: 1px solid var(--line); padding: 12px 16px; border-radius: 8px; transition: 0.2s; }
    .timeline-content:hover { border-color: var(--accent-patient); transform: translateX(2px); }
    
    .timestamp { font-size: 12px; color: var(--ink-soft); }
    
    .mode-tag { font-family: monospace; font-size: 11px; background: var(--paper); border: 1px solid var(--line); padding: 2px 6px; border-radius: 4px; }
    
    .reason-box { font-size: 13px; color: #b45309; background: rgba(245, 158, 11, 0.1); padding: 8px 12px; border-radius: 6px; border-left: 2px solid #f59e0b; }
    
    .pagination-wrapper { padding: 16px 24px; border-top: 1px solid var(--line); background: var(--paper); }
  `]
})
export class PatientAccessLogsComponent implements OnInit {
  icons = ICONS;
  logs: AccessLog[] = [];
  emergencyLogs: EmergencyAccessLog[] = [];
  
  currentPageNormal = 1;
  pageSizeNormal = 5;
  
  currentPageEmergency = 1;
  pageSizeEmergency = 5;
  loading = true;

  constructor(private api: PatientApiService) {}
  
  ngOnInit() {
    let completed = 0;
    const checkDone = () => { if (++completed === 2) this.loading = false; };

    this.api.getAccessLogs().subscribe(l => { this.logs = l; checkDone(); });
    this.api.getEmergencyLogs().subscribe(l => { this.emergencyLogs = l; checkDone(); });
  }

  get paginatedLogs(): AccessLog[] {
    const startIndex = (this.currentPageNormal - 1) * this.pageSizeNormal;
    return this.logs.slice(startIndex, startIndex + this.pageSizeNormal);
  }

  get paginatedEmergencyLogs(): EmergencyAccessLog[] {
    const startIndex = (this.currentPageEmergency - 1) * this.pageSizeEmergency;
    return this.emergencyLogs.slice(startIndex, startIndex + this.pageSizeEmergency);
  }
}

