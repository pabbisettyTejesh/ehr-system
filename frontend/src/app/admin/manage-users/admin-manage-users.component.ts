import { Component, OnInit } from '@angular/core';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';
import { CommonModule } from '@angular/common';
import { AdminApiService } from '../../core/services/admin.service';
import { AppUser } from '../../core/models/models';
import { PaginationComponent } from '../../shared/pagination/pagination.component';

@Component({
  selector: 'app-admin-manage-users',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe, PaginationComponent],
  template: `
    <div class="container" style="max-width: 1000px;">
      <div class="page-header" style="border-bottom: none; margin-bottom: 0;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <span class="icon-circle bg-accent-admin">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.users | safeHtml"></svg>
          </span>
          <div>
            <span class="page-eyebrow">Admin Portal</span>
            <h1>Manage Users</h1>
          </div>
        </div>
      </div>

      <p style="font-size: 14px; color: var(--ink-soft); margin-bottom: 32px; padding-left: 56px;">
        Oversee all registered accounts. You can monitor account statuses and deactivate active users if necessary.
      </p>

      <div class="card" style="padding: 0; overflow: hidden; border: 1px solid var(--line); border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
        
        <div class="data-grid-toolbar">
          <div class="search-box">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" placeholder="Search by email..." disabled title="Search is coming soon">
          </div>
          <div class="filter-pills">
            <span class="filter-pill active">All Users</span>
            <span class="filter-pill">Doctors</span>
            <span class="filter-pill">Patients</span>
          </div>
        </div>

        <div style="overflow-x: auto;">
          <table class="premium-table" *ngIf="users.length > 0">
            <thead>
              <tr>
                <th>User Account</th>
                <th>Role Identity</th>
                <th>Account Status</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let u of paginatedUsers">
                <td>
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div class="avatar-xs" [class]="u.role === 'DOCTOR' ? 'bg-accent-doctor' : u.role === 'PATIENT' ? 'bg-accent-patient' : 'bg-accent-admin'">
                      {{ u.email.charAt(0).toUpperCase() }}
                    </div>
                    <div style="display: flex; flex-direction: column;">
                      <strong style="color: var(--ink); font-size: 14px;">{{ u.email }}</strong>
                      <span style="color: var(--ink-soft); font-size: 12px; font-family: monospace;">ID: {{ u.id }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="role-badge" [class]="'role-' + u.role.toLowerCase()">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px;" *ngIf="u.role === 'PATIENT'"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px;" *ngIf="u.role === 'DOCTOR'"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    {{ u.role }}
                  </span>
                </td>
                <td>
                  <span class="status-dot" [class.active-dot]="u.accountStatus === 'ACTIVE'" [class.inactive-dot]="u.accountStatus !== 'ACTIVE'"></span>
                  <span style="font-size: 13px; font-weight: 500;" [class.success-text]="u.accountStatus === 'ACTIVE'" [class.error-text]="u.accountStatus !== 'ACTIVE'">
                    {{ u.accountStatus }}
                  </span>
                </td>
                <td style="text-align: right;">
                  <button class="btn danger outline" style="padding: 6px 12px; font-size: 12px;" *ngIf="u.accountStatus === 'ACTIVE'" (click)="deactivate(u)">
                    Deactivate
                  </button>
                  <span *ngIf="u.accountStatus !== 'ACTIVE'" style="font-size: 12px; color: var(--ink-soft); font-style: italic;">Suspended</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="pagination-wrapper" *ngIf="users.length > 0">
          <app-pagination 
            [totalItems]="users.length" 
            [pageSize]="pageSize" 
            [currentPage]="currentPage" 
            (pageChange)="currentPage = $event">
          </app-pagination>
        </div>

        <div class="empty-state" *ngIf="users.length === 0" style="padding: 64px 24px;">
          <img src="assets/illustrations/empty-state.svg" alt="No users registered yet." loading="lazy" style="max-width: 200px; opacity: 0.8; margin-bottom: 16px;">
          <h3 style="margin: 0 0 8px 0; color: var(--ink);">No Users Found</h3>
          <p style="color: var(--ink-soft); font-size: 15px; margin: 0;">The system does not have any registered users yet.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .data-grid-toolbar { padding: 16px 24px; border-bottom: 1px solid var(--line); display: flex; justify-content: space-between; align-items: center; background: var(--bg-soft); }
    
    .search-box { position: relative; display: flex; align-items: center; width: 300px; }
    .search-box svg { position: absolute; left: 12px; color: var(--ink-soft); }
    .search-box input { width: 100%; padding: 8px 12px 8px 36px; border: 1px solid var(--line); border-radius: 6px; font-size: 13px; background: var(--bg); transition: 0.2s; }
    .search-box input:focus { border-color: var(--accent-admin); outline: none; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
    
    .filter-pills { display: flex; gap: 8px; }
    .filter-pill { padding: 6px 14px; font-size: 12px; font-weight: 500; border-radius: 20px; border: 1px solid var(--line); color: var(--ink-soft); background: var(--bg); cursor: pointer; transition: 0.2s; }
    .filter-pill:hover { background: var(--bg-soft); }
    .filter-pill.active { background: var(--accent-admin); color: white; border-color: var(--accent-admin); }
    
    .premium-table { width: 100%; border-collapse: collapse; }
    .premium-table th { text-align: left; padding: 12px 24px; font-size: 12px; font-weight: 600; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid var(--line); background: var(--bg); }
    .premium-table td { padding: 16px 24px; border-bottom: 1px solid var(--line); vertical-align: middle; }
    .premium-table tbody tr { transition: 0.2s; background: var(--bg); }
    .premium-table tbody tr:hover { background: var(--bg-soft); }
    
    .avatar-xs { width: 36px; height: 36px; border-radius: 8px; color: white; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 600; }
    
    .role-badge { display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; }
    .role-patient { background: rgba(16, 185, 129, 0.1); color: var(--accent-patient); }
    .role-doctor { background: rgba(37, 99, 235, 0.1); color: var(--accent-doctor); }
    .role-admin { background: rgba(124, 58, 237, 0.1); color: var(--accent-admin); }
    
    .status-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 6px; }
    .active-dot { background: var(--success); box-shadow: 0 0 0 3px rgba(16,185,129,0.2); }
    .inactive-dot { background: var(--warn); }
    
    .pagination-wrapper { padding: 16px 24px; border-top: 1px solid var(--line); background: var(--bg-soft); }
  `]
})
export class AdminManageUsersComponent implements OnInit {
  icons = ICONS;
  users: AppUser[] = [];

  currentPage = 1;
  pageSize = 10;

  constructor(private api: AdminApiService) {}
  
  ngOnInit() { this.load(); }
  
  load() { 
    this.api.getAllUsers().subscribe(u => {
      this.users = u;
      // Reset to page 1 on fresh load if needed, though simple replacement is fine
    }); 
  }
  
  deactivate(u: AppUser) { this.api.deactivateUser(u.id).subscribe(() => this.load()); }

  get paginatedUsers(): AppUser[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.users.slice(startIndex, startIndex + this.pageSize);
  }
}
