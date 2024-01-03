import React from 'react';
import ReactDOM from 'react-dom/client';
import { Buffer as ImportedBuffer } from 'buffer';
import * as Sentry from '@sentry/react';

let sentryReleaseTag;

// add a release tag only if REACT_APP_VERSION provided
if (process.env.REACT_APP_VERSION) {
  sentryReleaseTag = 'pillarx@' + process.env.REACT_APP_VERSION
    + (process.env.REACT_APP_COMMIT_SHA ? '-' + process.env.REACT_APP_COMMIT_SHA : '');
}

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
  enabled: process.env.NODE_ENV === 'production',
  environment: process.env.REACT_APP_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  release: sentryReleaseTag,
});

if (typeof window !== 'undefined') window.Buffer = window.Buffer ?? ImportedBuffer;

// containers
import Main from './containers/Main';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
