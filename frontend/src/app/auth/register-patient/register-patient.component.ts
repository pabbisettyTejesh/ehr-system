import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register-patient',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register-patient.component.html'
})
export class RegisterPatientComponent {
  form: any = {
    email: '', password: '', phone: '', fullName: '', dateOfBirth: '',
    gender: 'Male', bloodGroup: '', address: '', city: '',
    emergencyContactName: '', emergencyContactPhone: ''
  };
  error = '';
  success = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.error = '';
    this.loading = true;
    this.auth.registerPatient(this.form).subscribe({
      next: (res) => {
        this.loading = false;
        this.success = `Registered! Your Patient UID is ${res.patientUid}`;
        setTimeout(() => this.router.navigate(['/patient/dashboard']), 1500);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Registration failed';
      }
    });
  }
}
