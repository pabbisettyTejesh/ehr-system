import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ICONS } from '../icons';
import { SafeHtmlPipe } from '../safe-html.pipe';

interface NavItem {
  label: string;
  path: string;
  icon: string; // svg inner path(s), viewBox 0 0 24 24 — sourced from ../icons.ts
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const COLLAPSE_KEY = 'ehr_sidebar_collapsed';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, SafeHtmlPipe],
  template: `
    <div class="mobile-backdrop" (click)="closeMobile()"></div>
    <aside class="sidebar" [class]="'accent-' + roleKey()" *ngIf="groups.length">
      <nav>
        <ng-container *ngFor="let group of groups">
          <div class="side-group-label">{{ group.label }}</div>
          <a *ngFor="let item of group.items"
             [routerLink]="item.path"
             routerLinkActive="active"
             class="side-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="item.icon | safeHtml"></svg>
            <span>{{ item.label }}</span>
          </a>
        </ng-container>
      </nav>
    </aside>
  `
})
export class SidebarComponent {
  icons = ICONS;

  constructor(public auth: AuthService) {}

  roleKey(): string {
    switch (this.auth.role) {
      case 'PATIENT': return 'patient';
      case 'DOCTOR': return 'doctor';
      case 'ADMIN': return 'admin';
      default: return 'none';
    }
  }

  patientGroups: NavGroup[] = [
    {
      label: 'Care',
      items: [
        { label: 'Dashboard', path: '/patient/dashboard', icon: ICONS['layoutDashboard'] },
        { label: 'My Profile', path: '/patient/profile', icon: ICONS['userRound'] },
        { label: 'Appointments', path: '/patient/appointments', icon: ICONS['calendar'] },
      ]
    },
    {
      label: 'Records',
      items: [
        { label: 'Medical History', path: '/patient/medical-history', icon: ICONS['fileText'] },
        { label: 'Prescriptions', path: '/patient/prescriptions', icon: ICONS['pill'] },
        { label: 'Allergies', path: '/patient/allergies', icon: ICONS['triangleAlert'] },
        { label: 'Reports', path: '/patient/reports', icon: ICONS['scrollText'] },
      ]
    },
    {
      label: 'Privacy',
      items: [
        { label: 'Access Logs', path: '/patient/access-logs', icon: ICONS['shieldCheck'] },
      ]
    }
  ];

  doctorGroups: NavGroup[] = [
    {
      label: 'Care',
      items: [
        { label: 'Dashboard', path: '/doctor/dashboard', icon: ICONS['layoutDashboard'] },
        { label: 'My Patients', path: '/doctor/patients', icon: ICONS['users'] },
        { label: 'Search Patient', path: '/doctor/search-patient', icon: ICONS['search'] },
      ]
    },
    {
      label: 'Clinical',
      items: [
        { label: 'Create Encounter', path: '/doctor/create-encounter', icon: ICONS['clipboardList'] },
        { label: 'Add Medical Record', path: '/doctor/medical-record', icon: ICONS['notebookText'] },
        { label: 'Create Prescription', path: '/doctor/prescription', icon: ICONS['pill'] },
        { label: 'Manage Allergies', path: '/doctor/allergies', icon: ICONS['triangleAlert'] },
        { label: 'Reports', path: '/doctor/reports', icon: ICONS['scrollText'] },
      ]
    },
    {
      label: 'Emergency',
      items: [
        { label: 'Emergency Access', path: '/doctor/emergency-access', icon: ICONS['siren'] },
      ]
    }
  ];

  adminGroups: NavGroup[] = [
    {
      label: 'Overview',
      items: [
        { label: 'Dashboard', path: '/admin/dashboard', icon: ICONS['layoutDashboard'] },
        { label: 'Pending Doctors', path: '/admin/pending-doctors', icon: ICONS['userCheck'] },
      ]
    },
    {
      label: 'Records',
      items: [
        { label: 'Create Patient', path: '/admin/create-patient', icon: ICONS['userPlus'] },
        { label: 'Create Appointment', path: '/admin/create-appointment', icon: ICONS['calendarPlus'] },
        { label: 'Manage Appointments', path: '/admin/manage-appointments', icon: ICONS['listChecks'] },
        { label: 'Manage Users', path: '/admin/manage-users', icon: ICONS['users'] },
      ]
    },
    {
      label: 'Privacy',
      items: [
        { label: 'Access Logs', path: '/admin/access-logs', icon: ICONS['shieldCheck'] },
        { label: 'Emergency Logs', path: '/admin/emergency-logs', icon: ICONS['siren'] },
      ]
    }
  ];

  closeMobile() {
    document.body.classList.remove('sidebar-open');
  }

  get groups(): NavGroup[] {
    switch (this.auth.role) {
      case 'PATIENT': return this.patientGroups;
      case 'DOCTOR': return this.doctorGroups;
      case 'ADMIN': return this.adminGroups;
      default: return [];
    }
  }
}
