import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { NotFoundComponent } from './not-found/not-found.component';

import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterPatientComponent } from './auth/register-patient/register-patient.component';
import { RegisterDoctorComponent } from './auth/register-doctor/register-doctor.component';

import { PatientDashboardComponent } from './patient/dashboard/patient-dashboard.component';
import { PatientProfileComponent } from './patient/profile/patient-profile.component';
import { PatientAppointmentsComponent } from './patient/appointments/patient-appointments.component';
import { PatientMedicalHistoryComponent } from './patient/medical-history/patient-medical-history.component';
import { PatientPrescriptionsComponent } from './patient/prescriptions/patient-prescriptions.component';
import { PatientAllergiesComponent } from './patient/allergies/patient-allergies.component';
import { PatientReportsComponent } from './patient/reports/patient-reports.component';
import { PatientAccessLogsComponent } from './patient/access-logs/patient-access-logs.component';

import { DoctorDashboardComponent } from './doctor/dashboard/doctor-dashboard.component';
import { DoctorProfileComponent } from './doctor/profile/doctor-profile.component';
import { DoctorPatientsComponent } from './doctor/patients/doctor-patients.component';
import { DoctorSearchPatientComponent } from './doctor/search-patient/doctor-search-patient.component';
import { DoctorPatientSummaryComponent } from './doctor/patient-summary/doctor-patient-summary.component';
import { DoctorCreateEncounterComponent } from './doctor/create-encounter/doctor-create-encounter.component';
import { DoctorMedicalRecordComponent } from './doctor/medical-record/doctor-medical-record.component';
import { DoctorPrescriptionComponent } from './doctor/prescription/doctor-prescription.component';
import { DoctorAllergiesComponent } from './doctor/allergies/doctor-allergies.component';
import { DoctorReportsComponent } from './doctor/reports/doctor-reports.component';
import { DoctorEmergencyAccessComponent } from './doctor/emergency-access/doctor-emergency-access.component';

import { AdminDashboardComponent } from './admin/dashboard/admin-dashboard.component';
import { AdminPendingDoctorsComponent } from './admin/pending-doctors/admin-pending-doctors.component';
import { AdminCreatePatientComponent } from './admin/create-patient/admin-create-patient.component';
import { AdminCreateAppointmentComponent } from './admin/create-appointment/admin-create-appointment.component';
import { AdminManageAppointmentsComponent } from './admin/manage-appointments/admin-manage-appointments.component';
import { AdminManageUsersComponent } from './admin/manage-users/admin-manage-users.component';
import { AdminAccessLogsComponent } from './admin/access-logs/admin-access-logs.component';
import { AdminEmergencyLogsComponent } from './admin/emergency-logs/admin-emergency-logs.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register/patient', component: RegisterPatientComponent },
  { path: 'register/doctor', component: RegisterDoctorComponent },

  // Patient
  { path: 'patient/dashboard', component: PatientDashboardComponent, canActivate: [roleGuard('PATIENT')] },
  { path: 'patient/profile', component: PatientProfileComponent, canActivate: [roleGuard('PATIENT')] },
  { path: 'patient/appointments', component: PatientAppointmentsComponent, canActivate: [roleGuard('PATIENT')] },
  { path: 'patient/medical-history', component: PatientMedicalHistoryComponent, canActivate: [roleGuard('PATIENT')] },
  { path: 'patient/prescriptions', component: PatientPrescriptionsComponent, canActivate: [roleGuard('PATIENT')] },
  { path: 'patient/allergies', component: PatientAllergiesComponent, canActivate: [roleGuard('PATIENT')] },
  { path: 'patient/reports', component: PatientReportsComponent, canActivate: [roleGuard('PATIENT')] },
  { path: 'patient/access-logs', component: PatientAccessLogsComponent, canActivate: [roleGuard('PATIENT')] },

  // Doctor
  { path: 'doctor/dashboard', component: DoctorDashboardComponent, canActivate: [roleGuard('DOCTOR')] },
  { path: 'doctor/profile', component: DoctorProfileComponent, canActivate: [roleGuard('DOCTOR')] },
  { path: 'doctor/patients', component: DoctorPatientsComponent, canActivate: [roleGuard('DOCTOR')] },
  { path: 'doctor/search-patient', component: DoctorSearchPatientComponent, canActivate: [roleGuard('DOCTOR')] },
  { path: 'doctor/patient-summary/:patientId', component: DoctorPatientSummaryComponent, canActivate: [roleGuard('DOCTOR')] },
  { path: 'doctor/create-encounter', component: DoctorCreateEncounterComponent, canActivate: [roleGuard('DOCTOR')] },
  { path: 'doctor/medical-record', component: DoctorMedicalRecordComponent, canActivate: [roleGuard('DOCTOR')] },
  { path: 'doctor/prescription', component: DoctorPrescriptionComponent, canActivate: [roleGuard('DOCTOR')] },
  { path: 'doctor/allergies', component: DoctorAllergiesComponent, canActivate: [roleGuard('DOCTOR')] },
  { path: 'doctor/reports', component: DoctorReportsComponent, canActivate: [roleGuard('DOCTOR')] },
  { path: 'doctor/emergency-access', component: DoctorEmergencyAccessComponent, canActivate: [roleGuard('DOCTOR')] },

  // Admin
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [roleGuard('ADMIN')] },
  { path: 'admin/pending-doctors', component: AdminPendingDoctorsComponent, canActivate: [roleGuard('ADMIN')] },
  { path: 'admin/create-patient', component: AdminCreatePatientComponent, canActivate: [roleGuard('ADMIN')] },
  { path: 'admin/create-appointment', component: AdminCreateAppointmentComponent, canActivate: [roleGuard('ADMIN')] },
  { path: 'admin/manage-appointments', component: AdminManageAppointmentsComponent, canActivate: [roleGuard('ADMIN')] },
  { path: 'admin/manage-users', component: AdminManageUsersComponent, canActivate: [roleGuard('ADMIN')] },
  { path: 'admin/access-logs', component: AdminAccessLogsComponent, canActivate: [roleGuard('ADMIN')] },
  { path: 'admin/emergency-logs', component: AdminEmergencyLogsComponent, canActivate: [roleGuard('ADMIN')] },

  { path: '**', component: NotFoundComponent }
];
