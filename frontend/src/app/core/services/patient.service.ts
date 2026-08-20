import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import * as M from '../models/models';

@Injectable({ providedIn: 'root' })
export class PatientApiService {
  constructor(private api: ApiService) {}

  getProfile() { return this.api.get<M.PatientProfile>('/patient/profile'); }
  updateProfile(body: any) { return this.api.put<M.PatientProfile>('/patient/profile', body); }
  getAppointments() { return this.api.get<M.Appointment[]>('/patient/appointments'); }
  getActiveDoctors() { return this.api.get<M.DoctorListItem[]>('/patient/doctors/active'); }
  requestAppointment(body: any) { return this.api.post<M.Appointment>('/patient/appointments/request', body); }
  getMedicalHistory() { return this.api.get<M.MedicalRecord[]>('/patient/medical-history'); }
  getPrescriptions() { return this.api.get<M.Prescription[]>('/patient/prescriptions'); }
  getAllergies() { return this.api.get<M.Allergy[]>('/patient/allergies'); }
  getReports() { return this.api.get<M.ReportItem[]>('/patient/reports'); }
  getAccessLogs() { return this.api.get<M.AccessLog[]>('/patient/access-logs'); }
  getEmergencyLogs() { return this.api.get<M.EmergencyAccessLog[]>('/patient/emergency-logs'); }
}
