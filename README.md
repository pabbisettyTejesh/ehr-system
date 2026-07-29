# Centralized Patient-Centric EHR Management System

Full-stack scaffold: **Spring Boot (Java) backend** + **Angular frontend**,
built directly from your MVP spec (auth, patient/doctor/admin modules,
appointment-based access, emergency access, audit logging).

## Structure

```
ehr-system/
├── backend/     Spring Boot 3.2 / Java 17 / MySQL / JWT
└── frontend/    Angular 17 (standalone components)
```

## Default admin login

There's no public "register as admin" endpoint on purpose (admins
shouldn't be self-service). A `DataSeeder` runs on first backend
startup and creates one automatically:

```
email:    admin@ehr.com
password: Admin@123
```

Change this password (or delete/edit `DataSeeder.java`) before any
real deployment — it's local-dev seed data only.

## Running the backend

1. Install Java 17+ and Maven (or use the included `mvnw` if you add one).
2. Create a MySQL database, or just let `createDatabaseIfNotExist=true`
   handle it (see `src/main/resources/application.properties`).
3. Update `application.properties` with your DB username/password.
4. From `backend/`:
   ```
   mvn spring-boot:run
   ```
5. API runs on `http://localhost:8080/api`.

To use PostgreSQL instead: swap the `mysql-connector-j` dependency in
`pom.xml` for `org.postgresql:postgresql`, and update the datasource URL
and dialect in `application.properties`.

## Running the frontend

1. Install Node.js 18+ and Angular CLI (`npm i -g @angular/cli`).
2. From `frontend/`:
   ```
   npm install
   npm start
   ```
3. App runs on `http://localhost:4200` and talks to the backend at
   `http://localhost:8080/api` (see `src/environments/environment.ts`).

## What's implemented (MVP, matches your doc's Phases 1–5)

**Backend**
- JWT auth, BCrypt password hashing, role-based route protection
- All 12 entities from section 12 (User, PatientProfile, DoctorProfile,
  Appointment, Encounter, MedicalRecord, Allergy, Prescription,
  PrescriptionItem, Report, AccessLog, EmergencyAccessLog)
- Appointment-based full-access rule (section 17.1) enforced in
  `DoctorService.assertHasFullAccess()` on every clinical write/read
- Emergency access rule (17.2): doctor-must-be-ACTIVE + mandatory reason +
  critical-data-only response + automatic logging
- Admin approval workflow for doctors; patient self-register or
  admin-created; sequential `PAT-YYYY-NNNNNN` UID generator
- Access logging wired into the sensitive patient/doctor endpoints

**Frontend**
- Login / patient registration / doctor registration
- Patient dashboard: profile, appointments, medical history timeline,
  prescriptions, allergies, reports, access + emergency logs
- Doctor dashboard: appointed patients, UID search (limited view),
  patient summary, create encounter, add medical record, create
  prescription, manage allergies, add report metadata, emergency access
- Admin dashboard: approve/reject doctors, create patients, create/manage
  appointments, manage users, view access & emergency logs
- Route guards per role, JWT auto-attached via HTTP interceptor

## What's intentionally left for you to extend (per your "Excluded from MVP" list)
- File upload for reports (metadata-only is wired up; add multipart
  upload in `ReportController`/`doctor-reports` when ready)
- Patient-requested appointments (Option B in section 21.1)
- Finer-grained allergy/medicine interaction warnings (a basic
  substring-match check exists in `DoctorService.createPrescription`)
- Pagination/filtering on log and list views
- Unit/integration tests

## Security notes baked in
- No sensitive medical data inside the JWT (only userId/email/role)
- Angular route guards are UI-only; every real check happens in
  `SecurityConfig` + service-layer methods like `assertHasFullAccess`
- Soft-deactivation only — nothing is hard-deleted
