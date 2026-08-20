import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientApiService } from '../../core/services/patient.service';
import { Prescription } from '../../core/models/models';
import { EmptyStateComponent } from '../../shared/empty-state/empty-state.component';
import { SkeletonComponent } from '../../shared/skeleton/skeleton.component';

@Component({
  selector: 'app-patient-prescriptions',
  standalone: true,
  imports: [CommonModule, EmptyStateComponent, SkeletonComponent],
  template: `
    <div class="container" style="max-width: 900px;">
      <div class="page-header" style="border-bottom: none; margin-bottom: 0;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <span class="icon-circle bg-accent-patient">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.5 20.5L3.5 13.5a2.828 2.828 0 0 1 4-4l7 7a2.828 2.828 0 0 1-4 4z"></path>
              <line x1="10" y1="10" x2="14" y2="14"></line>
              <path d="M16 11V6a2 2 0 0 0-2-2h-3"></path>
              <line x1="12" y1="14" x2="16" y2="10"></line>
              <path d="M15 15l6-6"></path>
            </svg>
          </span>
          <div>
            <span class="page-eyebrow">Patient Portal</span>
            <h1>Digital Prescriptions</h1>
          </div>
        </div>
      </div>
      
      <p style="font-size: 14px; color: var(--ink-soft); margin-bottom: 32px; padding-left: 56px;">
        View your official digital prescriptions. You can present these to pharmacies for medication fulfillment.
      </p>

      <!-- Skeleton Loading -->
      <div *ngIf="loading" style="display:flex; flex-direction:column; gap:16px;">
        <app-skeleton type="card" height="200px" *ngFor="let i of [1,2,3]"></app-skeleton>
      </div>

      <div class="rx-grid" *ngIf="!loading && prescriptions.length > 0">
        <div class="rx-card" *ngFor="let p of prescriptions">
          
          <div class="rx-header">
            <div style="display: flex; align-items: flex-start; justify-content: space-between;">
              <div>
                <h3 class="rx-logo">Rx</h3>
                <p style="margin: 4px 0 0; font-size: 12px; color: var(--ink-soft); font-family: monospace;">ID: PRE-{{ p.id }}</p>
              </div>
              <div style="text-align: right;">
                <span class="status-pill active" style="margin-bottom: 8px;">{{ p.status }}</span>
                <p style="margin: 0; font-size: 13px; color: var(--ink-soft);">{{ p.createdAt | date:'mediumDate' }}</p>
              </div>
            </div>
            
            <div class="doctor-info">
              <div class="avatar-xs bg-accent-doctor">D</div>
              <div style="display: flex; flex-direction: column;">
                <span style="font-size: 12px; color: var(--ink-soft);">Prescribed by</span>
                <span style="font-size: 14px; font-weight: 600; color: var(--ink);">Doctor ID: {{ p.doctorId }}</span>
              </div>
            </div>
          </div>
          
          <div class="rx-body">
            <div class="med-item" *ngFor="let item of p.items; let i = index">
              <div class="med-header">
                <span class="med-number">{{ i + 1 }}</span>
                <h4 style="margin: 0; font-size: 16px; color: var(--ink);">{{ item.medicineName }}</h4>
              </div>
              
              <div class="med-details-grid">
                <div class="detail-box">
                  <span class="detail-label">Dosage</span>
                  <span class="detail-val">{{ item.dosage }}</span>
                </div>
                <div class="detail-box">
                  <span class="detail-label">Frequency</span>
                  <span class="detail-val">{{ item.frequency }}</span>
                </div>
                <div class="detail-box">
                  <span class="detail-label">Duration</span>
                  <span class="detail-val">{{ item.duration }}</span>
                </div>
              </div>
              
              <div class="med-instructions" *ngIf="item.instructions">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                <span>{{ item.instructions }}</span>
              </div>
            </div>
          </div>
          
          <div class="rx-footer">
            <p>Officially signed digital prescription.</p>
            <button class="btn secondary outline" style="font-size: 12px; padding: 4px 10px;" (click)="print()">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Download PDF
            </button>
          </div>
          
        </div>
      </div>
      
      <app-empty-state 
        *ngIf="!loading && prescriptions.length === 0" 
        iconName="pill" 
        title="No Prescriptions Found" 
        message="You don't have any digital prescriptions on file." 
        theme="patient">
      </app-empty-state>
    </div>
  `,
  styles: [`
    .rx-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 24px; }
    
    .rx-card { background: var(--paper); border: 1px solid var(--line); border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.03); display: flex; flex-direction: column; position: relative; }
    .rx-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 6px; background: linear-gradient(90deg, var(--accent-patient), #10b981); }
    
    .rx-header { padding: 24px; border-bottom: 1px dashed var(--line); background: var(--bg-soft); }
    .rx-logo { margin: 0; font-size: 32px; font-family: 'Times New Roman', Times, serif; font-style: italic; font-weight: 700; color: var(--ink); line-height: 1; }
    
    .status-pill { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; }
    .status-pill.active { background: rgba(16, 185, 129, 0.1); color: var(--success); }
    
    .doctor-info { display: flex; align-items: center; gap: 12px; margin-top: 24px; padding: 12px; background: var(--bg); border: 1px solid var(--line); border-radius: 8px; }
    .avatar-xs { width: 32px; height: 32px; border-radius: 8px; color: white; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; }
    
    .rx-body { padding: 24px; display: flex; flex-direction: column; gap: 24px; flex: 1; }
    .med-item { display: flex; flex-direction: column; gap: 16px; }
    .med-header { display: flex; align-items: center; gap: 12px; }
    .med-number { width: 24px; height: 24px; border-radius: 50%; background: var(--accent-patient); color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; }
    
    .med-details-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
    .detail-box { display: flex; flex-direction: column; gap: 4px; padding: 8px; background: var(--bg-soft); border-radius: 6px; border: 1px solid var(--line); }
    .detail-label { font-size: 11px; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
    .detail-val { font-size: 13px; color: var(--ink); font-weight: 500; }
    
    .med-instructions { display: flex; align-items: flex-start; gap: 8px; font-size: 13px; color: var(--ink); background: rgba(37,99,235,0.05); padding: 10px 12px; border-radius: 6px; border-left: 2px solid var(--accent-doctor); }
    .med-instructions svg { color: var(--accent-doctor); flex-shrink: 0; margin-top: 2px; }
    
    .rx-footer { padding: 16px 24px; border-top: 1px solid var(--line); display: flex; justify-content: space-between; align-items: center; background: var(--bg-soft); }
    .rx-footer p { margin: 0; font-size: 12px; color: var(--ink-soft); font-style: italic; }
  `]
})
export class PatientPrescriptionsComponent implements OnInit {
  prescriptions: Prescription[] = [];
  loading = true;
  constructor(private api: PatientApiService) {}
  ngOnInit() { 
    this.api.getPrescriptions().subscribe(p => {
      this.prescriptions = p;
      this.loading = false;
    }); 
  }
  print() {
    window.print();
  }
}
