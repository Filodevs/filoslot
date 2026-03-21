import { TestBed } from '@angular/core/testing';

import { EnvironmentService } from './environment.service';

describe('EnvironmentService', () => {
  let service: EnvironmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnvironmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('config()', () => {
    it('should return environment configuration object', () => {
      const config = service.config();

      expect(config).toBeDefined();
      expect(config.production).toBeDefined();
      expect(config.api).toBeDefined();
      expect(config.features).toBeDefined();
      expect(config.logging).toBeDefined();
    });
  });

  describe('isProduction()', () => {
    it('should return production flag', () => {
      const isProduction = service.isProduction();

      expect(typeof isProduction).toBe('boolean');
    });
  });

  describe('getApiBaseUrl()', () => {
    it('should return API base URL', () => {
      const baseUrl = service.getApiBaseUrl();

      expect(baseUrl).toBeDefined();
      expect(typeof baseUrl).toBe('string');
      expect(baseUrl.length).toBeGreaterThan(0);
    });
  });

  describe('buildApiUrl()', () => {
    it('should build API URL without parameters', () => {
      const endpoint = '/auth/login';
      const url = service.buildApiUrl(endpoint);

      expect(url).toContain(endpoint);
      expect(url).toContain(service.getApiBaseUrl());
    });

    it('should replace path parameters in URL', () => {
      const endpoint = '/business/:id';
      const params = { id: '123' };
      const url = service.buildApiUrl(endpoint, params);

      expect(url).toContain('/business/123');
      expect(url).not.toContain(':id');
    });

    it('should replace multiple path parameters', () => {
      const endpoint = '/business/:businessId/resource/:resourceId';
      const params = { businessId: '456', resourceId: '789' };
      const url = service.buildApiUrl(endpoint, params);

      expect(url).toContain('/business/456/resource/789');
      expect(url).not.toContain(':businessId');
      expect(url).not.toContain(':resourceId');
    });
  });

  describe('Feature flags', () => {
    it('should return mocking status', () => {
      const isMocking = service.isMockingEnabled();

      expect(typeof isMocking).toBe('boolean');
    });

    it('should return analytics status', () => {
      const isAnalytics = service.isAnalyticsEnabled();

      expect(typeof isAnalytics).toBe('boolean');
    });

    it('should return service worker status', () => {
      const isSW = service.isServiceWorkerEnabled();

      expect(typeof isSW).toBe('boolean');
    });
  });

  describe('Logging configuration', () => {
    it('should return logging level', () => {
      const level = service.getLoggingLevel();

      expect(['debug', 'info', 'warn', 'error']).toContain(level);
    });

    it('should return console logging status', () => {
      const isEnabled = service.isConsoleLoggingEnabled();

      expect(typeof isEnabled).toBe('boolean');
    });
  });
});
