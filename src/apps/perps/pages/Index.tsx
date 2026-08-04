import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@/perps/components/ConnectButton';
import { StatusBanner } from '@/perps/components/StatusBanner';
import { AgentControls } from '@/perps/components/AgentControls';
import { BalanceCard } from '@/perps/components/BalanceCard';
import { AssetSelector } from '@/perps/components/AssetSelector';
import { TradeForm } from '@/perps/components/TradeForm';
import { SparklineChart } from '@/perps/components/SparklineChart';
import { PositionsCard } from '@/perps/components/PositionsCard';
import { TradeHistoryCard } from '@/perps/components/TradeHistoryCard';
import { useHyperliquid } from '@/perps/hooks/useHyperliquid';
import type { AssetInfo } from '@/perps/lib/hyperliquid/types';

const Index = () => {
  const { address } = useAccount();
  const {
    setupStatus,
    userState,
    isLoading,
    checkSetupStatus,
    setupHyperliquid,
    loadBalance,
    availableAssets, // destructured from hook
    openOrders,
    activeAddress,
  } = useHyperliquid();

  const [selectedAsset, setSelectedAsset] = useState<AssetInfo | null>(null);

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

  // If we have available assets and nothing selected, select the first one (optional UX improvement)
  useEffect(() => {
    if (!selectedAsset && availableAssets.length > 0) {
      // Default to BTC or first asset if desired, or keep null
      // setSelectedAsset(availableAssets[0]); 
    }
  }, [availableAssets, selectedAsset]);

  const handleAssetSelect = (symbol: string, asset: AssetInfo) => {
    setSelectedAsset(asset);
  };

  const handlePositionClick = (symbol: string) => {
    const asset = availableAssets.find(a => a.symbol === symbol);
    if (asset) {
      handleAssetSelect(symbol, asset);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      console.warn(`Asset ${symbol} not found in availableAssets`);
    }
  };

  const handleTradeComplete = () => {
    loadBalance();
  };

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="container mx-auto px-4 pt-4 pb-24 md:pb-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-end mb-4">
          <ConnectButton />
        </div>

        {/* Status Banner */}
        {address && (
          <div className="mb-6">
            <StatusBanner
              status={setupStatus}
              onSetup={setupHyperliquid}
              isSettingUp={isLoading}
            />
          </div>
        )}

        {/* Agent Controls */}
        {address && setupStatus === 'setup' && (
          <div className="mb-6">
            <AgentControls
              onStatusChange={loadBalance}
              ethPrice={availableAssets.find((a) => a.symbol === 'ETH')?.price}
            />
          </div>
        )}

        {/* Sparkline Chart - Full Width */}
        {address && setupStatus === 'setup' && (
          <div className="mb-6">
            <SparklineChart selectedAsset={selectedAsset} />
          </div>
        )}

        {/* Open Positions - Full Width */}
        {address && setupStatus === 'setup' && userState && (
          <div className="mb-6">
            <PositionsCard
              key={activeAddress || address}
              masterAddress={activeAddress || address}
              onPositionClick={handlePositionClick}
              userState={userState}
              assetPositions={userState?.assetPositions} // Pass directly
              openOrders={openOrders}
              onRefresh={loadBalance}
            />
          </div>
        )}

        {/* Trade History - Full Width */}
        {address && setupStatus === 'setup' && (
          <div className="mb-6">
            <TradeHistoryCard masterAddress={activeAddress || address} />
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Balance */}
          <div className="lg:col-span-1">
            {address && setupStatus === 'setup' && userState && (
              <BalanceCard
                userState={userState}
                isLoading={isLoading}
                masterAddress={address}
                onRefresh={loadBalance}
                ethPrice={availableAssets.find((a) => a.symbol === 'ETH')?.price}
              />
            )}
          </div>

          {/* Middle Column - Asset Selector */}
          <div className="lg:col-span-1">
            {address && setupStatus === 'setup' && (
              <AssetSelector
                selectedSymbol={selectedAsset?.symbol || null}
                onSelect={handleAssetSelect}
                assets={availableAssets}
              />
            )}
          </div>

          {/* Right Columns - Trade Form (spans 2 columns) */}
          <div className="lg:col-span-2">
            {address && setupStatus === 'setup' && (
              <TradeForm
                selectedAsset={selectedAsset}
                onTradeComplete={handleTradeComplete}
                userState={userState}
              />
            )}
          </div>
        </div>

        {!address && null}
      </div>
    </div>
  );
};

export default Index;
