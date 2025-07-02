import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), svgr({})],
  build: {
    outDir: 'build',
    commonjsOptions: { transformMixedEsModules: true },
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
