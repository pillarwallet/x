import { SessionTypes } from '@walletconnect/types';
import { isAddress, isAddressEqual } from 'viem';

export const PERSONAL_SIGN = 'personal_sign';
export const ETH_SIGN = 'eth_sign';
export const ETH_SEND_TX = 'eth_sendTransaction';
export const ETH_SIGN_TX = 'eth_signTransaction';
export const ETH_SIGN_TYPED_DATA = 'eth_signTypedData';
export const ETH_SIGN_TYPED_DATA_V4 = 'eth_signTypedData_v4';
export const ETH_SEND_RAW_TRANSACTION = 'eth_sendRawTransaction';
export const ETH_ACCOUNTS = 'eth_accounts';
export const WALLET_SWITCH_CHAIN = 'wallet_switchEthereumChain';

export const WALLETCONNECT_EVENT = {
  SESSION_DELETE: 'session_delete',
  SESSION_PROPOSAL: 'session_proposal',
  SESSION_REQUEST: 'session_request',
  PROPOSAL_EXPIRE: 'proposal_expire',
  SESSION_REQUEST_EXPIRE: 'session_request_expire',
};

export const getWalletAddressesFromSession = (
  session: SessionTypes.Struct
): string[] => {
  const accounts: string[] = session.namespaces?.eip155?.accounts || [];
  return accounts.map((acc) => acc.split(':')[2]);
};

export const isAddressInSessionViaPrivy = (
  session: SessionTypes.Struct,
  EOAAddress: string | null | undefined
): boolean => {
  if (!EOAAddress || !isAddress(EOAAddress, { strict: false })) {
    return false;
  }

  const addresses = getWalletAddressesFromSession(session);

  return addresses.some((addr) => {
    if (!addr || !isAddress(addr, { strict: false })) {
      return false; // skip if the address is invalid
    }
    return isAddressEqual(addr as `0x${string}`, EOAAddress as `0x${string}`);
  });
};
