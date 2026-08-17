import { Component, OnInit } from '@angular/core';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';
import { CommonModule } from '@angular/common';
import { PatientApiService } from '../../core/services/patient.service';
import { Allergy } from '../../core/models/models';

@Component({
  selector: 'app-patient-allergies',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  template: `
    <div class="container">
      <div class="page-header">
        <span class="icon-circle bg-accent-patient">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.triangleAlert | safeHtml"></svg>
        </span>
        <div>
          <span class="page-eyebrow">Patient Portal</span>
          <h1>My Allergies</h1>
        </div>
      </div>
      <div class="card">
        <table *ngIf="allergies.length > 0">
          <thead><tr><th>Allergen</th><th>Reaction</th><th>Severity</th><th>Status</th></tr></thead>
          <tbody>
            <tr *ngFor="let a of allergies">
              <td>{{ a.allergenName }}</td>
              <td>{{ a.reaction }}</td>
              <td><span class="badge" [class]="a.severity.toLowerCase()">{{ a.severity }}</span></td>
              <td><span class="badge" [class]="a.status === 'ACTIVE' ? 'active' : 'pending'">{{ a.status }}</span></td>
            </tr>
          </tbody>
        </table>
        <div class="empty-state" *ngIf="allergies.length === 0">
          <img src="assets/illustrations/empty-state.svg" alt="No known allergies recorded." loading="lazy">
          <p>No known allergies recorded.</p>
        </div>
      </div>
    </div>
  `
})
export class PatientAllergiesComponent implements OnInit {
  icons = ICONS;
  allergies: Allergy[] = [];
  constructor(private api: PatientApiService) {}
  ngOnInit() { this.api.getAllergies().subscribe(a => this.allergies = a); }
}
