import { Routes } from '@angular/router';
import { authGuard } from '../../infrastructure/guards/auth.guard';
import { roleGuard } from '../../infrastructure/guards/role.guard';

export const CENTRE_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['RESPONSABLE_CENTRE'] },
    loadComponent: () =>
      import('./shell/centre-shell.component').then(
        m => m.CentreShellComponent
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./dashboard/centre-dashboard.component').then(
            m => m.CentreDashboardComponent
          ),
      },
      {
        path: 'mon-centre',
        loadComponent: () =>
          import('./mon-centre/centre-home.component').then(
            m => m.CentreHomeComponent
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
