/**
 * Mock implementations of common services
 * Use these in TestBed.configureTestingModule providers
 */

import { signal } from '@angular/core';

import {
  ADMIN_USER_MOCK,
  AUTH_RESPONSE_MOCK,
} from '@models/__mocks__/auth.mock';
import { BUSINESS_MOCK } from '@models/__mocks__/business.mock';
import type { IUser } from '@models/user';
import { of, throwError } from 'rxjs';

// ============================================
// AuthService Mock
// ============================================
export const mockAuthService = {
  currentUser: signal<IUser | null>(ADMIN_USER_MOCK).asReadonly(),
  isAuthenticated: vi.fn(() => true),
  login: vi.fn().mockReturnValue(of(AUTH_RESPONSE_MOCK)),
  logout: vi.fn(),
  refreshToken: vi.fn().mockReturnValue(of(AUTH_RESPONSE_MOCK)),
};

export const mockAuthServiceUnauthenticated = {
  currentUser: signal<IUser | null>(null).asReadonly(),
  isAuthenticated: vi.fn(() => false),
  login: vi.fn().mockReturnValue(of(AUTH_RESPONSE_MOCK)),
  logout: vi.fn(),
  refreshToken: vi
    .fn()
    .mockReturnValue(throwError(() => new Error('Unauthorized'))),
};

// ============================================
// Router Mock
// ============================================
export const mockRouter = {
  navigate: vi.fn().mockResolvedValue(true),
  navigateByUrl: vi.fn().mockResolvedValue(true),
  createUrlTree: vi.fn(),
  serializeUrl: vi.fn().mockReturnValue(''),
  url: '/',
  events: of(),
};

// ============================================
// ActivatedRoute Mock
// ============================================
export const mockActivatedRoute = {
  snapshot: {
    params: {},
    queryParams: {},
    data: {},
    url: [],
    paramMap: {
      get: vi.fn(),
      has: vi.fn(),
      getAll: vi.fn(),
      keys: [],
    },
    queryParamMap: {
      get: vi.fn(),
      has: vi.fn(),
      getAll: vi.fn(),
      keys: [],
    },
  },
  params: of({}),
  queryParams: of({}),
  data: of({}),
  url: of([]),
  paramMap: of({
    get: vi.fn(),
    has: vi.fn(),
    getAll: vi.fn(),
    keys: [],
  }),
  queryParamMap: of({
    get: vi.fn(),
    has: vi.fn(),
    getAll: vi.fn(),
    keys: [],
  }),
};

// ============================================
// Dialog Service Mock
// ============================================
export const mockDialog = {
  open: vi.fn().mockReturnValue(of(null)),
  close: vi.fn(),
};

// ============================================
// Notification Service Mock
// ============================================
export const mockNotification = {
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
  clear: vi.fn(),
};

// ============================================
// ConfirmDialog Service Mock
// ============================================
export const mockConfirmDialog = {
  confirm: vi.fn().mockReturnValue(of(true)),
  close: vi.fn(),
};

// ============================================
// HttpClient Mock
// ============================================
export const mockHttpClient = {
  get: vi.fn().mockReturnValue(of({})),
  post: vi.fn().mockReturnValue(of({})),
  put: vi.fn().mockReturnValue(of({})),
  patch: vi.fn().mockReturnValue(of({})),
  delete: vi.fn().mockReturnValue(of({})),
  request: vi.fn().mockReturnValue(of({})),
};

// ============================================
// BusinessService Mock
// ============================================
export const mockBusinessService = {
  currentBusiness: signal(BUSINESS_MOCK).asReadonly(),
  getAllBusinesses: vi.fn().mockReturnValue(of([BUSINESS_MOCK])),
  getBusinessById: vi.fn().mockReturnValue(of(BUSINESS_MOCK)),
  createBusiness: vi.fn().mockReturnValue(of(BUSINESS_MOCK)),
  updateBusiness: vi.fn().mockReturnValue(of(BUSINESS_MOCK)),
  deleteBusiness: vi.fn().mockReturnValue(of(void 0)),
};

// ============================================
// EnvironmentService Mock
// ============================================
export const mockEnvironmentService = {
  config: vi.fn(() => ({
    production: false,
    api: {
      baseUrl: 'http://localhost:3000/api',
      timeout: 30000,
    },
    features: {
      mockingEnabled: true,
      pushNotifications: false,
    },
    logging: {
      level: 'debug',
    },
  })),
  isProduction: vi.fn(() => false),
  isMockingEnabled: vi.fn(() => true),
  getApiBaseUrl: vi.fn(() => 'http://localhost:3000/api'),
  buildApiUrl: vi.fn(
    (endpoint: string) => `http://localhost:3000/api${endpoint}`,
  ),
};

// ============================================
// Supabase Service Mock
// ============================================
export const mockSupabaseService = {
  client: {
    auth: {
      signInWithPassword: vi.fn().mockResolvedValue({ data: {}, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      getSession: vi
        .fn()
        .mockResolvedValue({ data: { session: null }, error: null }),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: {}, error: null }),
    })),
  },
};

// ============================================
// Helper to reset all mocks
// ============================================
export function resetAllMocks() {
  vi.clearAllMocks();
}
