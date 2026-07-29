import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientApiService } from '../../core/services/patient.service';
import { Allergy } from '../../core/models/models';

@Component({
  selector: 'app-patient-allergies',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>My Allergies</h1>
      <div class="card">
        <table>
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
        <p *ngIf="allergies.length === 0">No known allergies recorded.</p>
      </div>
    </div>
  `
})
export class PatientAllergiesComponent implements OnInit {
  allergies: Allergy[] = [];
  constructor(private api: PatientApiService) {}
  ngOnInit() { this.api.getAllergies().subscribe(a => this.allergies = a); }
}
