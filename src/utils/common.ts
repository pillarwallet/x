import { ethers } from 'ethers';

export const getObjectHash = (obj: unknown, salt?: string | number) => {
  const checksum = `${JSON.stringify(obj)}-${salt}`;
  return ethers.utils.hexlify(Buffer.from(checksum));
}
