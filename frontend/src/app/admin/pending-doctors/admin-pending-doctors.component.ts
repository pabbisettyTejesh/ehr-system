import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminApiService } from '../../core/services/admin.service';
import { DoctorProfile } from '../../core/models/models';

@Component({
  selector: 'app-admin-pending-doctors',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Pending Doctor Approvals</h1>
      <div class="card">
        <table>
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
        <p *ngIf="doctors.length === 0">No pending doctor approvals.</p>
      </div>
    </div>
  `
})
export class AdminPendingDoctorsComponent implements OnInit {
  doctors: DoctorProfile[] = [];
  constructor(private api: AdminApiService) {}

  ngOnInit() { this.load(); }
  load() { this.api.getPendingDoctors().subscribe(d => this.doctors = d); }

  approve(d: DoctorProfile) { this.api.approveDoctor(d.id).subscribe(() => this.load()); }
  reject(d: DoctorProfile) { this.api.rejectDoctor(d.id).subscribe(() => this.load()); }
}
