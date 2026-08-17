import { Component, HostListener } from '@angular/core';
import { SafeHtmlPipe } from '../safe-html.pipe';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ICONS } from '../icons';
import { CommandPaletteComponent } from '../command-palette/command-palette.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, SafeHtmlPipe, CommandPaletteComponent],
  template: `
    <nav class="navbar" [class.scrolled]="scrolled" [class]="'accent-' + roleKey()">
      <a class="brand" routerLink="/{{ dashboardPath() }}">
        <span class="brand-mark">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.activity | safeHtml"></svg>
        </span>
        <span class="brand-text">
          <strong>EHR</strong><span class="brand-sub">System</span>
        </span>
      </a>

      <div class="links" *ngIf="auth.isLoggedIn">
        <app-command-palette></app-command-palette>
        <span class="role-tag">{{ auth.role }}</span>
        <a routerLink="/{{ dashboardPath() }}">Dashboard</a>
        <button class="btn secondary" (click)="logout()">Sign out</button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      --nav-accent: #1C1B1A;
      position: sticky; top: 0; z-index: 50;
      display: flex; justify-content: space-between; align-items: center;
      background: rgba(23,20,15,0.72); color: #fff; padding: 14px 28px;
      border-bottom: 2px solid var(--nav-accent);
      gap: 12px;
      -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px);
    }
    .navbar.scrolled { background: #17140F; }
    .btn, button { white-space: nowrap; }
    @media (max-width: 700px) {
      .navbar { padding: 12px 14px; }
      .links { gap: 10px !important; }
      .links > a { display: none; }
      .brand-sub { display: none; }
    }
    .navbar.accent-patient { --nav-accent: #1F6F54; }
    .navbar.accent-doctor { --nav-accent: #1E3A5F; }
    .navbar.accent-admin { --nav-accent: #5B3256; }

    .brand { display: flex; align-items: center; gap: 10px; color: #fff; }
    .brand-mark {
      width: 30px; height: 30px; border-radius: 4px;
      background: var(--nav-accent);
      display: flex; align-items: center; justify-content: center;
    }
    .brand-mark svg { width: 16px; height: 16px; color: #fff; }
    .brand-text { font-family: 'Fraunces', serif; font-weight: 450; font-size: 17px; line-height: 1; }
    .brand-text strong { font-weight: 600; }
    .brand-sub { font-family: 'Inter', sans-serif; font-weight: 400; font-size: 13px; color: #A79E8E; margin-left: 5px; }

    .links { display: flex; align-items: center; gap: 16px; }
    .links a { color: #EDE7DC; font-weight: 500; font-size: 14px; }
    .links a:hover { color: #fff; }
    .role-tag {
      background: var(--nav-accent);
      padding: 3px 11px; border-radius: 3px; font-size: 10.5px;
      font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
    }
    .links .btn.secondary {
      background: transparent; border: 1px solid #3A3327; color: #EDE7DC;
    }
    .links .btn.secondary:hover { border-color: #5A5040; }
  `]
})
export class NavbarComponent {
  icons = ICONS;
  scrolled = false;

  constructor(public auth: AuthService, private router: Router) {}

  @HostListener('window:scroll')
  onWindowScroll() {
    this.scrolled = window.scrollY > 8;
  }

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
