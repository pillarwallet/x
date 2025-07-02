import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import dynamicImport from 'vite-plugin-dynamic-import';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), svgr({}), dynamicImport()],
  build: {
    outDir: 'build',
    commonjsOptions: { transformMixedEsModules: true },
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src/apps'),
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
});
