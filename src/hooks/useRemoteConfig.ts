import { useEffect, useState } from 'react';
import {
  getUseRelayBuyFlag,
  initializeRemoteConfig,
} from '../services/firebase';

/**
 * Gets the relayBuy query parameter from the current URL
 * Returns true if relayBuy=true, false if relayBuy=false, null if not present
 */
const getRelayBuyFromUrl = (): boolean | null => {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(window.location.search);
  const relayBuyParam = params.get('relayBuy');

  if (relayBuyParam === null) return null;
  if (relayBuyParam === 'true') return true;
  if (relayBuyParam === 'false') return false;

  return null;
};

/**
 * Hook to get remote config values
 * This hook initializes Firebase Remote Config on first use
 * and provides reactive access to remote config values
 *
 * URL query parameter override:
 * - Add ?relayBuy=true to force relay buy mode
 * - Add ?relayBuy=false to force non-relay buy mode
 * - No parameter uses the Firebase Remote Config value
 */
export const useRemoteConfig = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [useRelayBuy, setUseRelayBuy] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      await initializeRemoteConfig();

      // Get the value after initialization completes
      const firebaseValue = getUseRelayBuyFlag();

      // Check for URL query parameter override
      const urlOverride = getRelayBuyFromUrl();

      // Use URL override if present, otherwise use Firebase value
      const finalValue = urlOverride !== null ? urlOverride : firebaseValue;

      // Update state after we have the value
      setUseRelayBuy(finalValue);
      setIsInitialized(true);
    };

    initialize();
  }, []);

  return {
    isInitialized,
    useRelayBuy,
  };
};

/**
 * Helper function to get the USE_RELAY_BUY flag synchronously
 * This should only be used after Remote Config has been initialized
 */
export const getUseRelayBuy = (): boolean => {
  return getUseRelayBuyFlag();
};
