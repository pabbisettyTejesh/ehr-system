import { Component, OnInit } from '@angular/core';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientApiService } from '../../core/services/patient.service';
import { PatientProfile } from '../../core/models/models';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeHtmlPipe],
  templateUrl: './patient-profile.component.html'
})
export class PatientProfileComponent implements OnInit {
  icons = ICONS;
  profile: PatientProfile | null = null;
  saving = false;
  message = '';

  constructor(private api: PatientApiService) {}

  ngOnInit() {
    this.api.getProfile().subscribe(p => this.profile = p);
  }

  save() {
    if (!this.profile) return;
    this.saving = true;
    this.api.updateProfile(this.profile).subscribe({
      next: (p) => { this.profile = p; this.saving = false; this.message = 'Profile updated.'; },
      error: () => { this.saving = false; this.message = 'Update failed.'; }
    });
  }
}
