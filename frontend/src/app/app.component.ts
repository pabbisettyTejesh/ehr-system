import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, SidebarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="app-body">
      <app-sidebar *ngIf="auth.isLoggedIn"></app-sidebar>
      <div class="main-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class AppComponent {
  constructor(public auth: AuthService) {}

  /**
   * A single delegated click listener gives every .btn in the app a
   * soft ripple from the click point, with no per-button directive
   * or template change needed anywhere.
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent) {
    const target = (e.target as HTMLElement)?.closest?.('.btn') as HTMLElement | null;
    if (!target) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const span = document.createElement('span');
    span.className = 'ripple-dot';
    span.style.width = span.style.height = `${size}px`;
    span.style.left = `${e.clientX - rect.left - size / 2}px`;
    span.style.top = `${e.clientY - rect.top - size / 2}px`;
    span.addEventListener('animationend', () => span.remove());
    target.appendChild(span);
  }
}
