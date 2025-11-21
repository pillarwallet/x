/**
 * Validate Ethereum address
 */
export const validateEthereumAddress = (address: string): boolean => {
  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  return ethAddressRegex.test(address);
};

/**
 * Validate email address
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL
 */
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate app ID (alphanumeric with hyphens and underscores)
 */
export const validateAppId = (appId: string): boolean => {
  const appIdRegex = /^[a-z0-9-_]+$/;
  return appIdRegex.test(appId) && appId.length >= 3 && appId.length <= 50;
};

/**
 * Sanitize app ID (convert to lowercase, replace spaces with hyphens)
 */
export const sanitizeAppId = (input: string): string => {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '');
};

