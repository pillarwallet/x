import type { Hex } from 'viem';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { encryptWithPin, decryptWithPin, type EncryptedData } from '../encryption';
import { initializeSessionManager, resetInactivityTimer, clearSession } from './session-manager';

// Module-level cache for unlocked private key (cleared on page refresh or session timeout)
let cachedPrivateKey: Hex | null = null;

// Initialize session manager to auto-clear cache after inactivity
initializeSessionManager(() => {
  console.log('[Keystore] Clearing cached private keys due to session timeout');
  cachedPrivateKey = null;
  cachedImportedKey = null; // Also clear imported account cache
});

export function generateAgentWallet(): { address: string; privateKey: Hex } {
  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);
  return {
    address: account.address,
    privateKey: privateKey,
  };
}

// Storage Keys Helper
function getStorageKey(masterAddress: string, suffix: string): string {
  return `hl_agent_${masterAddress.toLowerCase()}_${suffix}`;
}

// ----- ENCRYPTED STORAGE (Preferred) -----

export async function storeAgentWalletEncrypted(
  masterAddress: string,
  address: string,
  privateKey: Hex,
  pin: string,
  approved: boolean = false,
  builderApproved: boolean = false
): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const encrypted = await encryptWithPin(privateKey, pin);
    const storageData = JSON.stringify(encrypted);

    localStorage.setItem(getStorageKey(masterAddress, 'address'), address);
    localStorage.setItem(getStorageKey(masterAddress, 'encrypted_key'), storageData);

    // Clear legacy plaintext key if it exists to upgrade security
    localStorage.removeItem(getStorageKey(masterAddress, 'key'));

    localStorage.setItem(getStorageKey(masterAddress, 'approved'), String(approved));
    localStorage.setItem(getStorageKey(masterAddress, 'builder_approved'), String(builderApproved));

    // Hot-load the cache so it's immediately available without unlocking again
    cachedPrivateKey = privateKey;
    resetInactivityTimer(); // Reset session timeout on wallet storage
  } catch (error) {
    console.error('Failed to encrypt wallet:', error);
    throw new Error('Encryption failed');
  }
}

export async function unlockAgentWallet(
  masterAddress: string,
  pin: string
): Promise<{ address: string; privateKey: Hex; approved: boolean; builderApproved: boolean } | null> {
  if (typeof window === 'undefined') return null;

  const address = localStorage.getItem(getStorageKey(masterAddress, 'address'));
  const encryptedkeyData = localStorage.getItem(getStorageKey(masterAddress, 'encrypted_key'));
  const approvedItem = localStorage.getItem(getStorageKey(masterAddress, 'approved'));
  const approved = approvedItem === 'true';
  if (approvedItem !== null && approvedItem !== 'true' && approvedItem !== 'false') {
    console.warn(`[Keystore] Invalid key 'approved' value: ${approvedItem}`);
    localStorage.removeItem(getStorageKey(masterAddress, 'approved'));
  }

  const builderApprovedItem = localStorage.getItem(getStorageKey(masterAddress, 'builder_approved'));
  const builderApproved = builderApprovedItem === 'true';
  if (builderApprovedItem !== null && builderApprovedItem !== 'true' && builderApprovedItem !== 'false') {
    console.warn(`[Keystore] Invalid key 'builder_approved' value: ${builderApprovedItem}`);
    localStorage.removeItem(getStorageKey(masterAddress, 'builder_approved'));
  }

  if (!address || !encryptedkeyData) {
    // Fallback using deprecated plaintext for migration/legacy support
    return getAgentWalletLocal(masterAddress);
  }

  try {
    const encryptedData: EncryptedData = JSON.parse(encryptedkeyData);
    const privateKey = await decryptWithPin(encryptedData, pin);

    cachedPrivateKey = privateKey as Hex;
    resetInactivityTimer(); // Reset session timeout on wallet unlock

    return {
      address,
      privateKey: privateKey as Hex,
      approved,
      builderApproved
    };
  } catch (error) {
    console.error('Failed to unlock wallet:', error);
    throw error; // Let UI handle "Incorrect PIN"
  }
}

