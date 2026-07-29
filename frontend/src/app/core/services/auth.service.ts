import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../models/models';
import { environment } from '../../../environments/environment';

const STORAGE_KEY = 'ehr_auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentAuth = signal<AuthResponse | null>(this.loadFromStorage());

  constructor(private http: HttpClient) {}

  private loadFromStorage(): AuthResponse | null {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  private persist(auth: AuthResponse | null) {
    if (auth) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
    this.currentAuth.set(auth);
  }

  registerPatient(payload: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register/patient`, payload)
      .pipe(tap(res => { if (res.token) this.persist(res); }));
  }

  registerDoctor(payload: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register/doctor`, payload);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(tap(res => this.persist(res)));
  }

  logout() {
    this.persist(null);
  }

  get token(): string | null {
    return this.currentAuth()?.token ?? null;
  }

  get role(): string | null {
    return this.currentAuth()?.role ?? null;
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }
}
