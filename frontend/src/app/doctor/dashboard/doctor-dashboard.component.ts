import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ICONS } from '../../shared/icons';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { CareRailComponent, RailItem } from '../../shared/care-rail/care-rail.component';
import { DoctorApiService } from '../../core/services/doctor.service';
import { AppointedPatient, EncounterSummary } from '../../core/models/models';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, SafeHtmlPipe, CareRailComponent],
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

      <div class="dash-grid" style="margin-top:28px;">
        <a class="card" routerLink="/doctor/patients">
          <h3>
            <span class="icon-circle bg-accent-doctor">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.users | safeHtml"></svg>
            </span>
            My Appointed Patients
          </h3>
          <p>Patients linked to you via appointment</p>
        </a>

        <a class="card" routerLink="/doctor/search-patient">
          <h3>
            <span class="icon-circle bg-accent-doctor">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.search | safeHtml"></svg>
            </span>
            Search Patient
          </h3>
          <p>Search by Patient UID (limited view)</p>
        </a>

        <a class="card" routerLink="/doctor/create-encounter">
          <h3>
            <span class="icon-circle bg-accent-doctor">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.clipboardList | safeHtml"></svg>
            </span>
            Create Encounter
          </h3>
          <p>Log a new consultation or visit</p>
        </a>

        <a class="card" routerLink="/doctor/medical-record">
          <h3>
            <span class="icon-circle bg-accent-doctor">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.notebookText | safeHtml"></svg>
            </span>
            Add Medical Record
          </h3>
          <p>Diagnosis, symptoms, clinical notes</p>
        </a>

        <a class="card" routerLink="/doctor/prescription">
          <h3>
            <span class="icon-circle bg-accent-doctor">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.pill | safeHtml"></svg>
            </span>
            Create Prescription
          </h3>
          <p>Add medicines for an encounter</p>
        </a>

        <a class="card" routerLink="/doctor/allergies">
          <h3>
            <span class="icon-circle bg-accent-doctor">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.triangleAlert | safeHtml"></svg>
            </span>
            Manage Allergies
          </h3>
          <p>Add or update allergy records</p>
        </a>

        <a class="card" routerLink="/doctor/reports">
          <h3>
            <span class="icon-circle bg-accent-doctor">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.scrollText | safeHtml"></svg>
            </span>
            Reports
          </h3>
          <p>Add report metadata</p>
        </a>

        <a class="card emergency-card" routerLink="/doctor/emergency-access">
          <h3>
            <span class="icon-circle" style="background:#fff;color:var(--critical);">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.siren | safeHtml"></svg>
            </span>
            Emergency Access
          </h3>
          <p style="color:#5c1a24;">Critical, read-only data by Patient UID</p>
        </a>
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
