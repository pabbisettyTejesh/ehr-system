import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientApiService } from '../../core/services/patient.service';
import { MedicalRecord } from '../../core/models/models';
import { EmptyStateComponent } from '../../shared/empty-state/empty-state.component';
import { SkeletonComponent } from '../../shared/skeleton/skeleton.component';

@Component({
  selector: 'app-patient-medical-history',
  standalone: true,
  imports: [CommonModule, EmptyStateComponent, SkeletonComponent],
  template: `
    <div class="container" style="max-width: 800px;">
      <div class="page-header" style="border-bottom: none; margin-bottom: 0;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <span class="icon-circle bg-accent-patient">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line>
            </svg>
          </span>
          <div>
            <span class="page-eyebrow">Patient</span>
            <h1>My Health Timeline</h1>
          </div>
        </div>
      </div>
      
      <p style="font-size: 14px; color: var(--ink-soft); margin-bottom: 32px; padding-left: 56px;">
        A complete, chronological history of your clinical notes and medical diagnoses.
      </p>

      <!-- Skeleton Loading -->
      <div *ngIf="loading" class="timeline" style="margin-top: 24px;">
        <app-skeleton type="row" height="100px" *ngFor="let i of [1,2,3]"></app-skeleton>
      </div>

      <div class="timeline" *ngIf="!loading && records.length > 0">
        <div class="timeline-item" *ngFor="let r of records">
          <div class="timeline-marker"></div>
          <div class="timeline-content card" style="padding: 24px; margin-top: -12px;">
            <div class="timeline-head">
              <span class="timeline-date">{{ r.createdAt | date:'longDate' }}</span>
              <span class="timeline-time">{{ r.createdAt | date:'shortTime' }}</span>
            </div>
            
            <h3 class="diagnosis-title">{{ r.diagnosis || 'No diagnosis recorded' }}</h3>
            
            <div class="clinical-details">
              <div class="detail-block" *ngIf="r.symptoms">
                <strong>Symptoms Reported:</strong>
                <p>{{ r.symptoms }}</p>
              </div>
              
              <div class="detail-block" *ngIf="r.clinicalNotes">
                <strong>Doctor's Clinical Notes:</strong>
                <p style="font-style: italic; color: var(--ink);">"{{ r.clinicalNotes }}"</p>
              </div>
              
              <div class="detail-block" *ngIf="r.treatmentPlan" style="background: rgba(16, 185, 129, 0.05); padding: 12px; border-radius: 8px; border-left: 3px solid var(--success);">
                <strong style="color: var(--success);">Treatment Plan:</strong>
                <p style="margin: 4px 0 0 0; color: var(--ink);">{{ r.treatmentPlan }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <app-empty-state 
        *ngIf="!loading && records.length === 0" 
        iconName="fileText" 
        title="No Health Records" 
        message="Your health timeline is empty. No clinical records have been added yet." 
        theme="patient">
      </app-empty-state>
    </div>
  `,
  styles: [`
    .timeline {
      display: flex; flex-direction: column;
      padding-left: 20px;
    }
    .timeline-item {
      display: flex; gap: 24px; position: relative; padding-bottom: 32px;
    }
    .timeline-item:last-child { padding-bottom: 0; }
    .timeline-item:not(:last-child)::before {
      content: ''; position: absolute; left: 7px; top: 16px; bottom: -16px;
      width: 2px; background: var(--line);
    }
    .timeline-marker {
      width: 16px; height: 16px; border-radius: 50%;
      background: var(--accent-patient);
      margin-top: 0; z-index: 1;
      box-shadow: 0 0 0 6px var(--bg);
      flex-shrink: 0;
    }
    .timeline-content {
      flex: 1; transition: all 0.2s ease;
      border: 1px solid var(--line);
    }
    .timeline-content:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.04);
      border-color: var(--accent-patient);
    }
    .timeline-head {
      display: flex; justify-content: space-between; border-bottom: 1px solid var(--line);
      padding-bottom: 12px; margin-bottom: 16px;
    }
    .timeline-date { font-weight: 600; color: var(--ink); font-size: 14px; }
    .timeline-time { color: var(--ink-soft); font-size: 13px; }
    
    .diagnosis-title { margin: 0 0 16px 0; font-size: 20px; color: var(--ink); }
    
    .clinical-details { display: flex; flex-direction: column; gap: 16px; }
    .detail-block strong { display: block; font-size: 13px; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
    .detail-block p { margin: 0; font-size: 15px; line-height: 1.5; color: var(--ink); }
  `]
})
export class PatientMedicalHistoryComponent implements OnInit {
  records: MedicalRecord[] = [];
  loading = true;
  constructor(private api: PatientApiService) {}
  ngOnInit() { 
    this.api.getMedicalHistory().subscribe(r => {
      this.records = r;
      this.loading = false;
    }); 
  }
}
