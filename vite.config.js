import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import dynamicImport from 'vite-plugin-dynamic-import';
import svgr from 'vite-plugin-svgr';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [react(), svgr({}), dynamicImport(), basicSsl()],
  build: {
    outDir: 'build',
    commonjsOptions: { transformMixedEsModules: true },
    rollupOptions: {
      external: ['/functions/**'],
    },
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src/apps'),
      crypto: 'crypto-browserify',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-utils/setupTests.ts',
    define: {
      global: 'globalThis',
    },
    pool: 'forks',
  },
  server: {
    https: false,
    host: '0.0.0.0',
    proxy: {
      '/api/coinbase': {
        target: 'https://api.cdp.coinbase.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/coinbase/, ''),
        secure: true,
      },
    },
  },
});
