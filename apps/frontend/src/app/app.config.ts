import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { CentreRepository } from './domain/centre.repository';
import { CentreHttpRepository } from './infrastructure/repositories/centre.http.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: CentreRepository,
      useClass: CentreHttpRepository,
    },
  ],
};
