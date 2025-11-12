import { useEffect, useState } from 'react';
import {
  getUseRelayBuyFlag,
  initializeRemoteConfig,
} from '../services/firebase';

/**
 * Hook to get remote config values
 * This hook initializes Firebase Remote Config on first use
 * and provides reactive access to remote config values
 */
export const useRemoteConfig = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [useRelayBuy, setUseRelayBuy] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      await initializeRemoteConfig();

      // Get the value after initialization completes
      const flagValue = getUseRelayBuyFlag();

      // Update state after we have the value
      setUseRelayBuy(flagValue);
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
