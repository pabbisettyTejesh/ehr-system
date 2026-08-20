import { Component, OnInit } from '@angular/core';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';
import { CommonModule } from '@angular/common';
import { AdminApiService } from '../../core/services/admin.service';
import { EmergencyAccessLog } from '../../core/models/models';
import { PaginationComponent } from '../../shared/pagination/pagination.component';

@Component({
  selector: 'app-admin-emergency-logs',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe, PaginationComponent],
  template: `
    <div class="container" style="max-width: 1000px;">
      <div class="page-header" style="border-bottom: none; margin-bottom: 0;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <span class="icon-circle" style="background: rgba(239, 68, 68, 0.1); color: var(--warn);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.siren | safeHtml"></svg>
          </span>
          <div>
            <span class="page-eyebrow" style="color: var(--warn);">Admin Portal · High Priority</span>
            <h1>Emergency Access Logs</h1>
          </div>
        </div>
      </div>

      <p style="font-size: 14px; color: var(--ink-soft); margin-bottom: 32px; padding-left: 56px;">
        Review instances where doctors bypassed standard appointment access to view critical patient data in emergency situations.
      </p>

      <div class="card" style="padding: 0; overflow: hidden; border: 1px solid var(--line); border-radius: 12px; box-shadow: 0 8px 32px rgba(239, 68, 68, 0.08);">
        
        <div style="padding: 16px 24px; border-bottom: 1px solid rgba(239, 68, 68, 0.2); background: var(--warn-bg); display: flex; justify-content: space-between; align-items: center;">
          <h3 style="margin: 0; font-size: 16px; color: var(--warn); display: flex; align-items: center; gap: 8px;">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            Critical Overrides
          </h3>
          <span style="font-size: 13px; color: #991b1b; font-weight: 500;">{{ logs.length }} Total Events</span>
        </div>

        <div style="overflow-x: auto;">
          <table class="premium-table" *ngIf="logs.length > 0">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Doctor (Actor)</th>
                <th>Patient (Target)</th>
                <th>Justification</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let l of paginatedLogs">
                <td>
                  <div style="display: flex; flex-direction: column;">
                    <strong style="color: var(--ink); font-size: 14px;">{{ l.viewedAt | date:'mediumDate' }}</strong>
                    <span style="color: var(--ink-soft); font-size: 13px;">{{ l.viewedAt | date:'shortTime' }}</span>
                  </div>
                </td>
                <td>
                  <span class="id-badge">ID: {{ l.doctorId }}</span>
                </td>
                <td>
                  <span class="id-badge">ID: {{ l.patientId }}</span>
                </td>
                <td>
                  <div class="reason-block">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    {{ l.reason }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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
          <img src="assets/illustrations/empty-state.svg" alt="No emergency access recorded." loading="lazy" style="max-width: 200px; opacity: 0.8; margin-bottom: 16px;">
          <h3 style="margin: 0 0 8px 0; color: var(--ink);">No Emergency Overrides</h3>
          <p style="color: var(--ink-soft); font-size: 15px; margin: 0;">There have been no critical access events recorded.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .premium-table { width: 100%; border-collapse: collapse; }
    .premium-table th { text-align: left; padding: 16px 24px; font-size: 12px; font-weight: 600; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid var(--line); background: var(--bg); }
    .premium-table td { padding: 16px 24px; border-bottom: 1px solid var(--line); vertical-align: middle; }
    .premium-table tbody tr { transition: 0.2s; background: var(--bg); }
    .premium-table tbody tr:hover { background: var(--bg-soft); }
    
    .id-badge { padding: 4px 10px; background: rgba(0,0,0,0.05); border: 1px solid var(--line); border-radius: 6px; font-family: monospace; font-size: 13px; color: var(--ink); }
    
    .reason-block { display: flex; align-items: flex-start; gap: 8px; font-size: 13px; color: var(--ink); line-height: 1.5; background: var(--warn-bg); border-left: 3px solid var(--warn); padding: 8px 12px; border-radius: 0 6px 6px 0; }
    .reason-block svg { color: var(--warn); flex-shrink: 0; margin-top: 2px; }
    
    .pagination-wrapper { padding: 16px 24px; border-top: 1px solid var(--line); background: var(--bg-soft); }
  `]
})
export class AdminEmergencyLogsComponent implements OnInit {
  icons = ICONS;
  logs: EmergencyAccessLog[] = [];

  currentPage = 1;
  pageSize = 10;

  constructor(private api: AdminApiService) {}
  
  ngOnInit() { this.api.getEmergencyLogs().subscribe(l => this.logs = l); }

  get paginatedLogs(): EmergencyAccessLog[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.logs.slice(startIndex, startIndex + this.pageSize);
  }
}
