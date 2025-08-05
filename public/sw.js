const CACHE_NAME = 'expensio-static-v1';
const API_CACHE_NAME = 'expensio-api-v1';

// Static assets to cache
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Helper function to check if request is an API call
const isApiRequest = (url) => {
  return url.includes('/api/') || 
         url.includes('transactions') || 
         url.includes('categories') || 
         url.includes('auth') ||
         url.pathname.startsWith('/api');
};

// Install event - cache static resources only
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Failed to cache resources during install:', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - different strategies for API vs static assets
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  
  // Skip cross-origin requests unless they're API calls to the backend
  if (!event.request.url.startsWith(self.location.origin) && !isApiRequest(requestUrl)) {
    return;
  }

  // Handle navigation requests (HTML pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match('/');
        })
    );
    return;
  }

  // Handle API requests with network-first strategy
  if (isApiRequest(requestUrl)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Only cache successful GET requests for API data
          if (response.ok && event.request.method === 'GET') {
            const responseToCache = response.clone();
            caches.open(API_CACHE_NAME)
              .then((cache) => {
                // Set a short TTL for API responses by adding headers
                const responseWithTTL = new Response(responseToCache.body, {
                  status: responseToCache.status,
                  statusText: responseToCache.statusText,
                  headers: {
                    ...Object.fromEntries(responseToCache.headers.entries()),
                    'sw-cache-timestamp': Date.now().toString()
                  }
                });
                cache.put(event.request, responseWithTTL);
              });
          }
          return response;
        })
        .catch(() => {
          // Network failed, try to serve from API cache as fallback
          return caches.open(API_CACHE_NAME)
            .then((cache) => {
              return cache.match(event.request)
                .then((cachedResponse) => {
                  if (cachedResponse) {
                    // Check if cached response is too old (more than 5 minutes)
                    const cacheTimestamp = cachedResponse.headers.get('sw-cache-timestamp');
                    const now = Date.now();
                    const fiveMinutes = 5 * 60 * 1000;
                    
                    if (cacheTimestamp && (now - parseInt(cacheTimestamp)) > fiveMinutes) {
                      // Cache is too old, don't serve it
                      return new Response('Network unavailable', { status: 503 });
                    }
                    
                    return cachedResponse;
                  }
                  return new Response('Network unavailable', { status: 503 });
                });
            });
        })
    );
    return;
  }

  // Handle static assets with cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return cached response
        if (response) {
          return response;
        }

        // Not in cache, fetch from network
        return fetch(event.request).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone and cache the response for static assets
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(() => {
          // Network failed for static asset
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
          // For other static assets, just fail gracefully
          return new Response('Asset unavailable', { status: 404 });
        });
      })
  );
});

// Handle background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Add your background sync logic here
      console.log('Background sync triggered')
    );
  }
});

// Handle push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Default notification body',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/icons/icon-72x72.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-72x72.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Expensio', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});