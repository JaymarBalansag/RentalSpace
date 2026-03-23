import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  server: {
    // This tells Vite to allow requests from your ngrok URL
    allowedHosts: [
      '.ngrok-free.dev', // Allows all ngrok subdomains
      '.ngrok.io'         // Older ngrok domains
    ],
    // OR: for testing only, you can use:
    // allowedHosts: true, 
    
    // Ensure it's listening on the network
    host: '0.0.0.0', 
    strictPort: true,
  },
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'pwa-192x192.png',
        'pwa-512x512.png',
        'maskable-icon-512x512.png',
      ],
      manifest: {
        name: 'RentaHub',
        short_name: 'RentaHub',
        description: 'Discover rental spaces, compare listings, and stay connected with verified owners.',
        theme_color: '#1f5ea8',
        background_color: '#0e1f36',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        navigateFallback: 'index.html',
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,avif,json}'],
        runtimeCaching: [
          {
            urlPattern: ({ request, url }) =>
              url.origin === self.location.origin &&
              ['style', 'script', 'worker'].includes(request.destination),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'rentahub-static-assets',
            },
          },
          {
            urlPattern: ({ request, url }) =>
              request.destination === 'image' && url.origin === self.location.origin,
            handler: 'CacheFirst',
            options: {
              cacheName: 'rentahub-local-images',
              expiration: {
                maxEntries: 80,
                maxAgeSeconds: 60 * 60 * 24 * 14,
              },
            },
          },
          {
            urlPattern: ({ url }) =>
              [
                'images.unsplash.com',
                'cdn-icons-png.flaticon.com',
                'ui-avatars.com',
              ].includes(url.hostname),
            handler: 'CacheFirst',
            options: {
              cacheName: 'rentahub-remote-images',
              expiration: {
                maxEntries: 80,
                maxAgeSeconds: 60 * 60 * 24 * 7,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: ({ url }) =>
              [
                'api.rentahub.space',
                'nominatim.openstreetmap.org',
                'router.project-osrm.org',
                'tile.openstreetmap.org',
                'a.tile.openstreetmap.org',
                'b.tile.openstreetmap.org',
                'c.tile.openstreetmap.org',
                's.tile.openstreetmap.org',
              ].includes(url.hostname),
            handler: 'NetworkOnly',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
