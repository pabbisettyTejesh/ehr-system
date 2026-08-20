import { Component, OnInit } from '@angular/core';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DoctorApiService } from '../../core/services/doctor.service';
import { AppointedPatient } from '../../core/models/models';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { ToastService } from '../../core/services/toast.service';
import { EmptyStateComponent } from '../../shared/empty-state/empty-state.component';
import { SkeletonComponent } from '../../shared/skeleton/skeleton.component';

@Component({
  selector: 'app-doctor-patients',
  standalone: true,
  imports: [CommonModule, RouterLink, SafeHtmlPipe, PaginationComponent, FormsModule, EmptyStateComponent, SkeletonComponent],
  template: `
    <div class="container" style="max-width: 1200px;">
      <div class="page-header" style="border-bottom: none; margin-bottom: 8px;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <span class="icon-circle bg-accent-doctor">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.users | safeHtml"></svg>
          </span>
          <div>
            <span class="page-eyebrow">Doctor</span>
            <h1>My Appointed Patients</h1>
          </div>
        </div>
      </div>
      
      <p style="font-size: 14px; color: var(--ink-soft); margin-bottom: 24px; padding-left: 56px;">
        These are the patients you currently have full clinical access to. Click <strong>Enter Session</strong> to view their complete medical history, log encounters, or write prescriptions.
      </p>

      <!-- Skeleton Loading -->
      <div *ngIf="loading" class="patient-grid">
        <app-skeleton type="card" height="160px" *ngFor="let i of [1,2,3,4]"></app-skeleton>
      </div>

      <div class="patient-grid" *ngIf="!loading && patients.length > 0">
        <div class="patient-card" *ngFor="let a of paginatedPatients">
          
          <div class="patient-card-header">
            <div class="avatar-sm bg-accent-doctor">{{ a.patientName.charAt(0) }}</div>
            <div class="patient-info">
              <span class="uid-tag">#{{ a.patientId }} (UID: {{ a.patientUid }})</span>
              <strong class="p-name">{{ a.patientName }}</strong>
            </div>
          </div>
          
          <div class="patient-card-body">
            <div class="access-info">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.shieldCheck | safeHtml"></svg>
              <span>Access until: {{ a.accessEndTime | date:'short' }}</span>
            </div>
          </div>
          
          <div class="patient-card-footer">
            <a [routerLink]="['/doctor/patient-summary', a.patientId]" class="btn primary" style="flex: 1; justify-content: center;">Enter Session</a>
            
            <!-- Video Meeting Controls -->
            <button *ngIf="!a.meetingLink" class="btn secondary" (click)="generateMeetingLink(a)" title="Generate Video Link">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            </button>
            <a *ngIf="a.meetingLink" [href]="a.meetingLink" target="_blank" class="btn primary" style="background: var(--success); border-color: var(--success);" title="Join Video Call">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            </a>
            <button *ngIf="a.meetingLink" class="btn danger" style="padding: 6px;" (click)="deleteMeetingLink(a)" title="Delete Link">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            </button>
          </div>
        </div>
      </div>
      
      <div style="margin-top: 24px;">
        <app-pagination 
          *ngIf="!loading && patients.length > 0"
          [totalItems]="patients.length" 
          [pageSize]="pageSize" 
          [currentPage]="currentPage" 
          (pageChange)="currentPage = $event">
        </app-pagination>
      </div>

      <app-empty-state 
        *ngIf="!loading && patients.length === 0" 
        iconName="users" 
        title="No Appointed Patients" 
        message="No appointed patients yet — ask an admin to create an appointment linking you to a patient." 
        theme="doctor">
      </app-empty-state>
    </div>
  `,
  styles: [`
    .patient-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    .patient-card {
      background: var(--bg);
      border: 1px solid var(--line);
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(0,0,0,0.02);
    }
    .patient-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0,0,0,0.06);
      border-color: var(--accent-doctor);
    }
    .patient-card-header {
      padding: 20px;
      display: flex;
      gap: 16px;
      align-items: center;
      border-bottom: 1px solid var(--line);
      background: var(--bg-soft);
    }
    .avatar-sm {
      width: 48px; height: 48px;
      border-radius: 12px;
      color: white;
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; font-weight: 600;
    }
    .patient-info {
      display: flex; flex-direction: column; gap: 4px;
    }
    .uid-tag {
      font-family: monospace; font-size: 11px; color: var(--ink-soft);
      background: var(--bg); padding: 2px 6px; border-radius: 4px; border: 1px solid var(--line);
      align-self: flex-start;
    }
    .p-name {
      font-size: 16px; color: var(--ink);
    }
    .patient-card-body {
      padding: 16px 20px;
      flex: 1;
    }
    .access-info {
      display: flex; align-items: center; gap: 8px;
      font-size: 13px; color: var(--ink-soft);
    }
    .access-info svg { width: 16px; height: 16px; color: var(--success); }
    .patient-card-footer {
      padding: 16px 20px;
      border-top: 1px solid var(--line);
      display: flex;
      gap: 8px;
    }
  `]
})
export class DoctorPatientsComponent implements OnInit {
  icons = ICONS;
  patients: AppointedPatient[] = [];

  currentPage = 1;
  pageSize = 10;
  loading = true;
  
  constructor(private api: DoctorApiService, private toast: ToastService) {}
  
  ngOnInit() { this.load(); }
  
  load() { 
    this.api.getMyPatientsDetailed().subscribe(p => {
      this.patients = p;
      this.loading = false;
    }); 
  }

  get paginatedPatients(): AppointedPatient[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.patients.slice(startIndex, startIndex + this.pageSize);
  }

  generateMeetingLink(a: AppointedPatient) {
    this.api.generateMeetingLink(a.appointmentId).subscribe({
      next: () => {
        this.toast.showSuccess("Meeting link generated automatically!");
        this.load();
      }
    });
  }

  deleteMeetingLink(a: AppointedPatient) {
    if (confirm("Are you sure you want to delete this meeting link? The patient will no longer be able to join.")) {
      this.api.deleteMeetingLink(a.appointmentId).subscribe({
        next: () => {
          this.toast.showInfo("Meeting link deleted.");
          this.load();
        }
      });
    }
  }
}
