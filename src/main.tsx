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
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  enabled: true,
  environment: import.meta.env.VITE_SENTRY_ENVIRONMENT ?? 'staging',
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  release: sentryReleaseTag,
  // Only send error-level events to Sentry
  beforeSend(event, hint) {
    // Only send events with error level or higher
    if (event.level && event.level !== 'error' && event.level !== 'fatal') {
      return null; // Drop the event
    }
    
    // Also filter out info and warning level messages
    if (event.level === 'info' || event.level === 'warning') {
      return null; // Drop the event
    }
    
    return event;
  },
  // Set default level to error
  defaultTags: {
    level: 'error',
  },
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
