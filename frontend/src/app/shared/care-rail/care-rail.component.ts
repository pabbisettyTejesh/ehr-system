import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from '../safe-html.pipe';
import { ICONS } from '../icons';

export type RailEventType = 'encounter' | 'prescription' | 'report' | 'allergy' | 'access';

export interface RailItem {
  date: string | Date;
  title: string;
  detail: string;
  type: RailEventType;
  tagLabel: string;
}

const TAG_LABEL: Record<RailEventType, string> = {
  encounter: 'Encounter',
  prescription: 'Prescription',
  report: 'Report',
  allergy: 'Allergy',
  access: 'Access log'
};

/**
 * A unified chronological rail for blended event streams — encounters,
 * prescriptions, reports, allergies, access logs — color-coded by type
 * so the same visual language reads consistently wherever it's used
 * (dashboards, Medical History, Access Logs).
 */
@Component({
  selector: 'app-care-rail',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  template: `
    <div class="rail" *ngIf="items.length; else empty">
      <div class="rail-item" *ngFor="let item of items">
        <div class="rail-card">
          <div class="rail-icon-box" [class]="item.type">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" [innerHTML]="getIcon(item.type) | safeHtml"></svg>
          </div>
          <div class="rail-content">
            <div class="rail-header">
              <span class="rail-title">{{ item.title }}</span>
              <span class="rail-date">{{ item.date | date:'d MMM, y' }}</span>
            </div>
            <div class="rail-detail">{{ item.detail }}</div>
            <span class="rail-tag" [class]="item.type">{{ item.tagLabel }}</span>
          </div>
        </div>
      </div>
    </div>
    <ng-template #empty>
      <p class="rail-empty">Nothing recorded yet.</p>
    </ng-template>
  `
})
export class CareRailComponent {
  @Input() items: RailItem[] = [];

  getIcon(type: RailEventType): string {
    switch (type) {
      case 'encounter': return ICONS['stethoscope'];
      case 'prescription': return ICONS['pill'];
      case 'report': return ICONS['fileText'];
      case 'allergy': return ICONS['alertTriangle'];
      case 'access': return ICONS['shieldCheck'];
      default: return ICONS['activity'];
    }
  }
}

export function tagLabelFor(type: RailEventType): string {
  return TAG_LABEL[type];
}
