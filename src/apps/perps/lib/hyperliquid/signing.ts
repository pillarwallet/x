import {
  type Hex,
  hashTypedData,
  type WalletClient,
  keccak256,
  toHex,
  type PrivateKeyAccount,
  recoverTypedDataAddress,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import type { HyperliquidAction } from './types';

const SIGNATURE_CHAIN_ID = '0xa4b1'; // Arbitrum mainnet

export const HL_DOMAIN = {
  name: 'HyperliquidSignTransaction',
  version: '1',
  chainId: parseInt(SIGNATURE_CHAIN_ID, 16),
  verifyingContract: '0x0000000000000000000000000000000000000000' as const,
};

export const HL_TYPES = {
  HyperliquidTransaction: [
    { name: 'source', type: 'string' },
    { name: 'connectionId', type: 'bytes32' },
  ],
};

export async function signUserAction(
  walletClient: WalletClient,
  action: HyperliquidAction,
  nonce: number
): Promise<{ r: string; s: string; v: number }> {
  if (!walletClient.account) {
    throw new Error('No account connected');
  }

  // Construct the action payload
  const actionPayload = {
    action,
    nonce,
    vaultAddress: null,
  };

  // Convert to phantom agent format for signing
  const phantomAgent = {
    source: 'a',
    connectionId: hashTypedData({
      domain: HL_DOMAIN,
      types: {
        Agent: [
          { name: 'source', type: 'string' },
          { name: 'connectionId', type: 'bytes32' },
        ],
      },
      primaryType: 'Agent',
      message: {
        source: 'a',
        connectionId:
          '0x0000000000000000000000000000000000000000000000000000000000000000' as Hex,
      },
    }),
  };

  // Sign the action
  const actionHash = hashTypedData({
    domain: HL_DOMAIN,
    types: {
      HyperliquidTransaction: [
        { name: 'source', type: 'string' },
        { name: 'connectionId', type: 'bytes32' },
      ],
    },
    primaryType: 'HyperliquidTransaction',
    message: phantomAgent,
  });

  const signature = await walletClient.signTypedData({
    account: walletClient.account,
    domain: HL_DOMAIN,
    types: HL_TYPES,
    primaryType: 'HyperliquidTransaction',
    message: phantomAgent,
  });

  // Parse signature
  const r = signature.slice(0, 66);
  const s = '0x' + signature.slice(66, 130);
  const v = parseInt(signature.slice(130, 132), 16);

  return { r, s, v };
}

export function buildNoopAction(): HyperliquidAction {
  return {
    type: 'noop',
  };
}

export function buildOrderAction(params: {
  coin: number;
  isBuy: boolean;
  sz: number;
  limitPx: number;
  orderType: { limit?: { tif: string }; trigger?: any };
  reduceOnly: boolean;
  builder?: { b: string; f: number };
}): HyperliquidAction {
  return {
    type: 'order',
    orders: [
      {
        a: params.coin,
        b: params.isBuy,
        p: params.limitPx.toString(),
        s: params.sz.toString(),
        r: params.reduceOnly,
        t: params.orderType,
      },
    ],
    grouping: 'na',
    ...(params.builder && { builder: params.builder }),
  };
}

export function buildApproveAgentAction(params: {
  agentAddress: string;
  agentName?: string;
  nonce: number;
}): HyperliquidAction {
  return {
    type: 'approveAgent',
    hyperliquidChain: 'Mainnet',
    signatureChainId: SIGNATURE_CHAIN_ID,
    agentAddress: params.agentAddress,
    agentName: params.agentName || 'PillarX-Agent',
    nonce: params.nonce,
  };
}

export function buildApproveBuilderFeeAction(params: {
  maxFeeRate: string; // "0.1%" or "30bps" etc, but passed as percentage string e.g. "0.3%"
  builderAddress: string;
  nonce: number;
}): HyperliquidAction {
  return {
    type: 'approveBuilderFee',
    hyperliquidChain: 'Mainnet',
    signatureChainId: SIGNATURE_CHAIN_ID,
    maxFeeRate: params.maxFeeRate,
    builder: params.builderAddress,
    nonce: params.nonce,
  };
}

// Helper to get EIP-712 data for Approve Agent
export function getApproveAgentTypedData(
  hyperliquidChain: string,
  signatureChainId: string,
  agentAddress: string,
  agentName: string | undefined,
  nonce: number
) {
  const types = {
    'HyperliquidTransaction:ApproveAgent': [
      { name: 'hyperliquidChain', type: 'string' },
      { name: 'agentAddress', type: 'address' },
      { name: 'agentName', type: 'string' },
      { name: 'nonce', type: 'uint64' },
    ],
  };

  const domain = {
    name: 'HyperliquidSignTransaction',
    version: '1',
    chainId: parseInt(signatureChainId, 16),
    verifyingContract: '0x0000000000000000000000000000000000000000' as const,
  };

  const message = {
    hyperliquidChain: hyperliquidChain,
    agentAddress: agentAddress,
    agentName: agentName,
    nonce: nonce,
  };

  return {
    domain,
    types,
    primaryType: 'HyperliquidTransaction:ApproveAgent',
    message,
  };
}

// Helper to get EIP-712 data for Approve Builder Fee
export function getApproveBuilderFeeTypedData(
  hyperliquidChain: string,
  signatureChainId: string,
  maxFeeRate: string,
  builder: string,
  nonce: number
) {
  const types = {
    'HyperliquidTransaction:ApproveBuilderFee': [
      { name: 'hyperliquidChain', type: 'string' },
      { name: 'maxFeeRate', type: 'string' },
      { name: 'builder', type: 'address' },
      { name: 'nonce', type: 'uint64' },
    ],
  };

  const domain = {
    name: 'HyperliquidSignTransaction',
    version: '1',
    chainId: parseInt(signatureChainId, 16),
    verifyingContract: '0x0000000000000000000000000000000000000000' as const,
  };

  const message = {
    hyperliquidChain,
    maxFeeRate,
    builder,
    nonce,
  };

  return {
    domain,
    types,
    primaryType: 'HyperliquidTransaction:ApproveBuilderFee',
    message,
  };
}

export async function signApproveAgentAction(
  walletClient: WalletClient,
  action: any
): Promise<{ r: string; s: string; v: number }> {
  if (!walletClient.account) {
    throw new Error('No account connected');
  }

  const { domain, types, primaryType, message } = getApproveAgentTypedData(
    action.hyperliquidChain,
    action.signatureChainId,
    action.agentAddress,
    action.agentName,
    action.nonce
  );

  const signature = await walletClient.signTypedData({
    account: walletClient.account,
    domain,
    types,
    primaryType,
    message,
  });

  // Parse signature
  const r = signature.slice(0, 66);
  const s = '0x' + signature.slice(66, 130);
  const v = parseInt(signature.slice(130, 132), 16);

  return { r, s, v };
}

export async function signApproveBuilderFeeAction(
  walletClient: WalletClient,
  action: any
): Promise<{ r: string; s: string; v: number }> {
  if (!walletClient.account) {
    throw new Error('No account connected');
  }

  const { domain, types, primaryType, message } = getApproveBuilderFeeTypedData(
    action.hyperliquidChain,
    action.signatureChainId,
    action.maxFeeRate,
    action.builder,
    action.nonce
  );

  const signature = await walletClient.signTypedData({
    account: walletClient.account,
    domain,
    types,
    primaryType,
    message,
  });

  // Parse signature
  const r = signature.slice(0, 66);
  const s = '0x' + signature.slice(66, 130);
  const v = parseInt(signature.slice(130, 132), 16);

  return { r, s, v };
}

// Helper to get EIP-712 data for Withdraw3
export function getWithdraw3TypedData(
  hyperliquidChain: string,
  signatureChainId: string,
  destination: string,
  amount: string,
  time: number
) {
  const types = {
    'HyperliquidTransaction:Withdraw': [
      { name: 'hyperliquidChain', type: 'string' },
      { name: 'destination', type: 'string' },
      { name: 'amount', type: 'string' },
      { name: 'time', type: 'uint64' },
    ],
  };

  const domain = {
    name: 'HyperliquidSignTransaction',
    version: '1',
    chainId: parseInt(signatureChainId, 16),
    verifyingContract: '0x0000000000000000000000000000000000000000' as const,
  };

  const message = {
    hyperliquidChain,
    destination,
    amount,
    time,
  };

  return {
    domain,
    types,
    primaryType: 'HyperliquidTransaction:Withdraw',
    message,
  };
}

// Sign withdraw3 action with wallet client (for master wallet)
export async function signWithdraw3Action(
  walletClient: WalletClient,
  action: any
): Promise<{ r: string; s: string; v: number }> {
  if (!walletClient.account) {
    throw new Error('No account connected');
  }

  const { domain, types, primaryType, message } = getWithdraw3TypedData(
    action.hyperliquidChain,
    action.signatureChainId,
    action.destination,
    action.amount,
    action.time
  );

  const signature = await walletClient.signTypedData({
    account: walletClient.account,
    domain,
    types,
    primaryType: primaryType as any,
    message,
  });

  // Parse signature
  const r = signature.slice(0, 66);
  const s = '0x' + signature.slice(66, 130);
  const v = parseInt(signature.slice(130, 132), 16);

  return { r, s, v };
}

// Sign withdraw3 action with agent private key
export async function signWithdraw3AgentAction(
  agentPrivateKey: Hex,
  action: any
): Promise<{ r: string; s: string; v: number }> {
  const account = privateKeyToAccount(agentPrivateKey);

  const { domain, types, primaryType, message } = getWithdraw3TypedData(
    action.hyperliquidChain,
    action.signatureChainId,
    action.destination,
    action.amount,
    action.time
  );

  const signature = await account.signTypedData({
    domain,
    types,
    primaryType: primaryType as any,
    message,
  });

  // Parse signature
  const r = signature.slice(0, 66);
  const s = '0x' + signature.slice(66, 130);
  const v = parseInt(signature.slice(130, 132), 16);

  return { r, s, v };
}


export async function signAgentAction(
  agentPrivateKey: Hex,
  action: HyperliquidAction,
  nonce: number
): Promise<{ r: string; s: string; v: number }> {
  const account = privateKeyToAccount(agentPrivateKey);

  const phantomAgent = {
    source: 'a',
    connectionId: keccak256(
      toHex(
        JSON.stringify({
          source: 'a',
          connectionId:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
        })
      )
    ),
  };

  const signature = await account.signTypedData({
    domain: HL_DOMAIN,
    types: HL_TYPES,
    primaryType: 'HyperliquidTransaction',
    message: phantomAgent,
  });

  const r = signature.slice(0, 66);
  const s = '0x' + signature.slice(66, 130);
  const v = parseInt(signature.slice(130, 132), 16);

  return { r, s, v };
}

export async function verifyAgentSignature(
  agentAddress: string,
  signature: { r: string; s: string; v: number }
): Promise<boolean> {
  try {
    const phantomAgent = {
      source: 'a',
      connectionId: keccak256(
        toHex(
          JSON.stringify({
            source: 'a',
            connectionId:
              '0x0000000000000000000000000000000000000000000000000000000000000000',
          })
        )
      ),
    };

    const recoveredAddress = await recoverTypedDataAddress({
      domain: HL_DOMAIN,
      types: HL_TYPES,
      primaryType: 'HyperliquidTransaction',
      message: phantomAgent,
      signature:
        `${signature.r}${signature.s.slice(2)}${signature.v.toString(16).padStart(2, '0')}` as Hex,
    });

    return recoveredAddress.toLowerCase() === agentAddress.toLowerCase();
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

export function generateAgentWallet(): { address: string; privateKey: Hex } {
  // Generate random private key
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  const privateKey = ('0x' +
    Array.from(randomBytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')) as Hex;

  const account = privateKeyToAccount(privateKey);
  return {
    address: account.address,
    privateKey,
  };
}
