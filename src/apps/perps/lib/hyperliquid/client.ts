import axios from 'axios';
import { isTestnet } from '../../../../utils/blockchain';
import type { SignedAction, UserState, AssetInfo, HyperliquidOrder, UniverseAsset, AssetContext } from './types';

const BASE_URL = isTestnet
  ? 'https://api.hyperliquid-testnet.xyz'
  : 'https://api.hyperliquid.xyz';

const EXCHANGE_URL = `${BASE_URL}/exchange`;
const INFO_URL = `${BASE_URL}/info`;

export async function postExchange(signedAction: SignedAction): Promise<any> {
  try {
    // Explicitly set vaultAddress to undefined if null/empty to exclude from JSON
    const payload = {
      ...signedAction,
      vaultAddress: signedAction.vaultAddress || undefined,
    };

    const response = await axios.post(EXCHANGE_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = response.data;

    // Check if the exchange rejected the action
    if (data?.status && data.status !== 'ok') {
      const errorMsg =
        data.response?.error || data.response || 'Exchange rejected action';
      throw new Error(errorMsg);
    }

    return data;
  } catch (error: any) {
    console.error('Exchange API error:', error.response?.data || error.message);

    // Enhanced error message for signature mismatches
    const errorMessage =
      error.response?.data?.error ||
      error.message ||
      'Failed to execute action';
    if (errorMessage.includes('does not exist')) {
      console.error(
        '⚠️ Likely EIP-712 typed data mismatch. Verify domain, types, primaryType, and chainId.'
      );
    }

    throw new Error(errorMessage);
  }
}

export async function getUserState(address: string): Promise<UserState | null> {
  try {
    console.log('[getUserState] Fetching state for address:', address);
    console.log('[getUserState] Using API URL:', INFO_URL);

    const response = await axios.post(
      INFO_URL,
      {
        type: 'clearinghouseState',
        user: address,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('[getUserState] Response received:', {
      hasData: !!response.data,
      hasMarginSummary: !!response.data?.marginSummary,
      accountValue: response.data?.marginSummary?.accountValue
    });

    return response.data;
  } catch (error: any) {
    console.error('[getUserState] API error:', error.response?.data || error.message);
    return null;
  }
}

export async function getMetaInfo(): Promise<any> {
  try {
    const response = await axios.post(
      INFO_URL,
      {
        type: 'meta',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('Meta info error:', error.response?.data || error.message);
    return null;
  }
}

export async function getOpenOrders(
  address: string,
  symbol?: string
): Promise<HyperliquidOrder[]> {
  try {
    const response = await axios.post(
      INFO_URL,
      {
        type: 'openOrders',
        user: address,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const orders = response.data || [];

    // Filter by symbol if provided
    if (symbol) {
      return orders.filter((order: any) => order.coin === symbol);
    }

    return orders;
  } catch (error: any) {
    console.error('Open orders error:', error.response?.data || error.message);
    return [];
  }
}

export async function getFrontendOpenOrders(
  address: string
): Promise<HyperliquidOrder[]> {
  try {
    const response = await axios.post(
      INFO_URL,
      {
        type: 'frontendOpenOrders',
        user: address,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data || [];
  } catch (error: any) {
    console.error('Frontend open orders error:', error.response?.data || error.message);
    return [];
  }
}

export async function getUserFills(address: string): Promise<any[]> {
  try {
    const response = await axios.post(
      INFO_URL,
      {
        type: 'userFills',
        user: address,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data || [];
  } catch (error: any) {
    console.error('User fills error:', error.response?.data || error.message);
    return [];
  }
}



export async function getMarkPrice(symbol: string): Promise<number | null> {
  try {
    const response = await axios.post(
      INFO_URL,
      {
        type: 'allMids',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data && typeof response.data === 'object') {
      const markPrice = response.data[symbol];
      return markPrice ? parseFloat(markPrice) : null;
    }

    return null;
  } catch (error: any) {
    console.error('Mark price error:', error.response?.data || error.message);
    return null;
  }
}

export async function getAllAssets(): Promise<AssetInfo[]> {
  try {
    const response = await axios.post(
      INFO_URL,
      {
        type: 'meta',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data && response.data.universe) {
      return response.data.universe.map((asset: any, index: number) => ({
        id: index,
        symbol: asset.name,
        szDecimals: asset.szDecimals || 3,
        maxLeverage: asset.maxLeverage || 50,
      }));
    }

    return [];
  } catch (error: any) {
    console.error('Assets error:', error.response?.data || error.message);
    return [];
  }
}

export async function getMetaAndAssetCtxs(): Promise<any> {
  try {
    const response = await axios.post(
      INFO_URL,
      {
        type: 'metaAndAssetCtxs',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      'MetaAndAssetCtxs error:',
      error.response?.data || error.message
    );
    return null;
  }
}
