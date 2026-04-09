import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {},  // only if you have a proxy setup
  },
  preview: {
    port: 5173,
  }
})