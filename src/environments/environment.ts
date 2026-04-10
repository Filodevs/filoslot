import { IEnvironment } from './environment.interface';

/**
 * Development environment configuration
 * Used during npm start and local development
 */
export const environment: IEnvironment = {
  production: false,
  api: {
    baseUrl: 'http://localhost:3000/api/v1',
    timeout: 30000,
    auth: {
      login: '/auth/login',
      logout: '/auth/logout',
      refresh: '/auth/refresh',
      verify: '/auth/verify',
    },
    business: {
      me: '/businesses/me',
      slug: '/businesses/:slug',
      list: '/businesses',
      detail: '/business/:id',
      create: '/business',
      update: '/business/:id',
      delete: '/business/:id',
      resourcesByServiceId: '/businesses/:businessId/resources?serviceId=:serviceId',
    },
    appointments: {
      list: '/appointments',
      create: '/appointments',
      update: '/appointments/:id',
      cancel: '/appointments/confirmation/:token',
      detail: '/appointments/:id',
      confirmation: '/appointments/confirmation/:token',
      byDate: '/appointments?date=:date',
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
      updateAvailability: '/availability/:resourcedId',
    },
    slots: {
      available: '/slots?resourceId=:resourceId&serviceId=:serviceId&date=:date',
      book: '/slots/book',
    },
    directory: {
      search: '/directory/search',
      categories: '/directory/categories',
    },
  },
  features: {
    enableMocking: false,
    enableAnalytics: false,
    enableServiceWorker: false,
  },
  logging: {
    level: 'debug',
    enableConsole: true,
  },
  supabase: {
    url: 'https://hodfnemtgfnsozhwqntn.supabase.co',
    anonKey: 'sb_publishable_cwv7-IsLt1NNZBZ_cY9vpQ_7RDUaePn',
  },
};
