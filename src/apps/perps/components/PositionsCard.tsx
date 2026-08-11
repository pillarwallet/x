import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { Button } from '../components/ui/button';
import { RefreshCw, X, ChevronLeft, AlertTriangle } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
import { getUserState } from '../lib/hyperliquid/client';
import type {
  HyperliquidPosition,
  HyperliquidOrder,
  UniverseAsset,
} from '../lib/hyperliquid/types';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import { toast } from 'sonner';
import {
  getAgentWallet,
  getImportedAccount,
  isAgentWalletEncrypted,
  unlockAgentWallet,
  unlockImportedAccount,
  isImportedAccountEncrypted,
} from '../lib/hyperliquid/keystore';
import {
  placeMarketOrderAgent,
  cancelOrderAgent,
} from '../lib/hyperliquid/sdk';
import {
  getMarkPrice,
  getOpenOrders,
  getFrontendOpenOrders,
  getMetaAndAssetCtxs,
  getUserFills,
} from '../lib/hyperliquid/client';
import { TokenIcon } from './TokenIcon';
import { UnlockWalletModal } from './UnlockWalletModal';

interface PositionsCardProps {
  masterAddress: string;
  onPositionClick?: (symbol: string) => void;
  onRefresh?: () => void;
  userState?: any; // Using any for now to avoid strict type issues with passed state, or  userState?: UserState;
  assetPositions?: HyperliquidPosition[]; // Direct pass-through
  openOrders?: HyperliquidOrder[];
}

