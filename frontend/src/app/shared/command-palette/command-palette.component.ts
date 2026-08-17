import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DoctorApiService } from '../../core/services/doctor.service';
import { AppointedPatient } from '../../core/models/models';
import { ICONS } from '../icons';
import { SafeHtmlPipe } from '../safe-html.pipe';

/**
 * Doctor-only ⌘K / Ctrl+K patient lookup. Fuzzy-filters the doctor's
 * already-appointed patients (fetched once, cached) instead of a page
 * navigation — the "Search Patient" page still exists for out-of-list
 * UID lookups.
 */
@Component({
  selector: 'app-command-palette',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeHtmlPipe],
  template: `
    <button type="button" class="cmdk-trigger" *ngIf="auth.role === 'DOCTOR'" (click)="open()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.search | safeHtml"></svg>
      <span>Find patient</span>
      <kbd>{{ modKey }}K</kbd>
    </button>

    <div class="cmdk-overlay" *ngIf="isOpen" (click)="close()">
      <div class="cmdk" (click)="$event.stopPropagation()">
        <div class="cmdk-input">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.search | safeHtml"></svg>
          <input #queryInput [(ngModel)]="query" (ngModelChange)="onQueryChange()" (keydown)="onKeydown($event)"
                 placeholder="Search your patients by name or UID…" autocomplete="off">
        </div>
        <div class="cmdk-results" *ngIf="filtered.length; else noResults">
          <div class="cmdk-row" *ngFor="let p of filtered; let i = index"
               [class.sel]="i === selectedIndex"
               (mouseenter)="selectedIndex = i"
               (click)="go(p)">
            <div class="cmdk-row-left">
              <div class="cmdk-avatar">{{ initials(p.patientName) }}</div>
              <div>
                <div class="cmdk-name">{{ p.patientName }}</div>
                <div class="cmdk-meta">Access until {{ p.accessEndTime | date:'d MMM, y' }}</div>
              </div>
            </div>
            <span class="cmdk-uid">{{ p.patientUid }}</span>
          </div>
        </div>
        <ng-template #noResults>
          <div class="cmdk-empty">
            {{ !dataLoaded ? 'Loading your patients…' : (query ? 'No appointed patients match “' + query + '”.' : 'You have no appointed patients yet.') }}
          </div>
        </ng-template>
        <div class="cmdk-hint">
          <span><kbd>&#8593;</kbd><kbd>&#8595;</kbd> navigate</span>
          <span><kbd>&#8626;</kbd> open record</span>
          <span><kbd>esc</kbd> close</span>
        </div>
      </div>
    </div>
  `
})
export class CommandPaletteComponent {
  @ViewChild('queryInput') queryInput?: ElementRef<HTMLInputElement>;

  icons = ICONS;
  isOpen = false;
  query = '';
  selectedIndex = 0;
  patients: AppointedPatient[] = [];
  filtered: AppointedPatient[] = [];
  dataLoaded = false;
  private fetchStarted = false;
  readonly modKey = navigator.platform?.toLowerCase().includes('mac') ? '⌘' : 'Ctrl+';

  constructor(public auth: AuthService, private doctorApi: DoctorApiService, private router: Router) {}

  @HostListener('document:keydown', ['$event'])
  onGlobalKeydown(e: KeyboardEvent) {
    if (this.auth.role !== 'DOCTOR') return;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      this.isOpen ? this.close() : this.open();
    } else if (e.key === 'Escape' && this.isOpen) {
      this.close();
    }
  }

  open() {
    this.isOpen = true;
    this.selectedIndex = 0;
    if (!this.fetchStarted) {
      this.fetchStarted = true;
      this.doctorApi.getMyPatientsDetailed().subscribe(p => {
        this.patients = p;
        this.dataLoaded = true;
        this.onQueryChange();
      });
    } else {
      this.onQueryChange();
    }
    setTimeout(() => this.queryInput?.nativeElement.focus(), 0);
  }

  close() {
    this.isOpen = false;
    this.query = '';
  }

  onQueryChange() {
    const q = this.query.trim().toLowerCase();
    this.filtered = !q
      ? this.patients
      : this.patients.filter(p =>
          p.patientName.toLowerCase().includes(q) || p.patientUid.toLowerCase().includes(q));
    this.selectedIndex = 0;
  }

  onKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.selectedIndex = Math.min(this.selectedIndex + 1, this.filtered.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const p = this.filtered[this.selectedIndex];
      if (p) this.go(p);
    }
  }

  go(p: AppointedPatient) {
    this.close();
    this.router.navigate(['/doctor/patient-summary', p.patientId]);
  }

  initials(name: string): string {
    return name.split(' ').filter(Boolean).slice(0, 2).map(s => s[0]?.toUpperCase()).join('');
  }
}
