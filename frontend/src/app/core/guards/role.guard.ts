import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export function roleGuard(allowedRole: string): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isLoggedIn) {
      router.navigate(['/login']);
      return false;
    }
    if (auth.role !== allowedRole) {
      router.navigate(['/login']);
      return false;
    }
    return true;
  };
}
