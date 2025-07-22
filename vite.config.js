import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/azure-images': {
        target: 'https://mbimagestorage.blob.core.windows.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/azure-images/, '')
      }
    }
  },
  build: {
    rollupOptions: {
      input: './index.html'
    }
  }
}) 