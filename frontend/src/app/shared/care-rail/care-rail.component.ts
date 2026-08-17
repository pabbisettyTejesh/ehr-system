import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule],
  template: `
    <div class="rail" *ngIf="items.length; else empty">
      <div class="rail-item" *ngFor="let item of items">
        <span class="rail-dot" [class]="item.type"></span>
        <div class="rail-date">{{ item.date | date:'d MMM, y' }}</div>
        <div class="rail-title">{{ item.title }}</div>
        <div class="rail-detail">{{ item.detail }}</div>
        <span class="rail-tag" [class]="item.type">{{ item.tagLabel }}</span>
      </div>
    </div>
    <ng-template #empty>
      <p class="rail-empty">Nothing recorded yet.</p>
    </ng-template>
  `
})
export class CareRailComponent {
  @Input() items: RailItem[] = [];
}

export function tagLabelFor(type: RailEventType): string {
  return TAG_LABEL[type];
}