export function isAgentWalletEncrypted(masterAddress: string): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(getStorageKey(masterAddress, 'encrypted_key'));
}

export function hasAgentWallet(masterAddress: string): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(getStorageKey(masterAddress, 'address'));
}


// ----- LEGACY PLAINTEXT STORAGE (Deprecated) -----
// WARNING: These functions store private keys in plaintext localStorage
// Only use in development. Production usage is blocked by environment check.

function checkInsecureStorageAllowed(): void {
  const isAllowed = import.meta.env.VITE_ALLOW_INSECURE_STORAGE === 'true' ||
    import.meta.env.DEV === true;

  if (!isAllowed) {
    console.error('[Keystore] CRITICAL: Attempted to use insecure localStorage for private keys in production!');
    throw new Error('Insecure storage not allowed in production. Use encrypted storage instead.');
  }

  console.warn('[Keystore] WARNING: Using insecure localStorage for private keys. This should only be used in development.');
}

export function storeAgentWalletLocal(
  masterAddress: string,
  address: string,
  privateKey: Hex,
  approved?: boolean
): void {
  if (typeof window === 'undefined') return;
  checkInsecureStorageAllowed();

  localStorage.setItem(getStorageKey(masterAddress, 'address'), address);
  localStorage.setItem(getStorageKey(masterAddress, 'key'), privateKey);
  if (approved !== undefined) {
    localStorage.setItem(
      getStorageKey(masterAddress, 'approved'),
      String(approved)
    );
  }
  // Clear cache and session on new plaintext storage
  clearSession();
}

export function getAgentWalletLocal(
  masterAddress: string
): { address: string; privateKey: Hex; approved: boolean; builderApproved: boolean } | null {
  if (typeof window === 'undefined') return null;
  checkInsecureStorageAllowed();

  const address = localStorage.getItem(getStorageKey(masterAddress, 'address'));
  const privateKey = localStorage.getItem(
    getStorageKey(masterAddress, 'key')
  ) as Hex;
  // Defensive check for boolean values to prevent type errors
  const approvedItem = localStorage.getItem(getStorageKey(masterAddress, 'approved'));
  const approved = approvedItem === 'true';
  if (approvedItem !== null && approvedItem !== 'true' && approvedItem !== 'false') {
    console.warn(`[Keystore] Invalid 'approved' value found: ${approvedItem}. Clearing.`);
    localStorage.removeItem(getStorageKey(masterAddress, 'approved'));
  }

  const builderApprovedItem = localStorage.getItem(getStorageKey(masterAddress, 'builder_approved'));
  const builderApproved = builderApprovedItem === 'true';
  if (builderApprovedItem !== null && builderApprovedItem !== 'true' && builderApprovedItem !== 'false') {
    console.warn(`[Keystore] Invalid 'builder_approved' value found: ${builderApprovedItem}. Clearing.`);
    localStorage.removeItem(getStorageKey(masterAddress, 'builder_approved'));
  }

  if (!address || !privateKey) return null;

  return { address, privateKey, approved, builderApproved };
}

export function clearAgentWalletLocal(masterAddress: string): void {
  if (typeof window === 'undefined') return;
  checkInsecureStorageAllowed();

  localStorage.removeItem(getStorageKey(masterAddress, 'address'));
  localStorage.removeItem(getStorageKey(masterAddress, 'key'));
  localStorage.removeItem(getStorageKey(masterAddress, 'encrypted_key'));
  localStorage.removeItem(getStorageKey(masterAddress, 'approved'));
  localStorage.removeItem(getStorageKey(masterAddress, 'builder_approved'));
  // Clear cache and session when wallet is cleared
  clearSession();
}

