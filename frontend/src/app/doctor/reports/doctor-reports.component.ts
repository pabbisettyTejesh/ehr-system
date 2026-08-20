import { Component, OnInit } from '@angular/core';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorApiService } from '../../core/services/doctor.service';
import { AppointedPatient } from '../../core/models/models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-doctor-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeHtmlPipe],
  template: `
    <div class="container" style="max-width: 900px;">
      <div class="page-header" style="border-bottom: none; margin-bottom: 0;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <span class="icon-circle bg-accent-doctor">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.scrollText | safeHtml"></svg>
          </span>
          <div>
            <span class="page-eyebrow">Medical Records</span>
            <h1>Upload Clinical Report</h1>
          </div>
        </div>
      </div>
      
      <p style="font-size: 14px; color: var(--ink-soft); margin-bottom: 32px; padding-left: 56px;">
        Upload lab results, imaging reports, or consultation notes to the patient's permanent medical record.
      </p>

      <div class="card focus-form-card" style="padding: 32px;">
        
        <!-- Target Patient -->
        <div class="form-section">
          <h3 class="section-title">1. Target Patient</h3>
          <div class="form-group">
            <select [(ngModel)]="form.patientId" name="patientId" class="premium-select">
              <option [ngValue]="null" disabled>-- Select a Patient --</option>
              <option *ngFor="let p of myPatients" [ngValue]="p.patientId">
                {{ p.patientName }} (UID: {{ p.patientUid }})
              </option>
            </select>
          </div>
        </div>

        <!-- Report Details -->
        <div class="form-section" [class.disabled-section]="!form.patientId" style="margin-top: 40px; border-top: 1px solid var(--line); padding-top: 32px;">
          <h3 class="section-title">2. Document Metadata</h3>
          
          <div class="form-group" style="margin-bottom: 24px;">
            <label>Document Title</label>
            <input [(ngModel)]="form.reportName" name="reportName" class="premium-input" placeholder="e.g. Comprehensive Metabolic Panel...">
          </div>
          
          <div class="grid-2">
            <div class="form-group" style="margin-bottom: 0;">
              <label>Report Type</label>
              <input [(ngModel)]="form.reportType" name="reportType" class="premium-input" placeholder="e.g. Blood Test, MRI, X-Ray...">
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label>Facility / Hospital Name</label>
              <input [(ngModel)]="form.hospitalName" name="hospitalName" class="premium-input" placeholder="e.g. General Hospital...">
            </div>
          </div>
        </div>

        <!-- File Upload (Mock) -->
        <div class="form-section" [class.disabled-section]="!form.patientId" style="margin-top: 40px; border-top: 1px solid var(--line); padding-top: 32px;">
          <h3 class="section-title">3. Attach File</h3>
          
          <div class="file-drop-zone">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-doctor); margin-bottom: 12px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            <h4 style="margin: 0 0 4px 0; color: var(--ink);">Drag & Drop your file here</h4>
            <p style="margin: 0 0 16px 0; font-size: 13px; color: var(--ink-soft);">Supports PDF, DICOM, JPEG (Max 50MB)</p>
            <button class="btn secondary outline btn-small" disabled>Browse Files</button>
            <div style="margin-top: 16px; font-size: 11px; color: var(--ink-soft); background: var(--bg); padding: 4px 12px; border-radius: 20px; border: 1px solid var(--line);">
              File upload disabled in current MVP. Saving metadata only.
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div style="margin-top: 40px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--line); padding-top: 24px;">
          <div>
            <p class="success-text" *ngIf="saved" style="margin: 0; display: flex; align-items: center; gap: 6px;">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Report metadata indexed successfully.
            </p>
            <p class="error-text" *ngIf="error" style="margin: 0;">{{ error }}</p>
          </div>
          
          <button class="btn primary btn-large" (click)="submit()" [disabled]="!form.patientId || !form.reportName">
            Save Report Metadata
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-left: 6px;"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
          </button>
        </div>
        
      </div>
    </div>
  `,
  styles: [`
    .section-title { margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: var(--ink); text-transform: uppercase; letter-spacing: 0.5px; }
    .premium-select, .premium-input { width: 100%; padding: 12px 16px; border: 1px solid var(--line); border-radius: 8px; font-size: 15px; color: var(--ink); background: var(--bg); transition: all 0.2s; font-family: inherit; }
    .premium-select { appearance: none; background: var(--bg-soft); }
    .premium-select:focus, .premium-input:focus { border-color: var(--accent-doctor); outline: none; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
    
    .disabled-section { opacity: 0.5; pointer-events: none; filter: grayscale(100%); }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    
    .file-drop-zone { border: 2px dashed var(--line); border-radius: 12px; padding: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--bg-soft); transition: 0.2s; }
    .file-drop-zone:hover { border-color: var(--accent-doctor); background: rgba(37,99,235,0.02); }
    
    .btn-large { padding: 12px 24px; font-size: 15px; border-radius: 8px; display: flex; align-items: center; }
    .btn-small { padding: 8px 16px; font-size: 13px; border-radius: 6px; }
  `]
})
export class DoctorReportsComponent implements OnInit {
  icons = ICONS;
  myPatients: AppointedPatient[] = [];
  form: any = { patientId: null, reportName: '', reportType: '', hospitalName: '' };
  saved = false;
  error = '';

  constructor(private api: DoctorApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.api.getMyPatientsDetailed().subscribe(p => {
      this.myPatients = p;
      const pid = this.route.snapshot.queryParamMap.get('patientId');
      if (pid) {
        this.form.patientId = Number(pid);
      }
    });
  }

  submit() {
    this.error = ''; this.saved = false;
    this.api.addReport(this.form).subscribe({
      next: () => this.saved = true,
      error: (err) => this.error = err?.error?.message || 'Failed to save report'
    });
  }
}
