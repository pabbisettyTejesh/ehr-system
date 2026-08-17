import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminApiService } from '../../core/services/admin.service';
import { Appointment } from '../../core/models/models';

@Component({
  selector: 'app-admin-manage-appointments',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Manage Appointments</h1>
      <div class="card">
        <table>
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
        <p *ngIf="appointments.length === 0">No appointments yet.</p>
      </div>
    </div>
  `
})
export class AdminManageAppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  constructor(private api: AdminApiService) {}
  ngOnInit() { this.load(); }
  load() { this.api.getAllAppointments().subscribe(a => this.appointments = a); }
  cancel(a: Appointment) { this.api.cancelAppointment(a.id).subscribe(() => this.load()); }
}
