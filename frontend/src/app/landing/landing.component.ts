import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ICONS } from '../shared/icons';
import { RevealDirective } from '../shared/directives/reveal.directive';
import { SafeHtmlPipe } from '../shared/safe-html.pipe';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, RevealDirective, SafeHtmlPipe],
  template: `
    <div class="lp-hero">
      <div class="hero-grid-lines" aria-hidden="true"></div>

      <div class="hero-inner">
        <div class="hero-copy">
          <div class="hero-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.activity | safeHtml"></svg>
            <span>Centralized Patient-Centric EHR Platform</span>
          </div>
          <h1 class="hero-title">One health record.<br><span class="hero-gradient-text">Every provider, aligned.</span></h1>
          <p class="hero-sub">
            Medical history stops living in whichever clinic wrote it down. It follows the patient —
            with doctors seeing full records only once appointed, and every single access permanently logged and visible.
          </p>

          <!-- SINGLE main CTA — no duplicates anywhere else -->
          <div class="hero-cta">
            <a routerLink="/login" class="btn hero-btn-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.logIn | safeHtml"></svg>
              Sign in to your portal
            </a>
            <a routerLink="/register/patient" class="btn hero-btn-ghost">New Patient? Register free</a>
          </div>

          <div class="trust-strip">
            <span class="trust-chip">🔒 End-to-end encrypted</span>
            <span class="trust-chip">📋 Full audit trail</span>
            <span class="trust-chip">🚨 Emergency break-glass</span>
            <span class="trust-chip">✅ Admin-verified doctors</span>
          </div>
        </div>

        <!-- Animated floating card preview -->
        <div class="hero-visual">
          <div class="preview-card floating">
            <div class="preview-card-header">
              <div class="preview-avatar">JD</div>
              <div>
                <div class="preview-name">Jane Doe</div>
                <div class="preview-uid">UID: PT-2024-001234</div>
              </div>
              <span class="preview-status">Active</span>
            </div>
            <div class="preview-vitals">
              <div class="vital-item"><span class="vital-label">Blood Group</span><span class="vital-val">B+</span></div>
              <div class="vital-item"><span class="vital-label">Age</span><span class="vital-val">34</span></div>
              <div class="vital-item"><span class="vital-label">Allergies</span><span class="vital-val warn">2 active</span></div>
            </div>
            <div class="preview-timeline">
              <div class="tl-row"><span class="tl-dot tl-green"></span><span>Encounter logged — Dr. Sharma</span><span class="tl-time">2h ago</span></div>
              <div class="tl-row"><span class="tl-dot tl-gold"></span><span>Prescription issued — Amoxicillin</span><span class="tl-time">1d ago</span></div>
              <div class="tl-row"><span class="tl-dot tl-blue"></span><span>Access log viewed by patient</span><span class="tl-time">3d ago</span></div>
            </div>
          </div>
          <div class="floating-pill pill-rx floating-delayed">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.pill | safeHtml"></svg>
            3 active prescriptions
          </div>
          <div class="floating-pill pill-enc floating-delayed-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.shieldCheck | safeHtml"></svg>
            All access logged
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════ TRUSTED BY ═══════════════════════════ -->
    <div class="trusted-by-section">
      <p class="trusted-eyebrow">TRUSTED BY LEADING HEALTHCARE PROVIDERS</p>
      <div class="trusted-logos">
        <span class="logo-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" [innerHTML]="icons.activity | safeHtml"></svg> Memorial General</span>
        <span class="logo-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" [innerHTML]="icons.shieldCheck | safeHtml"></svg> Cedars Clinic</span>
        <span class="logo-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" [innerHTML]="icons.stethoscope | safeHtml"></svg> Apex Health</span>
        <span class="logo-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" [innerHTML]="icons.userPlus | safeHtml"></svg> Valley Medical</span>
      </div>
    </div>

    <div class="lp-container">

      <!-- ═══════════════════════════ FEATURES STRIP ═══════════════════════════ -->
      <div class="feature-grid">
        <div class="feature-item"><span class="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.fileText | safeHtml"></svg></span><span>Medical Records</span></div>
        <div class="feature-item"><span class="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.stethoscope | safeHtml"></svg></span><span>Doctor Portal</span></div>
        <div class="feature-item"><span class="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.calendar | safeHtml"></svg></span><span>Appointments</span></div>
        <div class="feature-item"><span class="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.activity | safeHtml"></svg></span><span>Medical Timeline</span></div>
        <div class="feature-item"><span class="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.siren | safeHtml"></svg></span><span>Emergency Access</span></div>
        <div class="feature-item"><span class="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.shieldCheck | safeHtml"></svg></span><span>Audit Logs</span></div>
        <div class="feature-item"><span class="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.pill | safeHtml"></svg></span><span>Prescriptions</span></div>
        <div class="feature-item"><span class="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.triangleAlert | safeHtml"></svg></span><span>Allergy Tracking</span></div>
      </div>

      <!-- ═══════════════════════════ WHAT IS EHR ═══════════════════════════ -->
      <div class="about-section" appReveal>
        <div class="about-text">
          <span class="page-eyebrow">What is this platform?</span>
          <h2>A living medical record that travels with the patient</h2>
          <p>
            Traditional healthcare systems suffer from data fragmentation — a patient's diagnosis from one clinic is invisible to another. Our EHR platform eliminates this by maintaining a single, centralized, always up-to-date health record per patient.
          </p>
          <p>
            Every piece of clinical data — encounters, prescriptions, allergies, reports, medical history — lives in one place, accessible only to doctors who have been formally appointed by a verified administrator. Nothing is silently shared. Everything is logged.
          </p>
          <div class="about-bullets">
            <div class="about-bullet"><span class="bullet-icon">📁</span><div><strong>Unified record</strong><br><span>One patient profile, multiple providers, no duplication.</span></div></div>
            <div class="about-bullet"><span class="bullet-icon">🔑</span><div><strong>Appointment-gated access</strong><br><span>Doctors only see records of patients linked to them via a formal appointment.</span></div></div>
            <div class="about-bullet"><span class="bullet-icon">👁️</span><div><strong>Full transparency</strong><br><span>Patients can see every access event, including emergency views, in real time.</span></div></div>
          </div>
        </div>
        <div class="about-visual">
          <div class="about-card">
            <div class="about-card-row top"><span class="ab-badge patient">Patient</span><span class="ab-uid">UID: PT-2024-001234</span></div>
            <div class="about-record-list">
              <div class="rec-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.fileText | safeHtml"></svg><span>Medical History</span><span class="rec-count">8 records</span></div>
              <div class="rec-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.pill | safeHtml"></svg><span>Prescriptions</span><span class="rec-count">3 active</span></div>
              <div class="rec-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.triangleAlert | safeHtml"></svg><span>Allergies</span><span class="rec-count warn">2 active</span></div>
              <div class="rec-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.calendar | safeHtml"></svg><span>Appointments</span><span class="rec-count">1 upcoming</span></div>
              <div class="rec-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.shieldCheck | safeHtml"></svg><span>Access Logs</span><span class="rec-count">12 events</span></div>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════ HOW IT WORKS BY ROLE ═══════════════════════════ -->
      <div class="section-header" appReveal>
        <h2>Three roles. One shared record.</h2>
        <p>Each stakeholder has a precisely scoped view — no more, no less than what they need.</p>
      </div>

      <div class="role-grid">
        <div class="role-card accent-patient" appReveal>
          <span class="role-tag-lg">Patient</span>
          <h3>Your record travels with you</h3>
          <ul>
            <li>Get a unique Patient UID the moment you register</li>
            <li>View your full medical timeline, prescriptions & allergies</li>
            <li>Book and track appointments with your doctors</li>
            <li>See exactly who accessed your data, and why — including emergencies</li>
            <li>Your UID alone never exposes clinical detail to unappointed doctors</li>
          </ul>
        </div>

        <div class="role-card accent-doctor" appReveal style="transition-delay:80ms;">
          <span class="role-tag-lg">Doctor</span>
          <h3>Full access, only when appointed</h3>
          <ul>
            <li>Registration requires administrator approval before you can log in</li>
            <li>Full clinical record access only for patients linked to you via an appointment</li>
            <li>Log encounters, diagnoses, clinical notes, and vital observations</li>
            <li>Issue prescriptions and manage patient allergy records</li>
            <li>Emergency mode: critical-only data by Patient UID, reason is mandatory, always logged</li>
          </ul>
        </div>

        <div class="role-card accent-admin" appReveal style="transition-delay:160ms;">
          <span class="role-tag-lg">Admin</span>
          <h3>Keeps the access model honest</h3>
          <ul>
            <li>Approves or rejects every doctor before they can practice on the platform</li>
            <li>Creates the appointment that grants a doctor access to a patient's record</li>
            <li>Can register patients directly, without touching any clinical data</li>
            <li>Full visibility into all access logs and emergency access events</li>
            <li>Manages users, appointments, and platform integrity</li>
          </ul>
        </div>
      </div>

      <!-- ═══════════════════════════ DATA FLOW DIAGRAM ═══════════════════════════ -->
      <div class="section-header" appReveal style="margin-top: 100px;">
        <h2>How your data flows</h2>
        <p>A seamless, encrypted loop — every handoff between roles is controlled, logged, and auditable.</p>
      </div>

      <div class="flow-diagram-wrap" appReveal>
        <div class="flow-diagram">
          <div class="flow-node-lg">
            <div class="flow-node-icon" style="background: var(--patient-soft); color: var(--patient);">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.userRound | safeHtml"></svg>
            </div>
            <div class="flow-node-label">Patient</div>
            <div class="flow-node-sub">Creates profile &<br>stores health record</div>
            <div class="node-pulse" style="background: rgba(15,118,110,0.2); animation-delay: 0s;"></div>
          </div>

          <div class="flow-arrow">
            <div class="arrow-line"></div>
            <div class="arrow-packet pkt-1"></div>
            <div class="arrow-label">Appointment<br>request</div>
          </div>

          <div class="flow-node-lg">
            <div class="flow-node-icon" style="background: var(--admin-soft); color: var(--admin);">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.shieldCheck | safeHtml"></svg>
            </div>
            <div class="flow-node-label">Admin</div>
            <div class="flow-node-sub">Approves doctors &<br>links appointments</div>
            <div class="node-pulse" style="background: rgba(109,40,217,0.2); animation-delay: 1s;"></div>
          </div>

          <div class="flow-arrow">
            <div class="arrow-line"></div>
            <div class="arrow-packet pkt-2"></div>
            <div class="arrow-label">Access<br>granted</div>
          </div>

          <div class="flow-node-lg">
            <div class="flow-node-icon" style="background: var(--doctor-soft); color: var(--doctor);">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.stethoscope | safeHtml"></svg>
            </div>
            <div class="flow-node-label">Doctor</div>
            <div class="flow-node-sub">Views record &<br>logs clinical notes</div>
            <div class="node-pulse" style="background: rgba(29,78,216,0.2); animation-delay: 2s;"></div>
          </div>
        </div>

        <div class="audit-strip">
          <div class="audit-chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.shieldCheck | safeHtml"></svg> Every access is permanently logged</div>
          <div class="audit-chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.siren | safeHtml"></svg> Emergency break-glass is always audited</div>
          <div class="audit-chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.fileText | safeHtml"></svg> Patient sees all access events in real time</div>
        </div>
      </div>

      <!-- ═══════════════════════════ FEATURE DEEP DIVE ═══════════════════════════ -->
      <div class="section-header" appReveal style="margin-top: 100px;">
        <h2>Everything a modern clinic needs</h2>
        <p>Purpose-built features for every stakeholder — from first registration to emergency access.</p>
      </div>

      <div class="deep-features" appReveal>
        <div class="deep-feature-item">
          <div class="df-icon" style="background: var(--patient-soft); color: var(--patient);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.activity | safeHtml"></svg>
          </div>
          <div>
            <h4>Medical Timeline</h4>
            <p>Every encounter, diagnosis, and note is organized chronologically — giving doctors an instant view of a patient's complete clinical history from day one.</p>
          </div>
        </div>

        <div class="deep-feature-item">
          <div class="df-icon" style="background: var(--doctor-soft); color: var(--doctor);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.pill | safeHtml"></svg>
          </div>
          <div>
            <h4>Digital Prescriptions</h4>
            <p>Doctors issue structured prescriptions with dosage, frequency, and duration. Patients can view and track all active and expired prescriptions at any time.</p>
          </div>
        </div>

        <div class="deep-feature-item">
          <div class="df-icon" style="background: rgba(225,29,72,0.08); color: var(--warn);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.triangleAlert | safeHtml"></svg>
          </div>
          <div>
            <h4>Allergy Management</h4>
            <p>Critical allergy data is prominently surfaced on every patient record. Doctors can add, update, and mark allergies as inactive — preventing dangerous drug interactions.</p>
          </div>
        </div>

        <div class="deep-feature-item">
          <div class="df-icon" style="background: rgba(212,175,55,0.1); color: var(--gold);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.siren | safeHtml"></svg>
          </div>
          <div>
            <h4>Emergency Break-Glass Access</h4>
            <p>When a doctor needs critical data outside their appointed patients — in a life-threatening situation — they can request emergency access. A mandatory reason is logged, the access is time-stamped, and the patient is notified afterward.</p>
          </div>
        </div>

        <div class="deep-feature-item">
          <div class="df-icon" style="background: var(--admin-soft); color: var(--admin);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.shieldCheck | safeHtml"></svg>
          </div>
          <div>
            <h4>Tamper-Proof Audit Logs</h4>
            <p>Every single interaction with a patient's record — who viewed it, when, and why — is permanently stored. Patients can inspect their full access history. Admins have a system-wide emergency log view.</p>
          </div>
        </div>

        <div class="deep-feature-item">
          <div class="df-icon" style="background: var(--patient-soft); color: var(--patient);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.calendar | safeHtml"></svg>
          </div>
          <div>
            <h4>Appointment-Driven Access</h4>
            <p>Administrators create appointments that formally link a doctor to a patient for a defined period. Only this link unlocks clinical access — eliminating unauthorized data browsing entirely.</p>
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════ STATS ═══════════════════════════ -->
      <div class="stats-section" appReveal>
        <div class="stat-block">
          <div class="stat-num-lg">100%</div>
          <div class="stat-desc">Role-based access control on every data point</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-block">
          <div class="stat-num-lg">0</div>
          <div class="stat-desc">Silent backdoors — emergency access is always audited</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-block">
          <div class="stat-num-lg">3</div>
          <div class="stat-desc">Distinct portals unified under one encrypted record</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-block">
          <div class="stat-num-lg">∞</div>
          <div class="stat-desc">Audit log entries retained — nothing is ever deleted</div>
        </div>
      </div>

      <!-- ═══════════════════════════ SECURITY SECTION ═══════════════════════════ -->
      <div class="security-section" appReveal>
        <img src="assets/illustrations/security-shield.svg" alt="" width="360" height="320" loading="lazy">
        <div>
          <span class="page-eyebrow">Built around access control</span>
          <h2>Every record is encrypted.<br>Every view is logged.</h2>
          <p style="color:var(--ink-soft); max-width:480px; line-height: 1.7; font-size: 16px;">
            Doctors only ever see full clinical detail for patients they've been appointed to.
            Emergency access works when it must — but it's reason-logged, time-stamped, and visible to
            the patient afterward. There are no silent backdoors on this platform.
          </p>
          <div class="security-chips">
            <span class="sec-chip">🔒 AES-256 encryption at rest</span>
            <span class="sec-chip">🛡️ RBAC on every endpoint</span>
            <span class="sec-chip">📋 Immutable audit trail</span>
            <span class="sec-chip">🚨 Break-glass with mandatory reason</span>
          </div>
        </div>
      </div>

    </div>

    <!-- ═══════════════════════════ FOOTER SIGN UP (no login button) ═══════════════════════════ -->
    <div class="lp-footer-cta">
      <div class="footer-cta-inner">
        <span class="page-eyebrow" style="display:block; margin-bottom: 16px;">Get started today — it's free</span>
        <h2 style="font-size: 44px; margin: 0 0 16px;">Join the platform.<br>Own your health record.</h2>
        <p style="color: var(--ink-soft); font-size: 17px; margin: 0 0 40px; max-width: 500px; margin-left: auto; margin-right: auto; line-height: 1.7;">
          Whether you're a patient wanting full control of your medical data, or a doctor looking for a smarter way to manage clinical records — this platform is built for you.
        </p>
        <div class="footer-cta-btns">
          <a routerLink="/register/patient" class="btn footer-btn-patient">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.userRound | safeHtml"></svg>
            Register as Patient
          </a>
          <a routerLink="/register/doctor" class="btn footer-btn-doctor">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="icons.stethoscope | safeHtml"></svg>
            Register as Doctor
          </a>
        </div>
        <p style="margin-top: 20px; font-size: 13px; color: var(--ink-soft);">Already have an account? <a routerLink="/login" style="color: var(--ink); font-weight: 600;">Sign in →</a></p>
      </div>
    </div>

    <!-- ═══════════════════════════ STANDARD FOOTER ═══════════════════════════ -->
    <footer class="real-footer">
      <div class="footer-grid">
        <div class="footer-brand">
          <span class="brand-text" style="color:#fff; font-size:22px; display:block; margin-bottom:12px;"><strong>EHR</strong><span style="font-weight:400; opacity:0.8;">System</span></span>
          <p>A central, secure, and transparent health record platform built for the modern clinical era.</p>
          <div class="footer-socials">
            <span class="social-icon">in</span>
            <span class="social-icon">tw</span>
            <span class="social-icon">fb</span>
          </div>
        </div>
        <div class="footer-col">
          <h4>Platform</h4>
          <a href="javascript:void(0)">Patient Portal</a>
          <a href="javascript:void(0)">Doctor Dashboard</a>
          <a href="javascript:void(0)">Admin Console</a>
          <a href="javascript:void(0)">Security & Compliance</a>
        </div>
        <div class="footer-col">
          <h4>Resources</h4>
          <a href="javascript:void(0)">Help Center</a>
          <a href="javascript:void(0)">API Documentation</a>
          <a href="javascript:void(0)">Emergency Guide</a>
          <a href="javascript:void(0)">System Status</a>
        </div>
        <div class="footer-col">
          <h4>Legal</h4>
          <a href="javascript:void(0)">Privacy Policy (HIPAA)</a>
          <a href="javascript:void(0)">Terms of Service</a>
          <a href="javascript:void(0)">Cookie Policy</a>
          <a href="javascript:void(0)">Contact Us</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 EHR System Technologies, Inc. All rights reserved.</p>
        <div class="footer-badges">
          <span class="f-badge">HIPAA Compliant</span>
          <span class="f-badge">SOC2 Certified</span>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .orb { display: none; }
    .lp-hero {
      position: relative; overflow: hidden;
      min-height: 92vh; display: flex; align-items: center; justify-content: center;
      background: transparent;
      padding: 80px 24px 60px;
    }
    .hero-grid-lines { position: absolute; inset: 0; background-image: linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px); background-size: 48px 48px; mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent); }

    .hero-inner { position: relative; z-index: 2; display: flex; align-items: center; justify-content: center; gap: 72px; max-width: 1160px; width: 100%; flex-wrap: wrap; }
    .hero-copy { flex: 1; min-width: 300px; max-width: 560px; }
    
    .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.7); backdrop-filter: blur(8px); border: 1px solid var(--line); border-radius: 20px; padding: 6px 14px; font-size: 13px; font-weight: 600; color: var(--ink-soft); margin-bottom: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
    .hero-badge svg { width: 14px; height: 14px; color: var(--patient); }
    
    .hero-title { font-family: 'Fraunces', serif; font-size: 56px; font-weight: 700; line-height: 1.1; letter-spacing: -0.03em; margin: 0 0 20px; color: var(--ink); }
    .hero-gradient-text { color: var(--doctor); }
    
    .hero-sub { font-size: 18px; line-height: 1.7; color: var(--ink-soft); margin: 0 0 32px; }
    .hero-cta { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 28px; }
    
    .hero-btn-primary { background: var(--ink); color: #fff; padding: 14px 24px; font-size: 15px; font-weight: 600; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); transition: all 0.2s ease; }
    .hero-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(0,0,0,0.18); }
    .hero-btn-ghost { background: rgba(255,255,255,0.7); backdrop-filter: blur(8px); border: 1px solid var(--line); color: var(--ink); padding: 12px 20px; font-size: 14px; border-radius: 12px; transition: background 0.2s; }
    .hero-btn-ghost:hover { background: rgba(255,255,255,1); }
    
    .trust-strip { display: flex; gap: 10px; flex-wrap: wrap; }
    .trust-chip { background: rgba(255,255,255,0.6); backdrop-filter: blur(8px); border: 1px solid var(--line); border-radius: 20px; padding: 6px 12px; font-size: 12px; font-weight: 500; color: var(--ink-soft); }

    /* Floating card (Premium Light Mode) */
    .hero-visual { flex: 1; min-width: 280px; max-width: 420px; position: relative; height: 340px; }
    @keyframes floatUp { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-12px);} }
    @keyframes floatUp2 { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-8px);} }
    .floating { animation: floatUp 6s ease-in-out infinite; }
    .floating-delayed { animation: floatUp2 7s ease-in-out infinite 1s; }
    .floating-delayed-2 { animation: floatUp2 8s ease-in-out infinite 2.5s; }
    
    .preview-card { background: rgba(255, 255, 255, 0.88); backdrop-filter: blur(24px); border: 1px solid rgba(226,232,240,0.8); border-radius: 20px; padding: 24px; box-shadow: 0 24px 60px rgba(0,0,0,0.06); position: absolute; top: 10px; left: 0; right: 0; color: var(--ink); }
    .preview-card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
    .preview-avatar { width: 44px; height: 44px; border-radius: 50%; background: var(--patient); color: #fff; display: flex; align-items: center; justify-content: center; font-family: 'Fraunces', serif; font-weight: 600; font-size: 16px; flex-shrink: 0; }
    .preview-name { font-weight: 700; font-size: 15px; color: var(--ink); }
    .preview-uid { font-size: 11px; color: var(--ink-soft); font-family: monospace; }
    .preview-status { margin-left: auto; background: rgba(15,118,110,0.1); color: var(--patient); border: 1px solid rgba(15,118,110,0.2); border-radius: 20px; padding: 4px 10px; font-size: 11px; font-weight: 700; }
    .preview-vitals { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; margin-bottom: 16px; }
    .vital-item { background: var(--bg-soft); border-radius: 8px; padding: 10px; text-align: center; border: 1px solid var(--line); }
    .vital-label { display: block; font-size: 9px; color: var(--ink-soft); margin-bottom: 4px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
    .vital-val { font-size: 16px; font-weight: 700; color: var(--ink); }
    .vital-val.warn { color: var(--warn); }
    .preview-timeline { display: flex; flex-direction: column; gap: 8px; }
    .tl-row { display: flex; align-items: center; gap: 8px; font-size: 11px; color: var(--ink-soft); }
    .tl-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .tl-gold { background: #fbbf24; }
    .tl-blue { background: #60a5fa; }
    .tl-time { margin-left: auto; color: rgba(255,255,255,0.4); }
    
    .floating-pill { position: absolute; display: flex; align-items: center; gap: 8px; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 10px 14px; font-size: 12px; font-weight: 600; color: #fff; box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
    .floating-pill svg { width: 16px; height: 16px; }
    .pill-rx { bottom: 10px; left: -20px; color: #34d399; }
    .pill-rx svg { color: #34d399; }
    .pill-enc { bottom: -20px; right: -10px; color: #60a5fa; }
    .pill-enc svg { color: #60a5fa; }

    /* Container */
    .lp-container { max-width: 1160px; margin: 0 auto; padding: 80px 24px; }
    .section-header { text-align: center; margin-bottom: 56px; }
    .section-header h2 { font-size: 40px; margin: 0 0 12px; font-family: 'Fraunces', serif; }
    .section-header p { font-size: 18px; color: var(--ink-soft); margin: 0; }

    /* About section */
    .about-section { display: flex; align-items: flex-start; gap: 72px; margin: 80px 0; flex-wrap: wrap; }
    .about-text { flex: 1; min-width: 280px; }
    .about-text h2 { font-size: 36px; margin: 8px 0 20px; font-family: 'Fraunces', serif; line-height: 1.2; }
    .about-text p { font-size: 16px; color: var(--ink-soft); line-height: 1.7; margin: 0 0 16px; }
    .about-bullets { display: flex; flex-direction: column; gap: 16px; margin-top: 24px; }
    .about-bullet { display: flex; align-items: flex-start; gap: 12px; }
    .bullet-icon { font-size: 22px; flex-shrink: 0; margin-top: 2px; }
    .about-bullet strong { display: block; font-size: 15px; margin-bottom: 2px; }
    .about-bullet span { font-size: 14px; color: var(--ink-soft); }
    .about-visual { flex: 1; min-width: 260px; max-width: 360px; }
    .about-card { background: rgba(255,255,255,0.85); backdrop-filter: blur(12px); border: 1px solid var(--line); border-radius: 20px; padding: 28px; box-shadow: 0 16px 48px rgba(0,0,0,0.04); }
    .about-card-row.top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
    .ab-badge { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--patient); background: var(--patient-soft); border: 1px solid rgba(15,118,110,0.2); border-radius: 20px; padding: 4px 12px; }
    .ab-uid { font-family: monospace; font-size: 11px; color: var(--ink-soft); }
    .about-record-list { display: flex; flex-direction: column; gap: 10px; }
    .rec-row { display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 500; padding: 10px 12px; background: var(--bg-soft); border-radius: 10px; }
    .rec-row svg { width: 16px; height: 16px; color: var(--gold); flex-shrink: 0; }
    .rec-count { margin-left: auto; font-size: 12px; color: var(--ink-soft); font-weight: 600; }
    .rec-count.warn { color: var(--warn); }

    /* Deep features */
    .deep-features { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; margin-bottom: 80px; }
    .deep-feature-item { display: flex; gap: 16px; align-items: flex-start; background: rgba(255,255,255,0.7); backdrop-filter: blur(8px); border: 1px solid var(--line); border-radius: 16px; padding: 24px; transition: all 0.2s; }
    .deep-feature-item:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.05); }
    .df-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .df-icon svg { width: 24px; height: 24px; }
    .deep-feature-item h4 { margin: 0 0 8px; font-size: 16px; }
    .deep-feature-item p { margin: 0; font-size: 14px; color: var(--ink-soft); line-height: 1.6; }

    /* Data flow */
    .flow-diagram-wrap { background: rgba(255,255,255,0.6); backdrop-filter: blur(12px); border: 1px solid var(--line); border-radius: 28px; padding: 56px 48px; box-shadow: 0 12px 40px rgba(0,0,0,0.03); margin-bottom: 80px; }
    .flow-diagram { display: flex; align-items: center; justify-content: center; gap: 0; flex-wrap: wrap; row-gap: 32px; }
    .flow-node-lg { position: relative; display: flex; flex-direction: column; align-items: center; gap: 10px; min-width: 130px; }
    .flow-node-icon { width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(0,0,0,0.06); position: relative; z-index: 2; }
    .flow-node-icon svg { width: 36px; height: 36px; }
    .flow-node-label { font-weight: 700; font-size: 16px; }
    .flow-node-sub { font-size: 12px; color: var(--ink-soft); text-align: center; line-height: 1.4; }
    .node-pulse { position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 80px; height: 80px; border-radius: 50%; animation: pulsing 3s ease-out infinite; }
    @keyframes pulsing { 0%{transform:translateX(-50%) scale(1); opacity: 0.8;} 100%{transform:translateX(-50%) scale(2.4); opacity:0;} }
    .flow-arrow { flex: 1; min-width: 80px; position: relative; display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 0 8px; }
    .arrow-line { width: 100%; height: 2px; background: repeating-linear-gradient(90deg, var(--line) 0, var(--line) 6px, transparent 6px, transparent 14px); position: relative; }
    .arrow-line::after { content: '→'; position: absolute; right: -4px; top: 50%; transform: translateY(-50%); font-size: 16px; color: var(--ink-soft); }
    .arrow-packet { position: absolute; top: -7px; width: 16px; height: 16px; border-radius: 50%; box-shadow: 0 0 10px currentColor; }
    .pkt-1 { background: var(--patient); color: var(--patient); animation: pktMove 3s ease-in-out infinite; }
    .pkt-2 { background: var(--admin); color: var(--admin); animation: pktMove 3s ease-in-out infinite 1.5s; }
    @keyframes pktMove { 0%{left:0;opacity:0;transform:scale(0.6);} 10%{opacity:1;transform:scale(1);} 90%{opacity:1;transform:scale(1);} 100%{left:100%;opacity:0;transform:scale(0.6);} }
    .arrow-label { font-size: 11px; color: var(--ink-soft); font-weight: 600; text-align: center; letter-spacing: 0.04em; }
    .audit-strip { display: flex; justify-content: center; gap: 16px; margin-top: 40px; flex-wrap: wrap; }
    .audit-chip { display: flex; align-items: center; gap: 8px; background: var(--bg-soft); border: 1px solid var(--line); border-radius: 12px; padding: 10px 16px; font-size: 13px; font-weight: 600; color: var(--ink-soft); }
    .audit-chip svg { width: 15px; height: 15px; color: var(--gold); }

    /* Stats */
    .stats-section { display: flex; align-items: center; justify-content: center; gap: 0; background: var(--ink); border-radius: 24px; padding: 56px 64px; margin: 80px 0; flex-wrap: wrap; row-gap: 32px; }
    .stat-block { flex: 1; min-width: 140px; text-align: center; }
    .stat-num-lg { font-family: 'Fraunces', serif; font-size: 60px; font-weight: 700; color: #fff; line-height: 1; margin-bottom: 8px; }
    .stat-desc { font-size: 13px; color: rgba(255,255,255,0.55); font-weight: 500; max-width: 160px; margin: 0 auto; line-height: 1.4; }
    .stat-divider { width: 1px; height: 80px; background: rgba(255,255,255,0.08); flex-shrink: 0; margin: 0 40px; }

    /* Security */
    .security-section { display: flex; align-items: center; justify-content: center; gap: 64px; max-width: 1000px; margin: 0 auto 80px; background: var(--surface); border: 1px solid var(--line); padding: 60px; border-radius: 24px; box-shadow: 0 12px 32px rgba(0,0,0,0.02); flex-wrap: wrap; }
    .security-section img { max-width: 320px; height: auto; }
    .security-section h2 { font-size: 32px; margin: 8px 0 16px; font-family: 'Fraunces', serif; line-height: 1.2; }
    .security-chips { display: flex; flex-direction: column; gap: 8px; margin-top: 24px; }
    .sec-chip { font-size: 14px; font-weight: 500; color: var(--ink-soft); }

    /* Footer CTA */
    .lp-footer-cta { position: relative; overflow: hidden; background: transparent; padding: 120px 24px; text-align: center; }
    .footer-cta-inner { position: relative; z-index: 2; }
    .footer-cta-inner h2 { font-family: 'Fraunces', serif; font-weight: 700; letter-spacing: -0.02em; }
    .footer-cta-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
    .footer-btn-patient { padding: 16px 32px; font-size: 15px; background: var(--patient); border-radius: 14px; box-shadow: 0 8px 24px rgba(31,111,84,0.25); }
    .footer-btn-doctor { padding: 16px 32px; font-size: 15px; background: var(--doctor); border-radius: 14px; box-shadow: 0 8px 24px rgba(30,58,95,0.2); }
    .footer-btn-patient:hover, .footer-btn-doctor:hover { transform: translateY(-2px); }

    /* Trusted By */
    .trusted-by-section { padding: 40px 24px; text-align: center; background: rgba(255,255,255,0.4); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
    .trusted-eyebrow { font-size: 11px; font-weight: 700; color: var(--ink-soft); letter-spacing: 0.1em; margin: 0 0 24px; }
    .trusted-logos { display: flex; align-items: center; justify-content: center; gap: 48px; flex-wrap: wrap; color: var(--ink-soft); }
    .logo-item { display: flex; align-items: center; gap: 8px; font-family: 'Fraunces', serif; font-size: 20px; font-weight: 600; opacity: 0.6; filter: grayscale(100%); transition: all 0.2s; }
    .logo-item svg { width: 24px; height: 24px; }
    .logo-item:hover { opacity: 1; filter: grayscale(0%); color: var(--ink); }

    /* Real Footer */
    .real-footer { background: var(--ink); color: rgba(255,255,255,0.7); padding: 80px 24px 40px; margin-top: 0; }
    .footer-grid { max-width: 1160px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; padding-bottom: 64px; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .footer-brand p { font-size: 14px; line-height: 1.6; margin: 0 0 24px; max-width: 280px; color: rgba(255,255,255,0.6); }
    .footer-socials { display: flex; gap: 12px; }
    .social-icon { width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #fff; cursor: pointer; transition: background 0.2s; }
    .social-icon:hover { background: rgba(255,255,255,0.2); }
    .footer-col h4 { color: #fff; font-size: 15px; margin: 0 0 20px; }
    .footer-col a { display: block; color: rgba(255,255,255,0.6); font-size: 14px; margin-bottom: 12px; transition: color 0.2s; text-decoration: none; }
    .footer-col a:hover { color: #fff; }
    .footer-bottom { max-width: 1160px; margin: 32px auto 0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; font-size: 13px; }
    .footer-badges { display: flex; gap: 12px; }
    .f-badge { border: 1px solid rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; }

    @media (max-width: 900px) {
      .hero-title { font-size: 40px; }
      .hero-visual { display: none; }
      .about-section { flex-direction: column; }
      .about-visual { max-width: 100%; }
      .stats-section { padding: 40px 24px; }
      .stat-divider { display: none; }
      .security-section { padding: 40px 24px; }
      .flow-diagram-wrap { padding: 32px 20px; }
      .footer-grid { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 600px) {
      .footer-grid { grid-template-columns: 1fr; }
      .footer-bottom { flex-direction: column; text-align: center; }
    }
  `]
})
export class LandingComponent {
  icons = ICONS;
}
