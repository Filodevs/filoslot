import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  if (!auth.isAuthenticated()) {
    return next(req);
  }

  const session = localStorage.getItem('session');
  if (!session) {
    return next(req);
  }

  const { token } = JSON.parse(session) as { token: string };

  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });

  return next(authReq);
};
