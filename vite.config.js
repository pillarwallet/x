import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import dynamicImport from 'vite-plugin-dynamic-import';
import svgr from 'vite-plugin-svgr';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { fileURLToPath } from 'url';

// Emulate __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), svgr(), dynamicImport(), basicSsl()],
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
    define: {
      // Explicitly expose VITE_PRIVY_APP_ID to the app
      // Use process.env directly to ensure Cloudflare Pages env vars are picked up
      // Fallback to loadEnv value if not in process.env
      'import.meta.env.VITE_PRIVY_APP_ID': JSON.stringify(
        process.env.VITE_PRIVY_APP_ID || env.VITE_PRIVY_APP_ID
      ),
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
      https: true,
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
  };
});
