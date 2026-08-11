import { useState, useCallback, useEffect, useMemo } from 'react';
import { useWalletClient } from 'wagmi';
import useTransactionKit from '../../../hooks/useTransactionKit';
import {
  getUserState,
  postExchange,
  getAllAssets,
  getOpenOrders,
} from '../lib/hyperliquid/client';
import {
  signUserAction,
  buildNoopAction,
  buildOrderAction,
} from '../lib/hyperliquid/signing';
import type {
  UserState,
  CopyTile,
  HyperliquidOrder,
  EnhancedAsset,
} from '../lib/hyperliquid/types';
import {
  calculatePositionSize,
  roundToSzDecimals,
  getEntryPrice,
  validateCopyTrade,
} from '../lib/hyperliquid/math';
import { toast } from 'sonner';
import { getAgentAddress } from '../lib/hyperliquid/keystore';
import { createWalletClient, custom, http } from 'viem';
import { arbitrum } from 'viem/chains';

type SetupStatus = 'unknown' | 'not-setup' | 'setup';

export function useHyperliquid() {
  const { kit } = useTransactionKit();
  const [setupStatus, setSetupStatus] = useState<SetupStatus>('unknown');
  const [userState, setUserState] = useState<UserState | null>(null);
  const [openOrders, setOpenOrders] = useState<HyperliquidOrder[]>([]);
  const [availableAssets, setAvailableAssets] = useState<EnhancedAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAddress, setActiveAddress] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [walletClient, setWalletClient] = useState<any>(null);

  // Safe provider access for delegatedEoa mode
  const clientTransport = useMemo(() => {
    try {
      return custom(kit.getProvider());
    } catch (e) {
      // In delegatedEoa mode, getProvider() might throw.
      console.debug('Provider not available (likely delegatedEoa mode).');
      return null;
    }
  }, [kit]);

  const checkSetupStatus = useCallback(async () => {
    // 1. Check for Imported Account (Priority)
    const { getImportedAccount } = await import('../lib/hyperliquid/keystore');
    const importedAccount = getImportedAccount();

    let targetAddress: string | null = null;
    let client: any = null;
    let isImported = false;

    if (importedAccount) {
      console.log('DEBUG: Using Imported Account:', importedAccount.accountAddress);
      targetAddress = importedAccount.accountAddress;

      // Create WalletClient from Private Key
      const { privateKeyToAccount } = await import('viem/accounts');
      const account = privateKeyToAccount(importedAccount.privateKey as `0x${string}`);

      client = createWalletClient({
        account,
        chain: arbitrum,
        transport: clientTransport ?? http(),
      });
      isImported = true;
    } else {

      // 2. Fallback to Connected Wallet
      try {
        const walletProvider = kit.getEtherspotProvider();
        const eoa = (await walletProvider.getSdk()).getEOAAddress() || null;
        console.log('DEBUG: Wallet Provider EOA:', eoa);

        if (eoa && clientTransport) {
          targetAddress = eoa;
          client = createWalletClient({
            account: eoa as `0x${string}`,
            chain: arbitrum,
            transport: clientTransport,
          });
        }
      } catch (err) {
        console.warn('Failed to get Etherspot provider or EOA (expected in delegatedEoa mode without imported account):', err);
      }
    }

    setAddress(targetAddress);
    setWalletClient(client);
    console.log('DEBUG: Active Client Account:', client?.account?.address);
    // Always fetch assets on load
    // Always fetch assets on load
    try {
      // Use getMetaAndAssetCtxs to get both metadata and prices
      const { getMetaAndAssetCtxs } = await import('../lib/hyperliquid/client');
      const data = await getMetaAndAssetCtxs();
      console.log('DEBUG: getMetaAndAssetCtxs result:', data);

      if (data && data[0] && data[1]) {
        const universe = data[0];
        const assetCtxs = data[1];

        const assets: EnhancedAsset[] = universe.map((u: any, index: number) => {
          const ctx = assetCtxs[index];
          return {
            id: index,
            symbol: u.name,
            szDecimals: u.szDecimals,
            maxLeverage: u.maxLeverage,
            price: ctx ? parseFloat(ctx.markPx) : 0,
            volume: ctx ? parseFloat(ctx.dayNtlVlm) : 0,
            priceChange: 0, // Not provided directly
            priceChangePercent: 0, // Not provided directly
          };
        });
        console.log('DEBUG: Parsed assets with prices:', assets.slice(0, 3));
        const ethAsset = assets.find(a => a.symbol === 'ETH');
        console.log('DEBUG: ETH Asset found:', ethAsset);
        setAvailableAssets(assets);
      } else {
        // Fallback if structure is unexpected
        const assets = await getAllAssets();
        setAvailableAssets(assets as EnhancedAsset[]);
      }
    } catch (e) {
      console.error('Failed to fetch assets', e);
    }

    if (!targetAddress) {
      setSetupStatus('unknown');
      setActiveAddress(null);
      return;
    }

    setIsLoading(true);
    try {
      console.log('DEBUG: Checking setup status for:', targetAddress);

      // 1. Fetch Main Address Data
      // Note: targetAddress is already set to either imported or eoa
      let state = await getUserState(targetAddress);
      console.log('state: ', state);
      let orders = await getOpenOrders(targetAddress);

      // 2. Check Agent Address
      // Unconditional switch: If an agent is linked, we use it.
      // const agentAddress = getAgentAddress(eoa);
      // if (agentAddress) {
      //   console.log(
      //     'DEBUG: Found Agent Address, executing switch:',
      //     agentAddress
      //   );

      //   const agentState = await getUserState(agentAddress);
      //   const agentOrders = await getOpenOrders(agentAddress);

      //   targetAddress = agentAddress as string;
      //   state = agentState;
      //   orders = agentOrders;
      // }

      setActiveAddress(targetAddress);
      console.log('DEBUG: User State result for', targetAddress, state);

      if (state) {
        // Ensure assetPositions exists
        if (!state.assetPositions) {
          console.warn(
            'WARNING: assetPositions missing in state, defaulting to []'
          );
          state.assetPositions = [];
        }
        setSetupStatus('setup');
        setUserState(state);
      } else {
        setSetupStatus('not-setup');
      }
      if (orders) {
        setOpenOrders(orders);
      }
    } catch (error) {
      console.error('Error checking setup status:', error);
      setSetupStatus('not-setup');
    } finally {
      setIsLoading(false);
    }
  }, [clientTransport]);

  const setupHyperliquid = useCallback(async () => {
    // Check for Imported Account logic again to ensure valid signer
    const { getImportedAccount } = await import('../lib/hyperliquid/keystore');
    const importedAccount = getImportedAccount();

    let client;
    if (importedAccount && importedAccount.accountAddress === address) {
      const { privateKeyToAccount } = await import('viem/accounts');
      const account = privateKeyToAccount(importedAccount.privateKey as `0x${string}`);
      client = createWalletClient({
        account,
        chain: arbitrum,
        transport: clientTransport ?? http(),
      });
    } else if (clientTransport) {
      client = createWalletClient({
        account: address as `0x${string}`,
        chain: arbitrum,
        transport: clientTransport,
      });
    }

    const walletClient = client;
    if (!walletClient || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    try {
      const action = buildNoopAction();
      const nonce = Date.now();
      const signature = await signUserAction(walletClient, action, nonce);

      await postExchange({
        action,
        nonce,
        signature,
      });

      toast.success('Hyperliquid account set up successfully!');
      setSetupStatus('setup');
      await checkSetupStatus();
    } catch (error: any) {
      console.error('Setup error:', error);
      toast.error(error.message || 'Failed to setup Hyperliquid account');
    } finally {
      setIsLoading(false);
    }
  }, [address, checkSetupStatus, clientTransport]);

  const loadBalance = useCallback(async () => {
    if (!address) return;

    setIsLoading(true);
    try {
      // Same logic as checkSetupStatus to determine active address
      let targetAddress: string = address;
      let state = await getUserState(address);
      let orders = await getOpenOrders(address);

      // const agentAddress = getAgentAddress(address);
      // if (agentAddress) {
      //   console.log(
      //     'DEBUG: Found Agent Address in loadBalance, executing switch:',
      //     agentAddress
      //   );
      //   const agentState = await getUserState(agentAddress);
      //   const agentOrders = await getOpenOrders(agentAddress);

      //   targetAddress = agentAddress as string;
      //   state = agentState;
      //   orders = agentOrders;
      // }

      setActiveAddress(targetAddress);

      console.log(
        'DEBUG: Final User State to be set:',
        JSON.stringify(state, null, 2)
      );

      if (state) {
        // Ensure assetPositions exists
        if (!state.assetPositions) {
          console.warn(
            'WARNING: assetPositions missing in state, defaulting to []'
          );
          state.assetPositions = [];
        }
        setUserState(state);
      }
      if (orders) {
        setOpenOrders(orders);
      }
    } catch (error) {
      console.error('Error loading balance:', error);
      toast.error('Failed to load balance');
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  const executeCopyTrade = useCallback(
    async (tile: CopyTile) => {
      // Check for Imported Account logic again to ensure valid signer
      const { getImportedAccount } = await import('../lib/hyperliquid/keystore');
      const importedAccount = getImportedAccount();

      let client;
      if (importedAccount && importedAccount.accountAddress === address) {
        const { privateKeyToAccount } = await import('viem/accounts');
        const account = privateKeyToAccount(importedAccount.privateKey as `0x${string}`);
        client = createWalletClient({
          account,
          chain: arbitrum,
          transport: clientTransport ?? http(),
        });
      } else if (clientTransport) {
        client = createWalletClient({
          account: address as `0x${string}`,
          chain: arbitrum,
          transport: clientTransport,
        });
      }
      const walletClient = client;
      if (!walletClient || !address) {
        toast.error('Please connect your wallet');
        return;
      }

      if (setupStatus !== 'setup') {
        toast.error('Please setup your Hyperliquid account first');
        return;
      }

      // Validate the trade
      const validation = validateCopyTrade(tile);
      if (!validation.valid) {
        toast.error(validation.error);
        return;
      }

      setIsLoading(true);
      try {
        // Look up asset ID by symbol
        const assets = await getAllAssets();
        const asset = assets.find((a) => a.symbol === tile.symbol);

        if (!asset) {
          toast.error(`Asset ${tile.symbol} not found`);
          return;
        }

        const notional = 5; // $5
        const leverage = 5; // 5x
        const entryPrice = getEntryPrice(tile.entry);
        const size = calculatePositionSize(notional, leverage, entryPrice);
        const roundedSize = roundToSzDecimals(size, 3);

        toast.info('Placing entry order...', { duration: 2000 });

        // Place entry order with numeric asset ID
        const entryAction = buildOrderAction({
          coin: asset.id,
          isBuy: tile.side === 'long',
          sz: roundedSize,
          limitPx: entryPrice,
          orderType: { limit: { tif: 'Gtc' } },
          reduceOnly: false,
        });

        const entryNonce = Date.now();
        const entrySignature = await signUserAction(
          walletClient,
          entryAction,
          entryNonce
        );

        const entryResult = await postExchange({
          action: entryAction,
          nonce: entryNonce,
          signature: entrySignature,
        });

        console.log('Entry order result:', entryResult);

        // Note: In production, you would also place SL and TP orders here
        // This is a simplified version for the MVP

        toast.success('Copy trade executed successfully!');
        await loadBalance();
      } catch (error: any) {
        console.error('Trade execution error:', error);
        toast.error(error.message || 'Failed to execute trade');
      } finally {
        setIsLoading(false);
      }
    },
    [address, setupStatus, loadBalance, clientTransport]
  );

  // Call checkSetupStatus on mount to initialize the address
  useEffect(() => {
    checkSetupStatus();

    const handleImportChange = () => {
      console.log('DEBUG: Imported account changed, refreshing setup status...');
      checkSetupStatus();
    };

    window.addEventListener('imported-account-changed', handleImportChange);
    return () => {
      window.removeEventListener('imported-account-changed', handleImportChange);
    };
  }, [checkSetupStatus]);

  return {
    setupStatus,
    userState,
    openOrders,
    isLoading,
    checkSetupStatus,
    setupHyperliquid,
    loadBalance,
    executeCopyTrade,
    availableAssets,
    activeAddress,
    address,
    walletClient,
  };
}
