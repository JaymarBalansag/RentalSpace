import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

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
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
