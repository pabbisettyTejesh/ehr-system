import { Component, OnInit } from '@angular/core';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';
import { CommonModule } from '@angular/common';
import { AdminApiService } from '../../core/services/admin.service';
import { Appointment } from '../../core/models/models';

@Component({
  selector: 'app-admin-manage-appointments',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  template: `
    <div class="container">
      <div class="page-header">
        <span class="icon-circle bg-accent-admin">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.listChecks | safeHtml"></svg>
        </span>
        <div>
          <span class="page-eyebrow">Admin Portal</span>
          <h1>Manage Appointments</h1>
        </div>
        <img src="assets/illustrations/appointment.svg" alt="" style="margin-left:auto; width:80px; height:auto;" loading="lazy">
      </div>
      <div class="card">
        <table *ngIf="appointments.length > 0">
          <thead><tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Status</th><th></th></tr></thead>
          <tbody>
            <tr *ngFor="let a of appointments">
              <td>{{ a.patientId }}</td>
              <td>{{ a.doctorId }}</td>
              <td>{{ a.appointmentDate | date:'medium' }}</td>
              <td><span class="badge active">{{ a.status }}</span></td>
              <td>
                <button class="btn danger" *ngIf="a.status !== 'CANCELLED'" (click)="cancel(a)">Cancel</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="empty-state" *ngIf="appointments.length === 0">
          <img src="assets/illustrations/empty-state.svg" alt="No appointments yet." loading="lazy">
          <p>No appointments yet.</p>
        </div>
      </div>
    </div>
  `
})
export class AdminManageAppointmentsComponent implements OnInit {
  icons = ICONS;
  appointments: Appointment[] = [];
  constructor(private api: AdminApiService) {}
  ngOnInit() { this.load(); }
  load() { this.api.getAllAppointments().subscribe(a => this.appointments = a); }
  cancel(a: Appointment) { this.api.cancelAppointment(a.id).subscribe(() => this.load()); }
}
