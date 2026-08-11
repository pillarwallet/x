import { ExchangeClient, HttpTransport } from '@nktkas/hyperliquid';
import { privateKeyToAccount } from 'viem/accounts';
import type { Hex } from 'viem';

/**
 * Creates an ExchangeClient configured with an agent's private key
 */
export function getExchangeClientForAgent(privateKey: Hex): ExchangeClient {
  const account = privateKeyToAccount(privateKey);
  const transport = new HttpTransport();
  return new ExchangeClient({ wallet: account, transport });
}

/**
 * Place a market order using the agent wallet
 */
export async function placeMarketOrderAgent(
  privateKey: Hex,
  params: {
    coinId: number;
    isBuy: boolean;
    size: number;
    currentPrice: number;
    reduceOnly?: boolean;
    builder?: { b: string; f: number };
  }
): Promise<any> {
  const client = getExchangeClientForAgent(privateKey);

  // Use 5% slippage to stay within Hyperliquid's 95% rule
  // For closing positions (reduce-only), checking price might be less critical if we just want out,
  // but we still need a limit price for the IOc order.
  const marketPrice = params.isBuy
    ? parseFloat((params.currentPrice * 1.05).toPrecision(5)).toString()
    : parseFloat((params.currentPrice * 0.95).toPrecision(5)).toString();

  const orderRequest = {
    orders: [
      {
        a: params.coinId,
        b: params.isBuy,
        p: marketPrice,
        s: params.size.toString(),
        r: params.reduceOnly ?? false,
        t: { limit: { tif: 'Ioc' as const } },
      },
    ],
    grouping: 'na' as const,
    builder: params.builder,
  };

  console.log('[SDK] Placing market order:', orderRequest);
  const response = await client.order(orderRequest);
  console.log('[SDK] Order response:', response);

  return response;
}

/**
 * Place a limit order (for SL/TP) using the agent wallet
 */
export async function placeLimitOrderAgent(
  privateKey: Hex,
  params: {
    coinId: number;
    isBuy: boolean;
    size: number;
    limitPrice: number;
    reduceOnly?: boolean;
    builder?: { b: string; f: number };
  }
): Promise<any> {
  const client = getExchangeClientForAgent(privateKey);

  const orderRequest = {
    orders: [
      {
        a: params.coinId,
        b: params.isBuy,
        p: parseFloat(params.limitPrice.toPrecision(5)).toString(), // Enforce 5 significant figures
        s: params.size.toString(),
        r: params.reduceOnly ?? false,
        t: { limit: { tif: 'Gtc' as const } },
      },
    ],
    grouping: 'na' as const,
    builder: params.builder,
  };

  console.log('[SDK] Placing limit order:', orderRequest);
  const response = await client.order(orderRequest);
  console.log('[SDK] Order response:', response);

  return response;
}

/**
 * Place a trigger order (for TP/SL) using the agent wallet
 * Trigger orders activate when mark price reaches triggerPx
 */
export async function placeTriggerOrderAgent(
  privateKey: Hex,
  params: {
    coinId: number;
    isBuy: boolean;
    size: number;
    triggerPrice: number;
    limitPrice: number;
    tpsl: 'tp' | 'sl';
    reduceOnly?: boolean;
    builder?: { b: string; f: number };
  }
): Promise<any> {
  const client = getExchangeClientForAgent(privateKey);

  const orderRequest = {
    orders: [
      {
        a: params.coinId,
        b: params.isBuy,
        p: parseFloat(params.limitPrice.toPrecision(5)).toString(),
        s: params.size.toString(),
        r: params.reduceOnly ?? true, // TP/SL should always be reduce-only
        t: {
          trigger: {
            isMarket: false,
            triggerPx: parseFloat(
              params.triggerPrice.toPrecision(5)
            ).toString(),
            tpsl: params.tpsl,
          },
        },
      },
    ],
    grouping: 'na' as const,
    builder: params.builder,
  };

  console.log('[SDK] Placing trigger order:', orderRequest);
  const response = await client.order(orderRequest);
  console.log('[SDK] Trigger order response:', response);

  return response;
}

/**
 * Cancel an order using the agent wallet
 */
export async function cancelOrderAgent(
  privateKey: Hex,
  params: {
    coinId: number;
    oid: number;
  }
): Promise<any> {
  const client = getExchangeClientForAgent(privateKey);

  const cancelRequest = {
    cancels: [
      {
        a: params.coinId,
        o: params.oid,
      },
    ],
  };

  console.log('[SDK] Canceling order:', cancelRequest);
  const response = await client.cancel(cancelRequest);
  console.log('[SDK] Cancel response:', response);

  return response;
}

/**
 * Approve an agent using the SDK
 */
export async function approveAgentSDK(
  masterPrivateKey: Hex,
  agentAddress: string,
  agentName?: string
): Promise<any> {
  const transport = new HttpTransport();
  const client = new ExchangeClient({ wallet: masterPrivateKey, transport });

  console.log('[SDK] Approving agent:', agentAddress);
  const response = await client.approveAgent({ agentAddress, agentName });
  console.log('[SDK] Approve response:', response);

  return response;
}

/**
 * Approve builder fee using the SDK
 */
export async function approveBuilderFeeSDK(
  masterPrivateKey: Hex,
  builderAddress: string,
  maxFeeRate: string // e.g. "0.1%" or "30bps" as string
): Promise<any> {
  const account = privateKeyToAccount(masterPrivateKey);
  const transport = new HttpTransport();
  const client = new ExchangeClient({ wallet: account, transport });

  console.log('[SDK] Approving builder fee:', { builderAddress, maxFeeRate });
  const response = await client.approveBuilderFee({
    builder: builderAddress,
    maxFeeRate,
  });
  console.log('[SDK] Approve builder fee response:', response);

  return response;
}

/**
 * Update leverage and margin mode for an asset
 */
export async function updateLeverageAgent(
  privateKey: Hex,
  params: {
    coinId: number;
    leverage: number;
    isCross: boolean; // true = Cross margin, false = Isolated margin
  }
): Promise<any> {
  const client = getExchangeClientForAgent(privateKey);

  console.log('[SDK] Updating leverage:', params);
  const response = await client.updateLeverage({
    asset: params.coinId,
    isCross: params.isCross,
    leverage: params.leverage,
  });
  console.log('[SDK] Update leverage response:', response);

  return response;
}
