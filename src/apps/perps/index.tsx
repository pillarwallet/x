import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { StatusBanner } from './components/StatusBanner';
import { AgentControls } from './components/AgentControls';
import { BalanceCard } from './components/BalanceCard';
import { AssetSelector } from './components/AssetSelector';
import { TradeForm } from './components/TradeForm';
import { SparklineChart } from './components/SparklineChart';
import { PositionsCard } from './components/PositionsCard';
import { TradeHistoryCard } from './components/TradeHistoryCard';
import { useHyperliquid } from './hooks/useHyperliquid';
import { getAgentWallet, getImportedAccount } from './lib/hyperliquid/keystore';
import { getUserState, getMetaAndAssetCtxs } from './lib/hyperliquid/client';
import type {
  AssetInfo,
  UserState,
  EnhancedAsset,
  HyperliquidOrder,
} from './lib/hyperliquid/types';
import { toast } from 'sonner';

import { Toaster } from './components/ui/sonner';

import './styles/perps.css';

const Index = () => {
  // Get symbol from URL params (e.g., /perps/btc)
  const { symbol: urlSymbol } = useParams<{ symbol?: string }>();

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  const {
    setupStatus,
    userState,
    isLoading,
    checkSetupStatus,
    setupHyperliquid,
    loadBalance,
    openOrders,
    address,
    walletClient,
  } = useHyperliquid();

  const [selectedAsset, setSelectedAsset] = useState<EnhancedAsset | null>({
    id: 0,
    symbol: 'BTC',
    szDecimals: 5,
    maxLeverage: 50,
    price: 0,
    volume: 0,
    priceChange: 0,
    priceChangePercent: 0,
  });
  const [agentAddress, setAgentAddress] = useState<string | null>(null);

  const handleSetAgentAddress = (addr: string | null) => {
    console.log('DEBUG: index.tsx setAgentAddress called with:', addr);
    setAgentAddress(addr);
  };
  const [agentUserState, setAgentUserState] = useState<UserState | null>(null);
  const [agentOpenOrders, setAgentOpenOrders] = useState<HyperliquidOrder[]>(
    []
  );
  const [isLoadingAgent, setIsLoadingAgent] = useState(true);
  // Centralized asset state
  const [allAssets, setAllAssets] = useState<EnhancedAsset[]>([]);

  // Load ALL assets on mount - Single Source of Truth
  useEffect(() => {
    const loadAssets = async () => {
      try {
        const data = await getMetaAndAssetCtxs();
        if (
          data &&
          Array.isArray(data) &&
          data[0]?.universe &&
          Array.isArray(data[1])
        ) {
          const universe = data[0].universe;
          const assetCtxs = data[1];

          const enhancedAssets: EnhancedAsset[] = universe.map(
            (asset: any, index: number) => {
              const ctx = assetCtxs[index] || {};
              const markPx = parseFloat(ctx.markPx || '0');
              const prevDayPx = parseFloat(ctx.prevDayPx || '0');

              return {
                id: index,
                symbol: asset.name,
                szDecimals: asset.szDecimals || 3,
                maxLeverage: asset.maxLeverage || 50,
                price: markPx,
                volume: parseFloat(ctx.dayNtlVlm || '0'),
                priceChange: prevDayPx > 0 ? markPx - prevDayPx : 0,
                priceChangePercent:
                  prevDayPx > 0 ? ((markPx - prevDayPx) / prevDayPx) * 100 : 0,
              };
            }
          );

          setAllAssets(enhancedAssets);

          // Auto-select asset from URL if provided
          if (urlSymbol && enhancedAssets.length > 0) {
            const normalizedUrlSymbol = urlSymbol.toUpperCase();
            const urlAsset = enhancedAssets.find(
              (a) => a.symbol === normalizedUrlSymbol
            );
            if (urlAsset) {
              setSelectedAsset(urlAsset);
              console.log(`[URL] Auto-selected ${urlAsset.symbol} from URL`);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load assets:', error);
      }
    };

    loadAssets();
  }, [urlSymbol]); // Only depend on urlSymbol to avoid render loop

  // Separate effect to update selected asset price when assets refresh
  useEffect(() => {
    if (selectedAsset && allAssets.length > 0) {
      const updated = allAssets.find((a) => a.symbol === selectedAsset.symbol);
      if (updated) {
        setSelectedAsset(updated);
      }
    }
  }, [allAssets]); // Only watch allAssets, not selectedAsset

  // Load imported account from global storage
  const fetchImportedAccount = async () => {
    try {
      const { getImportedAccount } = await import('./lib/hyperliquid/keystore');
      const { getFrontendOpenOrders } = await import(
        './lib/hyperliquid/client'
      );
      const imported = getImportedAccount();

      if (imported) {
        setAgentAddress(imported.accountAddress);
        const [state, orders] = await Promise.all([
          getUserState(imported.accountAddress),
          getFrontendOpenOrders(imported.accountAddress),
        ]);
        setAgentUserState(state);
        setAgentOpenOrders(orders || []);
      } else {
        setAgentAddress(null);
        setAgentUserState(null);
        setAgentOpenOrders([]);
      }
    } catch (error) {
      console.error('[Index] Error loading imported account:', error);
    } finally {
      setIsLoadingAgent(false);
    }
  };

  useEffect(() => {
    fetchImportedAccount();
  }, []);

  const handleRefresh = async () => {
    await Promise.all([loadBalance(), fetchImportedAccount()]);
  };

  useEffect(() => {
    if (address) {
      checkSetupStatus();
    }
  }, [address, checkSetupStatus]);

  useEffect(() => {
    if (setupStatus === 'setup') {
      loadBalance();
    }
  }, [setupStatus, loadBalance]);

  const handleAssetSelect = (
    symbol: string,
    asset: AssetInfo,
    shouldScroll = false
  ) => {
    // Look up full asset info including price
    const fullAsset = allAssets.find((a) => a.symbol === asset.symbol);
    if (fullAsset) {
      setSelectedAsset(fullAsset);
    } else {
      // Fallback if not found (shouldn't happen)
      setSelectedAsset(asset as EnhancedAsset);
    }

    if (shouldScroll) {
      const element = document.getElementById('chart-trade-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleTickerChange = (ticker: string) => {
    const normalizeTicker = ticker.toUpperCase().trim();

    // Instant lookup from cached assets - no API call needed!
    const asset = allAssets.find((a) => a.symbol === normalizeTicker);

    if (asset) {
      setSelectedAsset(asset);
      toast.success(`Switched to ${asset.symbol}`);
    } else {
      console.warn(`Asset ${normalizeTicker} not found in cached assets`);
      toast.error(`Asset ${normalizeTicker} not found. Please try refreshing.`);
    }
  };

  const handlePositionClick = (symbol: string) => {
    // 1. Find asset in our centralized allAssets list
    const asset = allAssets.find(
      (a) => a.symbol === symbol || a.symbol === symbol.toUpperCase()
    );

    if (asset) {
      // 2. Update selected asset (do not scroll)
      handleAssetSelect(asset.symbol, asset, false);
    } else {
      console.warn(`[Index] Asset ${symbol} not found in allAssets`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg">
      <Toaster />
      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8 max-w-7xl">
        {/* Header */}

        {/* Agent Controls + Balance - Side by Side */}
        {address && setupStatus === 'setup' && userState && (
          <div className="grid grid-cols-2 md:grid-cols-1 gap-6 mb-6">
            {/* Left: Agent Controls */}
            <div>
              <AgentControls
                onStatusChange={handleRefresh}
                onAgentAddressChange={setAgentAddress}
                userState={userState}
              />
            </div>

            {/* Right: Balance */}
            <div>
              {userState && (
                <BalanceCard
                  userState={userState}
                  isLoading={isLoading}
                  masterAddress={address || ''}
                  walletClient={walletClient}
                  onRefresh={handleRefresh}
                  isImported={!!agentAddress}
                />
              )}
            </div>
          </div>
        )}

        {/* Chart + Trade Form - Side by Side on Desktop */}
        {(agentAddress || (address && setupStatus === 'setup')) && (
          <div
            id="chart-trade-section"
            className="grid grid-cols-3 md:grid-cols-1 gap-6 mb-6"
          >
            {/* Left: Sparkline Chart (2/3 width on desktop) */}
            <div className="col-span-2 md:col-span-1">
              <SparklineChart
                selectedAsset={selectedAsset}
                userState={agentUserState || userState}
                openOrders={
                  agentOpenOrders.length > 0 ? agentOpenOrders : openOrders
                }
                accountAddress={agentAddress || address}
              />
            </div>

            {/* Right: Trade Form (1/3 width on desktop) */}
            <div className="col-span-1">
              <TradeForm
                selectedAsset={selectedAsset}
                onTradeComplete={handleRefresh}
                onTickerChange={handleTickerChange}
                userState={agentUserState || userState}
              />
            </div>
          </div>
        )}

        {/* Open Positions - Full Width */}
        {(agentAddress || (address && setupStatus === 'setup')) && (
          <div className="mb-6">
            <PositionsCard
              masterAddress={agentAddress || address}
              onPositionClick={handlePositionClick}
              onRefresh={handleRefresh}
              userState={agentUserState || userState}
              openOrders={
                agentOpenOrders.length > 0 ? agentOpenOrders : openOrders
              }
            />
          </div>
        )}

        {/* Trade History - Full Width */}
        {(agentAddress || (address && setupStatus === 'setup')) && (
          <div className="mb-6">
            <TradeHistoryCard masterAddress={agentAddress || address} />
          </div>
        )}

        {/* Asset Selector */}
        {(agentAddress || (address && setupStatus === 'setup')) && (
          <div className="mb-6">
            <AssetSelector
              selectedSymbol={selectedAsset?.symbol || null}
              onSelect={(symbol, asset) =>
                handleAssetSelect(symbol, asset, true)
              }
              assets={allAssets}
            />
          </div>
        )}

        {!address && !agentAddress && !isLoadingAgent && null}
      </div>
    </div>
  );
};

export default Index;
