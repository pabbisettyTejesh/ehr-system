import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const toast = inject(ToastService);
  const token = auth.token;

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMsg = 'An unknown error occurred';
      if (error.error?.message) {
        errorMsg = error.error.message;
      } else if (error.status === 401) {
        errorMsg = 'Session expired or unauthorized. Please log in again.';
        auth.logout();
      } else if (error.status === 403) {
        errorMsg = 'You do not have permission to perform this action.';
      } else if (error.status >= 500) {
        errorMsg = 'Server error. Please try again later.';
      }
      
      toast.showError(errorMsg);
      return throwError(() => error);
    })
  );
};
