/**
 * Service Worker for Push Notifications
 */

// This listener handles the 'push' event, which is triggered when a push message is received from the server.
self.addEventListener('push', function (event) {
  // We need to parse the data from the push event.
  // If the data is missing or not valid JSON, we'll use a default message.
  let data = { title: 'New Order!', body: 'A new order has been received.' };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      console.error('Push event data was not valid JSON:', e);
    }
  }

  // These are the options for the notification that will be shown to the user.
  const options = {
    body: data.body,
    icon: '/icon-192x192.png', // A 192x192 icon for the notification
    badge: '/badge-72x72.png',  // A small badge icon, often shown in the status bar on Android
  };

  // The event.waitUntil() method ensures the service worker doesn't terminate
  // until the notification has been successfully displayed to the user.
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});


// This listener handles the 'notificationclick' event, which is fired when a user clicks on the notification.
self.addEventListener('notificationclick', function (event) {
  // First, close the notification that was clicked.
  event.notification.close();

  // The event.waitUntil() method here ensures that the browser doesn't terminate the service worker
  // before our new window/tab has been displayed.
  event.waitUntil(
    // The clients.openWindow() method will open a new tab/window or focus an existing one.
    // We direct it to the root of your website ('/'). You could change this to '/admin/orders' for example.
    clients.openWindow('/')
  );
});