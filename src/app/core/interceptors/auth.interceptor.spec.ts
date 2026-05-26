import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let router: Router;

  describe('when user is authenticated', () => {
    const mockToken = 'mock-jwt-token';
    const mockAuthService = {
      isAuthenticated: vi.fn(() => true),
      logout: vi.fn(),
    };

    beforeEach(() => {
      localStorage.setItem('session', JSON.stringify({ token: mockToken }));

      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(withInterceptors([authInterceptor])),
          provideHttpClientTesting(),
          provideRouter([]),
          { provide: AuthService, useValue: mockAuthService },
        ],
      });

      httpMock = TestBed.inject(HttpTestingController);
      httpClient = TestBed.inject(HttpClient);
      router = TestBed.inject(Router);
    });

    afterEach(() => {
      httpMock.verify();
      localStorage.clear();
      vi.clearAllMocks();
    });

    it('should add Authorization header with Bearer token', () => {
      httpClient.get('/api/test').subscribe();

      const req = httpMock.expectOne('/api/test');
      expect(req.request.headers.get('Authorization')).toBe(
        `Bearer ${mockToken}`,
      );
      req.flush({});
    });
  });

  describe('when user is NOT authenticated', () => {
    const mockAuthService = {
      isAuthenticated: vi.fn(() => false),
      logout: vi.fn(),
    };

    beforeEach(() => {
      localStorage.clear();

      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(withInterceptors([authInterceptor])),
          provideHttpClientTesting(),
          provideRouter([]),
          { provide: AuthService, useValue: mockAuthService },
        ],
      });

      httpMock = TestBed.inject(HttpTestingController);
      httpClient = TestBed.inject(HttpClient);
    });

    afterEach(() => {
      httpMock.verify();
    });

    it('should NOT add Authorization header when not authenticated', () => {
      httpClient.get('/api/test').subscribe();

      const req = httpMock.expectOne('/api/test');
      expect(req.request.headers.get('Authorization')).toBeNull();
      req.flush({});
    });
  });

  describe('when server returns 401', () => {
    const mockAuthService = {
      isAuthenticated: vi.fn(() => true),
      logout: vi.fn(),
    };

    beforeEach(() => {
      localStorage.setItem(
        'session',
        JSON.stringify({ token: 'expired-token' }),
      );

      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(withInterceptors([authInterceptor])),
          provideHttpClientTesting(),
          provideRouter([]),
          { provide: AuthService, useValue: mockAuthService },
        ],
      });

      httpMock = TestBed.inject(HttpTestingController);
      httpClient = TestBed.inject(HttpClient);
      router = TestBed.inject(Router);
    });

    afterEach(() => {
      httpMock.verify();
      localStorage.clear();
      vi.clearAllMocks();
    });

    it('should call logout and redirect on 401', () => {
      const navigateSpy = vi.spyOn(router, 'navigate');

      httpClient.get('/api/protected').subscribe({ error: () => {} });

      const req = httpMock.expectOne('/api/protected');
      req.flush(
        { message: 'Unauthorized' },
        { status: 401, statusText: 'Unauthorized' },
      );

      expect(mockAuthService.logout).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
    });
  });
});
