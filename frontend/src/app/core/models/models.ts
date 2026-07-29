export interface AuthResponse {
  token: string | null;
  userId: number;
  email: string;
  role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
  patientUid: string | null;
  approvalStatus: string | null;
}

export interface PatientProfile {
  id: number;
  userId: number;
  patientUid: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  address: string;
  city: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

export interface DoctorProfile {
  id: number;
  userId: number;
  fullName: string;
  specialization: string;
  licenseNumber: string;
  qualification: string;
  experienceYears: number;
  defaultHospitalName: string;
  approvalStatus: 'PENDING_APPROVAL' | 'ACTIVE' | 'REJECTED' | 'DEACTIVATED';
}

export interface AppUser {
  id: number;
  email: string;
  role: string;
  accountStatus: string;
  isActive: boolean;
}

export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  appointmentDate: string;
  reason: string;
  status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED';
  accessStartTime: string;
  accessEndTime: string;
}

export interface Encounter {
  id: number;
  appointmentId: number;
  patientId: number;
  doctorId: number;
  hospitalName: string;
  departmentName: string;
  visitDate: string;
  visitType: 'NORMAL' | 'FOLLOW_UP' | 'EMERGENCY' | 'ONLINE';
  chiefComplaint: string;
  summary: string;
}

export interface MedicalRecord {
  id: number;
  encounterId: number;
  patientId: number;
  doctorId: number;
  diagnosis: string;
  symptoms: string;
  clinicalNotes: string;
  treatmentPlan: string;
  recordStatus: string;
  createdAt: string;
}

export interface PrescriptionItem {
  id?: number;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface Prescription {
  id: number;
  encounterId: number;
  patientId: number;
  doctorId: number;
  status: 'ACTIVE' | 'UPDATED' | 'STOPPED' | 'COMPLETED';
  items: PrescriptionItem[];
  createdAt: string;
}

export interface Allergy {
  id: number;
  patientId: number;
  allergenName: string;
  reaction: string;
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  status: 'ACTIVE' | 'RESOLVED';
  recordedByDoctorId: number;
  recordedAt: string;
  notes: string;
}

export interface ReportItem {
  id: number;
  encounterId: number;
  patientId: number;
  reportName: string;
  reportType: string;
  hospitalName: string;
  uploadedAt: string;
}

export interface AccessLog {
  id: number;
  userId: number;
  patientId: number;
  action: string;
  accessMode: string;
  ipAddress: string;
  timestamp: string;
  details: string;
}

export interface EmergencyAccessLog {
  id: number;
  doctorId: number;
  patientId: number;
  reason: string;
  viewedAt: string;
}

export interface EmergencyAccessResult {
  patientName: string;
  age: number;
  gender: string;
  bloodGroup: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  activeAllergies: { allergenName: string; severity: string; reaction: string }[];
  chronicConditions: string[];
  currentMedications: string[];
  pastMajorSurgeries: string[];
}

export interface AppointedPatient {
  appointmentId: number;
  patientId: number;
  patientUid: string;
  patientName: string;
  status: string;
  appointmentDate: string;
  accessEndTime: string;
}

export interface EncounterSummary {
  id: number;
  patientId: number;
  patientUid: string;
  patientName: string;
  hospitalName: string;
  visitDate: string;
  visitType: string;
  chiefComplaint: string;
}

export interface PatientListItem {
  id: number;
  patientUid: string;
  fullName: string;
  city: string;
}

export interface DoctorListItem {
  id: number;
  fullName: string;
  specialization: string;
  defaultHospitalName: string;
  approvalStatus: string;
}
