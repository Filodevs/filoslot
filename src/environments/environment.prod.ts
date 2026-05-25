import { IEnvironment } from './environment.interface';

export const environment: IEnvironment = {
  production: true,
  api: {
    baseUrl: '##API_BASE_URL##',
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
      resourcesByBusinessId: '/businesses/:businessId/resources',
      resourcesByServiceId: '/businesses/:businessId/resources/by-service/:serviceId',
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
    pushSubscriptions: {
      vapidPublicKey: '/push-subscriptions/vapid-public-key',
      subscribe: '/push-subscriptions',
      unsubscribe: '/push-subscriptions',
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
  supabase: {
    url: '##SUPABASE_URL##',
    anonKey: '##SUPABASE_ANON_KEY##',
  },
};
