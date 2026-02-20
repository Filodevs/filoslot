import { Routes } from '@angular/router';

import { MainLayout } from './core/layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'booking',
        loadComponent: () =>
          import('./features/booking/booking-container').then(
            (m) => m.BookingContainer,
          ),
      },
      { path: '', redirectTo: 'booking', pathMatch: 'full' },
      {
        path: 'admin',
        loadComponent: () =>
          import('./features/admin/resources/resources').then(
            (m) => m.Resources,
          ),
      },
    ],
  },
];
