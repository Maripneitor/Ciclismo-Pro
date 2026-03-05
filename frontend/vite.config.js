import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Permitir acceso externo
    watch: {
      usePolling: true, // Necesario para Docker/Windows
    },
    proxy: {
      '/api': {
        target: 'http://backend:3001', // Usar el nombre del servicio en Docker
        changeOrigin: true,
        secure: false,
      }
    }
  }
})