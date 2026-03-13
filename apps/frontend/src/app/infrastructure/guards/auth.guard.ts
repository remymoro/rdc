import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthFacade } from '../../application/facades/auth.facade';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthFacade);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { redirectTo: state.url },
  });
};
