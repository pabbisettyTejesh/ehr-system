import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminApiService } from '../../core/services/admin.service';
import { AppUser } from '../../core/models/models';

@Component({
  selector: 'app-admin-manage-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Manage Users</h1>
      <div class="card">
        <table>
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
      </div>
    </div>
  `
})
export class AdminManageUsersComponent implements OnInit {
  users: AppUser[] = [];
  constructor(private api: AdminApiService) {}
  ngOnInit() { this.load(); }
  load() { this.api.getAllUsers().subscribe(u => this.users = u); }
  deactivate(u: AppUser) { this.api.deactivateUser(u.id).subscribe(() => this.load()); }
}
