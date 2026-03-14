import { Routes } from '@angular/router';
import { authGuard } from '../../infrastructure/guards/auth.guard';
import { roleGuard } from '../../infrastructure/guards/role.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import('./shell/admin-shell.component').then(
        m => m.AdminShellComponent
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./dashboard/admin-dashboard.component').then(
            m => m.AdminDashboardComponent
          ),
      },
      {
        path: 'centres',
        loadComponent: () =>
          import('./centres/admin-centres-page.component').then(
            m => m.AdminCentresPageComponent
          ),
      },
      {
        path: 'responsables',
        loadComponent: () =>
          import('./responsables/admin-responsables-page.component').then(
            m => m.AdminResponsablesPageComponent
          ),
      },
      {
        path: 'profil',
        loadComponent: () =>
          import('../../ui/profil/profil.component').then(
            m => m.ProfilComponent
          ),
      },
    ],
  },
];
