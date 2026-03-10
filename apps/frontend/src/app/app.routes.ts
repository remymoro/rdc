import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'centres',
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
