import { Component, OnInit } from '@angular/core';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';
import { CommonModule } from '@angular/common';
import { AdminApiService } from '../../core/services/admin.service';
import { DoctorProfile } from '../../core/models/models';

@Component({
  selector: 'app-admin-pending-doctors',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  template: `
    <div class="container">
      <div class="page-header">
        <span class="icon-circle bg-accent-admin">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.userCheck | safeHtml"></svg>
        </span>
        <div>
          <span class="page-eyebrow">Admin Portal</span>
          <h1>Pending Doctor Approvals</h1>
        </div>
      </div>
      <div class="card">
        <table *ngIf="doctors.length > 0">
          <thead><tr><th>Name</th><th>Specialization</th><th>License</th><th>Hospital</th><th></th></tr></thead>
          <tbody>
            <tr *ngFor="let d of doctors">
              <td>{{ d.fullName }}</td>
              <td>{{ d.specialization }}</td>
              <td>{{ d.licenseNumber }}</td>
              <td>{{ d.defaultHospitalName }}</td>
              <td>
                <button class="btn success" (click)="approve(d)">Approve</button>
                <button class="btn danger" (click)="reject(d)">Reject</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="empty-state" *ngIf="doctors.length === 0">
          <img src="assets/illustrations/empty-state.svg" alt="No pending doctor approvals." loading="lazy">
          <p>No pending doctor approvals.</p>
        </div>
      </div>
    </div>
  `
})
export class AdminPendingDoctorsComponent implements OnInit {
  icons = ICONS;
  doctors: DoctorProfile[] = [];
  constructor(private api: AdminApiService) {}

  ngOnInit() { this.load(); }
  load() { this.api.getPendingDoctors().subscribe(d => this.doctors = d); }

  approve(d: DoctorProfile) { this.api.approveDoctor(d.id).subscribe(() => this.load()); }
  reject(d: DoctorProfile) { this.api.rejectDoctor(d.id).subscribe(() => this.load()); }
}
