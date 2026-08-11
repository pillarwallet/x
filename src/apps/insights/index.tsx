/**
 * PillarX Algorithmic Insights App
 * Main entry point for the Insights application
 */

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { Settings } from 'lucide-react';

// Styles
import './styles/insights.css';

// Components
import { Header } from './components/Header/Header';
import { SignalCard } from './components/SignalCard/SignalCard';
import { FeedEventCard } from './components/FeedEventCard/FeedEventCard';
import { PnLDetailModal } from './components/PnLDetailModal';
import { ConsentModal } from './components/consent';

// Hooks
import { useTradingSignals } from './hooks/useTradingSignals';
import { useSparklineData } from './hooks/useSparklineData';
import { useLogoMap } from './hooks/useLogoMap';
import { useSubscriptionStatus } from './hooks/useSubscriptionStatus';
import { isTestnet } from '../../utils/blockchain';

// Utils
import { generateFeedEvents, generateOverallPnLSparkline, generateOpenPnLSparkline, generateClosedPnLSparkline } from './utils/signalUtils';
import { updateSignalPrices } from './api/insightsApi';
import { openExternalUrl } from '../../utils/pillarWalletMessaging';

// Types
import type { TradingSignal, TabType, LeverageType, PnLViewType } from './types';

const STRIPE_CHECKOUT_URL_TESTNET =
  import.meta.env.VITE_STRIPE_CHECKOUT_URL_TESTNET ||
  'https://buy.stripe.com/test_fZubJ28Ky2eP8LK0sE0gw03';
const STRIPE_CHECKOUT_URL_MAINNET =
  import.meta.env.VITE_STRIPE_CHECKOUT_URL_MAINNET ||
  STRIPE_CHECKOUT_URL_TESTNET;
const STRIPE_CHECKOUT_URL = isTestnet
  ? STRIPE_CHECKOUT_URL_TESTNET
  : STRIPE_CHECKOUT_URL_MAINNET;
const SUBSCRIPTION_POLL_INTERVAL = 10000;

const getStoredValue = (key: string): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem(key);
};

const getInitialDevicePlatform = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const stored = localStorage.getItem('DEVICE_PLATFORM');
  if (stored) {
    return stored;
  }

  return new URLSearchParams(window.location.search).get('devicePlatform');
};

