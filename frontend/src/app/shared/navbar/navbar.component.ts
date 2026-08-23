import { Component, HostListener } from '@angular/core';
import { SafeHtmlPipe } from '../safe-html.pipe';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService, Notification } from '../../core/services/notification.service';
import { ICONS } from '../icons';
import { CommandPaletteComponent } from '../command-palette/command-palette.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, SafeHtmlPipe, CommandPaletteComponent],
  template: `
    <nav class="navbar" [class.scrolled]="scrolled" [ngClass]="'accent-' + roleKey()">
      <a class="brand" routerLink="/{{ dashboardPath() }}">
        <span class="brand-mark">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.activity | safeHtml"></svg>
        </span>
        <span class="brand-text">
          <strong>EHR</strong><span class="brand-sub">System</span>
        </span>
      </a>

      <button class="back-btn" *ngIf="showBackButton()" (click)="goBack()" title="Go Back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        <span>Back</span>
      </button>

      <div class="links" *ngIf="auth.isLoggedIn">
        <button class="hamburger" (click)="toggleMobileMenu()" title="Toggle Menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <app-command-palette></app-command-palette>
        
        <!-- Notification Bell Dropdown -->
        <div class="notif-wrapper" (click)="toggleNotif($event)">
          <button class="notif-btn" title="Notifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" [innerHTML]="icons.bell | safeHtml"></svg>
            <span class="notif-dot" *ngIf="(notifService.unreadCount$ | async)! > 0"></span>
          </button>
          
          <div class="notif-dropdown" *ngIf="showNotif" (click)="$event.stopPropagation()">
            <div class="notif-header">
              <span>Notifications</span>
              <button *ngIf="(notifService.unreadCount$ | async)! > 0" (click)="markAllRead()">Mark all read</button>
            </div>
            <div class="notif-body">
              <div *ngIf="notifications.length === 0" style="padding: 16px; text-align: center; color: var(--ink-soft); font-size: 13px;">
                No new notifications
              </div>
              <div class="notif-item" *ngFor="let n of notifications" [class.unread]="!n.read" (click)="markRead(n)">
                <div class="notif-icon">
                  <svg *ngIf="n.type === 'INFO'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" [innerHTML]="icons.activity | safeHtml"></svg>
                  <svg *ngIf="n.type === 'SUCCESS'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" [innerHTML]="icons.shieldCheck | safeHtml"></svg>
                  <svg *ngIf="n.type === 'WARNING'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" [innerHTML]="icons.calendar | safeHtml"></svg>
                  <svg *ngIf="n.type === 'ALERT'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" [innerHTML]="icons.activity | safeHtml"></svg>
                </div>
                <div class="notif-content">
                  <strong>{{ n.title }}</strong>
                  <p>{{ n.message }}</p>
                  <span>{{ n.createdAt | date:'short' }}</span>
                </div>
              </div>
            </div>
            <a routerLink="/{{ dashboardPath() }}" class="notif-footer" (click)="showNotif = false">
              View all activity
            </a>
          </div>
        </div>

        <span class="role-tag">{{ auth.role }}</span>
        <a routerLink="/{{ dashboardPath() }}">Dashboard</a>
        <button class="btn secondary" (click)="logout()">Sign out</button>
      </div>
    </nav>
  `,
  styles: [`
    :host {
      display: block;
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .navbar {
      --nav-accent: var(--ink);
      display: flex; justify-content: space-between; align-items: center;
      background: rgba(255, 255, 255, 0.7);
      color: var(--ink); padding: 14px 28px;
      border-bottom: 1px solid var(--line);
      gap: 12px;
      -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
      transition: all 0.3s ease;
    }
    .navbar.scrolled { 
      background: rgba(255, 255, 255, 0.95);
      box-shadow: 0 4px 24px rgba(0,0,0,0.04);
    }
    .btn, button { white-space: nowrap; }
    @media (max-width: 700px) {
      .navbar { padding: 12px 14px; }
      .links { gap: 10px !important; }
      .links > a { display: none; }
      .brand-sub { display: none; }
    }
    .navbar.accent-patient { --nav-accent: var(--patient); }
    .navbar.accent-doctor { --nav-accent: var(--doctor); }
    .navbar.accent-admin { --nav-accent: var(--admin); }

    .hamburger { display: none; background: none; border: none; padding: 8px; color: var(--ink); cursor: pointer; border-radius: 8px; }
    .hamburger:hover { background: var(--bg-soft); }
    .hamburger svg { width: 22px; height: 22px; }
    @media (max-width: 700px) { .hamburger { display: block; } }

    .brand { display: flex; align-items: center; gap: 10px; color: var(--ink); }
    .brand-mark {
      width: 32px; height: 32px; border-radius: 8px;
      background: var(--nav-accent);
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .brand-mark svg { width: 18px; height: 18px; color: #fff; }
    .brand-text { font-family: 'Fraunces', serif; font-weight: 450; font-size: 18px; line-height: 1; letter-spacing: -0.02em; }
    .brand-text strong { font-weight: 600; }
    .brand-sub { font-family: 'Inter', sans-serif; font-weight: 500; font-size: 13px; color: var(--ink-soft); margin-left: 6px; }

    .back-btn {
      display: flex; align-items: center; gap: 6px;
      background: var(--bg-soft); border: 1px solid var(--line);
      color: var(--ink); padding: 6px 12px; border-radius: 8px;
      font-size: 13px; font-weight: 500; cursor: pointer;
      transition: all 0.2s; margin-left: 16px; margin-right: auto;
    }
    .back-btn:hover { background: var(--bg); border-color: var(--ink-soft); }
    .back-btn svg { width: 14px; height: 14px; }
    @media (max-width: 700px) { .back-btn span { display: none; } .back-btn { padding: 8px; margin-left: 8px; } }

    .links { display: flex; align-items: center; gap: 20px; }
    .links a { color: var(--ink-soft); font-weight: 600; font-size: 14px; transition: color 0.2s; }
    .links a:hover { color: var(--ink); }
    .role-tag {
      background: color-mix(in srgb, var(--nav-accent) 12%, white);
      color: var(--nav-accent);
      padding: 4px 12px; border-radius: 20px; font-size: 11px;
      font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
      border: 1px solid color-mix(in srgb, var(--nav-accent) 20%, transparent);
    }
    .links .btn.secondary {
      background: var(--surface); border: 1px solid var(--line); color: var(--ink);
      box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    }
    .links .btn.secondary:hover { background: var(--bg-soft); border-color: var(--ink-soft); }

    .notif-wrapper { position: relative; }
    .notif-btn {
      background: none; border: none; cursor: pointer; color: var(--ink-soft);
      padding: 8px; border-radius: 50%; transition: all 0.2s; position: relative;
      display: flex; align-items: center; justify-content: center;
    }
    .notif-btn:hover { background: var(--bg-soft); color: var(--ink); }
    .notif-btn svg { width: 20px; height: 20px; }
    .notif-dot { position: absolute; top: 8px; right: 8px; width: 8px; height: 8px; background: var(--critical); border-radius: 50%; border: 2px solid #fff; }
    .notif-dropdown {
      position: absolute; top: 100%; right: 0; margin-top: 12px;
      width: 320px; background: var(--surface); border: 1px solid var(--line);
      border-radius: 12px; box-shadow: 0 12px 32px rgba(0,0,0,0.12);
      animation: slideDown 0.2s cubic-bezier(0.16,1,0.3,1); z-index: 100;
      overflow: hidden; text-align: left;
    }
    .notif-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid var(--line); background: var(--bg-soft); }
    .notif-header span { font-weight: 600; font-size: 13px; color: var(--ink); }
    .notif-header button { background: none; border: none; color: var(--gold); font-size: 12px; cursor: pointer; font-weight: 500; }
    .notif-header button:hover { text-decoration: underline; }
    .notif-body { max-height: 320px; overflow-y: auto; }
    .notif-item { display: flex; gap: 12px; padding: 16px; border-bottom: 1px solid var(--line); cursor: pointer; transition: background 0.2s; }
    .notif-item:hover { background: var(--bg-soft); }
    .notif-item.unread { background: color-mix(in srgb, var(--gold) 4%, transparent); }
    .notif-item.unread:hover { background: color-mix(in srgb, var(--gold) 8%, transparent); }
    .notif-icon { width: 32px; height: 32px; border-radius: 50%; background: var(--bg); display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--gold); border: 1px solid var(--line); }
    .notif-icon svg { width: 16px; height: 16px; }
    .notif-content { flex: 1; }
    .notif-content strong { display: block; font-size: 13px; color: var(--ink); margin-bottom: 2px; }
    .notif-content p { font-size: 12px; color: var(--ink-soft); margin: 0 0 6px 0; line-height: 1.4; white-space: normal; }
    .notif-content span { font-size: 11px; color: var(--ink-soft); font-family: 'Inter', sans-serif; font-weight: 500; }
    .notif-footer { display: block; text-align: center; padding: 12px; font-size: 13px; color: var(--ink-soft); font-weight: 500; text-decoration: none; transition: background 0.2s; background: var(--bg); }
    .notif-footer:hover { background: var(--bg-soft); color: var(--ink); }
  `]
})
export class NavbarComponent {
  icons = ICONS;
  scrolled = false;
  showNotif = false;
  notifications: Notification[] = [];

