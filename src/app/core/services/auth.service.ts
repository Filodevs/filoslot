import { Injectable, signal } from '@angular/core';

import { delay, Observable, of, throwError } from 'rxjs';

import {
  AUTH_CREDENTIALS_MOCK,
  AUTH_RESPONSE_MOCK,
} from '../../models/__mocks__/auth.mock';
import { ILoginCredentials, ILoginResponse, IUser } from '../../models/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _currentUser = signal<IUser | null>(null);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = () => this._currentUser() !== null;

  login(credentials: ILoginCredentials): Observable<ILoginResponse> {
    const isValid =
      credentials.email === AUTH_CREDENTIALS_MOCK.email &&
      credentials.password === AUTH_CREDENTIALS_MOCK.password;

    if (!isValid) {
      return throwError(() => new Error('Credenciales incorrectas')).pipe(
        delay(800),
      );
    }

    return of(AUTH_RESPONSE_MOCK).pipe(delay(800));
  }

  setSession(response: ILoginResponse): void {
    this._currentUser.set(response.user);
    localStorage.setItem('token', response.token);
  }

  logout(): void {
    this._currentUser.set(null);
    localStorage.removeItem('token');
  }
}
