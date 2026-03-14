import { ApplicationConfig, inject, provideAppInitializer, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';
import { CentreRepository } from './application/ports/centre.repository';
import { CentreHttpRepository } from './infrastructure/repositories/centre.http.repository';
import { AuthRepository } from './application/ports/auth.repository';
import { AuthHttpRepository } from './infrastructure/repositories/auth.http.repository';
import { authTokenInterceptor } from './infrastructure/http/auth-token.interceptor';
import { AuthFacade } from './application/facades/auth.facade';
import { MagasinRepository } from './application/ports/magasin.repository';
import { ResponsableCentreRepository } from './application/ports/responsable-centre.repository';
import { MagasinHttpRepository } from './infrastructure/repositories/magasin.http.repository';
import { ResponsableCentreHttpRepository } from './infrastructure/repositories/responsable-centre.http.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authTokenInterceptor])),
    providePrimeNG({ theme: { preset: Aura } }),
    provideAppInitializer(() => inject(AuthFacade).init()),
    {
      provide: CentreRepository,
      useClass: CentreHttpRepository,
    },
    {
      provide: AuthRepository,
      useClass: AuthHttpRepository,
    },
    {
      provide: ResponsableCentreRepository,
      useClass: ResponsableCentreHttpRepository,
    },
    {
      provide: MagasinRepository,
      useClass: MagasinHttpRepository,
    },
  ],
};
