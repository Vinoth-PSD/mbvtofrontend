import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false, // ⛔ disables source maps (saves ~30–100MB)
    outDir: 'dist',   // ✅ output folder (default, but good to be explicit)
    assetsInlineLimit: 4096, // ⛔ inline only small assets (<4KB)
    rollupOptions: {
      input: './index.html'
    }
  }
}) 