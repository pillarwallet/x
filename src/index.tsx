import React from 'react';
import ReactDOM from 'react-dom/client';
import { Buffer as ImportedBuffer } from 'buffer';
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'https://55052afb3f6f792430997f49a52c7720@o4505997388742656.ingest.sentry.io/4506280106655744',
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

if (typeof window !== 'undefined') window.Buffer = window.Buffer ?? ImportedBuffer;

// components
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
