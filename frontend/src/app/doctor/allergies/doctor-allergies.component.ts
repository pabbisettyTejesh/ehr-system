import { Component, OnInit } from '@angular/core';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorApiService } from '../../core/services/doctor.service';
import { AppointedPatient } from '../../core/models/models';

@Component({
  selector: 'app-doctor-allergies',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeHtmlPipe],
  template: `
    <div class="container" style="max-width: 900px;">
      <div class="page-header" style="border-bottom: none; margin-bottom: 0;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <span class="icon-circle bg-accent-doctor">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.triangleAlert | safeHtml"></svg>
          </span>
          <div>
            <span class="page-eyebrow">Clinical Action</span>
            <h1>Add Medical Alert</h1>
          </div>
        </div>
      </div>
      
      <p style="font-size: 14px; color: var(--ink-soft); margin-bottom: 32px; padding-left: 56px;">
        Record a new allergy or severe adverse reaction for a patient. This will immediately trigger medical alerts across their profile.
      </p>

      <div class="card focus-form-card" style="padding: 32px;">
        <!-- Patient Selection -->
        <div class="form-section">
          <h3 class="section-title">1. Select Patient</h3>
          <div class="form-group">
            <select [(ngModel)]="form.patientId" name="patient" class="premium-select">
              <option [ngValue]="null" disabled>-- Choose an Appointed Patient --</option>
              <option *ngFor="let p of myPatients" [ngValue]="p.patientId">
                {{ p.patientName }} (UID: {{ p.patientUid }})
              </option>
            </select>
            <p *ngIf="myPatients.length === 0" style="font-size: 13px; color: var(--warn); margin-top: 8px;">
              You do not have any appointed patients to add alerts for.
            </p>
          </div>
        </div>

        <!-- Allergen Details -->
        <div class="form-section" [class.disabled-section]="!form.patientId" style="margin-top: 40px; border-top: 1px solid var(--line); padding-top: 32px;">
          <h3 class="section-title">2. Allergen Details</h3>
          
          <div class="grid-2" style="margin-bottom: 24px;">
            <div class="form-group" style="margin-bottom: 0;">
              <label>Allergen Name</label>
              <input [(ngModel)]="form.allergenName" name="allergenName" class="premium-input" placeholder="e.g. Penicillin, Peanuts...">
            </div>
            
            <div class="form-group" style="margin-bottom: 0;">
              <label>Severity Level</label>
              <div class="severity-selector">
                <label class="sev-radio" [class.active-sev]="form.severity === 'LOW'" style="--sev-color: #3b82f6;">
                  <input type="radio" [(ngModel)]="form.severity" name="severity" value="LOW"> Low
                </label>
                <label class="sev-radio" [class.active-sev]="form.severity === 'MODERATE'" style="--sev-color: #f59e0b;">
                  <input type="radio" [(ngModel)]="form.severity" name="severity" value="MODERATE"> Mod
                </label>
                <label class="sev-radio" [class.active-sev]="form.severity === 'HIGH'" style="--sev-color: #ef4444;">
                  <input type="radio" [(ngModel)]="form.severity" name="severity" value="HIGH"> High
                </label>
                <label class="sev-radio" [class.active-sev]="form.severity === 'CRITICAL'" style="--sev-color: #7f1d1d;">
                  <input type="radio" [(ngModel)]="form.severity" name="severity" value="CRITICAL"> Crit
                </label>
              </div>
            </div>
          </div>
          
          <div class="form-group" style="margin-bottom: 24px;">
            <label>Observed Reaction</label>
            <input [(ngModel)]="form.reaction" name="reaction" class="premium-input" placeholder="e.g. Hives, Anaphylaxis, Shortness of breath...">
          </div>
          
          <div class="form-group" style="margin-bottom: 0;">
            <label>Clinical Notes (Optional)</label>
            <textarea [(ngModel)]="form.notes" name="notes" class="premium-textarea" rows="3" placeholder="Any additional context regarding the allergy..."></textarea>
          </div>
        </div>

        <!-- Submit Action -->
        <div style="margin-top: 40px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--line); padding-top: 24px;">
          <div>
            <p class="success-text" *ngIf="saved" style="margin: 0; display: flex; align-items: center; gap: 6px;">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Medical alert saved successfully.
            </p>
            <p class="error-text" *ngIf="error" style="margin: 0;">{{ error }}</p>
          </div>
          
          <button class="btn primary btn-large" (click)="submit()" [disabled]="!form.patientId || !form.allergenName">
            Save Medical Alert
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-left: 6px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .section-title { margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: var(--ink); text-transform: uppercase; letter-spacing: 0.5px; }
    .premium-select, .premium-input, .premium-textarea { width: 100%; padding: 12px 16px; border: 1px solid var(--line); border-radius: 8px; font-size: 15px; color: var(--ink); background: var(--bg); transition: all 0.2s; font-family: inherit; }
    .premium-select { appearance: none; background: var(--bg-soft); }
    .premium-select:focus, .premium-input:focus, .premium-textarea:focus { border-color: var(--accent-doctor); outline: none; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
    
    .disabled-section { opacity: 0.5; pointer-events: none; filter: grayscale(100%); }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    
    .severity-selector { display: flex; gap: 8px; height: 48px; }
    .sev-radio { flex: 1; border: 1px solid var(--line); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; cursor: pointer; transition: 0.2s; background: var(--bg-soft); color: var(--ink-soft); }
    .sev-radio input { display: none; }
    .sev-radio:hover { background: var(--bg); }
    .active-sev { border-color: var(--sev-color); background: rgba(0,0,0,0.02) !important; color: var(--sev-color); box-shadow: 0 0 0 2px var(--sev-color) inset; }
    
    .btn-large { padding: 12px 24px; font-size: 15px; border-radius: 8px; display: flex; align-items: center; }
  `]
})
export class DoctorAllergiesComponent implements OnInit {
  icons = ICONS;
  myPatients: AppointedPatient[] = [];
  form: any = { patientId: null, allergenName: '', severity: 'LOW', reaction: '', notes: '' };
  saved = false;
  error = '';

  constructor(private api: DoctorApiService) {}

  ngOnInit() {
    this.api.getMyPatientsDetailed().subscribe(p => this.myPatients = p);
  }

  submit() {
    this.error = ''; this.saved = false;
    this.api.addAllergy(this.form).subscribe({
      next: () => this.saved = true,
      error: (err) => this.error = err?.error?.message || 'Failed to save allergy'
    });
  }
}
