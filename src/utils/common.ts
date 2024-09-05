import { ethers } from 'ethers';

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
