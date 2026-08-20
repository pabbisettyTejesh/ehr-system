import { Component } from '@angular/core';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ICONS } from '../../shared/icons';
import { EmergencyApiService } from '../../core/services/emergency.service';
import { EmergencyAccessResult } from '../../core/models/models';

@Component({
  selector: 'app-doctor-emergency-access',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeHtmlPipe],
  template: `
    <div class="container" style="max-width: 900px;">
      
      <!-- Warning Banner -->
      <div class="emergency-banner">
        <div class="banner-content">
          <div class="banner-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.siren | safeHtml"></svg>
          </div>
          <div>
            <h2 style="margin: 0 0 4px 0; font-size: 18px; color: #7f1d1d; letter-spacing: -0.5px;">EMERGENCY MODE ACTIVE</h2>
            <p style="margin: 0; font-size: 14px; color: #991b1b;">
              This module bypasses standard appointment protocols to provide immediate, read-only access to life-saving clinical data. 
              <strong>All actions are logged and audited.</strong>
            </p>
          </div>
        </div>
      </div>

      <!-- Access Form -->
      <div class="card focus-form-card" style="padding: 32px; border: 2px solid rgba(239, 68, 68, 0.3); box-shadow: 0 8px 32px rgba(239, 68, 68, 0.1);" *ngIf="!result">
        
        <h3 class="section-title" style="color: var(--warn); margin-bottom: 24px;">Request Override Authorization</h3>
        
        <div class="form-group">
          <label style="color: var(--warn);">Target Patient UID</label>
          <div class="input-with-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input [(ngModel)]="patientUid" name="patientUid" class="premium-input pl-40" placeholder="e.g. PAT-2026-000001">
          </div>
        </div>
        
        <div class="form-group" style="margin-bottom: 32px;">
          <label style="color: var(--warn);">Clinical Justification (Mandatory)</label>
          <textarea [(ngModel)]="reason" name="reason" rows="3" class="premium-textarea" placeholder="Describe the nature of the emergency (e.g. Patient unconscious in ER, requires immediate surgical history...)"></textarea>
          <p style="margin: 8px 0 0; font-size: 12px; color: var(--ink-soft);">This justification will be visible to the patient and system administrators.</p>
        </div>
        
        <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(239, 68, 68, 0.2); padding-top: 24px;">
          <p class="error-text" *ngIf="error" style="margin: 0;">{{ error }}</p>
          <div *ngIf="!error"></div>
          
          <button class="btn btn-critical btn-large" (click)="submit()" [disabled]="!patientUid || !reason">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>
            Authorize Emergency Access
          </button>
        </div>
      </div>

      <!-- Critical Data Dashboard -->
      <div class="critical-dashboard" *ngIf="result">
        
        <div class="patient-id-strip">
          <div style="display: flex; align-items: center; gap: 24px;">
            <div class="avatar-lg bg-critical">{{ result.patientName.charAt(0) }}</div>
            <div>
              <span class="patient-uid-badge">{{ patientUid }}</span>
              <h1 class="patient-name">{{ result.patientName }}</h1>
              <div class="vitals-row">
                <span class="vital-chip">Age: <strong>{{ result.age }}</strong></span>
                <span class="vital-chip">Gender: <strong>{{ result.gender }}</strong></span>
                <span class="vital-chip critical-chip">Blood: <strong>{{ result.bloodGroup }}</strong></span>
              </div>
            </div>
          </div>
          <button class="btn secondary" (click)="result = null; reason = '';" style="border-color: rgba(239,68,68,0.3); color: var(--warn);">
            Close Record
          </button>
        </div>
        
        <div class="grid-2">
          
          <!-- Column 1: Alerts & Vitals -->
          <div style="display: flex; flex-direction: column; gap: 24px;">
            
            <div class="data-card alert-card">
              <h3 class="card-title">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                Active Allergies
              </h3>
              <p *ngIf="result.activeAllergies.length === 0" style="color:var(--ink-soft); font-size:14px; margin: 0;">No known allergies recorded.</p>
              <div class="allergy-list" *ngIf="result.activeAllergies.length > 0">
                <div class="allergy-item" *ngFor="let a of result.activeAllergies" [class.critical]="a.severity === 'CRITICAL'">
                  <strong>{{ a.allergenName }}</strong>
                  <span>Reaction: {{ a.reaction }}</span>
                </div>
              </div>
            </div>
            
            <div class="data-card">
              <h3 class="card-title">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                Current Medications
              </h3>
              <ul class="data-list" *ngIf="result.currentMedications.length > 0">
                <li *ngFor="let m of result.currentMedications">{{ m }}</li>
              </ul>
              <p *ngIf="result.currentMedications.length === 0" style="color:var(--ink-soft); font-size:14px; margin: 0;">No active medications.</p>
            </div>
            
          </div>
          
          <!-- Column 2: History & Contacts -->
          <div style="display: flex; flex-direction: column; gap: 24px;">
            
            <div class="data-card">
              <h3 class="card-title">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                Chronic Conditions
              </h3>
              <ul class="data-list" *ngIf="result.chronicConditions.length > 0">
                <li *ngFor="let c of result.chronicConditions">{{ c }}</li>
              </ul>
              <p *ngIf="result.chronicConditions.length === 0" style="color:var(--ink-soft); font-size:14px; margin: 0;">No chronic conditions reported.</p>
            </div>
            
            <div class="data-card">
              <h3 class="card-title">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                Past Major Surgeries
              </h3>
              <ul class="data-list" *ngIf="result.pastMajorSurgeries.length > 0">
                <li *ngFor="let s of result.pastMajorSurgeries">{{ s }}</li>
              </ul>
              <p *ngIf="result.pastMajorSurgeries.length === 0" style="color:var(--ink-soft); font-size:14px; margin: 0;">No past surgeries reported.</p>
            </div>
            
            <div class="data-card" style="background: var(--bg-soft);">
              <h3 class="card-title">Emergency Contact</h3>
              <div style="font-size: 15px; color: var(--ink);">
                <strong>{{ result.emergencyContactName }}</strong>
                <p style="margin: 4px 0 0; color: var(--warn); font-weight: 600;">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px; position: relative; top: 2px;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  {{ result.emergencyContactPhone }}
                </p>
              </div>
            </div>
            
          </div>
          
        </div>
      </div>

    </div>
  `,
  styles: [`
    /* Banner */
    .emergency-banner { background: #fef2f2; border-left: 6px solid #b91c1c; border-radius: 8px; padding: 16px 24px; margin-bottom: 32px; box-shadow: 0 4px 12px rgba(185, 28, 28, 0.05); }
    .banner-content { display: flex; align-items: flex-start; gap: 16px; }
    .banner-icon { color: #b91c1c; width: 28px; height: 28px; flex-shrink: 0; animation: pulse 2s infinite; }
    @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.7; } 100% { transform: scale(1); opacity: 1; } }
    
    /* Inputs */
    .section-title { margin: 0; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .input-with-icon { position: relative; }
    .input-icon { position: absolute; left: 16px; top: 14px; color: var(--warn); pointer-events: none; }
    .premium-input, .premium-textarea { width: 100%; padding: 12px 16px; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; font-size: 15px; color: var(--ink); background: rgba(239, 68, 68, 0.02); transition: all 0.2s; font-family: inherit; }
    .pl-40 { padding-left: 48px; }
    .premium-input:focus, .premium-textarea:focus { border-color: var(--warn); outline: none; box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1); background: var(--bg); }
    
    .btn-large { padding: 14px 28px; font-size: 16px; font-weight: 600; border-radius: 8px; display: flex; align-items: center; }
    .btn-critical { background: var(--warn); color: white; border: none; cursor: pointer; transition: 0.2s; }
    .btn-critical:hover { background: #b91c1c; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2); }
    .btn-critical:disabled { background: var(--line); color: var(--ink-soft); cursor: not-allowed; box-shadow: none; transform: none; }
    
    /* Dashboard */
    .critical-dashboard { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    
    .patient-id-strip { background: var(--bg); border: 2px solid var(--line); border-radius: 16px; padding: 24px; display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
    .avatar-lg { width: 72px; height: 72px; border-radius: 16px; color: white; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 700; }
    .bg-critical { background: var(--warn); }
    
    .patient-uid-badge { font-family: monospace; font-size: 12px; color: var(--warn); background: rgba(239,68,68,0.1); padding: 4px 10px; border-radius: 6px; font-weight: 600; }
    .patient-name { margin: 8px 0; font-size: 28px; font-weight: 700; color: var(--ink); }
    
    .vitals-row { display: flex; gap: 12px; flex-wrap: wrap; }
    .vital-chip { padding: 4px 12px; border-radius: 20px; font-size: 13px; color: var(--ink-soft); background: var(--bg-soft); border: 1px solid var(--line); }
    .vital-chip strong { color: var(--ink); }
    .critical-chip { background: rgba(239,68,68,0.05); border-color: rgba(239,68,68,0.2); color: #991b1b; }
    .critical-chip strong { color: var(--warn); }
    
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    
    .data-card { background: var(--bg); border: 1px solid var(--line); border-radius: 12px; padding: 24px; }
    .alert-card { border-color: rgba(239, 68, 68, 0.3); background: rgba(239, 68, 68, 0.02); }
    .card-title { margin: 0 0 16px 0; font-size: 15px; font-weight: 600; color: var(--ink); display: flex; align-items: center; gap: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
    .alert-card .card-title { color: var(--warn); }
    
    .allergy-list { display: flex; flex-direction: column; gap: 12px; }
    .allergy-item { display: flex; flex-direction: column; padding: 12px; background: var(--bg); border: 1px solid var(--line); border-left: 3px solid #f59e0b; border-radius: 8px; }
    .allergy-item.critical { border-left-color: var(--warn); background: rgba(239,68,68,0.05); }
    .allergy-item strong { font-size: 15px; color: var(--ink); margin-bottom: 2px; }
    .allergy-item span { font-size: 13px; color: var(--ink-soft); }
    
    .data-list { margin: 0; padding-left: 20px; color: var(--ink); font-size: 15px; line-height: 1.6; }
    .data-list li { margin-bottom: 6px; }
  `]
})
export class DoctorEmergencyAccessComponent {
  icons = ICONS;
  patientUid = '';
  reason = '';
  result: EmergencyAccessResult | null = null;
  error = '';

  constructor(private api: EmergencyApiService) {}

  submit() {
    this.error = ''; this.result = null;
    this.api.requestAccess(this.patientUid, this.reason).subscribe({
      next: (r) => this.result = r,
      error: (err) => this.error = err?.error?.message || 'Emergency access failed'
    });
  }
}
