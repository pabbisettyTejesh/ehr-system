import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorApiService } from '../../core/services/doctor.service';
import { AppointedPatient } from '../../core/models/models';

@Component({
  selector: 'app-doctor-create-encounter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container form-page">
      <div class="page-header">
        <span class="icon-circle bg-accent-doctor">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/></svg>
        </span>
        <div>
          <span class="page-eyebrow">Doctor · Appointed patients only</span>
          <h1>Create Encounter</h1>
        </div>
      </div>

      <div class="card">
        <div class="form-group">
          <label>Patient</label>
          <select [(ngModel)]="selectedAppointment" name="patient" (ngModelChange)="onPatientSelect()">
            <option [ngValue]="null" disabled>Select a patient…</option>
            <option *ngFor="let p of myPatients" [ngValue]="p">
              {{ p.patientName }} — {{ p.patientUid }}
            </option>
          </select>
          <p *ngIf="myPatients.length === 0" style="font-size:12.5px;color:var(--ink-soft);margin-top:6px;">
            You have no appointed patients yet.
          </p>
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label>Hospital/Clinic Name</label>
            <input [(ngModel)]="form.hospitalName" name="hospitalName">
          </div>
          <div class="form-group">
            <label>Department</label>
            <input [(ngModel)]="form.departmentName" name="departmentName">
          </div>
        </div>
        <div class="form-group">
          <label>Visit Type</label>
          <select [(ngModel)]="form.visitType" name="visitType">
            <option>NORMAL</option>
            <option>FOLLOW_UP</option>
            <option>EMERGENCY</option>
            <option>ONLINE</option>
          </select>
        </div>
        <div class="form-group">
          <label>Chief Complaint</label>
          <textarea [(ngModel)]="form.chiefComplaint" name="chiefComplaint" rows="2"></textarea>
        </div>
        <div class="form-group">
          <label>Summary</label>
          <textarea [(ngModel)]="form.summary" name="summary" rows="2"></textarea>
        </div>
        <button class="btn" (click)="submit()" [disabled]="!form.patientId">Create Encounter</button>
        <p class="success-text" *ngIf="createdId">
          Encounter created — <span class="uid">#{{ createdId }}</span> for {{ selectedAppointment?.patientName }}.
          You'll find it in the dropdown on the Medical Record and Prescription pages.
        </p>
        <p class="error-text" *ngIf="error">{{ error }}</p>
      </div>
    </div>
  `
})
export class DoctorCreateEncounterComponent implements OnInit {
  myPatients: AppointedPatient[] = [];
  selectedAppointment: AppointedPatient | null = null;
  form: any = { patientId: null, appointmentId: null, hospitalName: '', departmentName: '', visitType: 'NORMAL', chiefComplaint: '', summary: '' };
  createdId: number | null = null;
  error = '';

  constructor(private api: DoctorApiService) {}

  ngOnInit() {
    this.api.getMyPatientsDetailed().subscribe(p => this.myPatients = p);
  }

  onPatientSelect() {
    if (this.selectedAppointment) {
      this.form.patientId = this.selectedAppointment.patientId;
      this.form.appointmentId = this.selectedAppointment.appointmentId;
    }
  }

  submit() {
    this.error = '';
    this.api.createEncounter(this.form).subscribe({
      next: (e) => this.createdId = e.id,
      error: (err) => this.error = err?.error?.message || 'Failed to create encounter (check appointment access)'
    });
  }
}
