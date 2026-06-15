import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const isDev = process.env.VITE_IS_DEV === 'true'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: isDev
    ? {
        proxy: {
          '/api': {
            target: process.env.VITE_API_DEV_TARGET || 'http://localhost:8080',
            changeOrigin: true,
          },
        },
      }
    : undefined,
})
