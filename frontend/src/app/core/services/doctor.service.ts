import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import * as M from '../models/models';

@Injectable({ providedIn: 'root' })
export class DoctorApiService {
  constructor(private api: ApiService) {}

  searchPatient(patientUid: string) {
    return this.api.get<any>('/doctor/patients/search', { patientUid });
  }
  getMyPatients() { return this.api.get<M.Appointment[]>('/doctor/patients'); }
  getMyPatientsDetailed() { return this.api.get<M.AppointedPatient[]>('/doctor/patients/detailed'); }
  getMyEncountersDetailed() { return this.api.get<M.EncounterSummary[]>('/doctor/encounters/detailed'); }
  getPatientSummary(patientId: number) {
    return this.api.get<M.PatientProfile>(`/doctor/patients/${patientId}/summary`);
  }
  createEncounter(body: any) { return this.api.post<M.Encounter>('/doctor/encounters', body); }
  getMyEncounters() { return this.api.get<M.Encounter[]>('/doctor/encounters'); }
  addMedicalRecord(body: any) { return this.api.post<M.MedicalRecord>('/doctor/medical-records', body); }
  createPrescription(body: any) { return this.api.post<M.Prescription>('/doctor/prescriptions', body); }
  updatePrescriptionStatus(id: number, status: string) {
    return this.api.put<M.Prescription>(`/doctor/prescriptions/${id}/status?status=${status}`, {});
  }
  addAllergy(body: any) { return this.api.post<M.Allergy>('/doctor/allergies', body); }
  updateAllergy(id: number, body: any) { return this.api.put<M.Allergy>(`/doctor/allergies/${id}`, body); }
  addReport(body: any) { return this.api.post<M.ReportItem>('/doctor/reports', body); }
}
