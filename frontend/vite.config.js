import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    host: true,
    // Konfigurasi https dihapus karena kita pakai ngrok
    proxy: {
      '/api': {
        target: 'http://localhost:5000', 
        changeOrigin: true,
      }
    },
    // [SOLUSI] Tambahkan blok ini untuk mengizinkan host dari ngrok
    hmr: {
      host: 'localhost',
      protocol: 'ws',
    },
    // [SOLUSI UTAMA] Izinkan host ngrok Anda
    allowedHosts: [
      '.ngrok-free.app' // Ini akan mengizinkan SEMUA subdomain dari ngrok-free.app
    ]
  }
})
