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
    return;
  }

  try {
    await fetchAndActivate(remoteConfig);
    remoteConfigInitialized = true;
  } catch (error) {
    console.error('Failed to initialize Firebase Remote Config:', error);
    // Continue with default values
  }
};

// Helper function to get the USE_RELAY_BUY flag
export const getUseRelayBuyFlag = (): boolean => {
  try {
    return getBoolean(remoteConfig, 'USE_RELAY_BUY');
  } catch (error) {
    console.error('Failed to get USE_RELAY_BUY from Remote Config:', error);
    // Return default value
    return false;
  }
};
