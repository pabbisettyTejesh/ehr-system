import { Component, OnInit } from '@angular/core';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../core/services/admin.service';
import { Appointment } from '../../core/models/models';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-admin-manage-appointments',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe, FormsModule],
  template: `
    <div class="container" style="max-width: 1000px;">
      <div class="page-header" style="border-bottom: none; margin-bottom: 0;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <span class="icon-circle bg-accent-admin">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.listChecks | safeHtml"></svg>
          </span>
          <div>
            <span class="page-eyebrow">Admin Portal</span>
            <h1>Manage Appointments</h1>
          </div>
        </div>
      </div>
      
      <p style="font-size: 14px; color: var(--ink-soft); margin-bottom: 32px; padding-left: 56px;">
        Review appointment requests from patients, assign clinical access windows for doctors, and oversee the global schedule.
      </p>

      <!-- Pending Appointments -->
      <div class="card" style="padding: 0; overflow: hidden; border: 1px solid var(--line); border-radius: 12px; margin-bottom: 32px; box-shadow: 0 8px 24px rgba(245, 158, 11, 0.05);" *ngIf="pendingAppointments.length > 0">
        <div style="padding: 20px 24px; border-bottom: 1px solid var(--line); background: var(--warn-bg); display: flex; justify-content: space-between; align-items: center;">
          <h3 style="margin: 0; color: #b45309; display: flex; align-items: center; gap: 8px;">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            Action Required: Pending Requests
          </h3>
          <span style="background: white; color: #b45309; padding: 2px 10px; border-radius: 20px; font-size: 12px; font-weight: 600;">{{ pendingAppointments.length }} Pending</span>
        </div>
        
        <div style="overflow-x: auto;">
          <table class="premium-table">
            <thead>
              <tr>
                <th>Requested Schedule</th>
                <th>Patient & Doctor</th>
                <th>Chief Complaint</th>
                <th style="text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of pendingAppointments">
                <td>
                  <div style="display: flex; flex-direction: column;">
                    <strong style="color: var(--ink); font-size: 14px;">{{ p.appointmentDate | date:'mediumDate' }}</strong>
                    <span style="color: var(--ink-soft); font-size: 13px;">{{ p.appointmentDate | date:'shortTime' }}</span>
                  </div>
                </td>
                <td>
                  <div style="display: flex; flex-direction: column;">
                    <span style="font-size: 13px; color: var(--ink);">Patient ID: <strong>{{ p.patientId }}</strong></span>
                    <span style="font-size: 13px; color: var(--ink-soft);">Doctor ID: <strong>{{ p.doctorId }}</strong></span>
                  </div>
                </td>
                <td><p style="margin: 0; font-size: 13px; color: var(--ink); max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" [title]="p.reason">{{ p.reason }}</p></td>
                <td style="text-align: right;">
                  <div *ngIf="approvingId !== p.id" style="display: flex; gap: 8px; justify-content: flex-end;">
                    <button class="btn primary" (click)="startApprove(p)" style="padding: 6px 12px; font-size: 12px;">Approve</button>
                    <button class="btn danger outline" (click)="reject(p)" style="padding: 6px 12px; font-size: 12px;">Reject</button>
                  </div>
                  
                  <div *ngIf="approvingId === p.id" class="approval-form">
                    <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--ink-soft); text-align: left;">Set Clinical Access Window</span>
                    <div style="display: flex; gap: 8px;">
                      <input type="datetime-local" class="premium-input-sm" [(ngModel)]="approvePayload.accessStartTime" title="Access Start">
                      <input type="datetime-local" class="premium-input-sm" [(ngModel)]="approvePayload.accessEndTime" title="Access End">
                    </div>
                    <div style="display: flex; gap: 8px; justify-content: flex-end;">
                      <button class="btn primary" (click)="confirmApprove(p)" style="padding: 4px 10px; font-size: 12px;">Confirm</button>
                      <button class="btn secondary" (click)="approvingId = null" style="padding: 4px 10px; font-size: 12px;">Cancel</button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- All Appointments -->
      <div class="card" style="padding: 0; overflow: hidden; border: 1px solid var(--line); border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
        <div class="data-grid-toolbar">
          <h3 style="margin: 0; font-size: 16px; color: var(--ink);">All Appointments Schedule</h3>
        </div>

        <div style="overflow-x: auto;">
          <table class="premium-table" *ngIf="appointments.length > 0">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Patient & Doctor</th>
                <th>Status</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let a of appointments">
                <td>
                  <div style="display: flex; flex-direction: column;">
                    <strong style="color: var(--ink); font-size: 14px;">{{ a.appointmentDate | date:'mediumDate' }}</strong>
                    <span style="color: var(--ink-soft); font-size: 13px;">{{ a.appointmentDate | date:'shortTime' }}</span>
                  </div>
                </td>
                <td>
                  <div style="display: flex; flex-direction: column;">
                    <span style="font-size: 13px; color: var(--ink);">Patient ID: <strong>{{ a.patientId }}</strong></span>
                    <span style="font-size: 13px; color: var(--ink-soft);">Doctor ID: <strong>{{ a.doctorId }}</strong></span>
                  </div>
                </td>
                <td>
                  <span class="status-pill" 
                        [class.status-active]="a.status === 'ACTIVE' || a.status === 'SCHEDULED'"
                        [class.status-rejected]="a.status === 'CANCELLED' || a.status === 'EXPIRED'"
                        [class.status-requested]="a.status === 'REQUESTED'">
                    {{ a.status }}
                  </span>
                </td>
                <td style="text-align: right;">
                  <button class="btn danger outline" style="padding: 6px 12px; font-size: 12px;" *ngIf="a.status !== 'CANCELLED' && a.status !== 'REQUESTED'" (click)="cancel(a)">Cancel</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="empty-state" *ngIf="appointments.length === 0" style="padding: 64px 24px;">
          <img src="assets/illustrations/empty-state.svg" alt="No appointments yet." loading="lazy" style="max-width: 200px; opacity: 0.8; margin-bottom: 16px;">
          <p style="color: var(--ink-soft); font-size: 15px; margin: 0;">No appointments found in the system.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .data-grid-toolbar { padding: 16px 24px; border-bottom: 1px solid var(--line); display: flex; justify-content: space-between; align-items: center; background: var(--bg-soft); }
    
    .premium-table { width: 100%; border-collapse: collapse; }
    .premium-table th { text-align: left; padding: 12px 24px; font-size: 12px; font-weight: 600; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid var(--line); background: var(--bg); }
    .premium-table td { padding: 16px 24px; border-bottom: 1px solid var(--line); vertical-align: middle; }
    .premium-table tbody tr { transition: 0.2s; background: var(--bg); }
    .premium-table tbody tr:hover { background: var(--bg-soft); }
    
    .approval-form { display: flex; flex-direction: column; gap: 8px; background: var(--bg); border: 1px solid var(--line); padding: 12px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .premium-input-sm { padding: 6px 10px; border: 1px solid var(--line); border-radius: 6px; font-size: 12px; font-family: inherit; }
    .premium-input-sm:focus { outline: none; border-color: var(--accent-admin); }
    
    .status-pill { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; }
    .status-active { background: rgba(16, 185, 129, 0.1); color: var(--success); }
    .status-rejected { background: rgba(239, 68, 68, 0.1); color: var(--warn); }
    .status-requested { background: rgba(245, 158, 11, 0.1); color: #b45309; }
  `]
})
export class AdminManageAppointmentsComponent implements OnInit {
  icons = ICONS;
  appointments: Appointment[] = [];
  pendingAppointments: Appointment[] = [];
  
