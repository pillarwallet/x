let signMessageFn: ((message: string) => Promise<string>) | null = null;
let getAddressFn: (() => string | undefined) | null = null;

export const setRequestSignature = (
  signer: (message: string) => Promise<string>,
  getAddress?: () => string | undefined
) => {
  signMessageFn = signer;
  getAddressFn = getAddress || null;
};

export const clearRequestSignature = () => {
  signMessageFn = null;
  getAddressFn = null;
};

export const getConnectedAddress = (): string | undefined => {
  return getAddressFn ? getAddressFn() : undefined;
};

// Helper function to sort object keys recursively for consistent JSON stringification
const sortKeysRecursively = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sortKeysRecursively);
  }
  
  const sorted: Record<string, any> = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    sorted[key] = sortKeysRecursively(obj[key]);
  }
  
  return sorted;
};

export const signPayloadForHeader = async (
  payload: unknown
): Promise<string> => {
  if (!signMessageFn) {
    console.error('❌ Signer not initialised!');
    throw new Error('Signer not initialised');
  }
  
  console.log('🔐 SIGNING - Signer function is available, calling it...');
  
  // Sort keys recursively to ensure consistent JSON stringification
  const sortedPayload = sortKeysRecursively(payload ?? {});
  const message = JSON.stringify(sortedPayload);
  
  console.log('🔐 SIGNING - Message to sign:', message);
  
  // Sign the message directly (not a hash)
  const signature = await signMessageFn(message);
  
  console.log('🔐 SIGNING - Generated signature:', signature);
  
  return signature;
};
