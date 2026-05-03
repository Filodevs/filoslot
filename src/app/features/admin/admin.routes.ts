import { Routes } from '@angular/router';

import { Admin } from './admin';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: Admin,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard').then((c) => c.Dashboard),
      },
      {
        path: 'setup',
        loadComponent: () => import('./setup/setup').then((c) => c.Setup),
      },
      {
        path: 'profile',
        loadComponent: () => import('./profile/profile').then((c) => c.Profile),
      },
    ],
  },
];
