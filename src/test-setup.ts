/**
 * Global test setup for Vitest + Angular 21
 * Configures TestBed, mocks window APIs, and provides common test utilities
 */

import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import 'vitest-canvas-mock';

// Initialize Angular testing environment once
getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting(), {
  teardown: { destroyAfterEach: true },
});

// Mock window.matchMedia for PrimeNG components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver for PrimeNG components
const resizeObserverMock = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
global.ResizeObserver = resizeObserverMock;
(window as any).ResizeObserver = resizeObserverMock;

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  takeRecords: vi.fn().mockReturnValue([]),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock,
});

// Mock window.location
delete (window as any).location;
window.location = {
  ...window.location,
  href: 'http://localhost:4200',
  origin: 'http://localhost:4200',
  protocol: 'http:',
  host: 'localhost:4200',
  hostname: 'localhost',
  port: '4200',
  pathname: '/',
  search: '',
  hash: '',
  reload: vi.fn(),
  replace: vi.fn(),
  assign: vi.fn(),
} as any;

// Suppress console errors during tests (optional - comment out to debug)
// global.console.error = vi.fn();
// global.console.warn = vi.fn();
