import { Routes } from '@angular/router';

import { MainLayout } from './core/layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/public/public.routes').then(r => r.PUBLIC_ROUTES)
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('./features/admin/admin.routes').then(r => r.ADMIN_ROUTES)
      }
    ] 
  },
  { path: '**', redirectTo: '' }
];