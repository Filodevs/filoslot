import { IEnvironment } from './environment.interface';

export const environment: IEnvironment = {
  production: true,
  api: {
    baseUrl: 'https://api.filoslot.com/v1',
    timeout: 30000,
    auth: {
      login: '/auth/login',
      logout: '/auth/logout',
      refresh: '/auth/refresh',
      verify: '/auth/verify',
    },
    business: {
      list: '/business',
      detail: '/business/:id',
      create: '/business',
      update: '/business/:id',
      delete: '/business/:id',
    },
    appointments: {
      list: '/appointments',
      create: '/appointments',
      update: '/appointments/:id',
      cancel: '/appointments/:id/cancel',
      detail: '/appointments/:id',
    },
    services: {
      list: '/services',
      create: '/services',
      update: '/services/:id',
      delete: '/services/:id',
    },
    resources: {
      list: '/resources',
      create: '/resources',
      update: '/resources/:id',
      delete: '/resources/:id',
    },
    slots: {
      available: '/slots/available',
      book: '/slots/book',
    },
    directory: {
      search: '/directory/search',
      categories: '/directory/categories',
    },
  },
  features: {
    enableMocking: false,
    enableAnalytics: true,
    enableServiceWorker: true,
  },
  logging: {
    level: 'error',
    enableConsole: false,
  },
};
