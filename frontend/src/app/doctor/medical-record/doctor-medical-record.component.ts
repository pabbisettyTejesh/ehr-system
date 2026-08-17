import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorApiService } from '../../core/services/doctor.service';
import { EncounterSummary } from '../../core/models/models';

@Component({
  selector: 'app-doctor-medical-record',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container form-page">
      <div class="page-header">
        <span class="icon-circle bg-accent-doctor">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h12v17a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4Z"/><path d="M9 12h6M9 16h4"/></svg>
        </span>
        <div>
          <span class="page-eyebrow">Doctor · Appointed patients only</span>
          <h1>Add Medical Record</h1>
        </div>
      </div>

      <div class="card">
        <div class="form-group">
          <label>Encounter</label>
          <select [(ngModel)]="selectedEncounter" name="encounter" (ngModelChange)="onEncounterSelect()">
            <option [ngValue]="null" disabled>Select an encounter…</option>
            <option *ngFor="let e of encounters" [ngValue]="e">
              {{ e.patientName }} — {{ e.visitDate | date:'MMM d, y, h:mm a' }} ({{ e.hospitalName || 'No hospital set' }})
            </option>
          </select>
          <p *ngIf="encounters.length === 0" style="font-size:12.5px;color:var(--ink-soft);margin-top:6px;">
            No encounters yet — create one first on the "Create Encounter" page.
          </p>
        </div>
        <div class="form-group">
          <label>Symptoms</label>
          <textarea [(ngModel)]="form.symptoms" name="symptoms" rows="2"></textarea>
        </div>
        <div class="form-group">
          <label>Diagnosis</label>
          <textarea [(ngModel)]="form.diagnosis" name="diagnosis" rows="2"></textarea>
        </div>
        <div class="form-group">
          <label>Clinical Notes</label>
          <textarea [(ngModel)]="form.clinicalNotes" name="clinicalNotes" rows="3"></textarea>
        </div>
        <div class="form-group">
          <label>Treatment Plan</label>
          <textarea [(ngModel)]="form.treatmentPlan" name="treatmentPlan" rows="2"></textarea>
        </div>
        <button class="btn" (click)="submit()" [disabled]="!form.encounterId">Save Medical Record</button>
        <p class="success-text" *ngIf="saved">Medical record saved.</p>
        <p class="error-text" *ngIf="error">{{ error }}</p>
      </div>
    </div>
  `
})
export class DoctorMedicalRecordComponent implements OnInit {
  encounters: EncounterSummary[] = [];
  selectedEncounter: EncounterSummary | null = null;
  form: any = { encounterId: null, patientId: null, symptoms: '', diagnosis: '', clinicalNotes: '', treatmentPlan: '' };
  saved = false;
  error = '';

  constructor(private api: DoctorApiService) {}

  ngOnInit() {
    this.api.getMyEncountersDetailed().subscribe(e => this.encounters = e);
  }

  onEncounterSelect() {
    if (this.selectedEncounter) {
      this.form.encounterId = this.selectedEncounter.id;
      this.form.patientId = this.selectedEncounter.patientId;
    }
  }

  submit() {
    this.error = ''; this.saved = false;
    this.api.addMedicalRecord(this.form).subscribe({
      next: () => this.saved = true,
      error: (err) => this.error = err?.error?.message || 'Failed to save record'
    });
  }
}
