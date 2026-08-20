import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let toast of toastService.toasts()" 
           class="toast-card" 
           [ngClass]="toast.type"
           (click)="toastService.remove(toast.id)">
        <div class="toast-icon">
          <svg *ngIf="toast.type === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          <svg *ngIf="toast.type === 'error'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <svg *ngIf="toast.type === 'info'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        </div>
        <div class="toast-message">{{ toast.message }}</div>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      pointer-events: none;
    }
    .toast-card {
      pointer-events: auto;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      padding: 14px 18px;
      min-width: 300px;
      max-width: 400px;
      box-shadow: var(--shadow-hover);
      cursor: pointer;
      animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      transition: all 0.2s ease;
    }
    .toast-card:hover {
      transform: translateY(-2px);
    }
    .toast-icon svg {
      width: 20px;
      height: 20px;
      margin-top: 2px;
    }
    .toast-message {
      font-size: 0.95rem;
      line-height: 1.4;
      color: var(--ink);
    }
    /* Variants */
    .success { border-left: 4px solid var(--patient); }
    .success .toast-icon { color: var(--patient); }
    .error { border-left: 4px solid var(--critical); }
    .error .toast-icon { color: var(--critical); }
    .info { border-left: 4px solid var(--doctor); }
    .info .toast-icon { color: var(--doctor); }

    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
