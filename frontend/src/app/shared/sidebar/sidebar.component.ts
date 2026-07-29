import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  label: string;
  path: string;
  icon: string; // svg inner path(s), viewBox 0 0 24 24
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" [class]="'accent-' + roleKey()" *ngIf="items.length">
      <nav>
        <a *ngFor="let item of items"
           [routerLink]="item.path"
           routerLinkActive="active"
           class="side-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="item.icon"></svg>
          <span>{{ item.label }}</span>
        </a>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      --side-accent: #14231F;
      width: 232px;
      flex-shrink: 0;
      background: #fff;
      border-right: 1px solid #E2E8E5;
      min-height: calc(100vh - 62px);
      padding: 18px 12px;
    }
    .sidebar.accent-patient { --side-accent: #0F6E62; }
    .sidebar.accent-doctor { --side-accent: #1D4ED8; }
    .sidebar.accent-admin { --side-accent: #6D28D9; }

    nav { display: flex; flex-direction: column; gap: 2px; }

    .side-link {
      display: flex;
      align-items: center;
      gap: 11px;
      padding: 9px 12px;
      border-radius: 8px;
      font-size: 13.5px;
      font-weight: 500;
      color: #4B5A56;
      transition: background 0.12s ease, color 0.12s ease;
    }
    .side-link svg { width: 17px; height: 17px; flex-shrink: 0; }
    .side-link:hover { background: #F4F6F5; color: #14231F; }
    .side-link.active {
      background: color-mix(in srgb, var(--side-accent) 12%, white);
      color: var(--side-accent);
      font-weight: 700;
    }
  `]
})
export class SidebarComponent {
  constructor(public auth: AuthService) {}

  roleKey(): string {
    switch (this.auth.role) {
      case 'PATIENT': return 'patient';
      case 'DOCTOR': return 'doctor';
      case 'ADMIN': return 'admin';
      default: return 'none';
    }
  }

  private icons = {
    home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>',
    file: '<path d="M4 4h12l4 4v12H4z"/><path d="M9 9h6M9 13h6M9 17h3"/>',
    pill: '<rect x="3" y="9" width="18" height="9" rx="2"/><path d="M8 9V6a4 4 0 0 1 8 0v3"/>',
    alert: '<path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v4M12 17h.01"/>',
    report: '<path d="M4 3h11l5 5v13H4z"/><path d="M15 3v5h5"/>',
    shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/>',
    clipboard: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/>',
    note: '<path d="M6 4h12v17a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4Z"/><path d="M9 12h6M9 16h4"/>',
    emergency: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4M12 17h.01"/>',
    check: '<path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="9"/>',
    userplus: '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/>',
    calplus: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18M12 14v4M10 16h4"/>',
    list: '<path d="M9 11l2 2 4-4"/><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18"/>',
    usercheck: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/><path d="m17 8 2 2 3-3"/>'
  };

  patientItems: NavItem[] = [
    { label: 'Dashboard', path: '/patient/dashboard', icon: this.icons.home },
    { label: 'My Profile', path: '/patient/profile', icon: this.icons.user },
    { label: 'Appointments', path: '/patient/appointments', icon: this.icons.calendar },
    { label: 'Medical History', path: '/patient/medical-history', icon: this.icons.file },
    { label: 'Prescriptions', path: '/patient/prescriptions', icon: this.icons.pill },
    { label: 'Allergies', path: '/patient/allergies', icon: this.icons.alert },
    { label: 'Reports', path: '/patient/reports', icon: this.icons.report },
    { label: 'Access Logs', path: '/patient/access-logs', icon: this.icons.shield },
  ];

  doctorItems: NavItem[] = [
    { label: 'Dashboard', path: '/doctor/dashboard', icon: this.icons.home },
    { label: 'My Patients', path: '/doctor/patients', icon: this.icons.users },
    { label: 'Search Patient', path: '/doctor/search-patient', icon: this.icons.search },
    { label: 'Create Encounter', path: '/doctor/create-encounter', icon: this.icons.clipboard },
    { label: 'Add Medical Record', path: '/doctor/medical-record', icon: this.icons.note },
    { label: 'Create Prescription', path: '/doctor/prescription', icon: this.icons.pill },
    { label: 'Manage Allergies', path: '/doctor/allergies', icon: this.icons.alert },
    { label: 'Reports', path: '/doctor/reports', icon: this.icons.report },
    { label: 'Emergency Access', path: '/doctor/emergency-access', icon: this.icons.emergency },
  ];

  adminItems: NavItem[] = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: this.icons.home },
    { label: 'Pending Doctors', path: '/admin/pending-doctors', icon: this.icons.check },
    { label: 'Create Patient', path: '/admin/create-patient', icon: this.icons.userplus },
    { label: 'Create Appointment', path: '/admin/create-appointment', icon: this.icons.calplus },
    { label: 'Manage Appointments', path: '/admin/manage-appointments', icon: this.icons.list },
    { label: 'Manage Users', path: '/admin/manage-users', icon: this.icons.usercheck },
    { label: 'Access Logs', path: '/admin/access-logs', icon: this.icons.shield },
    { label: 'Emergency Logs', path: '/admin/emergency-logs', icon: this.icons.emergency },
  ];

  get items(): NavItem[] {
    switch (this.auth.role) {
      case 'PATIENT': return this.patientItems;
      case 'DOCTOR': return this.doctorItems;
      case 'ADMIN': return this.adminItems;
      default: return [];
    }
  }
}