// Global imported account storage (also plaintext by default in old code, ideally should encrypt too)
// For now, leaving as is or upgrading if requested. User request focused on agent wallet.
// Global Imported Account Storage
const GLOBAL_IMPORTED_ADDRESS_KEY = 'hl_imported_address';
const GLOBAL_IMPORTED_ENCRYPTED_KEY = 'hl_imported_encrypted_key';
const GLOBAL_ACCOUNT_KEY = 'hl_imported_account'; // Legacy plaintext

// Imported account cache (also cleared on session timeout)
let cachedImportedKey: Hex | null = null;

export async function storeImportedAccountEncrypted(
  address: string,
  privateKey: Hex,
  pin: string
): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const encrypted = await encryptWithPin(privateKey, pin);
    const storageData = JSON.stringify(encrypted);

    localStorage.setItem(GLOBAL_IMPORTED_ADDRESS_KEY, address);
    localStorage.setItem(GLOBAL_IMPORTED_ENCRYPTED_KEY, storageData);

    // Clear legacy plaintext
    localStorage.removeItem(GLOBAL_ACCOUNT_KEY);

    // Cache it
    cachedImportedKey = privateKey;
    resetInactivityTimer(); // Reset session timeout on imported account storage
    window.dispatchEvent(new Event('imported-account-changed'));
  } catch (error) {
    console.error('Failed to encrypt imported account:', error);
    throw new Error('Encryption failed');
  }
}

export async function unlockImportedAccount(
  pin: string
): Promise<{ accountAddress: string; privateKey: Hex } | null> {
  if (typeof window === 'undefined') return null;

  const address = localStorage.getItem(GLOBAL_IMPORTED_ADDRESS_KEY);
  const encryptedkeyData = localStorage.getItem(GLOBAL_IMPORTED_ENCRYPTED_KEY);

  if (!address || !encryptedkeyData) return null;

  try {
    const encryptedData: EncryptedData = JSON.parse(encryptedkeyData);
    const privateKey = await decryptWithPin(encryptedData, pin);

    cachedImportedKey = privateKey as Hex;
    resetInactivityTimer(); // Reset session timeout on imported account unlock
    window.dispatchEvent(new Event('imported-account-changed'));

    return {
      accountAddress: address,
      privateKey: privateKey as Hex,
    };
  } catch (error) {
    console.error('Failed to unlock imported account:', error);
    throw error;
  }
}

export function isImportedAccountEncrypted(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(GLOBAL_IMPORTED_ENCRYPTED_KEY);
}

export function getImportedAccountAddress(): string | null {
  if (typeof window === 'undefined') return null;
  // Check new key first, then legacy
  const newAddress = localStorage.getItem(GLOBAL_IMPORTED_ADDRESS_KEY);
  if (newAddress) return newAddress;

  // Try legacy GLOBAL_ACCOUNT_KEY with safe JSON parsing
  const legacyData = localStorage.getItem(GLOBAL_ACCOUNT_KEY);
  if (legacyData) {
    try {
      const parsed = JSON.parse(legacyData);
      return parsed.accountAddress || null;
    } catch (error) {
      console.warn('[Keystore] Failed to parse legacy GLOBAL_ACCOUNT_KEY, clearing corrupt data:', error);
      localStorage.removeItem(GLOBAL_ACCOUNT_KEY);
      return null;
    }
  }

  return null;
}

export async function storeImportedAccount(
  accountAddress: string,
  privateKey: Hex,
  pin: string
): Promise<void> {
  // Enforce encryption by delegating
  await storeImportedAccountEncrypted(accountAddress, privateKey, pin);
}

export function getImportedAccount(): {
  accountAddress: string;
  privateKey: Hex;
} | null {
  if (typeof window === 'undefined') return null;

  // 1. Check Cache
  if (cachedImportedKey) {
    const address = getImportedAccountAddress();
    if (address) {
      resetInactivityTimer(); // Reset session timeout on imported account access
      return { accountAddress: address, privateKey: cachedImportedKey };
    }
  }

  // 2. Check Legacy Plaintext
  const data = localStorage.getItem(GLOBAL_ACCOUNT_KEY);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      return {
        accountAddress: parsed.accountAddress,
        privateKey: parsed.privateKey as Hex,
      };
    } catch {
      return null;
    }
  }

  // 3. If Encrypted and not cached force user to unlock (return null here)
  if (isImportedAccountEncrypted()) {
    return null;
  }

  return null;
}

