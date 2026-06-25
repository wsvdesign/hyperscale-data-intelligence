import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Allow sql.js to serve its wasm file from node_modules
    fs: {
      allow: ['..']
    }
  },
  optimizeDeps: {
    // sql.js uses WebAssembly — exclude from Vite pre-bundling
    exclude: ['sql.js']
  },
  build: {
    rollupOptions: {
      // Copy sql-wasm.wasm to dist on build
      external: [],
    }
  }
})
