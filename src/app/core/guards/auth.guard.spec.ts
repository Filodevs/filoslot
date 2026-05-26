import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { authGuard } from './auth.guard';

const mockAuthServiceAuthenticated = {
  isAuthenticated: vi.fn(() => true),
  currentUser: vi.fn(),
};

const mockAuthServiceUnauthenticated = {
  isAuthenticated: vi.fn(() => false),
  currentUser: vi.fn(),
};

describe('authGuard', () => {
  let router: Router;

  describe('when user IS authenticated', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideRouter([]),
          { provide: AuthService, useValue: mockAuthServiceAuthenticated },
        ],
      });

      router = TestBed.inject(Router);
    });

    it('should allow navigation (return true)', () => {
      const result = TestBed.runInInjectionContext(() =>
        authGuard({} as any, {} as any),
      );
      expect(result).toBe(true);
    });

    it('should not redirect when authenticated', () => {
      const navigateSpy = vi.spyOn(router, 'navigate');
      TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
      expect(navigateSpy).not.toHaveBeenCalled();
    });
  });

  describe('when user is NOT authenticated', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideRouter([]),
          { provide: AuthService, useValue: mockAuthServiceUnauthenticated },
        ],
      });

      router = TestBed.inject(Router);
    });

    it('should deny navigation (return false)', () => {
      const result = TestBed.runInInjectionContext(() =>
        authGuard({} as any, {} as any),
      );
      expect(result).toBe(false);
    });

    it('should redirect to /auth/login', () => {
      const navigateSpy = vi.spyOn(router, 'navigate');
      TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
      expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
    });
  });
});
