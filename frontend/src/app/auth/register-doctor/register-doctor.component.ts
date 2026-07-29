import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register-doctor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register-doctor.component.html'
})
export class RegisterDoctorComponent {
  form: any = {
    email: '', password: '', phone: '', fullName: '', specialization: '',
    licenseNumber: '', qualification: '', experienceYears: null, defaultHospitalName: ''
  };
  error = '';
  success = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.error = '';
    this.loading = true;
    this.auth.registerDoctor(this.form).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Registered! Your account is pending admin approval. You can log in once approved.';
        setTimeout(() => this.router.navigate(['/login']), 2500);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Registration failed';
      }
    });
  }
}
