import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container [ngSwitch]="type">
      <!-- Card Skeleton -->
      <div *ngSwitchCase="'card'" class="skeleton-card" [style.height]="height">
        <div class="skel-header">
          <div class="skeleton-avatar"></div>
          <div class="skel-lines">
            <div class="skeleton-block w-40"></div>
            <div class="skeleton-block w-20"></div>
          </div>
        </div>
        <div class="skeleton-block mt-3"></div>
        <div class="skeleton-block w-80 mt-2"></div>
      </div>

      <!-- Avatar Skeleton -->
      <div *ngSwitchCase="'avatar'" class="skeleton-avatar" [style.width]="width" [style.height]="height"></div>

      <!-- Row Skeleton -->
      <div *ngSwitchCase="'row'" class="skeleton-row">
        <div class="skeleton-avatar-sm"></div>
        <div class="skel-lines w-full">
          <div class="skeleton-block w-30"></div>
          <div class="skeleton-block w-60 mt-1"></div>
        </div>
      </div>

      <!-- Default Block -->
      <span *ngSwitchDefault class="skeleton-block" [style.width]="width" [style.height]="height" [style.borderRadius]="radius"></span>
    </ng-container>
  `,
  styles: [`
    .skeleton-block {
      display: block;
      background: var(--bg-soft);
      border-radius: var(--radius-sm);
      position: relative;
      overflow: hidden;
      min-height: 14px;
    }
    
    .skeleton-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: var(--bg-soft);
      position: relative;
      overflow: hidden;
      flex-shrink: 0;
    }

    .skeleton-avatar-sm {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--bg-soft);
      position: relative;
      overflow: hidden;
      flex-shrink: 0;
    }

    .skeleton-card {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: var(--radius-lg);
      padding: 24px;
      display: flex;
      flex-direction: column;
    }

    .skel-header {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .skel-lines {
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex: 1;
    }

    .skeleton-row {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: var(--radius);
    }

    .w-20 { width: 20%; }
    .w-30 { width: 30%; }
    .w-40 { width: 40%; }
    .w-60 { width: 60%; }
    .w-80 { width: 80%; }
    .w-full { width: 100%; }
    .mt-1 { margin-top: 4px; }
    .mt-2 { margin-top: 8px; }
    .mt-3 { margin-top: 12px; }

    /* Shimmer effect for all skeleton components */
    .skeleton-block::after,
    .skeleton-avatar::after,
    .skeleton-avatar-sm::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      transform: translateX(-100%);
      background-image: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0,
        rgba(255, 255, 255, 0.4) 20%,
        rgba(255, 255, 255, 0.6) 60%,
        rgba(255, 255, 255, 0)
      );
      animation: shimmer 1.5s infinite;
    }

    @keyframes shimmer {
      100% {
        transform: translateX(100%);
      }
    }
  `]
})
export class SkeletonComponent {
  @Input() type: 'block' | 'card' | 'avatar' | 'row' = 'block';
  @Input() width = '100%';
  @Input() height = '14px';
  @Input() radius = '4px';
}
