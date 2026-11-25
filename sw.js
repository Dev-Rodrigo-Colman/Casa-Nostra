/**
 * CASA NOSTRA PIZZERÍA — Service Worker (PWA)
 * Estrategia híbrida: Network-First para datos/código y Stale-While-Revalidate para imágenes.
 */

const CACHE_NAME = 'casa-nostra-v2';

// Recursos esenciales para funcionamiento offline
const PRECACHE_ASSETS = [
  './',
  'index.html',
  'style.css',
  'script.js',
  'manifest.webmanifest',
  'icon-192.png',
  'icon-512.png',
  'icon-maskable-512.png',
  'apple-touch-icon.png',
  'favicon.ico'
];

// Instalación: Pre-caché de recursos críticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activación: Limpieza inmediata de cachés antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Intercepción de peticiones (Fetch)
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Solo procesar peticiones GET
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Ignorar orígenes externos (Google Fonts, WhatsApp wa.me, Google Maps, etc.)
  if (url.origin !== self.location.origin) return;

  const isNavigation = request.mode === 'navigate' || request.destination === 'document';
  const isCode = url.pathname.endsWith('.css') || url.pathname.endsWith('.js') || url.pathname.endsWith('.html');
  const isImage = /\.(png|jpe?g|webp|svg|ico)$/i.test(url.pathname);

  // 1. HTML, CSS, JS y Navegación: ESTRATEGIA NETWORK-FIRST
  // Asegura que los clientes SIEMPRE vean la carta, precios y promociones actualizadas.
  if (isNavigation || isCode) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Si no hay red, servir desde caché
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            // Si es navegación y la URL específica no está en caché, servir la home precacheada
            if (isNavigation) {
              return caches.match('./').then((fallback) => fallback || caches.match('index.html'));
            }
            return null;
          });
        })
    );
    return;
  }

  // 2. Imágenes y recursos estáticos multimedia: ESTRATEGIA STALE-WHILE-REVALIDATE
  // Carga instantánea desde caché y actualización silenciosa en segundo plano.
  if (isImage) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                cache.put(request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => cachedResponse);

          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // 3. Resto de recursos del mismo origen: Cache-First con fallback a red
  event.respondWith(
    caches.match(request).then((cached) => {
      return cached || fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return networkResponse;
      });
    })
  );
});
