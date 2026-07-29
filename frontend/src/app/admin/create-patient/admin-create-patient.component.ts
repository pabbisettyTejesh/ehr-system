import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../core/services/admin.service';

@Component({
  selector: 'app-admin-create-patient',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container" style="max-width:560px;">
      <h1>Create Patient</h1>
      <div class="card">
        <div class="grid-2">
          <div class="form-group"><label>Full Name</label><input [(ngModel)]="form.fullName" name="fullName"></div>
          <div class="form-group"><label>Email</label><input [(ngModel)]="form.email" name="email"></div>
          <div class="form-group"><label>Temp Password</label><input [(ngModel)]="form.password" name="password"></div>
          <div class="form-group"><label>Phone</label><input [(ngModel)]="form.phone" name="phone"></div>
          <div class="form-group"><label>Date of Birth</label><input type="date" [(ngModel)]="form.dateOfBirth" name="dob"></div>
          <div class="form-group"><label>Gender</label>
            <select [(ngModel)]="form.gender" name="gender"><option>Male</option><option>Female</option><option>Other</option></select>
          </div>
          <div class="form-group"><label>Blood Group</label><input [(ngModel)]="form.bloodGroup" name="bg"></div>
          <div class="form-group"><label>City</label><input [(ngModel)]="form.city" name="city"></div>
        </div>
        <div class="form-group"><label>Address</label><input [(ngModel)]="form.address" name="address"></div>
        <div class="grid-2">
          <div class="form-group"><label>Emergency Contact Name</label><input [(ngModel)]="form.emergencyContactName" name="ecn"></div>
          <div class="form-group"><label>Emergency Contact Phone</label><input [(ngModel)]="form.emergencyContactPhone" name="ecp"></div>
        </div>
        <button class="btn" (click)="submit()">Create Patient</button>
        <p class="success-text" *ngIf="uid">Patient created. UID: {{ uid }}</p>
        <p class="error-text" *ngIf="error">{{ error }}</p>
      </div>
    </div>
  `
})
export class AdminCreatePatientComponent {
  form: any = {
    fullName: '', email: '', password: '', phone: '', dateOfBirth: '', gender: 'Male',
    bloodGroup: '', city: '', address: '', emergencyContactName: '', emergencyContactPhone: ''
  };
  uid = '';
  error = '';

  constructor(private api: AdminApiService) {}

  submit() {
    this.error = ''; this.uid = '';
    this.api.createPatient(this.form).subscribe({
      next: (res) => this.uid = res.patientUid || '',
      error: (err) => this.error = err?.error?.message || 'Failed to create patient'
    });
  }
}
