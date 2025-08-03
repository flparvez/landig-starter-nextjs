// public/service-worker.js

self.addEventListener('push', function (event) {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192x192.png', // Optional: Add an icon in your public folder
    badge: '/badge-72x72.png',  // Optional: Add a badge
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});