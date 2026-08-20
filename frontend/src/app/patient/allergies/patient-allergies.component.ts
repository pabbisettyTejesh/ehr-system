import { Component, OnInit } from '@angular/core';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';
import { CommonModule } from '@angular/common';
import { PatientApiService } from '../../core/services/patient.service';
import { Allergy } from '../../core/models/models';
import { EmptyStateComponent } from '../../shared/empty-state/empty-state.component';
import { SkeletonComponent } from '../../shared/skeleton/skeleton.component';

@Component({
  selector: 'app-patient-allergies',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe, EmptyStateComponent, SkeletonComponent],
  template: `
    <div class="container" style="max-width: 900px;">
      <div class="page-header" style="border-bottom: none; margin-bottom: 0;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <span class="icon-circle bg-accent-patient" style="background: rgba(239, 68, 68, 0.1); color: var(--warn);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.triangleAlert | safeHtml"></svg>
          </span>
          <div>
            <span class="page-eyebrow" style="color: var(--warn);">Medical Alert</span>
            <h1>My Allergies</h1>
          </div>
        </div>
      </div>
      
      <p style="font-size: 14px; color: var(--ink-soft); margin-bottom: 32px; padding-left: 56px;">
        Review your recorded allergies. This critical information is highlighted to all authorized doctors during your appointments.
      </p>

      <!-- Skeleton Loading -->
      <div *ngIf="loading" class="allergy-grid">
        <app-skeleton type="card" height="180px" *ngFor="let i of [1,2,3]"></app-skeleton>
      </div>

      <div class="allergy-grid" *ngIf="!loading && allergies.length > 0">
        <div class="allergy-card" *ngFor="let a of allergies" [ngClass]="'severity-' + a.severity.toLowerCase()">
          
          <div class="allergy-header">
            <h3 class="allergen-name">{{ a.allergenName }}</h3>
            <span class="status-badge" [class.active-status]="a.status === 'ACTIVE'" [class.inactive-status]="a.status !== 'ACTIVE'">
              {{ a.status }}
            </span>
          </div>
          
          <div class="allergy-body">
            <div class="info-group">
              <span class="info-label">Severity Level</span>
              <span class="severity-pill" [ngClass]="'pill-' + a.severity.toLowerCase()">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                {{ a.severity }}
              </span>
            </div>
            
            <div class="info-group">
              <span class="info-label">Reported Reaction</span>
              <p class="reaction-text">{{ a.reaction }}</p>
            </div>
          </div>
          
          <div class="allergy-footer">
            <span class="id-text">Record ID: ALG-{{ a.id }}</span>
            <span class="id-text">Recorded by Doctor {{ a.recordedByDoctorId }}</span>
          </div>
          
        </div>
      </div>
      
      <app-empty-state 
        *ngIf="!loading && allergies.length === 0" 
        iconName="triangleAlert" 
        title="No Known Allergies" 
        message="You do not have any active medical allergies recorded." 
        theme="patient">
      </app-empty-state>
    </div>
  `,
  styles: [`
    .allergy-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 24px; }
    
    .allergy-card { background: var(--bg); border: 1px solid var(--line); border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; transition: 0.2s; position: relative; }
    .allergy-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
    .allergy-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 6px; }
    
    /* Severity Styling */
    .severity-high::before { background: var(--warn); }
    .severity-high { border-color: rgba(239, 68, 68, 0.3); }
    .severity-high .allergy-header { background: rgba(239, 68, 68, 0.05); border-bottom-color: rgba(239, 68, 68, 0.1); }
    
    .severity-medium::before { background: #f59e0b; }
    .severity-medium { border-color: rgba(245, 158, 11, 0.3); }
    .severity-medium .allergy-header { background: rgba(245, 158, 11, 0.05); border-bottom-color: rgba(245, 158, 11, 0.1); }
    
    .severity-low::before { background: #3b82f6; }
    .severity-low { border-color: rgba(59, 130, 246, 0.3); }
    .severity-low .allergy-header { background: rgba(59, 130, 246, 0.05); border-bottom-color: rgba(59, 130, 246, 0.1); }
    
    .allergy-header { padding: 20px 24px; border-bottom: 1px dashed var(--line); display: flex; justify-content: space-between; align-items: flex-start; }
    .allergen-name { margin: 0; font-size: 20px; font-weight: 700; color: var(--ink); letter-spacing: -0.5px; }
    
    .status-badge { padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
    .active-status { background: var(--ink); color: white; }
    .inactive-status { background: var(--bg-soft); color: var(--ink-soft); border: 1px solid var(--line); }
    
    .allergy-body { padding: 24px; display: flex; flex-direction: column; gap: 20px; flex: 1; }
    .info-group { display: flex; flex-direction: column; gap: 6px; }
    .info-label { font-size: 12px; font-weight: 600; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 0.5px; }
    
    .reaction-text { margin: 0; font-size: 14px; color: var(--ink); line-height: 1.5; background: var(--bg-soft); padding: 12px; border-radius: 8px; border: 1px solid var(--line); }
    
    .severity-pill { display: inline-flex; align-items: center; gap: 4px; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; width: fit-content; }
    .pill-high { background: rgba(239, 68, 68, 0.1); color: var(--warn); }
    .pill-medium { background: rgba(245, 158, 11, 0.1); color: #b45309; }
    .pill-low { background: rgba(59, 130, 246, 0.1); color: #1d4ed8; }
    
    .allergy-footer { padding: 16px 24px; background: var(--bg-soft); border-top: 1px solid var(--line); display: flex; justify-content: space-between; }
    .id-text { font-size: 12px; color: var(--ink-soft); font-family: monospace; }
  `]
})
export class PatientAllergiesComponent implements OnInit {
  icons = ICONS;
  allergies: Allergy[] = [];
  loading = true;
  constructor(private api: PatientApiService) {}
  ngOnInit() { 
    this.api.getAllergies().subscribe(a => {
      this.allergies = a;
      this.loading = false;
    }); 
  }
}
