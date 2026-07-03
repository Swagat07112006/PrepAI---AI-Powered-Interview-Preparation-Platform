import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/@tanstack/') || id.includes('node_modules/react-router-dom/')) {
            return 'data-router-vendor';
          }
          if (id.includes('node_modules/framer-motion/')) {
            return 'motion-vendor';
          }
          if (id.includes('node_modules/@radix-ui/') || id.includes('node_modules/react-hook-form/') || id.includes('node_modules/@hookform/') || id.includes('node_modules/zod/') || id.includes('node_modules/sonner/')) {
            return 'ui-form-vendor';
          }
          if (id.includes('node_modules/lucide-react/')) {
            return 'icons-vendor';
          }
          if (id.includes('node_modules/axios/')) {
            return 'network-vendor';
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});