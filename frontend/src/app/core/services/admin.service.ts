import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import * as M from '../models/models';

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  constructor(private api: ApiService) {}

  getPendingDoctors() { return this.api.get<M.DoctorProfile[]>('/admin/doctors/pending'); }
  getAllDoctors() { return this.api.get<M.DoctorListItem[]>('/admin/doctors'); }
  getAllPatients() { return this.api.get<M.PatientListItem[]>('/admin/patients'); }
  approveDoctor(id: number) { return this.api.put<M.DoctorProfile>(`/admin/doctors/${id}/approve`); }
  rejectDoctor(id: number) { return this.api.put<M.DoctorProfile>(`/admin/doctors/${id}/reject`); }
  createPatient(body: any) { return this.api.post<M.AuthResponse>('/admin/patients', body); }
  getAllUsers() { return this.api.get<M.AppUser[]>('/admin/users'); }
  deactivateUser(id: number) { return this.api.put<M.AppUser>(`/admin/users/${id}/deactivate`); }
  createAppointment(body: any) { return this.api.post<M.Appointment>('/admin/appointments', body); }
  getAllAppointments() { return this.api.get<M.Appointment[]>('/admin/appointments'); }
  cancelAppointment(id: number) { return this.api.put<M.Appointment>(`/admin/appointments/${id}/cancel`); }
  getAccessLogs() { return this.api.get<M.AccessLog[]>('/admin/access-logs'); }
  getEmergencyLogs() { return this.api.get<M.EmergencyAccessLog[]>('/admin/emergency-logs'); }
}
