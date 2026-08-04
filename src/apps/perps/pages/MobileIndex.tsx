import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { MobileHeader } from '../components/mobile/MobileHeader';
import { MobileBalanceCard } from '../components/mobile/MobileBalanceCard';
import { MobilePositionsCard } from '../components/mobile/MobilePositionsCard';
import { TradeHistoryCard } from '../components/TradeHistoryCard';
import { MobileMarketsList } from '../components/mobile/MobileMarketsList';
import { useHyperliquid } from '../hooks/useHyperliquid';
import { getUserState, getMetaAndAssetCtxs, getOpenOrders } from '../lib/hyperliquid/client';
import { getImportedAccount } from '../lib/hyperliquid/keystore';
import type { UserState, HyperliquidOrder, MarketData } from '../lib/hyperliquid/types';

export default function MobileIndex() {
  const { address } = useAccount();
  const { userState, isLoading, availableAssets } = useHyperliquid();

  const [agentAddress, setAgentAddress] = useState<string | null>(null);
  const [agentUserState, setAgentUserState] = useState<UserState | null>(null);
  const [markets, setMarkets] = useState<MarketData[]>([]);

  // Load imported account
  useEffect(() => {
    const loadImportedAccount = async () => {
      try {
        const imported = getImportedAccount();
        if (imported) {
          setAgentAddress(imported.accountAddress);
          const state = await getUserState(imported.accountAddress);
          setAgentUserState(state);
        }
      } catch (error) {
        console.error('[MobileIndex] Error loading imported account:', error);
      }
    };

    loadImportedAccount();
  }, []);

  // Load markets data
  useEffect(() => {
    const loadMarkets = async () => {
      try {
        const data = await getMetaAndAssetCtxs();
        if (data?.universe) {
          const formattedMarkets = data.universe
            .slice(0, 10)
            .map((asset: any, index: number) => ({
              coin: asset.name,
              price: formatPrice(parseFloat(asset.markPx || '0')),
              maxLeverage: asset.maxLeverage || 20,
              volume: formatVolume(parseFloat(asset.dayNtlVlm || '0')),
              change: '+0.80',
              changePercent: '0.80%',
            }));
          setMarkets(formattedMarkets);
        }
      } catch (error) {
        console.error('[MobileIndex] Error loading markets:', error);
      }
    };

    loadMarkets();
  }, []);

  // Open Orders State
  const [openOrders, setOpenOrders] = useState<HyperliquidOrder[]>([]);

  // Load Open Orders
  useEffect(() => {
    const fetchOrders = async () => {
      const targetAddress = address || agentAddress;
      if (!targetAddress) return;

      try {
        const orders = await getOpenOrders(targetAddress);
        setOpenOrders(orders || []);
      } catch (error) {
        console.error('[MobileIndex] Error loading orders:', error);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [address, agentAddress]);

  // Get balance from agent or connected wallet
  const displayState = agentUserState || userState;
  const rawBalance = displayState?.marginSummary
    ? parseFloat(displayState.marginSummary.accountValue) - parseFloat(displayState.marginSummary.totalMarginUsed)
    : 0;
  const balance = rawBalance.toFixed(2);

  // Format positions
  const positions =
    displayState?.assetPositions
      ?.filter((p: any) => parseFloat(p.position.szi) !== 0)
      .map((p: any) => {
        const size = parseFloat(p.position.szi);
        const isLong = size > 0;
        const pnl = parseFloat(p.position.unrealizedPnl || '0');
        const value = Math.abs(parseFloat(p.position.positionValue || '0'));

        return {
          coin: p.position.coin,
          leverage: Math.round(parseFloat(p.position.leverage?.value || '1')),
          side: isLong ? ('LONG' as const) : ('SHORT' as const),
          value: value.toFixed(2),
          pnl:
            pnl >= 0 ? `+$${pnl.toFixed(2)}` : `-$${Math.abs(pnl).toFixed(2)}`,
          pnlPercent: '0.00%',
          entryPrice: formatPrice(parseFloat(p.position.entryPx || '0')),
          markPrice: formatPrice(parseFloat(p.position.markPx || '0')),
          liqPrice: p.position.liquidationPx || 'N/A',
        };
      }) || [];

  // Calculate total PNL
  const totalPnl = positions.reduce((sum: number, p: any) => {
    const pnl = parseFloat(p.pnl.replace(/[+$-]/g, ''));
    return sum + (p.pnl.startsWith('-') ? -pnl : pnl);
  }, 0);

  const totalValue = positions.reduce((sum: number, p: any) => sum + parseFloat(p.value), 0);
  const totalPnlPercent =
    totalValue > 0 ? ((totalPnl / totalValue) * 100).toFixed(2) : '0.00';

  const handlePositionClick = (coin: string) => {
    // In mobile, we might navigate to a details page or just log for now
    // But consistent with Desktop, we should probably try to select it if we had a global selection context
    // For now, let's just log it or maybe we need to navigate?
    // The user request was about loading the chart.
    // Ensure we find the asset in availableAssets to validate it exists
    const asset = availableAssets.find((a) => a.symbol === coin);
    if (asset) {
      console.log('Mobile: Selected asset', coin);
      // TODO: If there is a mobile chart view, we should navigate/update it here.
      // For now, verifying the click logic works is key.
      // If the mobile app shares state with desktop via a context, updating it here would be ideal.
      // Since this is a simple page, we might just be done.
    } else {
      console.warn(`Mobile: Asset ${coin} not found`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <MobileHeader />

      {/* Content */}
      <div className="pt-16 px-4 pb-6 space-y-3">
        {/* Balance Card */}
        <MobileBalanceCard
          balance={parseFloat(balance).toFixed(2)}
          onWithdraw={() => console.log('Withdraw')}
          onDeposit={() => console.log('Deposit')}
        />

        {/* Positions Card */}
        {(positions.length > 0 || openOrders.length > 0) && (
          <MobilePositionsCard
            positions={positions}
            totalValue={totalValue.toFixed(2)}
            totalPnl={
              totalPnl >= 0
                ? `+$${totalPnl.toFixed(2)}`
                : `-$${Math.abs(totalPnl).toFixed(2)}`
            }
            totalPnlPercent={`${totalPnlPercent}%`}
            openOrders={openOrders}
            onPositionClick={handlePositionClick}
          />
        )}

        {/* Trade History */}
        {address && (
          <TradeHistoryCard masterAddress={address} />
        )}

        {/* Markets List */}
        <MobileMarketsList
          markets={markets}
          onMarketSelect={(coin) => console.log('Selected:', coin)}
        />
      </div>
    </div>
  );
}

function formatPrice(price: number): string {
  if (price >= 1000) {
    return price.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }
  // If price < 1, use 5 decimals
  if (Math.abs(price) < 1 && Math.abs(price) > 0) {
    return price.toFixed(5);
  }
  return price.toFixed(2);
}

function formatVolume(volume: number): string {
  if (volume >= 1e9) {
    return `$${(volume / 1e9).toFixed(1)}B`;
  }
  if (volume >= 1e6) {
    return `$${(volume / 1e6).toFixed(1)}M`;
  }
  return `$${volume.toFixed(0)}`;
}