const shortenAddress = (address: string) => {
  if (!address) {
    return '';
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const formatDate = (value?: number | null) => {
  if (!value) {
    return null;
  }

  const millis = value > 1e12 ? value : value * 1000;

  return new Date(millis).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const App = () => {
  // State
  const [activeTab, setActiveTab] = useState<TabType>('open');
  const [selectedPnLView, setSelectedPnLView] = useState<PnLViewType>(null);
  const [leverage, setLeverage] = useState<LeverageType>(1);
  const [updating, setUpdating] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const storedEoaAddress = useMemo(() => getStoredValue('EOA_ADDRESS'), []);
  const { user } = usePrivy();
  const { wallets } = useWallets();
  const privyWalletAddress = user?.wallet?.address;
  const privyWallets = wallets || [];
  const fallbackWalletAddress =
    privyWallets.length > 0 ? privyWallets[0]?.address : undefined;

  const eoaAddress = useMemo(() => {
    return storedEoaAddress || privyWalletAddress || fallbackWalletAddress || null;
  }, [storedEoaAddress, privyWalletAddress, fallbackWalletAddress]);
  const devicePlatform = useMemo(() => getInitialDevicePlatform(), []);
  const isNativeApp =
    devicePlatform === 'ios' || devicePlatform === 'android';

  const {
    subscription,
    loading: subscriptionLoading,
    error: subscriptionError,
    isActive: hasActiveSubscription,
    refetch: refetchSubscription,
    polling: isSubscriptionPolling,
    startPolling,
    stopPolling,
  } = useSubscriptionStatus(eoaAddress, {
    enabled: Boolean(eoaAddress),
    pollIntervalMs: SUBSCRIPTION_POLL_INTERVAL,
  });

  const [isAwaitingSubscription, setIsAwaitingSubscription] = useState(false);
  const [showManageMenu, setShowManageMenu] = useState(false);
  const manageMenuRef = useRef<HTMLDivElement | null>(null);
  const manageSubscriptionUrl = import.meta.env.VITE_STRIPE_CUSTOMER_PORTAL_URL;
  const trimmedManageSubscriptionUrl = manageSubscriptionUrl?.trim() || '';

  // Hooks
  const { signals, loading, setSignals } = useTradingSignals({
    enabled: consentGiven && hasActiveSubscription,
  });
  const { sparklineDataMap, fetchSparkline, fetchSparklines, loading: sparklineLoading } = useSparklineData();
  const logoMap = useLogoMap(signals);

  // Track initial load - only animate on first load, not on data refreshes
  useEffect(() => {
    if (!loading && signals.length > 0 && isInitialLoad) {
      // Mark initial load as complete after first data load completes
      setIsInitialLoad(false);
    }
  }, [loading, signals.length, isInitialLoad]);

  useEffect(() => {
    if (hasActiveSubscription) {
      setIsAwaitingSubscription(false);
      stopPolling();
    }
  }, [hasActiveSubscription, stopPolling]);

  // Check consent status on mount
  useEffect(() => {
    const storedConsent = localStorage.getItem('pillarx_consent_accepted');
    if (storedConsent) {
      try {
        const consent = JSON.parse(storedConsent);
        const consentDate = new Date(consent.timestamp);
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        if (consentDate > oneYearAgo) {
          setConsentGiven(true);
        } else {
          setShowConsentModal(true);
        }
      } catch {
        setShowConsentModal(true);
      }
    } else {
      setShowConsentModal(true);
    }
  }, []);

  // Track which signal IDs we've already initiated sparkline fetches for
  const fetchedSparklineIdsRef = useRef<Set<string>>(new Set());

  // Fetch sparklines for open signals only when new active signals are detected
  // This effect should only run once after signals are initially loaded, not on every update
  useEffect(() => {
    if (!hasActiveSubscription) {
      return;
    }

    if (signals.length > 0 && !loading) {
      const openSignals = signals.filter(s => s.status === 'active');

      // Only fetch sparklines for signals we haven't fetched yet
      const signalsNeedingSparklines = openSignals.filter(signal => {
        const alreadyFetched = fetchedSparklineIdsRef.current.has(signal.id);
        const hasData = sparklineDataMap[signal.id] && sparklineDataMap[signal.id].length > 0;
        const isLoading = sparklineLoading[signal.id];

        if (alreadyFetched || hasData || isLoading) {
          return false;
        }

        // Mark as fetched to prevent duplicate requests
        fetchedSparklineIdsRef.current.add(signal.id);
        return true;
      });

      if (signalsNeedingSparklines.length > 0) {
        console.log(`📊 [Sparkline] Initial fetch for ${signalsNeedingSparklines.length} new signals`);
        fetchSparklines(signalsNeedingSparklines);
      }
    }
    // Only depend on signal count and loading state, not the signals array itself
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signals.length, loading, hasActiveSubscription]);

  // Helper functions
  const applyLeverage = (pnl: number) => pnl * leverage;

  const calculateTotalPnL = (signalList: TradingSignal[]) => {
    return signalList.reduce((sum, signal) => {
      return sum + (signal.realized_pnl_percent || 0);
    }, 0);
  };

  // Filtered signals
  const openSignals = useMemo(() => signals.filter(s => s.status === 'active'), [signals]);
  const closedSignals = useMemo(() => {
    return signals
      .filter(s => ['completed', 'stopped', 'closed'].includes(s.status || 'active'))
      .sort((a, b) => {
        const dateA = new Date(a.closed_at || a.last_price_update || a.created_at).getTime();
        const dateB = new Date(b.closed_at || b.last_price_update || b.created_at).getTime();
        return dateB - dateA;
      });
  }, [signals]);

  const calculateOpenPnL = () => {
    return openSignals.reduce((sum, signal) => {
      return sum + (signal.profit_loss_percent || 0);
    }, 0);
  };

  const calculateOpenRealizedPnL = () => {
    return openSignals.reduce((sum, signal) => {
      return sum + (signal.realized_pnl_percent || 0);
    }, 0);
  };

  // PnL calculations
  const openTotalPnL = useMemo(() => {
    const value = calculateOpenPnL();
    console.log(`💰 [PnL] openTotalPnL: ${value}% (${openSignals.length} signals)`);
    if (openSignals.length > 0) {
      console.log('📊 [PnL] Open signals breakdown:', openSignals.map(s => ({
        ticker: s.ticker,
        profit_loss_percent: s.profit_loss_percent,
        realized_pnl_percent: s.realized_pnl_percent,
      })));
    }
    return value;
  }, [openSignals]);

  const closedTotalPnL = useMemo(() => {
    const closedPnL = calculateTotalPnL(closedSignals);
    const openRealizedPnL = calculateOpenRealizedPnL();
    const value = closedPnL + openRealizedPnL;
    console.log(`💰 [PnL] closedTotalPnL: ${value}% (closed: ${closedPnL}%, open realized: ${openRealizedPnL}%)`);
    return value;
  }, [closedSignals, openSignals]);

  const floatingPnL = useMemo(() => {
    const value = openTotalPnL + closedTotalPnL;
    console.log(`💰 [PnL] floatingPnL: ${value}% (open: ${openTotalPnL}%, closed: ${closedTotalPnL}%)`);
    return value;
  }, [openTotalPnL, closedTotalPnL]);

  // Sparkline data
  const overallPnLSparklineData = useMemo(() => generateOverallPnLSparkline(closedSignals), [closedSignals]);
  const openPnLSparklineData = useMemo(() => generateOpenPnLSparkline(openSignals), [openSignals]);
  const closedPnLSparklineData = useMemo(() => generateClosedPnLSparkline(closedSignals, openSignals), [closedSignals, openSignals]);

  // Feed events
  const feedEvents = useMemo(() => generateFeedEvents(signals), [signals]);

  // Displayed signals based on active tab
  const displayedSignals = useMemo(() => {
    if (activeTab === 'open') return openSignals;
    if (activeTab === 'closed') return closedSignals;
    if (activeTab === 'feed') return [];
    return signals;
  }, [activeTab, openSignals, closedSignals, signals]);

  // Update prices function
  const handleUpdatePrices = async () => {
    setUpdating(true);
    try {
      const result = await updateSignalPrices();
      if (result.error) {
        console.error('Error updating prices:', result.error);
      }
    } catch (error) {
      console.error('Error calling update function:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleRefreshSubscription = useCallback(() => {
    refetchSubscription().catch(() => { });
  }, [refetchSubscription]);

  const handleSubscribeClick = useCallback(() => {
    if (!eoaAddress) {
      alert('No wallet detected. Please re-open PillarX from the mobile app.');
      return;
    }

    if (typeof window === 'undefined') {
      return;
    }

    const checkoutUrl = `${STRIPE_CHECKOUT_URL}?client_reference_id=${encodeURIComponent(
      eoaAddress
    )}`;

    setIsAwaitingSubscription(true);
    startPolling();
    refetchSubscription().catch(() => { });

    if (!isNativeApp) {
      const confirmed = window.confirm(
        'The subscription checkout will open in a new browser tab. Once complete, return here to access Insights.'
      );
      if (!confirmed) {
        setIsAwaitingSubscription(false);
        stopPolling();
        return;
      }
    } else {
      const confirmed = window.confirm(
        'The subscription checkout will open in your browser. Once complete, return here to access Insights.'
      );
      if (!confirmed) {
        setIsAwaitingSubscription(false);
        stopPolling();
        return;
      }
    }

    // Use the utility function to open external URL
    // It will handle both native app (via postMessage) and browser (via window.open)
    openExternalUrl(checkoutUrl);
  }, [eoaAddress, isNativeApp, refetchSubscription, startPolling, stopPolling]);

  const handleManageSubscription = useCallback(() => {
    if (!trimmedManageSubscriptionUrl) {
      alert('Subscription portal is currently unavailable.');
      return;
    }
    // Use the utility function to open external URL
    // It will handle both native app (via postMessage) and browser (via window.open)
    openExternalUrl(trimmedManageSubscriptionUrl, 'noopener,noreferrer');
    setShowManageMenu(false);
  }, [trimmedManageSubscriptionUrl]);

  // Poll for price updates every 30 seconds
  useEffect(() => {
    if (!consentGiven || !hasActiveSubscription) return;

    handleUpdatePrices();
    const interval = setInterval(() => {
      handleUpdatePrices();
      // Refresh sparklines for open signals
      const currentOpenSignals = signals.filter(s => s.status === 'active');
      if (currentOpenSignals.length > 0) {
        fetchSparklines(currentOpenSignals);
      }
    }, 30000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consentGiven, hasActiveSubscription]);

  useEffect(() => {
    if (!showManageMenu) {
      return undefined;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        manageMenuRef.current &&
        !manageMenuRef.current.contains(event.target as Node)
      ) {
        setShowManageMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showManageMenu]);

  // Consent handlers
  const handleConsentAccepted = (payload: any) => {
    localStorage.setItem('pillarx_consent_accepted', JSON.stringify(payload));
    setConsentGiven(true);
    setShowConsentModal(false);
  };

  const handleConsentDeclined = () => {
    alert('You must accept the terms to access PillarX Algorithmic Insights.');
  };

  const consentModalElement = (
    <ConsentModal
      open={showConsentModal}
      onConsentAccepted={handleConsentAccepted}
      onConsentDeclined={handleConsentDeclined}
      userRegion="Other"
      immediateAccess={true}
    />
  );

  const missingEoaAddress = !eoaAddress;
  const showSubscriptionLoading =
    Boolean(eoaAddress) &&
    subscriptionLoading &&
    !hasActiveSubscription &&
    !isAwaitingSubscription &&
    !isSubscriptionPolling;
  const subscriptionInactive =
    Boolean(eoaAddress) &&
    !subscriptionLoading &&
    !hasActiveSubscription;
  const subscriptionStatusLabel = subscription?.status
    ? subscription.status.replace(/_/g, ' ')
    : 'No active subscription';
  const nextRenewalText =
    formatDate(subscription?.currentPeriodEnd) ?? 'Not scheduled';
  const shouldShowManageSubscriptionButton =
    Boolean(trimmedManageSubscriptionUrl) &&
    !subscriptionInactive &&
    !showSubscriptionLoading;

  if (!consentGiven) {
    return (
      <>
        {consentModalElement}
        <div className="min-h-screen bg-parallax-glow flex items-center justify-center">
          <div className="text-muted-foreground">Please accept the terms to continue...</div>
        </div>
      </>
    );
  }

  if (missingEoaAddress) {
    return (
      <>
        {consentModalElement}
        <div className="min-h-screen bg-parallax-glow flex items-center justify-center px-4">
          <div className="max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur">
            <h1 className="text-3xl font-semibold text-white mb-4">
              Connect your Pillar wallet
            </h1>
            <p className="text-muted-foreground mb-2">
              We couldn&apos;t detect an EOA address for this session.
            </p>
            <p className="text-muted-foreground">
              Please open PillarX from the Pillar Wallet app on iOS or Android,
              or sign in again to continue.
            </p>
          </div>
        </div>
      </>
    );
  }

  if (showSubscriptionLoading) {
    return (
      <>
        {consentModalElement}
        <div className="min-h-screen bg-parallax-glow flex items-center justify-center px-4">
          <div className="max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur">
            <h1 className="text-3xl font-semibold text-white mb-6">
              Checking your subscription
            </h1>
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
              <div className="h-12 w-12 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              <p className="text-sm">
                Hold tight while we confirm your PillarX Insights access.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (subscriptionInactive) {
    return (
      <>
        {consentModalElement}
        <div className="min-h-screen bg-parallax-glow flex items-center justify-center px-4">
          <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
            <h1 className="text-3xl font-semibold text-white mb-4">
              Unlock PillarX Algorithmic Insights
            </h1>
            <p className="text-muted-foreground mb-6">
              Insights now requires an active subscription. Subscribe via
              Stripe to continue.
            </p>

            <div className="space-y-2 text-sm text-muted-foreground mb-6">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Connected EOA wallet</span>
                <span className="font-mono text-white">
                  {shortenAddress(eoaAddress as string)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Status</span>
                <span className="capitalize">{subscriptionStatusLabel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Next renewal</span>
                <span>{nextRenewalText}</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-8">
              Every subscription starts with a 7-day free trial. You won&apos;t be charged until the trial ends, and you can cancel anytime.
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleSubscribeClick}
                className="w-full rounded-2xl bg-white py-3 font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Subscribe with Stripe
              </button>
              <button
                type="button"
                onClick={handleRefreshSubscription}
                disabled={subscriptionLoading}
                className="w-full rounded-2xl border border-white/20 py-3 font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Refresh status
              </button>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              {isNativeApp
                ? 'We will open your default browser to finish checkout.'
                : 'Checkout opens in a new browser tab.'}
            </p>

            {subscriptionError && (
              <p className="mt-4 text-sm text-red-400">
                {subscriptionError.message}
              </p>
            )}

            {(isAwaitingSubscription || isSubscriptionPolling) && (
              <div className="mt-6 flex flex-col items-center gap-3 text-sm text-muted-foreground">
                <div className="h-10 w-10 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                <span>Waiting to hear about your subscription...</span>
                <span className="text-xs text-muted-foreground">
                  We&apos;ll keep checking every 10 seconds.
                </span>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {consentModalElement}

      <div className="min-h-screen bg-parallax-glow">
        <div className="container mx-auto px-4 py-8">
          {shouldShowManageSubscriptionButton && (
            <div className="flex justify-end mb-4">
              <div className="relative" ref={manageMenuRef}>
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={showManageMenu}
                  onClick={() => setShowManageMenu((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20"
                >
                  <Settings size={16} />
                  Manage subscription
                </button>
                {showManageMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-[#0c0b13]/95 p-2 shadow-lg backdrop-blur">
                    <button
                      type="button"
                      onClick={handleManageSubscription}
                      className="w-full rounded-lg px-3 py-2 text-left text-sm text-white hover:bg-white/10"
                    >
                      Manage subscription
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Header */}
          <Header
            openSignals={openSignals}
            closedSignals={closedSignals}
            floatingPnL={floatingPnL}
            openTotalPnL={openTotalPnL}
            closedTotalPnL={closedTotalPnL}
            overallPnLSparklineData={overallPnLSparklineData}
            openPnLSparklineData={openPnLSparklineData}
            closedPnLSparklineData={closedPnLSparklineData}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            leverage={leverage}
            onLeverageChange={setLeverage}
            onPnLViewClick={setSelectedPnLView}
            applyLeverage={applyLeverage}
            calculateTotalPnL={calculateTotalPnL}
          />

          {/* Main Content */}
          {loading ? (
            <div className="text-center text-muted-foreground py-12">Loading events...</div>
          ) : signals.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              No events yet. Waiting for incoming events...
            </div>
          ) : activeTab === 'feed' ? (
            <div className="space-y-3 max-w-5xl mx-auto">
              <AnimatePresence mode="popLayout">
                {feedEvents.length === 0 ? (
                  <div className="text-center text-muted-foreground py-12">
                    No events yet
                  </div>
                ) : (
                  feedEvents.map((event) => (
                    <FeedEventCard
                      key={event.id}
                      event={event}
                      leverage={leverage}
                      animateOnMount={isInitialLoad}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="space-y-4 max-w-5xl mx-auto">
              <AnimatePresence mode="popLayout">
                {displayedSignals.length === 0 ? (
                  <div className="text-center text-muted-foreground py-12">No events in this category</div>
                ) : (
                  displayedSignals.map((signal) => (
                    <SignalCard
                      key={signal.id}
                      signal={signal}
                      leverage={leverage}
                      sparklineData={sparklineDataMap[signal.id]}
                      logoMap={logoMap}
                      animateOnMount={isInitialLoad}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* PillarX Watermark */}
        <div className="fixed bottom-6 right-6 text-muted-foreground/30 text-xs font-semibold">
          Powered by PillarX
        </div>

        {/* P&L Detail Modal */}
        <PnLDetailModal
          open={selectedPnLView !== null}
          onOpenChange={(open) => !open && setSelectedPnLView(null)}
          view={selectedPnLView}
          signals={signals}
        />
      </div>
    </>
  );
};

export default App;
