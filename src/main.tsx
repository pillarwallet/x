/* eslint-disable prefer-template */
import * as Sentry from '@sentry/react';
import { Buffer as ImportedBuffer } from 'buffer';
import React from 'react';
import ReactDOM from 'react-dom/client';

// containers
import { Provider } from 'react-redux';
import Main from './containers/Main';
import { store } from './store';

if (typeof window !== 'undefined') {
  // @ts-expect-error: Browser does not exists in global
  window.Browser = {
    T: () => {},
  };
}

let sentryReleaseTag;

// add a release tag only if VITE_VERSION provided
if (import.meta.env.VITE_VERSION) {
  sentryReleaseTag =
    'pillarx@' +
    import.meta.env.VITE_VERSION +
    (import.meta.env.VITE_COMMIT_SHA
      ? '-' + import.meta.env.VITE_COMMIT_SHA
      : '');
}

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
  enabled: process.env.NODE_ENV === 'production',
  environment: import.meta.env.VITE_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  release: sentryReleaseTag,
});

if (typeof window !== 'undefined')
  window.Buffer = window.Buffer ?? ImportedBuffer;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Main />
    </Provider>
  </React.StrictMode>
);
