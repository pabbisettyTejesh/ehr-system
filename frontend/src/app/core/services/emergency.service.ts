import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import * as M from '../models/models';

@Injectable({ providedIn: 'root' })
export class EmergencyApiService {
  constructor(private api: ApiService) {}

  requestAccess(patientUid: string, reason: string) {
    return this.api.post<M.EmergencyAccessResult>('/emergency/access', { patientUid, reason });
  }
}
