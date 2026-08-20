import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';
import { DoctorApiService } from '../../core/services/doctor.service';
import { DoctorProfile } from '../../core/models/models';
import { SkeletonComponent } from '../../shared/skeleton/skeleton.component';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeHtmlPipe, SkeletonComponent],
  template: `
    <div class="container" style="max-width: 1000px;">
      
      <div class="page-header">
        <div style="display: flex; align-items: center; gap: 16px;">
          <span class="icon-circle bg-accent-doctor">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.userRound | safeHtml"></svg>
          </span>
          <div>
            <span class="page-eyebrow">Settings</span>
            <h1>Doctor Profile</h1>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="!profile" class="profile-layout">
        <div class="profile-sidebar">
          <app-skeleton type="card" height="300px"></app-skeleton>
        </div>
        <div class="profile-main">
          <app-skeleton type="card" height="500px"></app-skeleton>
        </div>
      </div>

      <!-- Loaded State -->
      <div *ngIf="profile" class="profile-layout reveal in-view">
        
        <!-- Left Sidebar: Identity Card -->
        <div class="profile-sidebar">
          <div class="identity-card">
            <div class="ic-avatar">
              {{ getInitials(profile.fullName) }}
              <div class="ic-status-dot"></div>
            </div>
            <h2 class="ic-name">{{ profile.fullName }}</h2>
            
            <div class="uid-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.shieldCheck | safeHtml"></svg>
              {{ profile.licenseNumber || 'License Pending' }}
            </div>
            
            <div class="ic-divider"></div>
            
            <div class="ic-stats">
              <div class="ic-stat">
                <span class="ic-stat-label">Specialty</span>
                <span class="ic-stat-val">{{ profile.specialization || '--' }}</span>
              </div>
              <div class="ic-stat">
                <span class="ic-stat-label">Experience</span>
                <span class="ic-stat-val">{{ profile.experienceYears ? profile.experienceYears + ' yrs' : '--' }}</span>
              </div>
            </div>
            
            <div class="ic-divider"></div>
            
            <div class="ic-info">
              <div class="ic-info-row">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                <span>{{ profile.approvalStatus | titlecase }} Status</span>
              </div>
              <div class="ic-info-row">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <span>{{ profile.defaultHospitalName || 'Hospital not set' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Main: Edit Form -->
        <div class="profile-main">
          <div class="card edit-card">
            <div class="edit-header">
              <h3>Professional Information</h3>
              <p>Update your clinical details and qualifications.</p>
            </div>
            
            <form (ngSubmit)="save()" class="edit-form">
              <div class="grid-2">
                <div class="form-group">
                  <label>Full Name</label>
                  <input [(ngModel)]="profile.fullName" name="fullName" required>
                </div>
                <div class="form-group">
                  <label>License Number</label>
                  <input [(ngModel)]="profile.licenseNumber" name="licenseNumber">
                </div>
                
                <div class="form-group">
                  <label>Specialization</label>
                  <input [(ngModel)]="profile.specialization" name="specialization" placeholder="e.g. Cardiologist">
                </div>
                <div class="form-group">
                  <label>Qualifications</label>
                  <input [(ngModel)]="profile.qualification" name="qualification" placeholder="e.g. MBBS, MD">
                </div>
                
                <div class="form-group">
                  <label>Experience (Years)</label>
                  <input type="number" [(ngModel)]="profile.experienceYears" name="experienceYears">
                </div>
                <div class="form-group">
                  <label>Primary Hospital / Clinic</label>
                  <input [(ngModel)]="profile.defaultHospitalName" name="defaultHospitalName">
                </div>
              </div>
              
              <div class="form-actions">
                <button type="button" class="btn secondary" (click)="resetForm()">Cancel</button>
                <button type="submit" class="btn primary" [disabled]="saving" style="min-width: 120px; justify-content: center; background: var(--doctor);">
                  <span *ngIf="saving" class="spinner"></span>
                  <span *ngIf="!saving">Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
        
      </div>
    </div>
  `,
  styles: [`
    .profile-layout {
      display: flex;
      gap: 32px;
      align-items: flex-start;
      margin-top: 24px;
    }
    .profile-sidebar {
      flex: 0 0 320px;
    }
    .profile-main {
      flex: 1;
      min-width: 0;
    }
    
    @media (max-width: 900px) {
      .profile-layout { flex-direction: column; }
      .profile-sidebar { flex: none; width: 100%; }
    }

    /* Identity Card */
    .identity-card {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: var(--radius-lg);
      padding: 32px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      box-shadow: 0 12px 32px rgba(0,0,0,0.02);
    }
    
    .ic-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: var(--doctor);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-family: 'Fraunces', serif;
      font-weight: 600;
      margin-bottom: 16px;
      position: relative;
      box-shadow: 0 8px 24px rgba(30,58,95,0.2);
    }
    
    .ic-status-dot {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 16px;
      height: 16px;
      background: var(--success);
      border: 3px solid var(--surface);
      border-radius: 50%;
    }
    
    .ic-name {
      font-size: 22px;
      margin: 0 0 8px;
      color: var(--ink);
    }
    
    .uid-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--bg-soft);
      padding: 6px 12px;
      border-radius: 20px;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 13px;
      font-weight: 600;
      color: var(--doctor);
      border: 1px solid var(--line);
    }
    .uid-badge svg { width: 14px; height: 14px; }
    
    .ic-divider {
      width: 100%;
      height: 1px;
      background: var(--line);
      margin: 24px 0;
    }
    
    .ic-stats {
      width: 100%;
      display: flex;
      justify-content: center;
      gap: 32px;
    }
    
    .ic-stat {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .ic-stat-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--ink-soft);
      font-weight: 600;
    }
    .ic-stat-val {
      font-size: 16px;
      font-weight: 700;
      color: var(--ink);
    }
    
    .ic-info {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .ic-info-row {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      color: var(--ink-soft);
      text-align: left;
    }
    .ic-info-row svg {
      width: 16px;
      height: 16px;
      color: var(--ink-soft);
      opacity: 0.7;
    }

    /* Edit Form */
    .edit-card {
      padding: 32px;
    }
    .edit-header h3 {
      font-size: 18px;
      margin: 0 0 4px;
    }
    .edit-header p {
      font-size: 13px;
      color: var(--ink-soft);
      margin: 0 0 24px;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid var(--line);
    }
    
    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class DoctorProfileComponent implements OnInit {
  icons = ICONS;
  profile: DoctorProfile | null = null;
  originalProfile: DoctorProfile | null = null;
  saving = false;

  constructor(private api: DoctorApiService, private toast: ToastService) {}

  ngOnInit() {
    this.fetchProfile();
  }

  fetchProfile() {
    this.api.getProfile().subscribe({
      next: (p) => { 
        this.profile = p; 
        this.originalProfile = JSON.parse(JSON.stringify(p)); 
      },
      error: () => this.toast.showError('Failed to load profile')
    });
  }

  getInitials(name: string): string {
    if (!name) return 'DR';
    // Remove "Dr. " or "Dr " if present
    let cleanName = name.replace(/^dr\.?\s+/i, '');
    const parts = cleanName.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return cleanName.substring(0, 2).toUpperCase();
  }

  resetForm() {
    if (this.originalProfile) {
      this.profile = JSON.parse(JSON.stringify(this.originalProfile));
    }
  }

  save() {
    if (!this.profile) return;
    this.saving = true;
    this.api.updateProfile(this.profile).subscribe({
      next: (p) => { 
        this.profile = p; 
        this.originalProfile = JSON.parse(JSON.stringify(p));
        this.saving = false; 
        this.toast.showSuccess('Professional profile updated'); 
      },
      error: () => { 
        this.saving = false; 
        this.toast.showError('Failed to update profile'); 
      }
    });
  }
}
