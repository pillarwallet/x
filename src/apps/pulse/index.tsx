import { useEffect } from 'react';
import AppWrapper from './components/App/AppWrapper';
import './styles/tailwindPulse.css';

// utils
import { initSentryForPulse } from './utils/sentry';

const App = () => {
  /**
   * Initialize Sentry for the pulse app
   * Minimal setup to avoid quota issues - only captures errors
   */
  useEffect(() => {
    initSentryForPulse();
  }, []);

  return <AppWrapper />;
};

export default App;
