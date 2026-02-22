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
        pathMatch: 'full'
      }
    ]
  }
];