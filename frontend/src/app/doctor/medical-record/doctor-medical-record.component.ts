import { Component, OnInit } from '@angular/core';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorApiService } from '../../core/services/doctor.service';
import { AppointedPatient } from '../../core/models/models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-doctor-medical-record',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeHtmlPipe],
  template: `
    <div class="container" style="max-width: 900px;">
      <div class="page-header" style="border-bottom: none; margin-bottom: 0;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <span class="icon-circle bg-accent-doctor">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.notebookText | safeHtml"></svg>
          </span>
          <div>
            <span class="page-eyebrow">Clinical Action</span>
            <h1>Add Medical Record</h1>
          </div>
        </div>
      </div>
      
      <p style="font-size: 14px; color: var(--ink-soft); margin-bottom: 32px; padding-left: 56px;">
        Document symptoms, diagnoses, and treatment plans. This will be added to the patient's permanent medical history.
      </p>

      <div class="card focus-form-card" style="padding: 32px;">
        <!-- Patient Selection -->
        <div class="form-section">
          <h3 class="section-title">1. Select Patient</h3>
          <div class="form-group">
            <select [(ngModel)]="form.patientId" name="patient" class="premium-select">
              <option [ngValue]="null" disabled>-- Choose an Appointed Patient --</option>
              <option *ngFor="let p of patients" [ngValue]="p.patientId">
                {{ p.patientName }} (UID: {{ p.patientUid }})
              </option>
            </select>
            <p *ngIf="patients.length === 0" style="font-size: 13px; color: var(--warn); margin-top: 8px;">
              You do not have any appointed patients to add records for.
            </p>
          </div>
        </div>

        <!-- Clinical Details -->
        <div class="form-section" [class.disabled-section]="!form.patientId" style="margin-top: 40px; border-top: 1px solid var(--line); padding-top: 32px;">
          <h3 class="section-title">2. Clinical Details</h3>
          
          <div class="grid-2" style="margin-bottom: 24px;">
            <div class="form-group" style="margin-bottom: 0;">
              <label>Reported Symptoms</label>
              <textarea [(ngModel)]="form.symptoms" name="symptoms" class="premium-textarea" rows="3" placeholder="e.g. Fever, coughing, fatigue..."></textarea>
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label>Diagnosis</label>
              <textarea [(ngModel)]="form.diagnosis" name="diagnosis" class="premium-textarea" rows="3" placeholder="e.g. Acute bronchitis"></textarea>
            </div>
          </div>
          
          <div class="form-group" style="margin-bottom: 24px;">
            <label>Doctor's Clinical Notes</label>
            <textarea [(ngModel)]="form.clinicalNotes" name="clinicalNotes" class="premium-textarea" rows="4" placeholder="Detailed observations from the consultation..."></textarea>
          </div>
          
          <div class="form-group" style="margin-bottom: 0;">
            <label>Treatment Plan</label>
            <textarea [(ngModel)]="form.treatmentPlan" name="treatmentPlan" class="premium-textarea" rows="3" placeholder="Recommended treatments, lifestyle changes, etc."></textarea>
          </div>
        </div>

        <!-- Submit Action -->
        <div style="margin-top: 40px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--line); padding-top: 24px;">
          <div>
            <p class="success-text" *ngIf="saved" style="margin: 0; display: flex; align-items: center; gap: 6px;">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Medical record saved securely.
            </p>
            <p class="error-text" *ngIf="error" style="margin: 0;">{{ error }}</p>
          </div>
          
          <button class="btn primary btn-large" (click)="submit()" [disabled]="!form.patientId || !form.diagnosis">
            Save Medical Record
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-left: 6px;"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .section-title { margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: var(--ink); text-transform: uppercase; letter-spacing: 0.5px; }
    .premium-select { width: 100%; padding: 12px 16px; border: 1px solid var(--line); border-radius: 8px; font-size: 15px; color: var(--ink); background: var(--bg-soft); transition: all 0.2s; appearance: none; }
    .premium-select:focus { border-color: var(--accent-doctor); outline: none; background: var(--bg); box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
    
    .premium-textarea { width: 100%; padding: 12px 16px; border: 1px solid var(--line); border-radius: 8px; font-size: 14px; background: var(--bg); transition: all 0.2s; font-family: inherit; resize: vertical; }
    .premium-textarea:focus { border-color: var(--accent-doctor); outline: none; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
    
    .disabled-section { opacity: 0.5; pointer-events: none; filter: grayscale(100%); }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    
    .btn-large { padding: 12px 24px; font-size: 15px; border-radius: 8px; display: flex; align-items: center; }
  `]
})
export class DoctorMedicalRecordComponent implements OnInit {
  icons = ICONS;
  patients: AppointedPatient[] = [];
  form: any = { patientId: null, symptoms: '', diagnosis: '', clinicalNotes: '', treatmentPlan: '' };
  saved = false;
  error = '';

  constructor(private api: DoctorApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.api.getMyPatientsDetailed().subscribe(p => {
      this.patients = p;
      const pid = this.route.snapshot.queryParamMap.get('patientId');
      if (pid) {
        this.form.patientId = Number(pid);
      }
    });
  }

  submit() {
    this.error = ''; this.saved = false;
    this.api.addMedicalRecord(this.form).subscribe({
      next: () => this.saved = true,
      error: (err) => this.error = err?.error?.message || 'Failed to save record'
    });
  }
}
