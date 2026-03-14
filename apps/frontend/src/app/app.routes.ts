import { Routes } from '@angular/router';
import { guestGuard } from './infrastructure/guards/guest.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./ui/auth/login/login.component').then(
        m => m.LoginComponent
      ),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.routes').then(
        m => m.ADMIN_ROUTES
      ),
  },
  {
    path: 'centre',
    loadChildren: () =>
      import('./features/centre/centre.routes').then(
        m => m.CENTRE_ROUTES
      ),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
