import { Component, OnInit } from '@angular/core';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorApiService } from '../../core/services/doctor.service';
import { PrescriptionItem, EncounterSummary } from '../../core/models/models';

@Component({
  selector: 'app-doctor-prescription',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeHtmlPipe],
  template: `
    <div class="container form-page wide">
      <div class="page-header">
        <span class="icon-circle bg-accent-doctor">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.pill | safeHtml"></svg>
        </span>
        <div>
          <span class="page-eyebrow">Doctor · Appointed patients only</span>
          <h1>Create Prescription</h1>
        </div>
        <img src="assets/illustrations/prescription.svg" alt="" style="margin-left:auto; width:80px; height:auto;" loading="lazy">
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

        <h3 style="margin-top:8px;">Medicines</h3>
        <div *ngFor="let item of items; let i = index" class="card" style="background:var(--paper); box-shadow:none; border:1px dashed var(--line);">
          <div class="grid-2">
            <div class="form-group"><label>Medicine Name</label><input [(ngModel)]="item.medicineName" name="med{{i}}"></div>
            <div class="form-group"><label>Dosage</label><input [(ngModel)]="item.dosage" name="dose{{i}}"></div>
            <div class="form-group"><label>Frequency</label><input [(ngModel)]="item.frequency" name="freq{{i}}"></div>
            <div class="form-group"><label>Duration</label><input [(ngModel)]="item.duration" name="dur{{i}}"></div>
          </div>
          <div class="form-group"><label>Instructions</label><input [(ngModel)]="item.instructions" name="ins{{i}}"></div>
          <button class="btn danger" (click)="removeItem(i)">Remove</button>
        </div>
        <button class="btn secondary" (click)="addItem()">+ Add Medicine</button>

        <div style="margin-top:20px;">
          <button class="btn" (click)="submit()" [disabled]="!encounterId">Create Prescription</button>
        </div>
        <p class="success-text" *ngIf="saved">Prescription created.</p>
        <p class="error-text" *ngIf="error">{{ error }}</p>
      </div>
    </div>
  `
})
export class DoctorPrescriptionComponent implements OnInit {
  icons = ICONS;
  encounters: EncounterSummary[] = [];
  selectedEncounter: EncounterSummary | null = null;
  encounterId: number | null = null;
  patientId: number | null = null;
  items: PrescriptionItem[] = [{ medicineName: '', dosage: '', frequency: '', duration: '', instructions: '' }];
  saved = false;
  error = '';

  constructor(private api: DoctorApiService) {}

  ngOnInit() {
    this.api.getMyEncountersDetailed().subscribe(e => this.encounters = e);
  }

  onEncounterSelect() {
    if (this.selectedEncounter) {
      this.encounterId = this.selectedEncounter.id;
      this.patientId = this.selectedEncounter.patientId;
    }
  }

  addItem() {
    this.items.push({ medicineName: '', dosage: '', frequency: '', duration: '', instructions: '' });
  }

  removeItem(i: number) {
    this.items.splice(i, 1);
  }

  submit() {
    this.error = ''; this.saved = false;
    this.api.createPrescription({ encounterId: this.encounterId, patientId: this.patientId, items: this.items })
      .subscribe({
        next: () => this.saved = true,
        error: (err) => this.error = err?.error?.message || 'Failed to create prescription'
      });
  }
}
