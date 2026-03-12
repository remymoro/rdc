import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { routes } from './app.routes';
import { CentreRepository } from './application/ports/centre.repository';
import { CentreHttpRepository } from './infrastructure/repositories/centre.http.repository';
import { AuthRepository } from './application/ports/auth.repository';
import { AuthHttpRepository } from './infrastructure/repositories/auth.http.repository';
import { authTokenInterceptor } from './infrastructure/http/auth-token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authTokenInterceptor])),
    providePrimeNG({ theme: { preset: Aura } }),
    {
      provide: CentreRepository,
      useClass: CentreHttpRepository,
    },
    {
      provide: AuthRepository,
      useClass: AuthHttpRepository,
    },
  ],
};
