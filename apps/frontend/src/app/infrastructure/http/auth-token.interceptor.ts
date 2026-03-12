import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthFacade } from '../../application/facades/auth.facade';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthFacade);
  const token = auth.accessToken();

  if (!token) {
    return next(req);
  }

  if (req.url.includes('/api/auth/login') || req.url.includes('/api/auth/refresh')) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );
};
