import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['brand/condovia-logo-white.png', 'brand/condovia-light.png', 'brand/apple-touch-icon-180.png'],
      manifest: {
        name: 'Condovia — Marketplace dei servizi condominiali',
        short_name: 'Condovia',
        description: 'La prima rete digitale per la compravendita di servizi e interventi per il condominio.',
        lang: 'it',
        dir: 'ltr',
        theme_color: '#1e1815',
        background_color: '#1e1815',
        display: 'standalone',
        display_override: ['standalone', 'minimal-ui', 'browser'],
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',
        id: '/',
        categories: ['business', 'productivity', 'utilities'],
        icons: [
          { src: '/brand/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/brand/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        shortcuts: [
          { name: 'Accedi', short_name: 'Accedi', url: '/#/login', icons: [{ src: '/brand/icon-192.png', sizes: '192x192' }] },
          { name: 'Iscriviti', short_name: 'Iscriviti', url: '/#/registrati', icons: [{ src: '/brand/icon-192.png', sizes: '192x192' }] },
          { name: 'Backoffice', short_name: 'Backoffice', url: '/#/backoffice/login', icons: [{ src: '/brand/icon-192.png', sizes: '192x192' }] },
        ],
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
            handler: 'NetworkFirst',
            options: { cacheName: 'api-cache', networkTimeoutSeconds: 8 },
          },
        ],
      },
    }),
  ],
  server: { port: 5173 },
})
