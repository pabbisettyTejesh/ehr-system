import { Component } from '@angular/core';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ICONS } from '../../shared/icons';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SafeHtmlPipe],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  icons = ICONS;
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.error = '';
    this.loading = true;
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.role === 'PATIENT') this.router.navigate(['/patient/dashboard']);
        else if (res.role === 'DOCTOR') this.router.navigate(['/doctor/dashboard']);
        else if (res.role === 'ADMIN') this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Login failed';
      }
    });
  }
}