  approvingId: number | null = null;
  approvePayload = { accessStartTime: '', accessEndTime: '' };

  constructor(private api: AdminApiService, private toast: ToastService) {}
  
  ngOnInit() { this.load(); }
  
  load() { 
    this.api.getAllAppointments().subscribe(a => this.appointments = a);
    this.api.getPendingAppointments().subscribe(p => this.pendingAppointments = p);
  }
  
  cancel(a: Appointment) { this.api.cancelAppointment(a.id).subscribe(() => this.load()); }

  startApprove(p: Appointment) {
    this.approvingId = p.id;
    // Default to the requested date, valid for 30 days
    const start = new Date(p.appointmentDate);
    const end = new Date(start);
    end.setDate(end.getDate() + 30);
    
    // Format to YYYY-MM-DDTHH:mm for datetime-local input
    this.approvePayload = {
      accessStartTime: start.toISOString().slice(0, 16),
      accessEndTime: end.toISOString().slice(0, 16)
    };
  }

  confirmApprove(p: Appointment) {
    if (!this.approvePayload.accessStartTime || !this.approvePayload.accessEndTime) {
      this.toast.showError('Please set both start and end times for access.');
      return;
    }
    const body = {
      accessStartTime: new Date(this.approvePayload.accessStartTime).toISOString(),
      accessEndTime: new Date(this.approvePayload.accessEndTime).toISOString()
    };
    this.api.approveAppointment(p.id, body).subscribe({
      next: () => {
        this.toast.showSuccess('Appointment approved and scheduled.');
        this.approvingId = null;
        this.load();
      }
    });
  }

  reject(p: Appointment) {
    if (confirm('Are you sure you want to reject this request?')) {
      this.api.rejectAppointment(p.id).subscribe({
        next: () => {
          this.toast.showInfo('Appointment request rejected.');
          this.load();
        }
      });
    }
  }
}
