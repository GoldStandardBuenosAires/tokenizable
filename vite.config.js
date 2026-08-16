import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 3000,
    allowedHosts: true,
    proxy: {
      // The browser NEVER talks to the Hardhat node directly — everything is
      // forwarded through this dev proxy. Live networks use their public RPC URL.
      '/api/rpc': {
        target: 'http://127.0.0.1:8545',
        changeOrigin: true,
        secure: false,
        rewrite: () => '/',
      },
    },
  },
  preview: {
    host: true,
    port: 3000,
  },
  build: {
    outDir: 'dist',
    target: 'es2020',
    sourcemap: false,
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});
