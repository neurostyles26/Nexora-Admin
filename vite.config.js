import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg', 'PwA-Nexora.png'],
      manifest: {
        name: 'Nexora Admin Professional',
        short_name: 'Nexora',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#020617',
        description: '"El núcleo inteligente que conecta tu negocio en tiempo real."',
        theme_color: '#6366f1',
        icons: [
          {
            src: '/PwA-Nexora.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/PwA-Nexora.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})

