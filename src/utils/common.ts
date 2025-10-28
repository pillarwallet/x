import { ethers } from 'ethers';

// types
import { AssetSelectOption, SendModalData } from '../types';

export const getObjectHash = (obj: unknown, salt?: string | number) => {
  const checksum = `${JSON.stringify(obj)}-${salt}`;
  return ethers.utils.hexlify(Buffer.from(checksum));
};

export const pasteFromClipboard = async (onPaste: (text: string) => void) => {
  try {
    await navigator.permissions.query({
      name: 'clipboard-read' as PermissionName,
    });
  } catch (e) {
    //
  }

  try {
    const copied = await navigator.clipboard.readText();
    onPaste(copied);
  } catch (e) {
    //
  }
};

export const copyToClipboard = async (text: string, onSuccess?: () => void) => {
  try {
    const result = await navigator.permissions.query({
      name: 'clipboard-write' as PermissionName,
    });
    if (result.state !== 'granted' && result.state !== 'prompt') return;
    await navigator.clipboard.writeText(text);
    if (onSuccess) {
      onSuccess();
    }
  } catch (e) {
    //
  }
};

export const convertDateToUnixTimestamp = (date: Date): number =>
  Math.floor(date.getTime() / 1000);

export const getShorterTimeUnits = (formattedDistanceToNowDate: string) => {
  // Replace long units with shorter units and delete white space before the units
  return formattedDistanceToNowDate
    .replace('seconds', 's')
    .replace('second', 's')
    .replace('minutes', 'min')
    .replace('minute', 'min')
    .replace('hours', 'h')
    .replace('hour', 'h')
    .replace('days', 'd')
    .replace('day', 'd')
    .replace('months', 'mo')
    .replace('month', 'mo')
    .replace(/(\d+)\s+(?=[a-zA-Z])/g, '$1');
};

export const transactionDescription = (
  selectedAsset: AssetSelectOption | undefined,
  amount: number | undefined,
  to: string | undefined,
  payload: SendModalData | undefined
) => {
  if (selectedAsset?.type === 'token') {
    if (amount && to) {
      return `${amount} ${selectedAsset.asset.symbol} to ${to.substring(0, 6)}...${to.substring(to.length - 5)}`;
    }
  }

  return payload?.description;
};

/**
 * Sanitizes error messages by removing sensitive information like private keys.
 * @param error - The error to sanitize
 * @param sensitiveData - Optional sensitive data (e.g., private key) to redact from the error
 * @returns A sanitized error message string
 */
export const sanitizeError = (
  error: unknown,
  sensitiveData?: string
): string => {
  let errorMessage = 'Unknown error';

  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (error && typeof error === 'object') {
    try {
      errorMessage = JSON.stringify(error);
    } catch {
      errorMessage = 'Unknown error';
    }
  }

  // Remove sensitive data from error message if present
  if (sensitiveData && errorMessage.includes(sensitiveData)) {
    errorMessage = errorMessage.replace(
      new RegExp(sensitiveData.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
      '[SENSITIVE_DATA_REDACTED]'
    );
  }

  return errorMessage;
};
