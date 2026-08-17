import { Component, OnInit } from '@angular/core';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../core/services/admin.service';
import { PatientListItem, DoctorListItem } from '../../core/models/models';

@Component({
  selector: 'app-admin-create-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeHtmlPipe],
  template: `
    <div class="container form-page">
      <div class="page-header">
        <span class="icon-circle bg-accent-admin">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.calendarPlus | safeHtml"></svg>
        </span>
        <div>
          <span class="page-eyebrow">Admin · Access link</span>
          <h1>Create Appointment</h1>
        </div>
        <img src="assets/illustrations/appointment.svg" alt="" style="margin-left:auto; width:80px; height:auto;" loading="lazy">
      </div>

      <div class="card">
        <div class="form-group">
          <label>Patient</label>
          <select [(ngModel)]="form.patientId" name="patientId">
            <option [ngValue]="null" disabled>Select a patient…</option>
            <option *ngFor="let p of patients" [ngValue]="p.id">
              {{ p.fullName }} — {{ p.patientUid }}{{ p.city ? ' · ' + p.city : '' }}
            </option>
          </select>
          <p *ngIf="patients.length === 0" style="font-size:12.5px;color:var(--ink-soft);margin-top:6px;">
            No patients yet — create one first.
          </p>
        </div>

        <div class="form-group">
          <label>Doctor</label>
          <select [(ngModel)]="form.doctorId" name="doctorId">
            <option [ngValue]="null" disabled>Select a doctor…</option>
            <option *ngFor="let d of doctors" [ngValue]="d.id" [disabled]="d.approvalStatus !== 'ACTIVE'">
              {{ d.fullName }}{{ d.specialization ? ' · ' + d.specialization : '' }}
              {{ d.approvalStatus !== 'ACTIVE' ? ' (' + d.approvalStatus + ')' : '' }}
            </option>
          </select>
          <p *ngIf="doctors.length === 0" style="font-size:12.5px;color:var(--ink-soft);margin-top:6px;">
            No doctors registered yet.
          </p>
        </div>

        <div class="form-group">
          <label>Appointment Date/Time</label>
          <input type="datetime-local" [(ngModel)]="form.appointmentDate" name="appointmentDate">
        </div>
        <div class="form-group">
          <label>Reason</label>
          <input [(ngModel)]="form.reason" name="reason">
        </div>
        <div class="form-group">
          <label>Access Valid (days)</label>
          <input type="number" [(ngModel)]="form.accessValidDays" name="accessValidDays">
        </div>
        <button class="btn" (click)="submit()" [disabled]="!form.patientId || !form.doctorId">Create Appointment</button>
        <p class="success-text" *ngIf="saved">Appointment created — this is now the doctor's access link to the patient.</p>
        <p class="error-text" *ngIf="error">{{ error }}</p>
      </div>
    </div>
  `
})
export class AdminCreateAppointmentComponent implements OnInit {
  icons = ICONS;
  form: any = { patientId: null, doctorId: null, appointmentDate: '', reason: '', accessValidDays: 30 };
  patients: PatientListItem[] = [];
  doctors: DoctorListItem[] = [];
  saved = false;
  error = '';

  constructor(private api: AdminApiService) {}

  ngOnInit() {
    this.api.getAllPatients().subscribe(p => this.patients = p);
    this.api.getAllDoctors().subscribe(d => this.doctors = d);
  }

  submit() {
    this.error = ''; this.saved = false;
    this.api.createAppointment(this.form).subscribe({
      next: () => { this.saved = true; this.form = { patientId: null, doctorId: null, appointmentDate: '', reason: '', accessValidDays: 30 }; },
      error: (err) => this.error = err?.error?.message || 'Failed to create appointment'
    });
  }
}
