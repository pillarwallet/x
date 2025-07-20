import {
  startRegistration,
  startAuthentication,
} from '@simplewebauthn/browser';

// Base URL for Firebase functions - adjust this based on your deployment
const FIREBASE_FUNCTIONS_BASE_URL = 'http://localhost:5000/pillarx-staging/us-central1';

// Helper function to make API calls to Firebase functions
async function callFirebaseFunction(endpoint: string, data: any) {
  const url = `${FIREBASE_FUNCTIONS_BASE_URL}/passkeys/${endpoint}`;
  console.log(`Calling Firebase function: ${url}`, data);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  console.log(`Response status: ${response.status}`);
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error('Firebase function error:', errorData);
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  console.log(`Firebase function success:`, result);
  return result;
}

// Register a new passkey for a user
export async function registerPasskey(userId: string, username: string): Promise<boolean> {
  try {
    // Step 1: Get registration options from server
    const options = await callFirebaseFunction('register/options', {
      userId,
      username,
    });

    // Step 2: Start registration on the client
    const credential = await startRegistration(options);

    // Step 3: Verify registration with server
    const verification = await callFirebaseFunction('register/verify', {
      userId,
      credential,
    });

    return verification.verified === true;
  } catch (error) {
    console.error('Passkey registration failed:', error);
    throw error;
  }
}

// Authenticate with an existing passkey
export async function authenticateWithPasskey(userId: string): Promise<boolean> {
  try {
    // Step 1: Get authentication options from server
    const options = await callFirebaseFunction('authenticate/options', {
      userId,
    });

    // Step 2: Start authentication on the client
    const credential = await startAuthentication(options);

    // Step 3: Verify authentication with server
    const verification = await callFirebaseFunction('authenticate/verify', {
      userId,
      credential,
    });

    return verification.verified === true;
  } catch (error) {
    console.error('Passkey authentication failed:', error);
    throw error;
  }
}

// Sign a custom challenge with passkey
export async function signWithPasskey(userId: string, customChallenge: string): Promise<{ verified: boolean; signedChallenge?: string; signature?: string }> {
  try {
    // Step 1: Get signing options from server with custom challenge
    const options = await callFirebaseFunction('sign/options', {
      userId,
      customChallenge,
    });

    // Step 2: Start authentication on the client (same as signing)
    const credential = await startAuthentication(options);

    // Step 3: Verify signing with server
    const verification = await callFirebaseFunction('sign/verify', {
      userId,
      credential,
    });

    return {
      verified: verification.verified === true,
      signedChallenge: verification.signedChallenge,
      signature: verification.signature,
    };
  } catch (error) {
    console.error('Passkey signing failed:', error);
    throw error;
  }
}

// Check if passkeys are supported in the current browser
export function isPasskeySupported(): boolean {
  return window.PublicKeyCredential !== undefined;
}

// Check if the current platform supports passkeys
export async function isPasskeyAvailable(): Promise<boolean> {
  if (!isPasskeySupported()) {
    return false;
  }

  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch (error) {
    console.error('Error checking passkey availability:', error);
    return false;
  }
} 