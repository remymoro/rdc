import { Routes } from '@angular/router';
import { authGuard } from './infrastructure/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./ui/auth/login/login.component').then(
        m => m.LoginComponent
      ),
  },
  {
    path: 'centres',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./ui/centres/centre-list/centre-list.component').then(
        m => m.CentreListComponent
      ),
  },
  {
    path: '',
    redirectTo: 'centres',
    pathMatch: 'full',
  },
];
