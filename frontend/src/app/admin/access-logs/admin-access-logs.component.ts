import { Component, OnInit } from '@angular/core';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';
import { CommonModule } from '@angular/common';
import { AdminApiService } from '../../core/services/admin.service';
import { AccessLog } from '../../core/models/models';
import { PaginationComponent } from '../../shared/pagination/pagination.component';

@Component({
  selector: 'app-admin-access-logs',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe, PaginationComponent],
  template: `
    <div class="container" style="max-width: 900px;">
      <div class="page-header" style="border-bottom: none; margin-bottom: 0;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <span class="icon-circle bg-accent-admin">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.shieldCheck | safeHtml"></svg>
          </span>
          <div>
            <span class="page-eyebrow">Security & Audit</span>
            <h1>System Access Logs</h1>
          </div>
        </div>
      </div>
      
      <p style="font-size: 14px; color: var(--ink-soft); margin-bottom: 32px; padding-left: 56px;">
        Monitor all data access events across the platform. This log ensures HIPAA compliance by tracking who viewed what, and when.
      </p>

      <div class="card" style="padding: 0; overflow: hidden; border: 1px solid var(--line); border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
        
        <div style="padding: 16px 24px; border-bottom: 1px solid var(--line); background: var(--bg-soft); display: flex; justify-content: space-between; align-items: center;">
          <h3 style="margin: 0; font-size: 16px; color: var(--ink);">Audit Trail</h3>
          <span style="font-size: 13px; color: var(--ink-soft);">Showing latest {{ paginatedLogs.length }} events</span>
        </div>

        <div class="timeline-container" *ngIf="logs.length > 0">
          <div class="timeline-event" *ngFor="let l of paginatedLogs">
            
            <div class="timeline-icon" [ngClass]="{
              'bg-success': l.accessMode === 'STANDARD' || l.accessMode === 'APPOINTMENT',
              'bg-warn': l.accessMode === 'EMERGENCY',
              'bg-primary': !l.accessMode
            }">
              <svg *ngIf="l.accessMode === 'EMERGENCY'" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              <svg *ngIf="l.accessMode !== 'EMERGENCY'" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12h4l2-9 5 18 3-9h5"></path></svg>
            </div>
            
            <div class="timeline-content">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <div>
                  <h4 style="margin: 0; font-size: 15px; color: var(--ink);">{{ l.action }}</h4>
                  <span style="font-size: 12px; color: var(--ink-soft);">{{ l.timestamp | date:'medium' }}</span>
                </div>
                <span class="mode-badge" *ngIf="l.accessMode" [ngClass]="{'badge-emergency': l.accessMode === 'EMERGENCY', 'badge-standard': l.accessMode !== 'EMERGENCY'}">
                  {{ l.accessMode }}
                </span>
              </div>
              
              <div class="log-details">
                <div class="detail-item">
                  <span class="detail-label">Actor (User ID)</span>
                  <span class="detail-value">{{ l.userId }}</span>
                </div>
                <div class="detail-item" *ngIf="l.patientId">
                  <span class="detail-label">Target (Patient ID)</span>
                  <span class="detail-value">{{ l.patientId }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Status</span>
                  <span class="detail-value" style="color: var(--success); font-weight: 500;">Authorized</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="pagination-wrapper" *ngIf="logs.length > 0">
          <app-pagination 
            [totalItems]="logs.length" 
            [pageSize]="pageSize" 
            [currentPage]="currentPage" 
            (pageChange)="currentPage = $event">
          </app-pagination>
        </div>

        <div class="empty-state" *ngIf="logs.length === 0" style="padding: 64px 24px;">
          <img src="assets/illustrations/empty-state.svg" alt="No logs yet." loading="lazy" style="max-width: 200px; opacity: 0.8; margin-bottom: 16px;">
          <h3 style="margin: 0 0 8px 0; color: var(--ink);">No Audit Logs Found</h3>
          <p style="color: var(--ink-soft); font-size: 15px; margin: 0;">The system has not recorded any access events yet.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .timeline-container { padding: 24px 32px; display: flex; flex-direction: column; gap: 32px; position: relative; }
    .timeline-container::before { content: ''; position: absolute; left: 47px; top: 32px; bottom: 32px; width: 2px; background: var(--line); }
    
    .timeline-event { display: flex; gap: 24px; position: relative; z-index: 1; }
    
    .timeline-icon { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0; box-shadow: 0 0 0 4px var(--bg); }
    .bg-success { background: var(--success); }
    .bg-warn { background: var(--warn); }
    .bg-primary { background: var(--accent-admin); }
    
    .timeline-content { flex: 1; background: var(--bg-soft); border: 1px solid var(--line); border-radius: 12px; padding: 20px; transition: 0.2s; }
    .timeline-content:hover { border-color: var(--accent-admin); box-shadow: 0 4px 12px rgba(124,58,237,0.05); transform: translateX(2px); }
    
    .mode-badge { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .badge-emergency { background: rgba(239, 68, 68, 0.1); color: var(--warn); }
    .badge-standard { background: rgba(16, 185, 129, 0.1); color: var(--success); }
    
    .log-details { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-top: 16px; padding-top: 16px; border-top: 1px dashed var(--line); }
    .detail-item { display: flex; flex-direction: column; gap: 4px; }
    .detail-label { font-size: 11px; font-weight: 600; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 0.5px; }
    .detail-value { font-size: 14px; color: var(--ink); font-family: monospace; }
    
    .pagination-wrapper { padding: 16px 24px; border-top: 1px solid var(--line); background: var(--bg-soft); }
  `]
})
export class AdminAccessLogsComponent implements OnInit {
  icons = ICONS;
  logs: AccessLog[] = [];
  
  currentPage = 1;
  pageSize = 10;

  constructor(private api: AdminApiService) {}
  
  ngOnInit() { this.api.getAccessLogs().subscribe(l => this.logs = l); }

  get paginatedLogs(): AccessLog[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.logs.slice(startIndex, startIndex + this.pageSize);
  }
}
