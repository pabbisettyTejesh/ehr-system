import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register-doctor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-bg">

      <!-- ═══════ FLOATING BACKGROUND OBJECTS — Doctor Navy Theme ═══════ -->
      <div class="bg-objects">
        <!-- Floating doctor card -->
        <div class="bg-card obj-1">
          <div class="bc-avatar" style="background:var(--doctor)">Dr</div>
          <div class="bc-lines">
            <div class="bc-line long"></div>
            <div class="bc-line medium" style="background:rgba(30,58,95,0.2)"></div>
          </div>
        </div>

        <!-- Floating stethoscope icon -->
        <div class="bg-icon obj-2" style="color:rgba(30,58,95,0.18);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 2v2"/><path d="M5 2v2"/><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"/><path d="M8 15a6 6 0 0 0 12 0v-3"/><circle cx="20" cy="10" r="2"/></svg>
        </div>

        <!-- Floating approval badge -->
        <div class="bg-badge obj-3" style="color:var(--success);">
          <div class="bb-dot" style="background:var(--success)"></div>
          Admin Approved
        </div>

        <!-- Floating clipboard card -->
        <div class="bg-card obj-4">
          <div class="bc-timeline">
            <div class="tl-item"><div class="tl-d" style="background:var(--doctor)"></div><div class="bc-line long"></div></div>
            <div class="tl-item"><div class="tl-d" style="background:var(--patient)"></div><div class="bc-line medium"></div></div>
            <div class="tl-item"><div class="tl-d" style="background:var(--gold)"></div><div class="bc-line short"></div></div>
          </div>
        </div>

        <!-- Floating ring -->
        <div class="bg-ring obj-5" style="border-color:rgba(30,58,95,0.1);"></div>

        <!-- Floating shield -->
        <div class="bg-icon obj-6" style="color:rgba(156,122,60,0.2);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
        </div>

        <!-- Floating license badge -->
        <div class="bg-badge obj-7" style="color:var(--doctor);">
          <div class="bb-dot" style="background:var(--doctor)"></div>
          LIC: MH-12345
        </div>

        <!-- Floating ECG card -->
        <div class="bg-card obj-8">
          <div class="bc-waveform">
            <svg viewBox="0 0 60 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--doctor)"><path d="M0 10 L6 10 L9 4 L12 16 L15 6 L18 14 L21 10 L60 10"/></svg>
          </div>
          <div class="bc-label" style="color:var(--doctor)">Patient Vitals</div>
        </div>

        <!-- Floating large ring -->
        <div class="bg-ring obj-9" style="width:300px;height:300px;border-color:rgba(30,58,95,0.06);"></div>

        <!-- Floating specialization chip -->
        <div class="bg-badge obj-10" style="color:var(--gold);">
          <div class="bb-dot" style="background:var(--gold)"></div>
          Cardiologist
        </div>

        <!-- Floating patient count card -->
        <div class="bg-card obj-11">
          <div class="bc-dot" style="background:var(--patient)"></div>
          <div class="bc-lines">
            <div class="bc-line medium"></div>
            <div class="bc-line short"></div>
          </div>
        </div>

        <!-- Floating activity icon -->
        <div class="bg-icon obj-12" style="color:rgba(31,111,84,0.18);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg>
        </div>

        <!-- Floating medium ring -->
        <div class="bg-ring obj-13" style="width:200px;height:200px;border-color:rgba(156,122,60,0.08);"></div>

        <!-- Floating log badge -->
        <div class="bg-badge obj-14" style="color:var(--patient);">
          <div class="bb-dot" style="background:var(--patient)"></div>
          Encounter Logged
        </div>
      </div>

      <!-- ═══════ MAIN CARD ═══════ -->
      <div class="reg-card">
        <div class="card-header">
          <div class="ch-icon" style="background:var(--doctor)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 2v2"/><path d="M5 2v2"/><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"/><path d="M8 15a6 6 0 0 0 12 0v-3"/><circle cx="20" cy="10" r="2"/></svg>
          </div>
          <div>
            <div class="ch-eyebrow" style="color:var(--doctor)">Doctor Portal</div>
            <h2>Create your account</h2>
          </div>
        </div>

        <form (ngSubmit)="submit()">
          <div class="grid-2">
            <div class="form-group"><label>Full Name</label><input [(ngModel)]="form.fullName" name="fullName" required placeholder="Dr. Jane Smith"></div>
            <div class="form-group"><label>Email</label><input type="email" [(ngModel)]="form.email" name="email" required placeholder="doctor@example.com"></div>
            <div class="form-group"><label>Password</label><input type="password" [(ngModel)]="form.password" name="password" required placeholder="••••••••"></div>
            <div class="form-group"><label>Phone</label><input [(ngModel)]="form.phone" name="phone" placeholder="+91 00000 00000"></div>
            <div class="form-group"><label>Specialization</label><input [(ngModel)]="form.specialization" name="specialization" placeholder="e.g. Cardiologist"></div>
            <div class="form-group"><label>License Number</label><input [(ngModel)]="form.licenseNumber" name="licenseNumber" placeholder="e.g. MH-12345"></div>
            <div class="form-group"><label>Qualification</label><input [(ngModel)]="form.qualification" name="qualification" placeholder="e.g. MBBS, MD"></div>
            <div class="form-group"><label>Experience (years)</label><input type="number" [(ngModel)]="form.experienceYears" name="experienceYears" placeholder="5"></div>
          </div>
          <div class="form-group"><label>Default Hospital / Clinic Name</label><input [(ngModel)]="form.defaultHospitalName" name="defaultHospitalName" placeholder="City General Hospital"></div>
          <div class="error-text" *ngIf="error">{{ error }}</div>
          <div class="success-text" *ngIf="success">{{ success }}</div>
          <button class="btn reg-btn" type="submit" [disabled]="loading" style="background:var(--doctor)">
            {{ loading ? 'Registering…' : 'Submit for Approval →' }}
          </button>
        </form>
        <p class="auth-footnote" style="text-align:center;margin-top:20px;">
          Already have an account? <a routerLink="/login">Sign in</a>
        </p>
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
    .bg-objects { position: absolute; inset: 0; pointer-events: none; z-index: 0; }

    .bg-card { position: absolute; background: rgba(255,255,255,0.5); border: 1px solid rgba(30,58,95,0.15); border-radius: 14px; padding: 12px 16px; display: flex; align-items: center; gap: 10px; backdrop-filter: blur(6px); box-shadow: 0 8px 24px rgba(0,0,0,0.04); }
    .bc-avatar { width: 32px; height: 32px; border-radius: 50%; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px; flex-shrink: 0; }
    .bc-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .bc-lines { display: flex; flex-direction: column; gap: 6px; }
    .bc-line { height: 6px; border-radius: 4px; background: var(--line); }
    .bc-line.long { width: 80px; } .bc-line.medium { width: 56px; } .bc-line.short { width: 36px; }
    .bc-waveform svg { width: 60px; height: 20px; }
    .bc-label { font-size: 10px; font-weight: 700; letter-spacing: 0.06em; }
    .bc-timeline { display: flex; flex-direction: column; gap: 6px; }
    .tl-item { display: flex; align-items: center; gap: 8px; }
    .tl-d { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

    .bg-icon { position: absolute; }
    .bg-icon svg { width: 48px; height: 48px; }
    .bg-ring { position: absolute; width: 160px; height: 160px; border-radius: 50%; border: 1.5px solid; }
    .bg-badge { position: absolute; background: rgba(255,255,255,0.55); border: 1px solid rgba(30,58,95,0.15); border-radius: 20px; padding: 8px 14px; font-size: 11px; font-weight: 700; display: flex; align-items: center; gap: 6px; backdrop-filter: blur(6px); }
    .bb-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

    .obj-1  { top: 5%;  left: 4%;   animation: float1 16s ease-in-out infinite; }
    .obj-2  { top: 15%; right: 4%;  animation: float2 20s ease-in-out infinite; }
    .obj-3  { top: 32%; left: 5%;   animation: float3 11s ease-in-out infinite 2s; }
    .obj-4  { top: 58%; left: 2%;   animation: float1 14s ease-in-out infinite 1s; }
    .obj-5  { top: 42%; right: -20px; animation: spin 48s linear infinite; }
    .obj-6  { bottom: 18%; left: 6%; animation: float2 17s ease-in-out infinite 0.5s; }
    .obj-7  { top: 20%; right: 6%;  animation: float1 13s ease-in-out infinite 3s; }
    .obj-8  { bottom: 10%; right: 5%; animation: float3 15s ease-in-out infinite 1.5s; }
    .obj-9  { bottom: -60px; left: -60px; animation: spin 60s linear infinite reverse; }
    .obj-10 { top: 70%; right: 4%;  animation: float2 12s ease-in-out infinite 2.5s; }
    .obj-11 { top: 80%; left: 20%;  animation: float1 10s ease-in-out infinite 0.5s; }
    .obj-12 { top: 3%;  left: 40%;  animation: float3 22s ease-in-out infinite 4s; }
    .obj-13 { top: -50px; right: 8%; animation: spin 52s linear infinite; }
    .obj-14 { bottom: 30%; left: 4%; animation: float2 13s ease-in-out infinite 3.5s; }

    @keyframes float1 { 0%,100%{transform:translate(0,0) rotate(0deg);} 25%{transform:translate(20px,-30px) rotate(3deg);} 50%{transform:translate(-10px,-50px) rotate(-2deg);} 75%{transform:translate(30px,-20px) rotate(4deg);} }
    @keyframes float2 { 0%,100%{transform:translate(0,0) rotate(0deg);} 33%{transform:translate(-25px,20px) rotate(-4deg);} 66%{transform:translate(15px,40px) rotate(3deg);} }
    @keyframes float3 { 0%,100%{transform:translate(0,0);} 50%{transform:translate(35px,-25px);} }
    @keyframes spin { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }

    /* ─── Registration card ─── */
    .reg-card { position: relative; z-index: 2; width: 100%; max-width: 600px; background: rgba(255,255,255,0.82); backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px); border: 1px solid rgba(30,58,95,0.15); border-radius: 28px; padding: 44px; box-shadow: 0 40px 80px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.6) inset; margin: 24px; }
    .card-header { display: flex; align-items: center; gap: 16px; margin-bottom: 28px; }
    .ch-icon { width: 52px; height: 52px; border-radius: 16px; color: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 8px 20px rgba(30,58,95,0.25); }
    .ch-icon svg { width: 26px; height: 26px; }
    .ch-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px; }
    .card-header h2 { margin: 0; font-size: 26px; letter-spacing: -0.02em; }
    .reg-btn { width: 100%; justify-content: center; padding: 14px; font-size: 15px; margin-top: 8px; border-radius: 14px; }
  `]
})
export class RegisterDoctorComponent {
  form: any = { email:'', password:'', phone:'', fullName:'', specialization:'', licenseNumber:'', qualification:'', experienceYears:null, defaultHospitalName:'' };
  error=''; success=''; loading=false;
  constructor(private auth: AuthService, private router: Router) {}
  submit() {
    this.error=''; this.loading=true;
    this.auth.registerDoctor(this.form).subscribe({
      next: () => { this.loading=false; this.success='Registered! Your account is pending admin approval. You can log in once approved.'; setTimeout(()=>this.router.navigate(['/login']),2500); },
      error: (err) => { this.loading=false; this.error=err?.error?.message||'Registration failed'; }
    });
  }
}
