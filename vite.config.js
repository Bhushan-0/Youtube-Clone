import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    host: '0.0.0.0',  // Allows access from external devices
    port: 5173,       // Ensure it matches your running port
    strictPort: true, // Ensures Vite doesn't change the port
    allowedHosts: ['d53d-103-200-214-76.ngrok-free.app'], // Add your Ngrok domain here
  },
})
