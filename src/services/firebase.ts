import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import {
  fetchAndActivate,
  getBoolean,
  getRemoteConfig,
  RemoteConfig,
} from 'firebase/remote-config';

const firebaseConfig = {
  apiKey: 'AIzaSyBqsmAxGY1Xpqlt9xAb3OzMaJdOO_QUZ3w',
  authDomain: 'pillarx-76235.firebaseapp.com',
  projectId: 'pillarx-76235',
  storageBucket: 'pillarx-76235.firebasestorage.app',
  messagingSenderId: '924594360100',
  appId: '1:924594360100:web:9075123e56081d30662db1',
  measurementId: 'G-RQ0CLNGRGV',
};

const app = initializeApp(firebaseConfig);

export const firebaseAnalytics = getAnalytics(app);

// Initialize Remote Config
export const remoteConfig: RemoteConfig = getRemoteConfig(app);

// Set config settings
remoteConfig.settings = {
  minimumFetchIntervalMillis: 60000, // 1 minute (reduced for testing)
  fetchTimeoutMillis: 60000, // 60 seconds
};

// Set default values for remote config
remoteConfig.defaultConfig = {
  USE_RELAY_BUY: false,
};

// Initialize and fetch remote config
let remoteConfigInitialized = false;

export const initializeRemoteConfig = async (): Promise<void> => {
  if (remoteConfigInitialized) {
    console.log('Firebase Remote Config already initialized');
    return;
  }

  try {
    console.log('Fetching and activating Firebase Remote Config...');
    console.log('Default config:', remoteConfig.defaultConfig);
    console.log(
      'Last fetch status BEFORE fetch:',
      remoteConfig.lastFetchStatus
    );

    const activated = await fetchAndActivate(remoteConfig);
    remoteConfigInitialized = true;

    console.log(
      'Firebase Remote Config initialized and activated. New values activated:',
      activated
    );
    console.log('Last fetch status AFTER fetch:', remoteConfig.lastFetchStatus);
    console.log('Remote Config fetch time:', remoteConfig.fetchTimeMillis);

    // Try to get all parameters to see what's available
    try {
      const allParams = (remoteConfig as any)._storage;
      console.log('All available parameters in Remote Config:', allParams);
    } catch (e) {
      console.log('Could not access internal storage');
    }

    // Log the actual value immediately after activation
    const immediateValue = getBoolean(remoteConfig, 'USE_RELAY_BUY');
    console.log(
      'USE_RELAY_BUY value immediately after activation:',
      immediateValue
    );
  } catch (error) {
    console.error('Failed to initialize Firebase Remote Config:', error);
    // Continue with default values
  }
};

// Helper function to get the USE_RELAY_BUY flag
export const getUseRelayBuyFlag = (): boolean => {
  try {
    console.log('getUseRelayBuyFlag: Remote Config state:', {
      initialized: remoteConfigInitialized,
      lastFetchStatus: remoteConfig.lastFetchStatus,
      fetchTimeMillis: remoteConfig.fetchTimeMillis,
      defaultConfig: remoteConfig.defaultConfig,
    });

    // Try to get all values to see what's actually in the config
    const allKeys = Object.keys(remoteConfig.defaultConfig);
    console.log(
      'getUseRelayBuyFlag: Available keys in defaultConfig:',
      allKeys
    );

    const value = getBoolean(remoteConfig, 'USE_RELAY_BUY');
    console.log('getUseRelayBuyFlag: Retrieved value from getBoolean:', value);

    // Try to access the value directly from the internal state
    try {
      const internalValue = (remoteConfig as any)._value?.['USE_RELAY_BUY'];
      console.log(
        'getUseRelayBuyFlag: Internal _value for USE_RELAY_BUY:',
        internalValue
      );
    } catch (e) {
      console.log('getUseRelayBuyFlag: Could not access internal value');
    }

    return value;
  } catch (error) {
    console.error('Failed to get USE_RELAY_BUY from Remote Config:', error);
    // Return default value
    return false;
  }
};
