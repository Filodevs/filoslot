export interface IEnvironment {
  production: boolean;
  api: {
    baseUrl: string;
    timeout: number;
    auth: {
      login: string;
      logout: string;
      refresh: string;
      verify: string;
    };
    business: {
      me: string;
      slug: string;
      list: string;
      detail: string;
      create: string;
      update: string;
      delete: string;
      resourcesByBusinessId: string;
      resourcesByServiceId: string;
    };
    appointments: {
      list: string;
      create: string;
      update: string;
      cancel: string;
      detail: string;
      confirmation: string;
      byDate: string;
      updateStatus: string;
    };
    services: {
      list: string;
      create: string;
      update: string;
      delete: string;
    };
    resources: {
      list: string;
      create: string;
      update: string;
      delete: string;
      updateAvailability: string;
    };
    slots: {
      available: string;
      book: string;
    };
    directory: {
      search: string;
      categories: string;
    };
    pushSubscriptions: {
      vapidPublicKey: string;
      subscribe: string;
      unsubscribe: string;
    };
  };
  features: {
    enableMocking: boolean;
    enableAnalytics: boolean;
    enableServiceWorker: boolean;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    enableConsole: boolean;
  };
  supabase: {
    url: string;
    anonKey: string;
  };
}
