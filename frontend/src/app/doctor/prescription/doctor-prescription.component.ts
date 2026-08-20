import { Component, OnInit } from '@angular/core';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorApiService } from '../../core/services/doctor.service';
import { PrescriptionItem, AppointedPatient } from '../../core/models/models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-doctor-prescription',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeHtmlPipe],
  template: `
    <div class="container" style="max-width: 900px;">
      <div class="page-header" style="border-bottom: none; margin-bottom: 0;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <span class="icon-circle bg-accent-doctor">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.pill | safeHtml"></svg>
          </span>
          <div>
            <span class="page-eyebrow">Clinical Action</span>
            <h1>Write Prescription</h1>
          </div>
        </div>
      </div>
      
      <p style="font-size: 14px; color: var(--ink-soft); margin-bottom: 32px; padding-left: 56px;">
        Issue a new digital prescription. The prescription will be instantly available in the patient's portal.
      </p>

      <div class="card focus-form-card" style="padding: 32px;">
        <!-- Patient Selection -->
        <div class="form-section">
          <h3 class="section-title">1. Select Patient</h3>
          <div class="form-group">
            <select [(ngModel)]="patientId" name="patient" class="premium-select">
              <option [ngValue]="null" disabled>-- Choose an Appointed Patient --</option>
              <option *ngFor="let p of patients" [ngValue]="p.patientId">
                {{ p.patientName }} (UID: {{ p.patientUid }})
              </option>
            </select>
            <p *ngIf="patients.length === 0" style="font-size: 13px; color: var(--warn); margin-top: 8px;">
              You do not have any appointed patients to prescribe to.
            </p>
          </div>
        </div>

        <!-- Medicine Details -->
        <div class="form-section" [class.disabled-section]="!patientId" style="margin-top: 40px; border-top: 1px solid var(--line); padding-top: 32px;">
          <h3 class="section-title">2. Prescribe Medications</h3>
          
          <div class="medicine-list">
            <div *ngFor="let item of items; let i = index" class="medicine-block">
              <div class="medicine-header">
                <span class="med-number">#{{ i + 1 }}</span>
                <button class="btn icon-btn danger-text" (click)="removeItem(i)" title="Remove this medicine" *ngIf="items.length > 1">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              
              <div class="form-group" style="margin-bottom: 16px;">
                <label>Medicine Name</label>
                <input [(ngModel)]="item.medicineName" name="med{{i}}" class="premium-input" placeholder="e.g. Amoxicillin 500mg">
              </div>
              
              <div class="grid-3" style="margin-bottom: 16px;">
                <div class="form-group">
                  <label>Dosage</label>
                  <input [(ngModel)]="item.dosage" name="dose{{i}}" class="premium-input" placeholder="e.g. 1 Tablet">
                </div>
                <div class="form-group">
                  <label>Frequency</label>
                  <input [(ngModel)]="item.frequency" name="freq{{i}}" class="premium-input" placeholder="e.g. Twice a day">
                </div>
                <div class="form-group">
                  <label>Duration</label>
                  <input [(ngModel)]="item.duration" name="dur{{i}}" class="premium-input" placeholder="e.g. 5 days">
                </div>
              </div>
              
              <div class="form-group" style="margin-bottom: 0;">
                <label>Special Instructions</label>
                <input [(ngModel)]="item.instructions" name="ins{{i}}" class="premium-input" placeholder="e.g. Take after meals">
              </div>
            </div>
          </div>
          
          <button class="btn secondary outline" (click)="addItem()" style="margin-top: 16px; border-style: dashed; width: 100%; justify-content: center;">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add Another Medicine
          </button>
        </div>

        <!-- Submit Action -->
        <div style="margin-top: 40px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--line); padding-top: 24px;">
          <div>
            <p class="success-text" *ngIf="saved" style="margin: 0; display: flex; align-items: center; gap: 6px;">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Prescription issued successfully.
            </p>
            <p class="error-text" *ngIf="error" style="margin: 0;">{{ error }}</p>
          </div>
          
          <button class="btn primary btn-large" (click)="submit()" [disabled]="!patientId || !items[0].medicineName">
            Issue Prescription
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-left: 6px;"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .section-title { margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: var(--ink); text-transform: uppercase; letter-spacing: 0.5px; }
    .premium-select { width: 100%; padding: 12px 16px; border: 1px solid var(--line); border-radius: 8px; font-size: 15px; color: var(--ink); background: var(--bg-soft); transition: all 0.2s; appearance: none; }
    .premium-select:focus { border-color: var(--accent-doctor); outline: none; background: var(--bg); box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
    
    .disabled-section { opacity: 0.5; pointer-events: none; filter: grayscale(100%); }
    
    .medicine-list { display: flex; flex-direction: column; gap: 24px; }
    .medicine-block { background: var(--bg-soft); border: 1px solid var(--line); border-radius: 12px; padding: 24px; position: relative; }
    .medicine-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--line); padding-bottom: 12px; }
    .med-number { font-size: 14px; font-weight: 600; color: var(--ink-soft); background: var(--bg); padding: 4px 10px; border-radius: 20px; border: 1px solid var(--line); }
    
    .premium-input { width: 100%; padding: 10px 14px; border: 1px solid var(--line); border-radius: 6px; font-size: 14px; background: var(--bg); transition: all 0.2s; }
    .premium-input:focus { border-color: var(--accent-doctor); outline: none; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
    
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    
    .icon-btn { background: none; border: none; padding: 6px; cursor: pointer; border-radius: 4px; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
    .icon-btn:hover { background: rgba(0,0,0,0.05); }
    .danger-text { color: var(--warn); }
    .danger-text:hover { background: var(--warn-bg); }
    
    .btn-large { padding: 12px 24px; font-size: 15px; border-radius: 8px; }
  `]
})
export class DoctorPrescriptionComponent implements OnInit {
  icons = ICONS;
  patients: AppointedPatient[] = [];
  patientId: number | null = null;
  items: PrescriptionItem[] = [{ medicineName: '', dosage: '', frequency: '', duration: '', instructions: '' }];
  saved = false;
  error = '';

  constructor(private api: DoctorApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.api.getMyPatientsDetailed().subscribe(p => {
      this.patients = p;
      const pid = this.route.snapshot.queryParamMap.get('patientId');
      if (pid) {
        this.patientId = Number(pid);
      }
    });
  }

  addItem() {
    this.items.push({ medicineName: '', dosage: '', frequency: '', duration: '', instructions: '' });
  }

  removeItem(i: number) {
    this.items.splice(i, 1);
  }

  submit() {
    this.error = ''; this.saved = false;
    this.api.createPrescription({ patientId: this.patientId, items: this.items })
      .subscribe({
        next: () => this.saved = true,
        error: (err) => this.error = err?.error?.message || 'Failed to create prescription'
      });
  }
}
