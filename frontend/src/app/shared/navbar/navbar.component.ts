import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar" [class]="'accent-' + roleKey()">
      <a class="brand" routerLink="/{{ dashboardPath() }}">
        <span class="brand-mark">
          <svg viewBox="0 0 24 24" fill="none"><path d="M12 3v18M3 12h18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>
        </span>
        <span class="brand-text">
          <strong>EHR</strong><span class="brand-sub">System</span>
        </span>
      </a>

      <div class="links" *ngIf="auth.isLoggedIn">
        <span class="role-tag">{{ auth.role }}</span>
        <a routerLink="/{{ dashboardPath() }}">Dashboard</a>
        <button class="btn secondary" (click)="logout()">Sign out</button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      --nav-accent: #14231F;
      display: flex; justify-content: space-between; align-items: center;
      background: #0D1512; color: #fff; padding: 14px 28px;
      border-bottom: 3px solid var(--nav-accent);
    }
    .navbar.accent-patient { --nav-accent: #0F6E62; }
    .navbar.accent-doctor { --nav-accent: #1D4ED8; }
    .navbar.accent-admin { --nav-accent: #6D28D9; }

    .brand { display: flex; align-items: center; gap: 10px; color: #fff; }
    .brand-mark {
      width: 30px; height: 30px; border-radius: 8px;
      background: var(--nav-accent);
      display: flex; align-items: center; justify-content: center;
    }
    .brand-mark svg { width: 16px; height: 16px; color: #fff; }
    .brand-text { font-family: 'Lora', serif; font-size: 17px; line-height: 1; }
    .brand-text strong { font-weight: 700; }
    .brand-sub { font-family: 'Inter', sans-serif; font-weight: 400; font-size: 13px; color: #9CA8A4; margin-left: 5px; }

    .links { display: flex; align-items: center; gap: 16px; }
    .links a { color: #E5E9E7; font-weight: 500; font-size: 14px; }
    .links a:hover { color: #fff; }
    .role-tag {
      background: var(--nav-accent);
      padding: 4px 12px; border-radius: 999px; font-size: 11px;
      font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase;
    }
    .links .btn.secondary {
      background: transparent; border: 1px solid #33403C; color: #E5E9E7;
    }
    .links .btn.secondary:hover { border-color: #576560; }
  `]
})
export class NavbarComponent {
  constructor(public auth: AuthService, private router: Router) {}

  roleKey(): string {
    switch (this.auth.role) {
      case 'PATIENT': return 'patient';
      case 'DOCTOR': return 'doctor';
      case 'ADMIN': return 'admin';
      default: return 'none';
    }
  }

  dashboardPath(): string {
    switch (this.auth.role) {
      case 'PATIENT': return 'patient/dashboard';
      case 'DOCTOR': return 'doctor/dashboard';
      case 'ADMIN': return 'admin/dashboard';
      default: return '';
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
