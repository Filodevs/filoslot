import { Routes } from '@angular/router';

import { Public } from './public';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    component: Public,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./directory/directory').then((c) => c.Directory),
      },
      {
        path: 'business/:businessSlug',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./business-profile/business-profile').then(
                (c) => c.BusinessProfile,
              ),
          },
          {
            path: 'booking',
            loadComponent: () =>
              import('./booking/booking-container').then(
                (c) => c.BookingContainer,
              ),
          },
          {
            path: 'booking/:token',
            loadComponent: () =>
              import('./booking-confirmation/booking-confirmation').then(
                (c) => c.BookingConfirmation,
              ),
          },
        ],
      },
    ],
  },
];
