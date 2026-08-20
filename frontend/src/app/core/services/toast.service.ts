import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private idCounter = 0;
  toasts = signal<Toast[]>([]);

  showSuccess(message: string, durationMs = 4000) {
    this.addToast(message, 'success', durationMs);
  }

  showError(message: string, durationMs = 5000) {
    this.addToast(message, 'error', durationMs);
  }

  showInfo(message: string, durationMs = 4000) {
    this.addToast(message, 'info', durationMs);
  }

  remove(id: number) {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }

  private addToast(message: string, type: 'success' | 'error' | 'info', durationMs: number) {
    const id = ++this.idCounter;
    this.toasts.update(current => [...current, { id, message, type }]);
    setTimeout(() => this.remove(id), durationMs);
  }
}
