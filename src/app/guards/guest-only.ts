import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const guestOnlyGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isLoggedIn()) {
    const homePath = router.parseUrl('/');
    return new RedirectCommand(homePath);
  }

  return true;
};
