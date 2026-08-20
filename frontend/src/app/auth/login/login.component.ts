import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-bg">

      <!-- ═══════ FLOATING BACKGROUND OBJECTS ═══════ -->
      <div class="bg-objects">
        <!-- Floating mini record card -->
        <div class="bg-card obj-1">
          <div class="bc-dot" style="background:var(--patient)"></div>
          <div class="bc-lines">
            <div class="bc-line long"></div>
            <div class="bc-line medium"></div>
          </div>
        </div>

        <!-- Floating shield icon -->
        <div class="bg-icon obj-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
        </div>

        <!-- Floating pill icon -->
        <div class="bg-icon obj-3" style="color: var(--gold);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
        </div>

        <!-- Floating waveform card -->
        <div class="bg-card obj-4">
          <div class="bc-waveform">
            <svg viewBox="0 0 60 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--patient)"><path d="M0 10 L8 10 L11 3 L14 17 L17 7 L20 13 L23 10 L60 10"/></svg>
          </div>
          <div class="bc-label">ECG Normal</div>
        </div>

        <!-- Floating user ring -->
        <div class="bg-ring obj-5" style="border-color: rgba(31,111,84,0.2);"></div>

        <!-- Floating file icon -->
        <div class="bg-icon obj-6" style="color: var(--doctor);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8l6 6v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
        </div>

        <!-- Floating access badge -->
        <div class="bg-badge obj-7">
          <div class="bb-dot" style="background:var(--success)"></div>
          Access Granted
        </div>

        <!-- Floating large ring -->
        <div class="bg-ring obj-8" style="width:300px;height:300px; border-color: rgba(156,122,60,0.1);"></div>

        <!-- Floating stethoscope -->
        <div class="bg-icon obj-9" style="color: rgba(30,58,95,0.3);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 2v2"/><path d="M5 2v2"/><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"/><path d="M8 15a6 6 0 0 0 12 0v-3"/><circle cx="20" cy="10" r="2"/></svg>
        </div>

        <!-- Floating mini log card -->
        <div class="bg-card obj-10">
          <div class="bc-dot" style="background:var(--gold)"></div>
          <div class="bc-lines">
            <div class="bc-line medium"></div>
            <div class="bc-line short"></div>
          </div>
        </div>

        <!-- Floating activity icon -->
        <div class="bg-icon obj-11" style="color: rgba(31,111,84,0.25);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg>
        </div>

        <!-- Floating UID chip -->
        <div class="bg-badge obj-12" style="color:var(--doctor);">
          <div class="bb-dot" style="background:var(--doctor)"></div>
          PT-2024-001
        </div>

        <!-- Floating large ring 2 -->
        <div class="bg-ring obj-13" style="width:200px;height:200px; border-color: rgba(30,58,95,0.08);"></div>
      </div>

      <!-- ═══════ MAIN CARD ═══════ -->
      <div class="login-card">
        <div class="card-brand">
          <div class="card-brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg>
          </div>
          <span>EHR<strong>System</strong></span>
        </div>
        <h2>Welcome back</h2>
        <p class="card-sub">Sign in to your portal to continue</p>
        <form (ngSubmit)="submit()">
          <div class="form-group">
            <label>Email address</label>
            <input type="email" [(ngModel)]="email" name="email" required autofocus placeholder="you@example.com">
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="password" name="password" required placeholder="••••••••">
          </div>
          <div class="error-text" *ngIf="error">{{ error }}</div>
          <button class="btn sign-btn" type="submit" [disabled]="loading">
            {{ loading ? 'Signing in…' : 'Sign in →' }}
          </button>
        </form>
        <div class="card-divider"><span>new here?</span></div>
        <div class="card-links">
          <a routerLink="/register/patient">Register as Patient</a>
          <span>·</span>
          <a routerLink="/register/doctor">Register as Doctor</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-bg {
      position: relative; min-height: 100vh;
      display: flex; align-items: center; justify-content: center;
      overflow: hidden;
      background: transparent;
    }

    /* ─── Floating background objects ─── */
    .bg-objects { position: absolute; inset: 0; pointer-events: none; z-index: 0; }

    .bg-card {
      position: absolute;
      background: rgba(255,255,255,0.55);
      border: 1px solid rgba(226,213,184,0.5);
      border-radius: 14px;
      padding: 14px 16px;
      display: flex; align-items: center; gap: 10px;
      backdrop-filter: blur(6px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.04);
    }
    .bc-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .bc-lines { display: flex; flex-direction: column; gap: 6px; }
    .bc-line { height: 6px; border-radius: 4px; background: var(--line); }
    .bc-line.long { width: 80px; }
    .bc-line.medium { width: 56px; }
    .bc-line.short { width: 36px; }
    .bc-waveform { display: flex; align-items: center; }
    .bc-waveform svg { width: 60px; height: 20px; }
    .bc-label { font-size: 10px; font-weight: 700; color: var(--patient); letter-spacing: 0.06em; }

    .bg-icon {
      position: absolute;
      color: rgba(31,111,84,0.2);
    }
    .bg-icon svg { width: 48px; height: 48px; }

    .bg-ring {
      position: absolute;
      width: 160px; height: 160px;
      border-radius: 50%;
      border: 1.5px solid;
    }

    .bg-badge {
      position: absolute;
      background: rgba(255,255,255,0.6);
      border: 1px solid rgba(226,213,184,0.5);
      border-radius: 20px;
      padding: 8px 14px;
      font-size: 11px; font-weight: 700;
      display: flex; align-items: center; gap: 6px;
      color: var(--patient);
      backdrop-filter: blur(6px);
    }
    .bb-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

    /* ─── Object positions & animations ─── */
    .obj-1  { top: 8%; left: 5%; animation: float1 14s ease-in-out infinite; }
    .obj-2  { top: 15%; right: 8%; animation: float2 18s ease-in-out infinite; }
    .obj-3  { top: 60%; left: 3%; animation: float3 12s ease-in-out infinite; }
    .obj-4  { bottom: 20%; right: 6%; animation: float1 16s ease-in-out infinite 2s; }
    .obj-5  { top: 40%; right: 2%; animation: spin 40s linear infinite; }
    .obj-6  { bottom: 10%; left: 10%; animation: float2 15s ease-in-out infinite 1s; }
    .obj-7  { top: 30%; left: 8%; animation: float3 10s ease-in-out infinite 3s; }
    .obj-8  { bottom: 5%; left: -60px; animation: spin 60s linear infinite reverse; }
    .obj-9  { top: 5%; left: 35%; animation: float1 20s ease-in-out infinite 4s; }
    .obj-10 { top: 70%; right: 12%; animation: float3 13s ease-in-out infinite 1.5s; }
    .obj-11 { bottom: 30%; right: 3%; animation: float2 17s ease-in-out infinite 2s; }
    .obj-12 { top: 80%; left: 20%; animation: float1 11s ease-in-out infinite 0.5s; }
    .obj-13 { top: -50px; right: 10%; animation: spin 50s linear infinite; }

    @keyframes float1 {
      0%,100% { transform: translate(0, 0) rotate(0deg); }
      25%     { transform: translate(20px, -30px) rotate(3deg); }
      50%     { transform: translate(-10px, -50px) rotate(-2deg); }
      75%     { transform: translate(30px, -20px) rotate(4deg); }
    }
    @keyframes float2 {
      0%,100% { transform: translate(0, 0) rotate(0deg); }
      33%     { transform: translate(-25px, 20px) rotate(-4deg); }
      66%     { transform: translate(15px, 40px) rotate(3deg); }
    }
    @keyframes float3 {
      0%,100% { transform: translate(0, 0); }
      50%     { transform: translate(35px, -25px); }
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }

    /* ─── Login card ─── */
    .login-card {
      position: relative; z-index: 2;
      width: 100%; max-width: 420px;
      background: rgba(255,255,255,0.82);
      backdrop-filter: blur(28px);
      -webkit-backdrop-filter: blur(28px);
      border: 1px solid rgba(226,213,184,0.7);
      border-radius: 28px;
      padding: 52px 44px;
      box-shadow: 0 40px 80px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.6) inset;
      margin: 24px;
    }
    .card-brand {
      display: flex; align-items: center; gap: 10px;
      margin-bottom: 28px;
      font-family: 'Fraunces', serif; font-size: 18px; font-weight: 500;
    }
    .card-brand-icon {
      width: 36px; height: 36px; border-radius: 10px;
      background: var(--ink); color: #fff;
      display: flex; align-items: center; justify-content: center;
    }
    .card-brand-icon svg { width: 18px; height: 18px; }
    .login-card h2 { margin: 0 0 6px; font-size: 30px; letter-spacing: -0.02em; }
    .card-sub { margin: 0 0 28px; font-size: 14px; color: var(--ink-soft); }
    .sign-btn { width: 100%; justify-content: center; padding: 14px; font-size: 15px; margin-top: 8px; border-radius: 14px; }
    .card-divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; font-size: 12px; color: var(--ink-soft); }
    .card-divider::before, .card-divider::after { content:''; flex:1; height:1px; background:var(--line); }
    .card-links { display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 13px; }
    .card-links a { color: var(--ink); font-weight: 600; }
    .card-links span { color: var(--ink-soft); }
  `]
})
export class LoginComponent {
  email = ''; password = ''; error = ''; loading = false;
  constructor(private auth: AuthService, private router: Router) {}
  submit() {
    this.error = ''; this.loading = true;
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.role === 'PATIENT') this.router.navigate(['/patient/dashboard']);
        else if (res.role === 'DOCTOR') this.router.navigate(['/doctor/dashboard']);
        else if (res.role === 'ADMIN') this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => { this.loading = false; this.error = err?.error?.message || 'Login failed'; }
    });
  }
}
