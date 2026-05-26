import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import {
  ADMIN_USER_MOCK,
  AUTH_CREDENTIALS_MOCK,
  AUTH_RESPONSE_MOCK,
} from '../../models/__mocks__/auth.mock';
import { AuthService } from './auth.service';
import { EnvironmentService } from './environment.service';
import { PushNotificationService } from './push-notification.service';

const mockEnvironmentService = {
  config: () => ({
    production: false,
    api: {
      baseUrl: 'http://localhost:3000/api',
      auth: { login: '/auth/login' },
      timeout: 30000,
    },
    features: {
      mockingEnabled: true,
      pushNotifications: false,
      analytics: false,
      serviceWorker: false,
    },
    logging: { level: 'debug', enableConsole: true },
    supabase: { url: '', anonKey: '' },
  }),
  isProduction: () => false,
  isMockingEnabled: () => true,
  getApiBaseUrl: () => 'http://localhost:3000/api',
  buildApiUrl: (endpoint: string) => `http://localhost:3000/api${endpoint}`,
};

const mockPushNotificationService = {
  init: vi.fn().mockReturnValue({ subscribe: vi.fn() }),
  unsubscribe: vi.fn().mockReturnValue({ subscribe: vi.fn() }),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: EnvironmentService, useValue: mockEnvironmentService },
        {
          provide: PushNotificationService,
          useValue: mockPushNotificationService,
        },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isAuthenticated()', () => {
    it('should return false when no user is set', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should return true after successful login', async () => {
      await new Promise<void>((resolve) => {
        service.login(AUTH_CREDENTIALS_MOCK).subscribe(() => {
          expect(service.isAuthenticated()).toBe(true);
          resolve();
        });
      });
    });
  });

  describe('currentUser signal', () => {
    it('should be null initially when no session in localStorage', () => {
      expect(service.currentUser()).toBeNull();
    });

    it('should be readonly (no set/update methods)', () => {
      expect((service.currentUser as any).set).toBeUndefined();
    });
  });

  describe('login() with mocking enabled', () => {
    it('should authenticate with correct credentials and set currentUser', async () => {
      await new Promise<void>((resolve) => {
        service.login(AUTH_CREDENTIALS_MOCK).subscribe({
          next: (response) => {
            expect(response).toEqual(AUTH_RESPONSE_MOCK);
            expect(service.currentUser()).toEqual(ADMIN_USER_MOCK);
            resolve();
          },
        });
      });
    });

    it('should save session to localStorage on successful login', async () => {
      await new Promise<void>((resolve) => {
        service.login(AUTH_CREDENTIALS_MOCK).subscribe(() => {
          const stored = localStorage.getItem('session');
          expect(stored).not.toBeNull();
          const session = JSON.parse(stored!);
          expect(session.user).toEqual(ADMIN_USER_MOCK);
          resolve();
        });
      });
    });

    it('should throw error with invalid credentials', async () => {
      const badCredentials = { email: 'wrong@test.com', password: 'wrongpass' };
      await new Promise<void>((resolve) => {
        service.login(badCredentials).subscribe({
          error: (err: Error) => {
            expect(err.message).toBe('Credenciales incorrectas');
            resolve();
          },
        });
      });
    });

    it('should call pushNotification.init() on successful login', async () => {
      await new Promise<void>((resolve) => {
        service.login(AUTH_CREDENTIALS_MOCK).subscribe(() => {
          expect(mockPushNotificationService.init).toHaveBeenCalled();
          resolve();
        });
      });
    });
  });

  describe('logout()', () => {
    it('should clear currentUser signal', async () => {
      await new Promise<void>((resolve) => {
        service.login(AUTH_CREDENTIALS_MOCK).subscribe(() => {
          expect(service.isAuthenticated()).toBe(true);
          service.logout();
          expect(service.currentUser()).toBeNull();
          expect(service.isAuthenticated()).toBe(false);
          resolve();
        });
      });
    });

    it('should remove session from localStorage', async () => {
      await new Promise<void>((resolve) => {
        service.login(AUTH_CREDENTIALS_MOCK).subscribe(() => {
          service.logout();
          expect(localStorage.getItem('session')).toBeNull();
          resolve();
        });
      });
    });
  });
});
