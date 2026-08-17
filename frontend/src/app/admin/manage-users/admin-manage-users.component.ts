import { Component, OnInit } from '@angular/core';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';
import { CommonModule } from '@angular/common';
import { AdminApiService } from '../../core/services/admin.service';
import { AppUser } from '../../core/models/models';

@Component({
  selector: 'app-admin-manage-users',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  template: `
    <div class="container">
      <div class="page-header">
        <span class="icon-circle bg-accent-admin">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.users | safeHtml"></svg>
        </span>
        <div>
          <span class="page-eyebrow">Admin Portal</span>
          <h1>Manage Users</h1>
        </div>
      </div>
      <div class="card">
        <table *ngIf="users.length > 0">
          <thead><tr><th>Email</th><th>Role</th><th>Status</th><th></th></tr></thead>
          <tbody>
            <tr *ngFor="let u of users">
              <td>{{ u.email }}</td>
              <td>{{ u.role }}</td>
              <td><span class="badge" [class]="u.accountStatus === 'ACTIVE' ? 'active' : 'rejected'">{{ u.accountStatus }}</span></td>
              <td>
                <button class="btn danger" *ngIf="u.accountStatus === 'ACTIVE'" (click)="deactivate(u)">Deactivate</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="empty-state" *ngIf="users.length === 0">
          <img src="assets/illustrations/empty-state.svg" alt="No users registered yet." loading="lazy">
          <p>No users registered yet.</p>
        </div>
      </div>
    </div>
  `
})
export class AdminManageUsersComponent implements OnInit {
  icons = ICONS;
  users: AppUser[] = [];
  constructor(private api: AdminApiService) {}
  ngOnInit() { this.load(); }
  load() { this.api.getAllUsers().subscribe(u => this.users = u); }
  deactivate(u: AppUser) { this.api.deactivateUser(u.id).subscribe(() => this.load()); }
}
