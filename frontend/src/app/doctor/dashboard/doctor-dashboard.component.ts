import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ICONS } from '../../shared/icons';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { CareRailComponent, RailItem } from '../../shared/care-rail/care-rail.component';
import { DoctorApiService } from '../../core/services/doctor.service';
import { AppointedPatient, EncounterSummary } from '../../core/models/models';
import { SkeletonComponent } from '../../shared/skeleton/skeleton.component';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, SafeHtmlPipe, CareRailComponent, SkeletonComponent],
  template: `
    <div class="container">
      <div class="dash-hero">
        <div>
          <span class="page-eyebrow">Doctor portal</span>
          <h1>Your practice, today</h1>
          <p style="color:var(--ink-soft);">Appointed patients, encounters, and clinical records.</p>
        </div>
        <img src="assets/illustrations/doctor-dashboard.svg" alt="Doctor reviewing appointed patients at a clinical workspace" width="420" height="300" loading="eager">
      </div>

      <!-- Skeleton Loading for Stats -->
      <div class="stat-row" *ngIf="!loaded">
        <div class="stat-tile" *ngFor="let i of [1,2,3]" style="padding: 0; border: none; background: transparent;">
          <app-skeleton type="card" height="136px" style="width: 100%;"></app-skeleton>
        </div>
      </div>

      <div class="stat-row" *ngIf="loaded">
        <div class="stat-tile">
          <div class="stat-top">
            <span class="stat-label">Appointed patients</span>
            <span class="stat-icon-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.users | safeHtml"></svg></span>
          </div>
          <div class="stat-num">{{ patients.length }}</div>
          <div class="stat-sub">currently linked to you</div>
        </div>
        <div class="stat-tile">
          <div class="stat-top">
            <span class="stat-label">Encounters today</span>
            <span class="stat-icon-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.clipboardList | safeHtml"></svg></span>
          </div>
          <div class="stat-num">{{ encountersToday }}</div>
          <div class="stat-sub">logged today</div>
        </div>
        <div class="stat-tile">
          <div class="stat-top">
            <span class="stat-label">Total encounters</span>
            <span class="stat-icon-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.notebookText | safeHtml"></svg></span>
          </div>
          <div class="stat-num">{{ encounters.length }}</div>
          <div class="stat-sub">across all patients</div>
        </div>
      </div>

      <div class="dash-split">
        <div>
          <div class="panel-title"><h3>Care Rail</h3><span class="mono">recent encounters</span></div>
          <app-care-rail [items]="railItems"></app-care-rail>
        </div>
        <div>
          <div class="panel-title"><h3>Quick actions</h3></div>
          <div class="qa-list">
            <a class="qa-item" routerLink="/doctor/search-patient">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.search | safeHtml"></svg>
              Search patient
            </a>
            <a class="qa-item" routerLink="/doctor/create-encounter">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.clipboardList | safeHtml"></svg>
              Create encounter
            </a>
            <a class="qa-item" routerLink="/doctor/prescription">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.pill | safeHtml"></svg>
              Create prescription
            </a>
          </div>
          <div class="mini-emergency">
            <strong>Need out-of-scope access?</strong>
            <p>Emergency mode returns critical-only data by Patient UID. A reason is mandatory and every access is logged.</p>
          </div>
        </div>
      </div>

      <div class="dash-split" style="margin-top: 28px;">
        <!-- Today's Agenda -->
        <div class="card" style="padding: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--line); padding-bottom: 12px; margin-bottom: 16px;">
            <h3 style="margin: 0; display: flex; align-items: center; gap: 8px;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px; color: var(--accent-doctor);" [innerHTML]="icons.calendar | safeHtml"></svg>
              Today's Agenda
            </h3>
            <span class="badge" style="background: var(--bg-soft);">{{ todayAgenda.length }} Scheduled</span>
          </div>
          
          <div *ngIf="todayAgenda.length > 0" style="display: flex; flex-direction: column; gap: 12px;">
            <div *ngFor="let apt of todayAgenda" style="padding: 12px; border-radius: 8px; border: 1px solid var(--line); background: var(--bg); display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong style="display: block; font-size: 15px;">{{ apt.patientName }}</strong>
                <span style="font-size: 13px; color: var(--ink-soft);">{{ apt.appointmentDate | date:'shortTime' }} · {{ apt.status }}</span>
              </div>
              <a [routerLink]="['/doctor/patient-summary', apt.patientId]" class="btn primary" style="padding: 4px 12px; font-size: 13px;">Enter Session</a>
            </div>
          </div>
          <p *ngIf="todayAgenda.length === 0" style="color: var(--ink-soft); font-size: 14px; text-align: center; padding: 24px 0;">No appointments scheduled for today.</p>
        </div>

        <!-- Priority Inbox -->
        <div class="card" style="padding: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--line); padding-bottom: 12px; margin-bottom: 16px;">
            <h3 style="margin: 0; display: flex; align-items: center; gap: 8px;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px; color: var(--warn);" [innerHTML]="icons.bell | safeHtml"></svg>
              Priority Inbox
            </h3>
          </div>
          
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div *ngFor="let p of priorityPatients" style="padding: 12px; border-radius: 8px; background: var(--bg-soft); display: flex; align-items: flex-start; gap: 12px;">
              <span class="icon-circle" style="background: #fff; width: 32px; height: 32px;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px; color: var(--warn);" [innerHTML]="icons.info | safeHtml"></svg>
              </span>
              <div>
                <strong style="font-size: 14px;">{{ p.patientName }}</strong>
                <p style="margin: 4px 0 0; font-size: 13px; color: var(--ink-soft);">Newly assigned patient awaiting initial consultation.</p>
                <a [routerLink]="['/doctor/patient-summary', p.patientId]" style="font-size: 13px; color: var(--accent-doctor); text-decoration: none; font-weight: 500; display: inline-block; margin-top: 8px;">View Patient &rarr;</a>
              </div>
            </div>
            
            <p *ngIf="priorityPatients.length === 0" style="color: var(--ink-soft); font-size: 14px; text-align: center; padding: 24px 0;">Inbox is clear.</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DoctorDashboardComponent implements OnInit {
  icons = ICONS;
  loaded = false;
  patients: AppointedPatient[] = [];
  encounters: EncounterSummary[] = [];
  encountersToday = 0;
  railItems: RailItem[] = [];
  todayAgenda: AppointedPatient[] = [];
  priorityPatients: AppointedPatient[] = [];

  constructor(private api: DoctorApiService) {}

  ngOnInit() {
    forkJoin({
      patients: this.api.getMyPatientsDetailed(),
      encounters: this.api.getMyEncountersDetailed()
    }).subscribe(({ patients, encounters }) => {
      this.patients = patients;
      this.encounters = encounters;

      const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0);
      this.encountersToday = encounters.filter(e => new Date(e.visitDate).getTime() >= startOfToday.getTime()).length;

      this.todayAgenda = patients.filter(p => new Date(p.appointmentDate).getTime() >= startOfToday.getTime());
      // For priority, just simulate by taking first 2 active patients for demo purposes
      this.priorityPatients = patients.filter(p => p.status === 'ACTIVE').slice(0, 2);

      this.railItems = [...encounters]
        .sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime())
        .slice(0, 8)
        .map(e => ({
          date: e.visitDate,
          type: 'encounter' as const,
          tagLabel: 'Encounter',
          title: `${e.patientName} · ${e.visitType}`,
          detail: e.chiefComplaint || e.hospitalName
        }));

      this.loaded = true;
    });
  }
}
