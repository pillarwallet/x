/* eslint-disable prefer-template */
import * as Sentry from '@sentry/react';
import { Buffer as ImportedBuffer } from 'buffer';
import React from 'react';
import ReactDOM from 'react-dom/client';

// containers
import { Provider } from 'react-redux';
import Main from './containers/Main';
import { store } from './store';

// Firebase Remote Config
import { initializeRemoteConfig } from './services/firebase';

// Initialize Firebase Remote Config early
initializeRemoteConfig().catch((error) => {
  console.error('Failed to initialize Firebase Remote Config:', error);
});

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
  enabled: true,
  environment: import.meta.env.VITE_SENTRY_ENVIRONMENT ?? 'staging',
  tracesSampleRate: 0.01, // Only capture 1% of performance traces
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
  release: sentryReleaseTag,
  // Enhanced beforeSend filter to drop more events and reduce data
  beforeSend(event) {
    // Only send error-level events to Sentry
    if (event.level && event.level !== 'error' && event.level !== 'fatal') {
      return null; // Drop the event
    }

    // Create a copy to avoid mutating the original event
    const filteredEvent = { ...event };

    // Remove large breadcrumb arrays to reduce payload size
    if (filteredEvent.breadcrumbs && filteredEvent.breadcrumbs.length > 10) {
      filteredEvent.breadcrumbs = filteredEvent.breadcrumbs.slice(-10); // Keep only last 10 breadcrumbs
    }

    // Remove excessive context data
    if (filteredEvent.contexts) {
      // Keep only essential contexts
      const essentialContexts = ['runtime', 'browser'];
      const filteredContexts = { ...filteredEvent.contexts };
      Object.keys(filteredContexts).forEach((key) => {
        if (!essentialContexts.includes(key)) {
          delete filteredContexts[key];
        }
      });
      filteredEvent.contexts = filteredContexts;
    }

    // Remove large extra data
    if (filteredEvent.extra && Object.keys(filteredEvent.extra).length > 5) {
      const essentialKeys = ['error_data', 'exchange_error_data'];
      const filteredExtra: Record<string, unknown> = {};
      essentialKeys.forEach((key) => {
        if (filteredEvent.extra && filteredEvent.extra[key]) {
          filteredExtra[key] = filteredEvent.extra[key];
        }
      });
      filteredEvent.extra = filteredExtra;
    }

    return filteredEvent;
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
