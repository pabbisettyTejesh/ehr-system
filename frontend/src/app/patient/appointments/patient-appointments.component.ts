import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientApiService } from '../../core/services/patient.service';
import { Appointment, DoctorListItem } from '../../core/models/models';
import { ToastService } from '../../core/services/toast.service';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';
import { EmptyStateComponent } from '../../shared/empty-state/empty-state.component';
import { SkeletonComponent } from '../../shared/skeleton/skeleton.component';


@Component({
  selector: 'app-patient-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeHtmlPipe, EmptyStateComponent, SkeletonComponent],
  template: `
    <div class="container" style="max-width: 900px;">
      <div class="page-header" style="border-bottom: none; margin-bottom: 0;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <span class="icon-circle bg-accent-patient">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.calendar | safeHtml"></svg>
          </span>
          <div>
            <span class="page-eyebrow">Patient Portal</span>
            <h1>My Agenda</h1>
          </div>
        </div>
        <button class="btn primary btn-large" (click)="showRequestForm = !showRequestForm" style="margin-left: auto;">
          {{ showRequestForm ? 'Cancel Request' : 'Request Appointment' }}
          <svg *ngIf="!showRequestForm" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-left: 6px;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
      </div>

      <p style="font-size: 14px; color: var(--ink-soft); margin-bottom: 32px; padding-left: 56px;">
        View your upcoming appointments, join video calls, and request new consultations.
      </p>

      <!-- Request Appointment Form -->
      <div class="card focus-form-card slide-down" *ngIf="showRequestForm" style="margin-bottom: 32px; padding: 32px; border: 2px solid var(--accent-patient);">
        <h3 style="margin-top: 0; margin-bottom: 24px; border-bottom: 1px solid var(--line); padding-bottom: 12px; font-size: 18px;">Request a New Appointment</h3>
        <form (ngSubmit)="submitRequest()" class="grid-2">
          <div class="form-group">
            <label>Select Doctor</label>
            <select class="premium-input" [(ngModel)]="req.doctorId" name="doctorId" required>
              <option value="">-- Choose a Doctor --</option>
              <option *ngFor="let d of activeDoctors" [value]="d.id">Dr. {{ d.fullName }} ({{ d.specialization }})</option>
            </select>
          </div>
          <div class="form-group">
            <label>Requested Date</label>
            <input type="datetime-local" class="premium-input" [(ngModel)]="req.requestedDate" name="requestedDate" required>
          </div>
          <div class="form-group" style="grid-column: 1 / -1; margin-bottom: 24px;">
            <label>Reason for Visit / Chief Complaint</label>
            <textarea class="premium-input" [(ngModel)]="req.reason" name="reason" rows="3" required placeholder="e.g. Fever for 3 days..."></textarea>
          </div>
          <div class="form-actions" style="grid-column: 1 / -1; display: flex; justify-content: flex-end;">
            <button type="submit" class="btn primary btn-large">Submit Request</button>
          </div>
        </form>
      </div>

      <!-- Skeleton Loading -->
      <div *ngIf="loading" class="agenda-list">
        <app-skeleton type="card" height="140px" *ngFor="let i of [1,2,3]"></app-skeleton>
      </div>

      <div class="agenda-list" *ngIf="!loading && appointments.length > 0">
        <div class="event-card" *ngFor="let a of appointments">
          
          <div class="event-date-block">
            <span class="event-month">{{ a.appointmentDate | date:'MMM' }}</span>
            <span class="event-day">{{ a.appointmentDate | date:'dd' }}</span>
            <span class="event-time">{{ a.appointmentDate | date:'shortTime' }}</span>
          </div>
          
          <div class="event-details">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
              <h3 class="event-title">Consultation (Doc ID: {{ a.doctorId }})</h3>
              <span class="status-pill" 
                    [class.status-active]="a.status === 'ACTIVE' || a.status === 'SCHEDULED'"
                    [class.status-rejected]="a.status === 'CANCELLED' || a.status === 'EXPIRED'"
                    [class.status-requested]="a.status === 'REQUESTED'">
                {{ a.status }}
              </span>
            </div>
            
            <p class="event-reason"><strong>Reason:</strong> {{ a.reason }}</p>
            
            <div class="event-actions" *ngIf="a.meetingLink && (a.status === 'ACTIVE' || a.status === 'SCHEDULED')">
              <a [href]="a.meetingLink" target="_blank" class="btn primary" style="background: var(--success); border-color: var(--success);">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                Join Video Call
              </a>
            </div>
          </div>
          
        </div>
      </div>

      <app-empty-state 
        *ngIf="!loading && appointments.length === 0" 
        iconName="calendar" 
        title="Your Agenda is Empty" 
        message="You don't have any upcoming or past appointments." 
        theme="patient">
      </app-empty-state>
    </div>
  `,
  styles: [`
    .premium-input { width: 100%; padding: 12px 16px; border: 1px solid var(--line); border-radius: 8px; font-size: 14px; background: var(--bg); transition: all 0.2s; font-family: inherit; }
    .premium-input:focus { border-color: var(--accent-patient); outline: none; box-shadow: 0 0 0 3px rgba(16,185,129,0.1); }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .btn-large { padding: 10px 20px; font-size: 14px; border-radius: 8px; display: flex; align-items: center; }
    
    .agenda-list { display: flex; flex-direction: column; gap: 16px; }
    .event-card { background: var(--bg); border: 1px solid var(--line); border-radius: 12px; display: flex; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.02); transition: all 0.2s ease; }
    .event-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.06); border-color: var(--accent-patient); }
    
    .event-date-block { background: var(--bg-soft); padding: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-width: 120px; border-right: 1px solid var(--line); }
    .event-month { font-size: 13px; font-weight: 600; color: var(--accent-patient); text-transform: uppercase; letter-spacing: 1px; }
    .event-day { font-size: 32px; font-weight: 700; color: var(--ink); line-height: 1.1; margin: 4px 0; }
    .event-time { font-size: 13px; color: var(--ink-soft); }
    
    .event-details { padding: 24px; flex: 1; display: flex; flex-direction: column; }
    .event-title { margin: 0; font-size: 18px; font-weight: 600; color: var(--ink); }
    .event-reason { font-size: 15px; color: var(--ink); line-height: 1.5; margin: 0 0 16px 0; }
    
    .status-pill { padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .status-active { background: rgba(16, 185, 129, 0.1); color: var(--success); }
    .status-rejected { background: rgba(239, 68, 68, 0.1); color: var(--warn); }
    .status-requested { background: rgba(245, 158, 11, 0.1); color: #b45309; }
    
    .event-actions { margin-top: auto; padding-top: 16px; border-top: 1px solid var(--line); }
    
    .slide-down { animation: slideDown 0.3s ease-out; }
    @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class PatientAppointmentsComponent implements OnInit {
  icons = ICONS;
  appointments: Appointment[] = [];
  activeDoctors: DoctorListItem[] = [];
  showRequestForm = false;
  loading = true;
  
  req = { doctorId: '', requestedDate: '', reason: '' };

  constructor(private api: PatientApiService, private toast: ToastService) {}
  
  ngOnInit() { 
    this.loadAppointments();
    this.api.getActiveDoctors().subscribe(d => this.activeDoctors = d);
  }

  loadAppointments() {
    this.api.getAppointments().subscribe(a => {
      this.appointments = a;
      this.loading = false;
    });
  }

  submitRequest() {
    if (!this.req.doctorId || !this.req.requestedDate) {
      this.toast.showError('Please select a doctor and date.');
      return;
    }
    
    // Convert local datetime string to ISO
    const payload = {
      doctorId: Number(this.req.doctorId),
      requestedDate: new Date(this.req.requestedDate).toISOString(),
      reason: this.req.reason
    };

    this.api.requestAppointment(payload).subscribe({
      next: () => {
        this.toast.showSuccess('Appointment request submitted successfully!');
        this.showRequestForm = false;
        this.req = { doctorId: '', requestedDate: '', reason: '' };
        this.loadAppointments();
      },
      error: () => {
        // Handled by global interceptor
      }
    });
  }
}
