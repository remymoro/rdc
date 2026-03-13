import { Routes } from '@angular/router';
import { authGuard } from './infrastructure/guards/auth.guard';
import { roleGuard } from './infrastructure/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./ui/auth/login/login.component').then(
        m => m.LoginComponent
      ),
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import('./features/admin/shell/admin-shell.component').then(
        m => m.AdminShellComponent
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./features/admin/dashboard/admin-dashboard.component').then(
            m => m.AdminDashboardComponent
          ),
      },
      {
        path: 'centres',
        loadComponent: () =>
          import('./features/admin/centres/admin-centres-page.component').then(
            m => m.AdminCentresPageComponent
          ),
      },
      {
        path: 'responsables',
        loadComponent: () =>
          import('./features/admin/responsables/admin-responsables-page.component').then(
            m => m.AdminResponsablesPageComponent
          ),
      },
      {
        path: 'profil',
        loadComponent: () =>
          import('./ui/profil/profil.component').then(
            m => m.ProfilComponent
          ),
      },
    ],
  },
  {
    path: 'centre',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['RESPONSABLE_CENTRE'] },
    loadComponent: () =>
      import('./features/centre/shell/centre-shell.component').then(
        m => m.CentreShellComponent
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./features/centre/dashboard/centre-dashboard.component').then(
            m => m.CentreDashboardComponent
          ),
      },
      {
        path: 'mon-centre',
        loadComponent: () =>
          import('./features/centre/mon-centre/centre-home.component').then(
            m => m.CentreHomeComponent
          ),
      },
      {
        path: 'profil',
        loadComponent: () =>
          import('./ui/profil/profil.component').then(
            m => m.ProfilComponent
          ),
      },
    ],
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
