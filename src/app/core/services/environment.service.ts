import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { IEnvironment } from '../../../environments/environment.interface';

@Injectable({ providedIn: 'root' })
export class EnvironmentService {
  config(): IEnvironment {
    return environment;
  }

  isProduction(): boolean {
    return environment.production;
  }

  getApiBaseUrl(): string {
    return environment.api.baseUrl;
  }

  buildApiUrl(
    endpoint: string,
    params?: Record<string, string>,
    queryParams?: Record<string, string>,
  ): string {
    let url = `${environment.api.baseUrl}${endpoint}`;

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url = url.replace(`:${key}`, value);
      });
    }

    if (queryParams) {
      const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');
      url += `?${queryString}`;
    }

    return url;
  }

  isMockingEnabled(): boolean {
    return environment.features.enableMocking;
  }

  isAnalyticsEnabled(): boolean {
    return environment.features.enableAnalytics;
  }

  isServiceWorkerEnabled(): boolean {
    return environment.features.enableServiceWorker;
  }

  getLoggingLevel(): 'debug' | 'info' | 'warn' | 'error' {
    return environment.logging.level;
  }

  isConsoleLoggingEnabled(): boolean {
    return environment.logging.enableConsole;
  }
}
