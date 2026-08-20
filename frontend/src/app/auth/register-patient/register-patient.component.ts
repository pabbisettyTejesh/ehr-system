import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register-patient',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-bg">

      <!-- ═══════ FLOATING BACKGROUND OBJECTS — Patient Emerald Theme ═══════ -->
      <div class="bg-objects">
        <!-- Floating patient ID card -->
        <div class="bg-card obj-1">
          <div class="bc-avatar" style="background:var(--patient)">JD</div>
          <div class="bc-lines">
            <div class="bc-line long"></div>
            <div class="bc-line medium" style="background: rgba(31,111,84,0.2);"></div>
          </div>
        </div>

        <!-- Floating pill -->
        <div class="bg-icon obj-2" style="color:rgba(31,111,84,0.2);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
        </div>

        <!-- Floating timeline card -->
        <div class="bg-card obj-3">
          <div class="bc-timeline">
            <div class="tl-item"><div class="tl-d" style="background:var(--patient)"></div><div class="bc-line medium"></div></div>
            <div class="tl-item"><div class="tl-d" style="background:var(--gold)"></div><div class="bc-line short"></div></div>
            <div class="tl-item"><div class="tl-d" style="background:var(--doctor)"></div><div class="bc-line long"></div></div>
          </div>
        </div>

        <!-- Floating ring -->
        <div class="bg-ring obj-4" style="border-color:rgba(31,111,84,0.12);"></div>

        <!-- Floating allergy badge -->
        <div class="bg-badge obj-5" style="color:var(--warn);">
          <div class="bb-dot" style="background:var(--warn)"></div>
          2 Active Allergies
        </div>

        <!-- Floating shield -->
        <div class="bg-icon obj-6" style="color:rgba(156,122,60,0.2);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
        </div>

        <!-- Floating UID chip -->
        <div class="bg-badge obj-7" style="color:var(--patient);">
          <div class="bb-dot" style="background:var(--patient)"></div>
          UID: PT-2024-001
        </div>

        <!-- Floating waveform card -->
        <div class="bg-card obj-8">
          <div class="bc-waveform">
            <svg viewBox="0 0 60 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--patient)"><path d="M0 10 L8 10 L11 3 L14 17 L17 7 L20 13 L23 10 L60 10"/></svg>
          </div>
          <div class="bc-label">B+ Blood Group</div>
        </div>

        <!-- Floating large ring -->
        <div class="bg-ring obj-9" style="width:280px;height:280px;border-color:rgba(31,111,84,0.07);"></div>

        <!-- Floating prescription badge -->
        <div class="bg-badge obj-10" style="color:var(--doctor);">
          <div class="bb-dot" style="background:var(--doctor)"></div>
          3 Prescriptions Active
        </div>

        <!-- Floating file icon -->
        <div class="bg-icon obj-11" style="color:rgba(30,58,95,0.18);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8l6 6v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
        </div>

        <!-- Floating access log card -->
        <div class="bg-card obj-12">
          <div class="bc-dot" style="background:var(--success)"></div>
          <div class="bc-lines">
            <div class="bc-line medium"></div>
            <div class="bc-line short"></div>
          </div>
        </div>

        <!-- Floating cross icon -->
        <div class="bg-icon obj-13" style="color:rgba(31,111,84,0.15);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z"/></svg>
        </div>
      </div>

      <!-- ═══════ MAIN CARD ═══════ -->
      <div class="reg-card">
        <div class="card-header">
          <div class="ch-icon" style="background:var(--patient)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
          </div>
          <div>
            <div class="ch-eyebrow">Patient Portal</div>
            <h2>Create your account</h2>
          </div>
        </div>

        <form (ngSubmit)="submit()">
          <div class="grid-2">
            <div class="form-group"><label>Full Name</label><input [(ngModel)]="form.fullName" name="fullName" required placeholder="Jane Smith"></div>
            <div class="form-group"><label>Email</label><input type="email" [(ngModel)]="form.email" name="email" required placeholder="you@example.com"></div>
            <div class="form-group"><label>Password</label><input type="password" [(ngModel)]="form.password" name="password" required placeholder="••••••••"></div>
            <div class="form-group"><label>Phone</label><input [(ngModel)]="form.phone" name="phone" placeholder="+91 00000 00000"></div>
            <div class="form-group"><label>Date of Birth</label><input type="date" [(ngModel)]="form.dateOfBirth" name="dateOfBirth"></div>
            <div class="form-group"><label>Gender</label><select [(ngModel)]="form.gender" name="gender"><option>Male</option><option>Female</option><option>Other</option></select></div>
            <div class="form-group"><label>Blood Group</label><input [(ngModel)]="form.bloodGroup" name="bloodGroup" placeholder="e.g. B+"></div>
            <div class="form-group"><label>City</label><input [(ngModel)]="form.city" name="city" placeholder="Mumbai"></div>
          </div>
          <div class="form-group"><label>Address</label><textarea [(ngModel)]="form.address" name="address" rows="2" placeholder="123, Street, City"></textarea></div>
          <div class="grid-2">
            <div class="form-group"><label>Emergency Contact Name</label><input [(ngModel)]="form.emergencyContactName" name="emergencyContactName" placeholder="John Smith"></div>
            <div class="form-group"><label>Emergency Contact Phone</label><input [(ngModel)]="form.emergencyContactPhone" name="emergencyContactPhone" placeholder="+91 00000 00000"></div>
          </div>
          <div class="error-text" *ngIf="error">{{ error }}</div>
          <div class="success-text" *ngIf="success">{{ success }}</div>
          <button class="btn reg-btn" type="submit" [disabled]="loading" style="background:var(--patient)">
            {{ loading ? 'Registering…' : 'Create My Record →' }}
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
      padding: 40px 20px;
    }
    .bg-objects { position: absolute; inset: 0; pointer-events: none; z-index: 0; }

    .bg-card { position: absolute; background: rgba(255,255,255,0.5); border: 1px solid rgba(31,111,84,0.15); border-radius: 14px; padding: 12px 16px; display: flex; align-items: center; gap: 10px; backdrop-filter: blur(6px); box-shadow: 0 8px 24px rgba(0,0,0,0.04); }
    .bc-avatar { width: 32px; height: 32px; border-radius: 50%; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px; flex-shrink: 0; }
    .bc-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .bc-lines { display: flex; flex-direction: column; gap: 6px; }
    .bc-line { height: 6px; border-radius: 4px; background: var(--line); }
    .bc-line.long { width: 80px; } .bc-line.medium { width: 56px; } .bc-line.short { width: 36px; }
    .bc-waveform svg { width: 60px; height: 20px; }
    .bc-label { font-size: 10px; font-weight: 700; color: var(--patient); letter-spacing: 0.06em; }
    .bc-timeline { display: flex; flex-direction: column; gap: 6px; }
    .tl-item { display: flex; align-items: center; gap: 8px; }
    .tl-d { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

    .bg-icon { position: absolute; }
    .bg-icon svg { width: 48px; height: 48px; }

    .bg-ring { position: absolute; width: 160px; height: 160px; border-radius: 50%; border: 1.5px solid; }

    .bg-badge { position: absolute; background: rgba(255,255,255,0.55); border: 1px solid rgba(31,111,84,0.2); border-radius: 20px; padding: 8px 14px; font-size: 11px; font-weight: 700; display: flex; align-items: center; gap: 6px; backdrop-filter: blur(6px); }
    .bb-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

    .obj-1  { top: 6%;  left: 4%;   animation: float1 15s ease-in-out infinite; }
    .obj-2  { top: 18%; right: 5%;  animation: float2 19s ease-in-out infinite; }
    .obj-3  { top: 55%; left: 2%;   animation: float3 13s ease-in-out infinite 1s; }
    .obj-4  { top: 38%; right: -20px; animation: spin 45s linear infinite; }
    .obj-5  { top: 28%; left: 6%;   animation: float1 11s ease-in-out infinite 2s; }
    .obj-6  { bottom: 15%; right: 4%; animation: float2 16s ease-in-out infinite 0.5s; }
    .obj-7  { bottom: 28%; left: 5%; animation: float3 12s ease-in-out infinite 3s; }
    .obj-8  { bottom: 8%;  right: 8%; animation: float1 17s ease-in-out infinite 1s; }
    .obj-9  { bottom: -40px; left: -40px; animation: spin 55s linear infinite reverse; }
    .obj-10 { top: 72%; right: 5%;  animation: float2 14s ease-in-out infinite 2s; }
    .obj-11 { top: 4%;  left: 38%;  animation: float3 21s ease-in-out infinite 3s; }
    .obj-12 { top: 82%; left: 18%;  animation: float1 10s ease-in-out infinite 1.5s; }
    .obj-13 { top: 45%; right: 3%;  animation: float2 18s ease-in-out infinite 4s; }

    @keyframes float1 { 0%,100%{transform:translate(0,0) rotate(0deg);} 25%{transform:translate(20px,-30px) rotate(3deg);} 50%{transform:translate(-10px,-50px) rotate(-2deg);} 75%{transform:translate(30px,-20px) rotate(4deg);} }
    @keyframes float2 { 0%,100%{transform:translate(0,0) rotate(0deg);} 33%{transform:translate(-25px,20px) rotate(-4deg);} 66%{transform:translate(15px,40px) rotate(3deg);} }
    @keyframes float3 { 0%,100%{transform:translate(0,0);} 50%{transform:translate(35px,-25px);} }
    @keyframes spin { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }

    /* ─── Registration card ─── */
    .reg-card { position: relative; z-index: 2; width: 100%; max-width: 600px; background: rgba(255,255,255,0.82); backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px); border: 1px solid rgba(31,111,84,0.2); border-radius: 28px; padding: 44px 44px; box-shadow: 0 40px 80px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.6) inset; margin: 24px; }
    .card-header { display: flex; align-items: center; gap: 16px; margin-bottom: 28px; }
    .ch-icon { width: 52px; height: 52px; border-radius: 16px; color: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 8px 20px rgba(31,111,84,0.25); }
    .ch-icon svg { width: 26px; height: 26px; }
    .ch-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--patient); margin-bottom: 4px; }
    .card-header h2 { margin: 0; font-size: 26px; letter-spacing: -0.02em; }
    .reg-btn { width: 100%; justify-content: center; padding: 14px; font-size: 15px; margin-top: 8px; border-radius: 14px; }
  `]
})
export class RegisterPatientComponent {
  form: any = { email:'', password:'', phone:'', fullName:'', dateOfBirth:'', gender:'Male', bloodGroup:'', address:'', city:'', emergencyContactName:'', emergencyContactPhone:'' };
  error=''; success=''; loading=false;
  constructor(private auth: AuthService, private router: Router) {}
  submit() {
    this.error=''; this.loading=true;
    this.auth.registerPatient(this.form).subscribe({
      next: (res) => { this.loading=false; this.success=`Registered! Your Patient UID is ${res.patientUid}`; setTimeout(()=>this.router.navigate(['/patient/dashboard']),1500); },
      error: (err) => { this.loading=false; this.error=err?.error?.message||'Registration failed'; }
    });
  }
}
