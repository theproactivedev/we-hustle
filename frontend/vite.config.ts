import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- Import Tailwind
import { tanstackRouter } from '@tanstack/router-plugin/vite';

// https://vite.dev
export default defineConfig({
  base: '/we-hustle/',
  plugins: [
    react(),
    tailwindcss(), // <-- Add Tailwind plugin here
    tanstackRouter(),
  ],
  server: {
    port: 3000,
    strictPort: true, // Optional: true makes Vite exit if port 3000 is already in use
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