  constructor(
    public auth: AuthService, 
    public notifService: NotificationService,
    public router: Router,
    private location: Location
  ) {
    if (this.auth.isLoggedIn) {
      this.loadNotifications();
    }
  }

  showBackButton(): boolean {
    if (!this.auth.isLoggedIn) return false;
    const path = this.router.url.split('?')[0]; // ignore query params
    const dash = '/' + this.dashboardPath();
    // Hide back button on the main dashboard of any role, or login page
    return path !== dash && path !== '/' && path !== '/login';
  }

  goBack() {
    this.location.back();
  }

  loadNotifications() {
    this.notifService.getUserNotifications().subscribe(data => {
      this.notifications = data;
    });
  }

  markRead(n: Notification) {
    if (n.read) return;
    this.notifService.markAsRead(n.id).subscribe(() => {
      n.read = true;
    });
  }

  markAllRead() {
    this.notifService.markAllAsRead().subscribe(() => {
      this.notifications.forEach(n => n.read = true);
    });
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.scrolled = window.scrollY > 8;
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.showNotif = false;
  }
  
  toggleNotif(event: Event) {
    event.stopPropagation();
    this.showNotif = !this.showNotif;
    if (this.showNotif) {
      this.loadNotifications();
    }
  }

  toggleMobileMenu() {
    document.body.classList.toggle('sidebar-open');
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
