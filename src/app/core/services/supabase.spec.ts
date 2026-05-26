import { TestBed } from '@angular/core/testing';

import { EnvironmentService } from './environment.service';
import { SupabaseService } from './supabase';

const mockEnvironmentService = {
  config: vi.fn(() => ({
    production: false,
    api: { baseUrl: '', auth: { login: '' }, timeout: 30000 },
    features: {
      mockingEnabled: true,
      pushNotifications: false,
      analytics: false,
      serviceWorker: false,
    },
    logging: { level: 'debug', enableConsole: true },
    supabase: { url: 'https://mock.supabase.co', anonKey: 'mock-anon-key' },
  })),
  isProduction: vi.fn(() => false),
  isMockingEnabled: vi.fn(() => true),
  getApiBaseUrl: vi.fn(() => ''),
  buildApiUrl: vi.fn((e: string) => e),
};

describe('SupabaseService', () => {
  let service: SupabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: EnvironmentService, useValue: mockEnvironmentService },
      ],
    });
    service = TestBed.inject(SupabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('listenToBroadcast()', () => {
    it('should return an Observable', () => {
      const result = service.listenToBroadcast('test-channel', 'test-event');
      expect(result).toBeDefined();
      expect(typeof result.subscribe).toBe('function');
    });
  });
});
