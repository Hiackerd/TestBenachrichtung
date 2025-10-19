// Tinder PWA Service Worker
const CACHE_NAME = 'tinder-pwa-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install Event
self.addEventListener('install', event => {
  console.log('Tinder PWA installiert');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', event => {
  console.log('Tinder PWA aktiv');
  event.waitUntil(self.clients.claim());
  
  // Starte Hintergrund-Benachrichtigungen
  startBackgroundNotifications();
});

// Hintergrund-Benachrichtigungen
function startBackgroundNotifications() {
  // Simuliere Tinder-Benachrichtigungen
  setInterval(() => {
    const messages = [
      "🔥 Deine Likes wurden aufgefühlt!",
      "💖 Neue Matches in deiner Nähe!",
      "⭐ Superlikes verfügbar!",
      "👀 Jemand hat dein Profil angesehen",
      "🎯 Potenzielle Matches warten auf dich!"
    ];
    
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    
    self.registration.showNotification("Tinder", {
      body: randomMsg,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      vibrate: [200, 100, 200],
      tag: 'tinder-bg-notification',
      requireInteraction: false
    });
  }, 2 * 60 * 1000); // Alle 2 Minuten
}

// Push Event (für spätere Push-Benachrichtigungen)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Neue Aktivität auf Tinder!',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    vibrate: [200, 100, 200],
    tag: 'tinder-push'
  };
  
  event.waitUntil(
    self.registration.showNotification('Tinder', options)
  );
});

// Notification Click
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({type: 'window'}).then(windowClients => {
      // App bereits offen? Dann fokussieren
      for (let client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Sonst neues Fenster öffnen
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Fetch Event (Offline-Funktionalität)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      }
    )
  );
});
