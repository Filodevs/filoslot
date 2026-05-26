// Custom service worker for FiloSlot
// Extends Angular ngsw with push notification support
// ngsw-worker.js is only available in production builds
try {
  importScripts('ngsw-worker.js');
} catch (_) {
  // Not a production build — caching disabled, push still works
}

self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};

  event.waitUntil(
    self.registration.showNotification(data.title ?? 'FiloSlot', {
      body: data.body ?? '',
      icon: '/icons/web-app-manifest-192x192.png',
      badge: '/icons/favicon-96x96.png',
    }),
  );
});
