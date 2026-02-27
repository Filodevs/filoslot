import { Routes } from '@angular/router';

import { AdminLayout } from './core/layout/admin-layout/admin-layout';
import { PublicLayout } from './core/layout/public-layout/public-layout';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/public/public.routes').then(
            (r) => r.PUBLIC_ROUTES,
          ),
      },
    ],
  },
  {
    path: 'admin',
    component: AdminLayout,

    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/admin/admin.routes').then((r) => r.ADMIN_ROUTES),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
