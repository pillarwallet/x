/**
 * Note! This is a temporary / experimental solution for a passkey-first login 
 * method. There will need to be a more permanent solution in future, which will
 * involve a backend or SSO solution paired with the passkey.
 *
 * This code was taking from:
 * https://github.com/IAmKio/eth-global-london-2024/blob/main/frontend/src/services/passkey.js
 */

/**
 * @name deletePasskey
 * @description Deletes the passkey from local storage
 *
 * @returns boolean
 */
const deletePasskey = async () => {
  localStorage.removeItem('uid');
  localStorage.removeItem('loginProvider');

  return true;
};

/**
 * @name createPasskey
 * @description Attempts to create a passkey for the user. This
 * may fail in several different ways in which it will fall through
 * to different error handlers.
 *
 * @returns boolean | Error
 */
const createPasskey = async () => {
  const name = 'Temporary Wallet';

  // Call the credentials API to create a new passkey
  return navigator.credentials
    .create({
      publicKey: {
        rp: {
          name: 'Px',
        },
        user: {
          id: new TextEncoder().encode('thisisatestforpasskeys@gmail.com'),
          name: name,
          displayName: name,
        },
        pubKeyCredParams: [
          {
            type: 'public-key',
            alg: -7,
          },
        ],
        attestation: 'direct',
        timeout: 60000,
        challenge: new Uint8Array(32).buffer,
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          requireResidentKey: true,
        },
      },
    })
    .then((cred) => {
      // Did we get a credential? Then it was successful and
      // we can store the credential in local storage.
      if (cred) {
        localStorage.setItem('uid', cred.id);
        localStorage.setItem('loginProvider', 'passkey');
        return true;
      } else {
        // Otjerwise, throw an error
        throw new Error('No credential found');
      }
    })
    .catch((err) => {
      // Final fall through
      throw new Error(err);
    });
};

/**
 * @name getPasskeyData
 * @description Attempts to get the passkey data from the user.
 *
 * @returns string | Error
 */
const getPasskeyData = async () => {
  const passkeyCredential = localStorage.getItem('credential');

  // No crednetial found? Throw an error
  if (!passkeyCredential) {
    throw new Error('No passkey found');
  }

  // Call the credentials API to get the passkey
  return navigator.credentials
    .get({
      publicKey: {
        timeout: 60000,
        challenge: new Uint8Array(32).buffer,
        allowCredentials: [],
      },
    })
    .then((credential) => {
      if (credential) {
        // Did we get the a credential? Store them in local storage
        localStorage.setItem('uid', credential.id);
        localStorage.setItem('loginProvider', 'passkey');
        return credential.id;
      } else {
        throw new Error('No credential found');
      }
    })
    .catch((err) => {
      // Final fall through
      throw new Error(err);
    });
};

export { createPasskey, deletePasskey, getPasskeyData };
