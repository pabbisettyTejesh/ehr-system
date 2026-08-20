import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="auth-bg">
      <!-- ═══════ FLOATING BACKGROUND OBJECTS ═══════ -->
      <div class="bg-objects">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
        
        <!-- Floating medical cross icon -->
        <div class="bg-icon obj-1" style="color:var(--patient);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z"/></svg>
        </div>

        <!-- Floating shield icon -->
        <div class="bg-icon obj-2" style="color:var(--admin);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
        </div>
        
        <!-- Floating broken file icon -->
        <div class="bg-icon obj-3" style="color:var(--warn);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="9.5" y1="12.5" x2="14.5" y2="17.5"/><line x1="14.5" y1="12.5" x2="9.5" y2="17.5"/></svg>
        </div>
        
        <div class="bg-ring obj-4" style="border-color: rgba(156,122,60,0.2);"></div>
        <div class="bg-ring obj-5" style="width: 250px; height: 250px; border-color: rgba(30,58,95,0.1);"></div>
      </div>

      <!-- ═══════ MAIN CARD ═══════ -->
      <div class="not-found-card">
        <div class="error-code">404</div>
        <h1 class="error-title">Page not found</h1>
        <p class="error-msg">The medical record, portal, or page you are looking for does not exist or you do not have permission to access it.</p>
        
        <div class="actions">
          <button (click)="goBack()" class="btn secondary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Go Back
          </button>
          <a routerLink="/" class="btn primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Return Home
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-bg {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      background: linear-gradient(160deg, #fdfcf8 0%, #f6f0e8 40%, #edf6f0 70%, #e8edf7 100%);
      padding: 40px 20px;
    }
    
    .bg-objects { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
    
    .orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.4; }
    .orb-1 { width: 500px; height: 500px; background: rgba(31,111,84,0.1); top: -100px; left: -100px; animation: orbDrift1 20s ease-in-out infinite; }
    .orb-2 { width: 600px; height: 600px; background: rgba(156,122,60,0.1); top: -50px; right: -200px; animation: orbDrift2 25s ease-in-out infinite; }
    .orb-3 { width: 400px; height: 400px; background: rgba(91,50,86,0.1); bottom: -100px; left: 20%; animation: orbDrift3 18s ease-in-out infinite; }
    
    .bg-icon { position: absolute; opacity: 0.2; }
    .bg-icon svg { width: 64px; height: 64px; }
    
    .bg-ring { position: absolute; width: 120px; height: 120px; border-radius: 50%; border: 2px solid; opacity: 0.5; }
    
    .obj-1 { top: 15%; left: 15%; animation: float1 15s ease-in-out infinite; }
    .obj-2 { bottom: 20%; right: 10%; animation: float2 18s ease-in-out infinite; }
    .obj-3 { top: 20%; right: 20%; animation: float3 12s ease-in-out infinite; }
    .obj-4 { top: 40%; left: 8%; animation: spin 40s linear infinite; }
    .obj-5 { bottom: 10%; left: 30%; animation: spin 50s linear infinite reverse; }
    
    @keyframes orbDrift1 { 0%,100%{transform:translate(0,0) scale(1);} 33%{transform:translate(60px,40px) scale(1.1);} 66%{transform:translate(-30px,70px) scale(0.9);} }
    @keyframes orbDrift2 { 0%,100%{transform:translate(0,0) scale(1);} 33%{transform:translate(-80px,50px) scale(1.05);} 66%{transform:translate(40px,-60px) scale(0.95);} }
    @keyframes orbDrift3 { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(50px,-40px) scale(1.08);} }
    
    @keyframes float1 { 0%,100%{transform:translate(0,0) rotate(0deg);} 25%{transform:translate(20px,-30px) rotate(5deg);} 50%{transform:translate(-15px,-40px) rotate(-3deg);} 75%{transform:translate(30px,-10px) rotate(6deg);} }
    @keyframes float2 { 0%,100%{transform:translate(0,0) rotate(0deg);} 33%{transform:translate(-30px,25px) rotate(-5deg);} 66%{transform:translate(20px,40px) rotate(4deg);} }
    @keyframes float3 { 0%,100%{transform:translate(0,0) rotate(0deg);} 50%{transform:translate(40px,-30px) rotate(10deg);} }
    @keyframes spin { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }

    .not-found-card {
      position: relative;
      z-index: 2;
      background: rgba(255,255,255,0.85);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(226,213,184,0.8);
      border-radius: 32px;
      padding: 64px 48px;
      text-align: center;
      max-width: 500px;
      width: 100%;
      box-shadow: 0 40px 80px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.6) inset;
    }
    
    .error-code {
      font-size: 80px;
      font-family: 'Fraunces', serif;
      font-weight: 700;
      line-height: 1;
      margin-bottom: 16px;
      background: linear-gradient(135deg, var(--patient) 0%, var(--gold) 50%, var(--doctor) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .error-title {
      font-size: 28px;
      margin: 0 0 16px;
      color: var(--ink);
    }
    
    .error-msg {
      font-size: 15px;
      color: var(--ink-soft);
      line-height: 1.6;
      margin: 0 0 32px;
    }
    
    .actions {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
    }
    
    .btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      font-size: 14px;
      border-radius: 12px;
      font-weight: 600;
    }
    
    .btn svg { width: 18px; height: 18px; }
    
    .btn.primary {
      background: var(--ink);
      color: white;
    }
    
    .btn.secondary {
      background: white;
      color: var(--ink);
      border: 1px solid var(--line);
    }
  `]
})
export class NotFoundComponent {
  goBack() {
    window.history.back();
  }
}
