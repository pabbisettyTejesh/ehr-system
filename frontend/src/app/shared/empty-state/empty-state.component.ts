import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ICONS } from '../icons';
import { SafeHtmlPipe } from '../safe-html.pipe';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, RouterLink, SafeHtmlPipe],
  template: `
    <div class="empty-state-wrap">
      <div class="empty-icon-wrap" [ngClass]="theme">
        <!-- Floating shapes behind icon -->
        <div class="empty-shape shape-1"></div>
        <div class="empty-shape shape-2"></div>
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons[iconName] | safeHtml"></svg>
        </div>
      </div>
      
      <h3 class="empty-title">{{ title }}</h3>
      <p class="empty-message">{{ message }}</p>
      
      <a *ngIf="ctaRoute" [routerLink]="ctaRoute" class="btn empty-cta" [ngClass]="'bg-' + theme">
        {{ ctaLabel }}
      </a>
    </div>
  `,
  styles: [`
    .empty-state-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px 24px;
      text-align: center;
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: var(--radius-lg);
      margin: 24px 0;
    }

    .empty-icon-wrap {
      position: relative;
      width: 100px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
    }

    .empty-icon {
      position: relative;
      z-index: 2;
      width: 56px;
      height: 56px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--surface);
      box-shadow: 0 12px 32px rgba(0,0,0,0.08);
    }
    
    .empty-icon svg {
      width: 28px;
      height: 28px;
    }

    .empty-shape {
      position: absolute;
      border-radius: 50%;
      z-index: 1;
    }

    .shape-1 {
      width: 80px;
      height: 80px;
      top: 0;
      left: 0;
      opacity: 0.15;
      animation: floatShape 8s ease-in-out infinite;
    }

    .shape-2 {
      width: 60px;
      height: 60px;
      bottom: 0;
      right: -10px;
      opacity: 0.1;
      animation: floatShape 6s ease-in-out infinite reverse;
    }

    @keyframes floatShape {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-10px) scale(1.05); }
    }

    .empty-title {
      font-size: 20px;
      margin: 0 0 8px;
      color: var(--ink);
      font-family: 'Fraunces', serif;
    }

    .empty-message {
      font-size: 14px;
      color: var(--ink-soft);
      max-width: 320px;
      line-height: 1.5;
      margin: 0 0 24px;
    }

    .empty-cta {
      padding: 10px 20px;
      font-size: 13px;
      border-radius: 10px;
      color: white;
    }

    /* Themes */
    .patient .empty-icon { color: var(--patient); }
    .patient .shape-1, .patient .shape-2 { background: var(--patient); }
    
    .doctor .empty-icon { color: var(--doctor); }
    .doctor .shape-1, .doctor .shape-2 { background: var(--doctor); }
    
    .admin .empty-icon { color: var(--admin); }
    .admin .shape-1, .admin .shape-2 { background: var(--admin); }
    
    .default .empty-icon { color: var(--ink-soft); }
    .default .shape-1, .default .shape-2 { background: var(--ink-soft); }

    .bg-patient { background: var(--patient); }
    .bg-doctor { background: var(--doctor); }
    .bg-admin { background: var(--admin); }
    .bg-default { background: var(--ink); }
  `]
})
export class EmptyStateComponent {
  icons = ICONS;
  
  @Input() iconName: string = 'fileText';
  @Input() title: string = 'No Data Found';
  @Input() message: string = 'There is currently no data to display in this section.';
  @Input() theme: 'patient' | 'doctor' | 'admin' | 'default' = 'default';
  
  @Input() ctaLabel?: string;
  @Input() ctaRoute?: string;
}