export function PositionsCard({
  masterAddress,
  onPositionClick,
  userState,
  assetPositions: directPositions, // Rename
  openOrders: externalOpenOrders,
  onRefresh,
}: PositionsCardProps) {
  const isMobile = useIsMobile();
  const [positions, setPositions] = useState<HyperliquidPosition[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [expandedPositionIndex, setExpandedPositionIndex] = useState<
    number | null
  >(null);
  const [positionToClose, setPositionToClose] = useState<HyperliquidPosition | null>(null);
  const [closePercentage, setClosePercentage] = useState<number>(100);
  const [isClosing, setIsClosing] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [universe, setUniverse] = useState<UniverseAsset[]>([]);
  const [openOrders, setOpenOrders] = useState<HyperliquidOrder[]>([]);
  const [internalUserState, setInternalUserState] = useState<UserState | null>(null);

  // Unlock Modal State
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ type: 'close' | 'cancel', data?: any } | null>(null);


  const handlePositionClick = (coin: string) => {
    // 1. Load asset into chart/trade form via parent
    if (onPositionClick) {
      onPositionClick(coin);
    }
  };

  const fetchData = useCallback(async () => {
    if (!masterAddress) return;

    setIsLoading(true);
    try {
      // If we have external data, we only need metadata and prices
      // checks if we need to fetch user data
      const shouldFetchUser = !userState && !directPositions; // Only fetch if no external userState or directPositions

      const promises: Promise<any>[] = [
        getMetaAndAssetCtxs(),
      ];

      if (shouldFetchUser) {
        promises.push(getUserState(masterAddress));
        promises.push(getFrontendOpenOrders(masterAddress));
      }

      const results = await Promise.all(promises);
      const metaData = results[0];
      const fetchedUserState = shouldFetchUser ? results[1] : userState;
      const fetchedOrders = shouldFetchUser ? results[2] : externalOpenOrders;

      if (shouldFetchUser) {
        setInternalUserState(fetchedUserState);
      }

      let currentUniverse = universe;
      const priceMap: Record<string, number> = {};
      if (
        metaData &&
        Array.isArray(metaData) &&
        metaData[0]?.universe &&
        Array.isArray(metaData[1])
      ) {
        const universeData = metaData[0].universe;
        setUniverse(universeData);
        currentUniverse = universeData; // Use fresh data for immediate lookup
        const assetCtxs = metaData[1];

        universeData.forEach((asset: any, index: number) => {
          const ctx = assetCtxs[index];
          if (ctx && ctx.markPx) {
            priceMap[asset.name] = parseFloat(ctx.markPx);
          }
        });
      }

      const effectiveState = userState || internalUserState;
      // Prefer direct positions if available, otherwise check state
      const sourcePositions = directPositions || effectiveState?.assetPositions;

      if (sourcePositions) {
        const uniqueKeys = new Set();

        // Robust Mapping Logic
        const openPositions = sourcePositions
          .map((pos: any) => {
            try {
              // Handle potential structure mismatch (wrapped vs flat)
              const rawPos = pos.position || pos;

              // Ensure uniqueness based on coin
              if (uniqueKeys.has(rawPos.coin)) {
                console.warn(`Duplicate position for ${rawPos.coin} found, skipping.`);
                return null;
              }
              uniqueKeys.add(rawPos.coin);

              // Enrich with mark price if missing or zero
              let markPx = rawPos.markPx;
              if (
                (!markPx || parseFloat(markPx) === 0) &&
                priceMap[rawPos.coin]
              ) {
                markPx = priceMap[rawPos.coin].toString();
              }

              // Robust Universe Lookup
              let coinInfo = currentUniverse.find((u) => u.name === rawPos.coin);

              if (!coinInfo) {
                // FALLBACK: If coin not found in universe, use default formatting
                // This ensures we show the position even if metadata is missing/loading
                console.warn(`Warning: Universe metadata missing for ${rawPos.coin}, using defaults`);
                coinInfo = {
                  name: rawPos.coin,
                  szDecimals: 4, // Default for most assets
                  maxLeverage: 50,
                };
              }

              return {
                ...rawPos,
                markPx,
                coinInfo,
              };
            } catch (e) {
              console.warn('CRITICAL WARNING: Error processing position item:', e, pos);
              return null;
            }
          })
          .filter((p: any) => !!p); // Only filter nulls/errors, allow 0 size for debugging

        setPositions(openPositions);
      } else {
        setPositions([]); // Clear positions if none found
      }

      setOpenOrders(fetchedOrders || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [masterAddress, userState, directPositions, externalOpenOrders, internalUserState]); // Added internalUserState to dependencies, removed universe

  useEffect(() => {
    fetchData();
    // Only poll if we don't have external data (to avoid rate limiting)
    if (!userState && !directPositions) {
      const interval = setInterval(fetchData, 10000);
      return () => clearInterval(interval);
    }
  }, [fetchData, userState, directPositions]); // Re-run when external data changes

  // Auto-collapse when there are no positions or orders, auto-open when there are
  useEffect(() => {
    if (positions.length === 0 && openOrders.length === 0) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [positions.length, openOrders.length]);

  const formatNumber = (
    value: string | number,
    decimals: number = 2
  ): string => {
    if (!value) return '-';
    return parseFloat(value.toString()).toFixed(decimals);
  };

  const formatPrice = (value: string | number): string => {
    if (!value) return '-';
    const val = parseFloat(value.toString());
    if (val === 0) return '0.00';
    if (Math.abs(val) < 1) return val.toFixed(5);
    return val.toFixed(2);
  };

  const formatPnl = (pnl: string) => {
    const pnlNum = parseFloat(pnl);
    const formatted = formatNumber(pnlNum, 2);
    const className = pnlNum >= 0 ? 'text-green-500' : 'text-red-500';
    return { formatted, className };
  };

  const calculateLeverage = (position: any): string => {
    if (position.leverage && typeof position.leverage.value === 'number') {
      return `${position.leverage.value}x`;
    }
    // Fallback to effective leverage calculation if SDK value is missing
    const positionValue =
      Math.abs(parseFloat(position.szi)) * parseFloat(position.entryPx);
    const marginUsed = parseFloat(position.marginUsed);
    if (marginUsed === 0) return '0x';
    return `${formatNumber(positionValue / marginUsed, 1)}x`;
  };

  const handleOpenCloseDialog = (position: any) => {
    setPositionToClose(position);
    setClosePercentage(100);
    setCloseDialogOpen(true);
  };

  /* Removed getCoinId as we reuse cached universe */

  const handleExecuteClose = async () => {
    if (!positionToClose) return;
    setIsClosing(true);
    try {
      let privateKey: string | undefined;

      // 1. Check for Imported Account (Priority)
      const imported = getImportedAccount();
      if (imported) {
        privateKey = imported.privateKey;
      }
      // 2. Fallback to Agent Wallet linked to connected wallet
      else {
        const agent = await getAgentWallet(masterAddress);
        if (agent?.approved) {
          privateKey = agent.privateKey;
        }
      }

      if (!privateKey) {
        // CHECK FOR LOCKED STATE
        if (isImportedAccountEncrypted() || isAgentWalletEncrypted(masterAddress)) {
          setPendingAction({ type: 'close' });
          setShowUnlockModal(true);
          setIsClosing(false); // Reset loading state
          return;
        }

        throw new Error(
          'Agent not found. Please import an account or create an agent.'
        );
      }

      // Use cached universe to find coin ID
      const coinIndex = universe.findIndex(
        (a: any) => a.name === positionToClose.coin
      );
      if (coinIndex === -1) {
        throw new Error(`Asset ${positionToClose.coin} not found in metadata`);
      }
      const coinId = coinIndex;

      const totalSize = Math.abs(parseFloat(positionToClose.szi));
      const sizeToClose = totalSize * (closePercentage / 100);
      const sizeStr = sizeToClose.toFixed(6);
      const size = parseFloat(sizeStr);

      const currentPrice =
        parseFloat(positionToClose.markPx) ||
        parseFloat(positionToClose.entryPx);
      const isLong = parseFloat(positionToClose.szi) > 0;

      await placeMarketOrderAgent(privateKey as `0x${string}`, {
        coinId,
        isBuy: !isLong,
        size,
        currentPrice,
        reduceOnly: true,
      });

      toast.success('Order submitted');
      setCloseDialogOpen(false);
      setTimeout(() => {
        fetchData();
        onRefresh?.();
      }, 1000);
      setExpandedPositionIndex(null);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsClosing(false);
    }
  };

  const isBuy = (side: string) => side === 'B';

  const handleCancelOrder = async (oid: number) => {
    let loadingToast: string | number | undefined;
    try {
      // Find the order to get the coin/asset info
      const order = openOrders.find((o) => o.oid === oid);
      if (!order) {
        toast.error('Order not found');
        return;
      }

      loadingToast = toast.info('Canceling order...', {
        description: `${order.coin} - Order ID: ${oid}`,
      });

      let privateKey: string | undefined;

      // 1. Check for Imported Account (Priority)
      const imported = getImportedAccount();
      if (imported) {
        privateKey = imported.privateKey;
      }
      // 2. Fallback to Agent Wallet linked to connected wallet
      else {
        const agent = await getAgentWallet(masterAddress);
        if (agent?.approved) {
          privateKey = agent.privateKey;
        }
      }

      if (!privateKey) {
        // CHECK FOR LOCKED STATE
        if (isImportedAccountEncrypted() || isAgentWalletEncrypted(masterAddress)) {
          toast.dismiss(loadingToast);
          setPendingAction({ type: 'cancel', data: oid });
          setShowUnlockModal(true);
          return;
        }

        toast.dismiss(loadingToast);
        toast.error('Agent wallet not found');
        return;
      }

      // Use cached universe to find coin ID
      const coinIndex = universe.findIndex((a: any) => a.name === order.coin);
      let coinId: number | undefined;

      if (coinIndex !== -1) {
        coinId = coinIndex;
      }

      if (coinId === undefined) {
        toast.dismiss(loadingToast);
        toast.error('Could not find asset ID', {
          description: `Asset: ${order.coin}`,
        });
        return;
      }

      await cancelOrderAgent(privateKey as `0x${string}`, {
        coinId: coinId,
        oid: oid,
      });

      toast.dismiss(loadingToast);
      toast.success('Order canceled successfully', {
        description: `${order.coin}`,
      });

      // Refresh orders list
      await fetchData();
      onRefresh?.();
    } catch (e: any) {
      console.error('Error canceling order:', e);
      if (loadingToast) toast.dismiss(loadingToast);
      toast.error('Failed to cancel order', {
        description: e.message || 'Unknown error',
      });
    }
  };

  // Helper to aggregate TP and SL orders for a specific coin
  const getOpenTP_SL = (coin: string, positionSize: number) => {
    const positionOrders = openOrders.filter(
      (o) => o.coin === coin && o.reduceOnly
    );

    // Determine position direction (Long > 0, Short < 0)
    const isLong = positionSize > 0;

    const tps: { price: number; size: number }[] = [];
    const sls: { price: number; size: number }[] = [];

    positionOrders.forEach((order) => {
      // Determine if it's a closing order (Long needs Sell, Short needs Buy)
      const isBuy = order.side === 'B';
      const isClosing = (isLong && !isBuy) || (!isLong && isBuy);

      if (isClosing) {
        // Get trigger price - API returns it directly on order object
        const triggerPx = parseFloat(
          order.triggerPx ||
          order.trigger?.triggerPx ||
          order.triggerCondition?.triggerPx ||
          '0'
        );
        const limitPx = parseFloat(order.limitPx || '0');
        const price = triggerPx > 0 ? triggerPx : limitPx;
        const size = parseFloat(order.sz);

        // Classify as TP or SL using orderType from API
        if (
          order.orderType &&
          order.orderType.toLowerCase().includes('take profit')
        ) {
          tps.push({ price, size });
        } else if (
          order.orderType &&
          order.orderType.toLowerCase().includes('stop')
        ) {
          sls.push({ price, size });
        } else if (order.reduceOnly) {
          // Fallback: classify based on price comparison for reduceOnly orders
          const position = positions.find((p) => p.coin === coin);
          const markPx = parseFloat(
            position?.markPx || position?.entryPx || '0'
          );

          if (markPx > 0 && price > 0) {
            if (isLong) {
              // Long: TP > Mark, SL < Mark
              if (price > markPx) tps.push({ price, size });
              else sls.push({ price, size });
            } else {
              // Short: TP < Mark, SL > Mark
              if (price < markPx) tps.push({ price, size });
              else sls.push({ price, size });
            }
          }
        }
      }
    });

    return {
      tps: tps.sort((a, b) => a.price - b.price),
      sls: sls.sort((a, b) => a.price - b.price),
    };
  };


  const handleUnlock = async (pin: string): Promise<boolean> => {
    try {
      // Try unlocking imported account first
      if (isImportedAccountEncrypted()) {
        const unlocked = await unlockImportedAccount(pin);
        if (unlocked) {
          setShowUnlockModal(false);
          // Retry pending action
          if (pendingAction?.type === 'close') {
            handleExecuteClose();
          } else if (pendingAction?.type === 'cancel' && pendingAction.data) {
            handleCancelOrder(pendingAction.data);
          }
          setPendingAction(null);
          return true;
        }
      }

      // Try unlocking agent wallet
      if (isAgentWalletEncrypted(masterAddress)) {
        const unlocked = await unlockAgentWallet(masterAddress, pin);
        if (unlocked) {
          setShowUnlockModal(false);
          // Retry pending action
          if (pendingAction?.type === 'close') {
            handleExecuteClose();
          } else if (pendingAction?.type === 'cancel' && pendingAction.data) {
            handleCancelOrder(pendingAction.data);
          }
          setPendingAction(null);
          return true;
        }
      }
    } catch (e) {
      console.error('Unlock failed', e);
    }
    return false;
  };

  return (
    <Card className="w-full">
      <UnlockWalletModal
        isOpen={showUnlockModal}
        onUnlock={handleUnlock}
        onClose={() => setShowUnlockModal(false)}
      />
      <Dialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground">
          <DialogHeader>
            <DialogTitle>Close {positionToClose?.coin}</DialogTitle>
            <DialogDescription>Select amount to close.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between">
              <Label>Amount</Label>
              <span className="font-mono">{closePercentage}%</span>
            </div>
            <Slider
              defaultValue={[100]}
              max={100}
              step={25}
              value={[closePercentage]}
              onValueChange={(vals) => setClosePercentage(vals[0])}
            />
            <div className="flex justify-between gap-2 mt-2">
              {[25, 50, 75, 100].map((pct) => (
                <Button
                  key={pct}
                  variant={closePercentage === pct ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setClosePercentage(pct)}
                  className="flex-1"
                >
                  {pct}%
                </Button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCloseDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleExecuteClose}
              disabled={isClosing}
            >
              {isClosing ? 'Closing...' : 'Confirm Close'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3">
          <CollapsibleTrigger className="flex items-center gap-2 hover:opacity-80 transition-opacity focus-visible:outline-none">
            <CardTitle className="text-lg">
              Positions & Orders
            </CardTitle>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </CollapsibleTrigger>
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchData}
            disabled={isLoading}
            className="h-8 w-8"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
            />
          </Button>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className={isMobile ? 'p-4' : ''}>
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                Open Positions
                <span className="text-xs font-normal bg-muted px-2 py-0.5 rounded-full">
                  {positions.length}
                </span>
              </h3>

              {positions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4 bg-muted/20 rounded-lg border border-dashed">
                  No open positions
                </p>
              ) : isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-lg" />
                  ))}
                </div>
              ) : expandedPositionIndex !== null &&
                positions[expandedPositionIndex] ? (
                (() => {
                  const position = positions[expandedPositionIndex];
                  const pnl = formatPnl(position.unrealizedPnl);
                  const marginUsedVal = parseFloat(position.marginUsed);
                  const roe =
                    marginUsedVal > 0
                      ? (parseFloat(position.unrealizedPnl) / marginUsedVal) * 100
                      : 0;
                  const isLong = parseFloat(position.szi) > 0;
                  const leverage = calculateLeverage(position);

                  // Get aggregated TPs and SLs
                  const { tps, sls } = getOpenTP_SL(
                    position.coin,
                    parseFloat(position.szi)
                  );

                  return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
                      <div className="flex items-center justify-between pb-2 border-b border-border/50">
                        <Button
                          variant="ghost"
                          className="pl-0 gap-1 hover:bg-transparent hover:text-primary"
                          onClick={() => setExpandedPositionIndex(null)}
                        >
                          <ChevronLeft className="h-5 w-5" />
                          <span className="text-base font-semibold">Back</span>
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          Open Position
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2">
                        <div className="flex items-center gap-3">
                          <TokenIcon symbol={position.coin} size={32} />
                          <div>
                            <div className="font-bold text-lg">
                              {position.coin}
                            </div>
                            <div
                              className={`text-sm font-medium ${isLong ? 'text-green-500' : 'text-red-500'}`}
                            >
                              {isLong ? 'Long' : 'Short'} {leverage}
                            </div>
                          </div>
                        </div>
                        <div className={`text-right ${pnl.className}`}>
                          <div className="font-bold text-lg">
                            ${pnl.formatted}
                          </div>
                          <div className="text-sm">{formatNumber(roe, 2)}%</div>
                        </div>
                      </div>

                      <div className="bg-muted/30 rounded-lg p-4 space-y-4">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                          Trade Details
                        </h4>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-sm">
                          <div>
                            <span className="text-xs text-muted-foreground block mb-1">
                              Entry Price
                            </span>
                            <span className="font-medium text-base">
                              ${formatPrice(position.entryPx)}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground block mb-1">
                              Mark Price
                            </span>
                            <span className="font-medium text-base">
                              ${formatPrice(position.markPx || '0')}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground block mb-1">
                              Size ({position.coin})
                            </span>
                            <span className="font-medium text-base">
                              {formatNumber(
                                Math.abs(parseFloat(position.szi)),
                                4
                              )}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground block mb-1">
                              Liq. Price
                            </span>
                            <span className="font-medium text-base text-orange-500">
                              {position.liquidationPx
                                ? `$${formatPrice(position.liquidationPx)}`
                                : '-'}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground block mb-1">
                              Margin Mode
                            </span>
                            <span className="font-medium text-base">
                              {position.leverage?.type === 'isolated'
                                ? 'Isolated'
                                : 'Cross'}
                            </span>
                          </div>
                          <div className="col-span-2 grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-xs text-muted-foreground block mb-1">
                                Take Profit
                              </span>
                              {tps.length > 0 ? (
                                <span className="font-medium text-base text-green-500">
                                  {tps
                                    .map((tp) => `$${formatPrice(tp.price)}`)
                                    .join(', ')}
                                </span>
                              ) : (
                                <span className="font-medium text-base text-green-500">
                                  {position.tpPrice
                                    ? `$${formatPrice(position.tpPrice)}`
                                    : '-'}
                                </span>
                              )}
                            </div>
                            <div>
                              <span className="text-xs text-muted-foreground block mb-1">
                                Stop Loss
                              </span>
                              {sls.length > 0 ? (
                                <span className="font-medium text-base text-red-500">
                                  {sls
                                    .map((sl) => `$${formatPrice(sl.price)}`)
                                    .join(', ')}
                                </span>
                              ) : (
                                <span className="font-medium text-base text-red-500">
                                  {position.slPrice
                                    ? `$${formatPrice(position.slPrice)}`
                                    : '-'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button
                          variant="destructive"
                          className="w-full py-6 text-base font-semibold shadow-lg shadow-destructive/20"
                          onClick={() => handleOpenCloseDialog(position)}
                        >
                          Close Position
                        </Button>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="space-y-1">
                  {!isMobile && (
                    <div className="grid grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_0.8fr_0.8fr_0.8fr_1fr] gap-2 px-2 pb-2 text-xs text-muted-foreground font-semibold uppercase tracking-wider text-right">
                      <div className="text-left">Coin</div>
                      <div>Size</div>
                      <div>Entry</div>
                      <div>Mark</div>
                      <div>Liq. Px</div>
                      <div>TP / SL</div>
                      <div>Margin</div>
                      <div className="text-center">PnL</div>
                    </div>
                  )}

                  {positions.map((position, index) => {
                    const pnl = formatPnl(position.unrealizedPnl);
                    const marginUsedVal = parseFloat(position.marginUsed);
                    const roe =
                      marginUsedVal > 0
                        ? (parseFloat(position.unrealizedPnl) / marginUsedVal) * 100
                        : 0;
                    const isLong = parseFloat(position.szi) > 0;
                    const positionValue =
                      Math.abs(parseFloat(position.szi)) *
                      parseFloat(position.markPx || '0');
                    const marginUsed = parseFloat(position.marginUsed || '0');
                    const leverage = position.leverage?.value || 0;

                    const { tps, sls } = getOpenTP_SL(
                      position.coin,
                      parseFloat(position.szi)
                    );
                    const hasOrders = tps.length > 0 || sls.length > 0;

                    if (isMobile) {
                      return (
                        <div
                          key={index}
                          onClick={() => {
                            handlePositionClick(position.coin);
                            setExpandedPositionIndex(index);
                          }}
                          className="flex flex-col gap-3 p-4 bg-card/50 hover:bg-muted/50 rounded-lg border border-border/50 mb-3 cursor-pointer"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <TokenIcon
                                symbol={position.coin}
                                size={32}
                                className="shrink-0"
                              />
                              <div>
                                <div className="font-bold text-base flex items-center gap-2">
                                  {position.coin}
                                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${isLong ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                    {isLong ? 'LONG' : 'SHORT'}
                                  </span>
                                </div>
                                <div
                                  className={`text-xs font-bold flex items-center gap-1 ${isLong ? 'text-green-500' : 'text-red-500'}`}
                                >
                                  {isLong ? 'Long' : 'Short'}
                                  <span className="text-muted-foreground font-normal">
                                    • {leverage}x
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className={`text-right ${pnl.className}`}>
                              <div className="font-bold text-base">
                                ${pnl.formatted}{' '}
                                <span className="text-xs font-medium opacity-80">
                                  ({formatNumber(roe, 1)}%)
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm mt-1 pt-3 border-t border-border/30">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-muted-foreground">
                                Size
                              </span>
                              <span className="font-medium text-foreground">
                                {formatNumber(position.szi, 3)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-muted-foreground">
                                Liq. Price
                              </span>
                              <span className="font-medium text-orange-500">
                                {position.liquidationPx
                                  ? `$${formatPrice(position.liquidationPx)}`
                                  : '-'}
                              </span>
                            </div>

                            <div className="flex justify-between items-center text-xs">
                              <span className="text-muted-foreground">
                                Entry
                              </span>
                              <span className="font-medium text-foreground">
                                ${formatPrice(position.entryPx)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-muted-foreground">
                                Margin
                              </span>
                              <span className="font-medium text-foreground">
                                ${formatNumber(marginUsed, 2)}
                              </span>
                            </div>

                            <div className="flex justify-between items-center text-xs">
                              <span className="text-muted-foreground">
                                Mark
                              </span>
                              <span className="font-medium text-foreground">
                                ${formatPrice(position.markPx || '0')}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-muted-foreground">
                                TP / SL
                              </span>
                              <span className="font-medium text-foreground">
                                {hasOrders ? (
                                  <div className="text-right">
                                    <span className="text-sm">
                                      {(() => {
                                        // Show closest orders only
                                        const closestTp = isLong
                                          ? tps[0]
                                          : tps[tps.length - 1];
                                        const closestSl = isLong
                                          ? sls[sls.length - 1]
                                          : sls[0];

                                        return (
                                          <div className="flex gap-2 justify-end">
                                            {closestTp && (
                                              <span className="text-green-500">
                                                {' '}
                                                ${formatPrice(closestTp.price)}
                                              </span>
                                            )}
                                            {closestSl && (
                                              <span className="text-red-500">
                                                {' '}
                                                ${formatPrice(closestSl.price)}
                                              </span>
                                            )}
                                          </div>
                                        );
                                      })()}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="flex gap-1 justify-end">
                                    {tps.length === 0 && sls.length === 0 ? (
                                      <span>-</span>
                                    ) : (
                                      <>
                                        {tps.length > 0 && (
                                          <span className="text-green-500">
                                            ${formatPrice(tps[0].price)}
                                          </span>
                                        )}
                                        {sls.length > 0 && (
                                          <span className="text-red-500">
                                            ${formatPrice(sls[0].price)}
                                          </span>
                                        )}
                                      </>
                                    )}
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={index}
                        onClick={() => {
                          handlePositionClick(position.coin);
                          setExpandedPositionIndex(index);
                        }}
                        className="grid grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_0.8fr_0.8fr_0.8fr_1fr] gap-2 p-3 bg-card/50 hover:bg-muted/50 active:bg-muted transition-colors rounded-lg items-center text-sm cursor-pointer border border-transparent hover:border-border/50 text-right"
                      >
                        <div className="flex items-center gap-2 text-left font-bold text-sm text-foreground">
                          <TokenIcon
                            symbol={position.coin}
                            size={20}
                            className="shrink-0"
                          />
                          <div className="flex items-baseline gap-1.5">
                            <span>{position.coin}</span>
                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${isLong ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                              {isLong ? 'LONG' : 'SHORT'}
                            </span>
                            <span className="text-xs font-medium text-emerald-400">
                              {calculateLeverage(position)}
                            </span>
                          </div>
                        </div>
                        <div
                          className={
                            isLong
                              ? 'text-green-500 font-medium'
                              : 'text-red-500 font-medium'
                          }
                        >
                          {formatNumber(position.szi, 3)}
                        </div>
                        <div className="font-medium text-foreground">
                          ${formatPrice(position.entryPx)}
                        </div>
                        <div className="font-medium text-foreground">
                          ${formatPrice(position.markPx || '0')}
                        </div>
                        <div className="font-medium text-orange-500">
                          {position.liquidationPx
                            ? `$${formatPrice(position.liquidationPx)}`
                            : '-'}
                        </div>
                        <div className="font-medium text-foreground flex justify-end items-center text-xs">
                          {hasOrders ? (
                            <div className="flex gap-2">
                              {(() => {
                                // Show closest orders only
                                const closestTp = isLong
                                  ? tps[0]
                                  : tps[tps.length - 1];
                                const closestSl = isLong
                                  ? sls[sls.length - 1]
                                  : sls[0];

                                return (
                                  <>
                                    {closestTp && (
                                      <span className="text-green-500">
                                        ${formatPrice(closestTp.price)}
                                      </span>
                                    )}
                                    {closestSl && (
                                      <span className="text-red-500">
                                        ${formatPrice(closestSl.price)}
                                      </span>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                          ) : (
                            <div className="flex flex-col items-end text-xs leading-tight">
                              {tps.length === 0 && sls.length === 0 ? (
                                <span className="text-muted-foreground">-</span>
                              ) : (
                                <>
                                  {tps.length > 0 && (
                                    <span className="text-green-500">
                                      {formatPrice(tps[0].price)}
                                    </span>
                                  )}
                                  {sls.length > 0 && (
                                    <span className="text-red-500">
                                      {formatPrice(sls[0].price)}
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="font-medium text-foreground">
                          ${formatNumber(marginUsed, 2)}
                        </div>
                        <div className={`text-center ${pnl.className}`}>
                          <span className="text-sm font-bold">
                            ${pnl.formatted}
                          </span>
                          <span className="text-sm opacity-80 ml-1">
                            ({formatNumber(roe, 1)}%)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                Open Orders
                <span className="text-xs font-normal bg-muted px-2 py-0.5 rounded-full">
                  {openOrders.length}
                </span>
              </h3>

              {openOrders.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4 bg-muted/20 rounded-lg border border-dashed">
                  No open orders
                </p>
              ) : isLoading ? (
                <div className="space-y-2">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {!isMobile && (
                    <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_0.5fr] gap-2 px-2 pb-2 text-xs text-muted-foreground font-semibold uppercase tracking-wider text-right">
                      <div className="text-left">Coin</div>
                      <div className="text-center">Type</div>
                      <div>Side</div>
                      <div>Size</div>
                      <div>Price</div>
                      <div className="text-center">Action</div>
                    </div>
                  )}

                  {openOrders.map((order, orderIndex) => {
                    const buy = isBuy(order.side);
                    const position = positions.find(
                      (p) => p.coin === order.coin
                    );

                    // Determine order type based on reduceOnly and price comparison
                    let type = order.orderType || 'Limit';

                    // Normalize trigger price
                    const triggerPxStr = order.triggerPx || order.trigger?.triggerPx || order.triggerCondition?.triggerPx;
                    const hasTrigger = !!triggerPxStr && parseFloat(triggerPxStr) > 0;

                    if (order.reduceOnly && position) {
                      const isLong = parseFloat(position.szi) > 0;
                      const isClosing = (isLong && !buy) || (!isLong && buy);

                      if (isClosing) {
                        const limitPrice = parseFloat(order.limitPx);
                        const triggerPrice = hasTrigger ? parseFloat(triggerPxStr!) : 0;
                        const executionPrice = hasTrigger ? triggerPrice : limitPrice;

                        const markPrice = parseFloat(position.markPx || position.entryPx || '0');

                        if (markPrice > 0) {
                          let baseType = 'Limit';
                          if (isLong) {
                            // Long position: TP if price > mark, SL if price < mark
                            baseType = executionPrice > markPrice ? 'Take Profit' : 'Stop Loss';
                          } else {
                            // Short position: TP if price < mark, SL if price > mark
                            baseType = executionPrice < markPrice ? 'Take Profit' : 'Stop Loss';
                          }

                          type = `${baseType} ${hasTrigger ? 'Trigger' : 'Limit'}`;
                        }
                      } else {
                        type = 'Reduce Only Limit';
                      }
                    } else if (hasTrigger) {
                      // If not reduced only but has trigger, likely a simpler trigger order
                      type = 'Trigger Order';
                      if (order.orderType) type = order.orderType;
                    }

                    let sideLabel = buy ? 'Long' : 'Short';
                    const isLong = position
                      ? parseFloat(position.szi) > 0
                      : false;

                    // Override side label for closing orders
                    if (order.reduceOnly && position) {
                      const isClosing = (isLong && !buy) || (!isLong && buy);
                      if (isClosing) {
                        sideLabel = isLong ? 'Close Long' : 'Close Short';
                      }
                    }

                    if (isMobile) {
                      return (
                        <div
                          key={order.oid}
                          className="flex flex-col gap-3 p-4 bg-card/50 hover:bg-muted/50 rounded-lg border border-border/50 mb-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <TokenIcon
                                symbol={order.coin}
                                size={32}
                                className="shrink-0"
                              />
                              <div>
                                <div className="font-bold text-base">
                                  {order.coin}
                                </div>
                                <div
                                  className={`text-xs font-bold ${buy ? 'text-green-500' : 'text-red-500'}`}
                                >
                                  {sideLabel}
                                  <span className="text-muted-foreground font-normal ml-1 block">
                                    {type}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => handleCancelOrder(order.oid)}
                            >
                              <X className="h-5 w-5" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs pt-2 border-t border-border/30">
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">
                                Size
                              </span>
                              <span className="font-medium text-foreground">
                                {formatNumber(order.sz, 4)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">
                                Price
                              </span>
                              <span className="font-medium text-foreground">
                                $
                                {formatPrice(
                                  parseFloat(
                                    order.triggerPx ||
                                    order.trigger?.triggerPx ||
                                    order.triggerCondition?.triggerPx ||
                                    order.limitPx ||
                                    '0'
                                  )
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={order.oid}
                        className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_0.5fr] gap-2 p-3 bg-card/50 hover:bg-muted/50 rounded-lg items-center text-sm border border-transparent hover:border-border/50 text-right"
                      >
                        <div className="flex items-center gap-2 text-left font-bold text-sm text-foreground">
                          <TokenIcon
                            symbol={order.coin}
                            size={20}
                            className="shrink-0"
                          />
                          <span>{order.coin}</span>
                        </div>
                        <div className="text-center font-medium text-xs text-muted-foreground">
                          {type}
                        </div>
                        <div
                          className={`font-bold ${buy ? 'text-green-500' : 'text-red-500'}`}
                        >
                          {sideLabel}
                        </div>
                        <div className="font-medium">
                          {formatNumber(order.sz, 4)}
                        </div>
                        <div className="font-medium text-foreground">
                          $
                          {formatPrice(
                            parseFloat(
                              order.triggerPx ||
                              order.trigger?.triggerPx ||
                              order.triggerCondition?.triggerPx ||
                              order.limitPx ||
                              '0'
                            )
                          )}
                        </div>
                        <div className="flex justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleCancelOrder(order.oid)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
