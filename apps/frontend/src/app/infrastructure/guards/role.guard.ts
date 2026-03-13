import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthUserDto } from '@rdc/shared';
import { AuthFacade } from '../../application/facades/auth.facade';

export const roleGuard: CanActivateFn = route => {
  const auth = inject(AuthFacade);
  const router = inject(Router);
  const allowedRoles = route.data?.['roles'] as AuthUserDto['role'][] | undefined;

  if (!allowedRoles?.length) {
    return true;
  }

  const user = auth.user();
  if (user && allowedRoles.includes(user.role)) {
    return true;
  }

  return router.createUrlTree([auth.homeUrl()]);
};
