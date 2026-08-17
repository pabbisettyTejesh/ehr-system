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
    <div class="container form-page">
      <div class="page-header">
        <span class="icon-circle bg-accent-doctor">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.triangleAlert | safeHtml"></svg>
        </span>
        <div>
          <span class="page-eyebrow">Doctor · Appointed patients only</span>
          <h1>Manage Allergies</h1>
        </div>
      </div>

      <div class="card">
        <div class="form-group">
          <label>Patient</label>
          <select [(ngModel)]="form.patientId" name="patientId">
            <option [ngValue]="null" disabled>Select a patient…</option>
            <option *ngFor="let p of myPatients" [ngValue]="p.patientId">
              {{ p.patientName }} — {{ p.patientUid }}
            </option>
          </select>
          <p *ngIf="myPatients.length === 0" style="font-size:12.5px;color:var(--ink-soft);margin-top:6px;">
            You have no appointed patients yet.
          </p>
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label>Allergen Name</label>
            <input [(ngModel)]="form.allergenName" name="allergenName">
          </div>
          <div class="form-group">
            <label>Severity</label>
            <select [(ngModel)]="form.severity" name="severity">
              <option>LOW</option>
              <option>MODERATE</option>
              <option>HIGH</option>
              <option>CRITICAL</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>Reaction</label>
          <input [(ngModel)]="form.reaction" name="reaction">
        </div>
        <div class="form-group">
          <label>Notes</label>
          <textarea [(ngModel)]="form.notes" name="notes" rows="2"></textarea>
        </div>
        <button class="btn" (click)="submit()" [disabled]="!form.patientId">Add Allergy Record</button>
        <p class="success-text" *ngIf="saved">Allergy record saved.</p>
        <p class="error-text" *ngIf="error">{{ error }}</p>
      </div>
    </div>
  `
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
