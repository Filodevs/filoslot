import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { catchError, delay, map, Observable, of, tap, throwError } from 'rxjs';

import {
  AUTH_CREDENTIALS_MOCK,
  AUTH_RESPONSE_MOCK,
} from '../../models/__mocks__/auth.mock';
import { ILoginCredentials, ILoginResponse, IUser } from '../../models/user';
import { EnvironmentService } from './environment.service';

interface ApiResponse<T> {
  data: T;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly env = inject(EnvironmentService);
  private readonly _currentUser = signal<IUser | null>(null);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = () => this._currentUser() !== null;

  constructor() {
    this._initializeSession();
  }

  login(credentials: ILoginCredentials): Observable<ILoginResponse> {
    if (this.env.isMockingEnabled()) {
      return this._loginMock(credentials).pipe(
        tap((response) => this._setSession(response)),
      );
    }

    return this._login(credentials).pipe(
      tap((response) => this._setSession(response)),
    );
  }

  logout(): void {
    this._currentUser.set(null);
    localStorage.removeItem('session');
  }

  private _setSession(response: ILoginResponse): void {
    this._currentUser.set(response.user);
    localStorage.setItem(
      'session',
      JSON.stringify({
        user: response.user,
        token: response.token,
      }),
    );
  }

  private _initializeSession(): void {
    const sessionData = localStorage.getItem('session');
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData) as ILoginResponse;

        if (!this._isTokenValid(session.token)) {
          this.logout();
          return;
        }

        this._currentUser.set(session.user);
      } catch {
        localStorage.removeItem('session');
      }
    }
  }

  private _isTokenValid(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  private _loginMock(
    credentials: ILoginCredentials,
  ): Observable<ILoginResponse> {
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

  private _login(credentials: ILoginCredentials): Observable<ILoginResponse> {
    const loginUrl = this.env.buildApiUrl(this.env.config().api.auth.login);

    return this.http
      .post<ApiResponse<ILoginResponse>>(loginUrl, credentials)
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          const errorMessage =
            error.error?.data?.message || 'Error al iniciar sesión';
          return throwError(() => new Error(errorMessage));
        }),
      );
  }
}
