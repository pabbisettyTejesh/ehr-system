import { Component } from '@angular/core';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorApiService } from '../../core/services/doctor.service';
import { ICONS } from '../../shared/icons';

@Component({
  selector: 'app-doctor-search-patient',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeHtmlPipe],
  template: `
    <div class="container" style="max-width: 800px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 70vh;">
      
      <div style="text-align: center; margin-bottom: 40px;">
        <span class="icon-circle bg-accent-doctor" style="width: 64px; height: 64px; margin: 0 auto 24px auto;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.search | safeHtml" style="width: 32px; height: 32px;"></svg>
        </span>
        <h1 style="font-size: 32px; margin: 0 0 12px 0;">Global Patient Search</h1>
        <p style="color: var(--ink-soft); font-size: 16px; max-width: 500px; margin: 0 auto;">
          Look up basic demographic information using a patient's unique UID.
        </p>
      </div>

      <div class="spotlight-search-container">
        <div class="search-input-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            [(ngModel)]="patientUid" 
            (keyup.enter)="search()"
            name="patientUid" 
            class="spotlight-input" 
            placeholder="Search by Patient UID (e.g. PAT-2026-...)"
            autocomplete="off"
            autofocus
          >
          <button class="btn primary search-btn" (click)="search()">Search</button>
        </div>
        
        <div class="error-msg" *ngIf="error">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          {{ error }}
        </div>

        <div class="spotlight-result slide-up" *ngIf="result">
          <div class="result-card">
            <div class="result-header">
              <div class="avatar-lg bg-accent-patient">{{ result.fullName.charAt(0).toUpperCase() }}</div>
              <div class="result-info">
                <h2>{{ result.fullName }}</h2>
                <div class="tags">
                  <span class="uid-badge">{{ result.patientUid }}</span>
                  <span class="info-badge">{{ result.gender || 'Unknown Gender' }}</span>
                </div>
              </div>
            </div>
            
            <div class="result-footer">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lock-icon"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <p>
                <strong>Clinical Data Locked.</strong> Full medical history and records require an active appointment linking you to this patient. Unappointed doctors can only view basic demographics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .spotlight-search-container { width: 100%; max-width: 640px; }
    
    .search-input-wrapper { position: relative; display: flex; align-items: center; background: var(--bg); border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.08); transition: 0.3s; padding: 6px; border: 1px solid var(--line); }
    .search-input-wrapper:focus-within { box-shadow: 0 12px 48px rgba(37,99,235,0.15); border-color: var(--accent-doctor); transform: translateY(-2px); }
    
    .search-icon { position: absolute; left: 24px; width: 24px; height: 24px; color: var(--ink-soft); pointer-events: none; }
    
    .spotlight-input { width: 100%; border: none; background: transparent; padding: 16px 24px 16px 64px; font-size: 20px; color: var(--ink); font-family: inherit; }
    .spotlight-input:focus { outline: none; }
    .spotlight-input::placeholder { color: #a1a1aa; font-weight: 400; }
    
    .search-btn { margin-left: 8px; padding: 12px 32px; font-size: 16px; border-radius: 10px; height: 52px; }
    
    .error-msg { margin-top: 16px; background: var(--warn-bg); color: var(--warn); padding: 12px 20px; border-radius: 8px; display: flex; align-items: center; gap: 8px; font-weight: 500; font-size: 14px; animation: slideDown 0.3s ease; }
    
    .spotlight-result { margin-top: 32px; width: 100%; }
    .result-card { background: var(--bg); border: 1px solid var(--line); border-radius: 16px; overflow: hidden; box-shadow: 0 12px 32px rgba(0,0,0,0.04); }
    
    .result-header { padding: 32px; display: flex; gap: 24px; align-items: center; border-bottom: 1px solid var(--line); }
    .avatar-lg { width: 80px; height: 80px; border-radius: 20px; color: white; display: flex; align-items: center; justify-content: center; font-size: 36px; font-weight: 700; box-shadow: 0 8px 24px rgba(16,185,129,0.2); }
    .result-info h2 { margin: 0 0 12px 0; font-size: 28px; color: var(--ink); }
    .tags { display: flex; gap: 12px; }
    .uid-badge { background: var(--bg-soft); border: 1px solid var(--line); padding: 6px 12px; border-radius: 6px; font-family: monospace; font-size: 14px; color: var(--ink); }
    .info-badge { background: var(--bg-soft); border: 1px solid var(--line); padding: 6px 12px; border-radius: 20px; font-size: 13px; color: var(--ink-soft); font-weight: 500; }
    
    .result-footer { padding: 24px 32px; background: rgba(37, 99, 235, 0.05); display: flex; gap: 16px; align-items: flex-start; }
    .lock-icon { color: var(--accent-doctor); flex-shrink: 0; margin-top: 2px; }
    .result-footer p { margin: 0; font-size: 14px; line-height: 1.6; color: var(--ink-soft); }
    .result-footer strong { color: var(--ink); }
    
    .slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class DoctorSearchPatientComponent {
  icons = ICONS;
  patientUid = '';
  result: any = null;
  error = '';

  constructor(private api: DoctorApiService) {}

  search() {
    this.error = '';
    this.result = null;
    this.api.searchPatient(this.patientUid).subscribe({
      next: (r) => this.result = r,
      error: (err) => this.error = err?.error?.message || 'Patient not found'
    });
  }
}
