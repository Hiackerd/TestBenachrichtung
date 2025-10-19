// Tinder Fake Service Worker
self.addEventListener('install', event => {
    self.skipWaiting();
    console.log('Tinder Service Worker installiert');
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
    console.log('Tinder Service Worker aktiv');
});

self.addEventListener('push', event => {
    const options = {
        body: '🔥 Neue Benachrichtigung von Tinder!',
        icon: '/faketinder-app/icon.png',
        badge: '/faketinder-app/badge.png',
        vibrate: [200, 100, 200],
        tag: 'tinder-notification'
    };
    
    event.waitUntil(
        self.registration.showNotification('Tinder', options)
    );
});
