import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientApiService } from '../../core/services/patient.service';
import { Appointment } from '../../core/models/models';

@Component({
  selector: 'app-patient-appointments',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>My Appointments</h1>
      <div class="card">
        <table>
          <thead><tr><th>Date</th><th>Doctor ID</th><th>Reason</th><th>Status</th></tr></thead>
          <tbody>
            <tr *ngFor="let a of appointments">
              <td>{{ a.appointmentDate | date:'medium' }}</td>
              <td>{{ a.doctorId }}</td>
              <td>{{ a.reason }}</td>
              <td><span class="badge active">{{ a.status }}</span></td>
            </tr>
          </tbody>
        </table>
        <p *ngIf="appointments.length === 0">No appointments yet.</p>
      </div>
    </div>
  `
})
export class PatientAppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  constructor(private api: PatientApiService) {}
  ngOnInit() { this.api.getAppointments().subscribe(a => this.appointments = a); }
}
