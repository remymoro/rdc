import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthFacade } from '../../application/facades/auth.facade';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthFacade);
  const router = inject(Router);

  if (auth.isAuthenticated() && auth.isAdmin()) {
    return true;
  }

  return router.createUrlTree(['/centres']);
};