export function clearImportedAccount(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(GLOBAL_ACCOUNT_KEY);
  localStorage.removeItem(GLOBAL_IMPORTED_ADDRESS_KEY);
  localStorage.removeItem(GLOBAL_IMPORTED_ENCRYPTED_KEY);
  // Note: clearSession() already clears cachedImportedKey, but we call it to also clear agent wallet cache
  clearSession();
  window.dispatchEvent(new Event('imported-account-changed'));
}

// Combined functions facade

export function updateAgentApproval(
  masterAddress: string,
  approved: boolean
): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(getStorageKey(masterAddress, 'approved'), String(approved));
}

export function updateBuilderApproval(
  masterAddress: string,
  builderApproved: unknown
): void {
  if (typeof window === 'undefined') return;
  if (typeof builderApproved !== 'boolean') {
    console.warn('[Keystore] updateBuilderApproval called with non-boolean:', builderApproved);
  }
  const approved = Boolean(builderApproved);
  localStorage.setItem(getStorageKey(masterAddress, 'builder_approved'), String(approved));
}

/**
 * @deprecated Use storeAgentWalletEncrypted instead. This function stores keys in plaintext.
 */
export async function storeAgentWallet(
  masterAddress: string,
  address: string,
  privateKey: Hex,
  pin: string,
  approved: boolean = false,
  builderApproved: boolean = false
): Promise<void> {
  // Enforce encryption
  return storeAgentWalletEncrypted(masterAddress, address, privateKey, pin, approved, builderApproved);
}

export async function getAgentWallet(
  masterAddress: string
): Promise<{ address: string; privateKey: Hex; approved: boolean; builderApproved: boolean } | null> {
  // Browser guard for SSR/test environments
  if (typeof window === 'undefined' || !window.localStorage) return null;

  // Check memory cache first
  if (cachedPrivateKey) {
    const address = localStorage.getItem(getStorageKey(masterAddress, 'address'));
    if (address) {
      const approvedItem = localStorage.getItem(getStorageKey(masterAddress, 'approved'));
      const approved = approvedItem === 'true';
      const builderApprovedItem = localStorage.getItem(getStorageKey(masterAddress, 'builder_approved'));
      const builderApproved = builderApprovedItem === 'true';
      resetInactivityTimer(); // Reset session timeout on wallet access
      return { address, privateKey: cachedPrivateKey, approved, builderApproved };
    }
  }

  if (isAgentWalletEncrypted(masterAddress)) {
    // Locked and not in memory
    // We cannot return the key. The caller must handle this.
    // For backward compatibility, we return null so the app thinks "No active wallet" 
    // (which implies one needs to be set up OR unlocked).
    return null;
  }

  // Legacy plaintext
  return getAgentWalletLocal(masterAddress);
}

export async function clearAgentWallet(masterAddress: string): Promise<void> {
  clearAgentWalletLocal(masterAddress);
}

export function clearAllAgentWalletsLocal(): void {
  // Browser guard for SSR safety
  if (typeof window === 'undefined' || !window.localStorage) return;

  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('hl_agent_')) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));

  // Clear in-memory cache
  cachedPrivateKey = null;
}

export function getAgentAddress(masterAddress: string): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(getStorageKey(masterAddress, 'address'));
}

export async function checkWalletMatch(importedAddress: string, masterAddress: string): Promise<boolean> {
  // Normalize addresses for comparison
  const normalize = (addr: string) => addr.toLowerCase();
  return normalize(importedAddress) === normalize(getAgentAddress(masterAddress) || '');
}
