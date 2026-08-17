import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientApiService } from '../../core/services/patient.service';
import { PatientProfile } from '../../core/models/models';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-profile.component.html'
})
export class PatientProfileComponent implements OnInit {
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
