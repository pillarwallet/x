import {
  IChartingLibraryWidget,
  LanguageCode,
  ResolutionString,
  Timezone,
  widget,
} from 'charting_library';
import { useEffect, useMemo, useRef, useState } from 'react';

// hooks
import { useAppSelector } from '../../hooks/useReducerHooks';

// types
import { TokenAtlasInfoData } from '../../../../types/api';
import { SelectedTokenType } from '../../types/types';

// utils
import { isNativeToken } from '../../../the-exchange/utils/wrappedTokens';

// components
import SkeletonLoader from '../../../../components/SkeletonLoader';
import { MobulaDatafeed } from './MobulaDatafeed';

type TradingViewChartProps = {
  onPriceUpdate?: (price: number) => void;
};

const TradingViewChart = ({ onPriceUpdate }: TradingViewChartProps = {}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<IChartingLibraryWidget | null>(null);
  const onPriceUpdateRef = useRef(onPriceUpdate);
  const [isLoading, setIsLoading] = useState(true);
  const [containerReady, setContainerReady] = useState(false);

  // Keep the callback ref updated without causing re-renders
  useEffect(() => {
    onPriceUpdateRef.current = onPriceUpdate;
  }, [onPriceUpdate]);

  const tokenDataInfo = useAppSelector(
    (state) => state.tokenAtlas.tokenDataInfo as TokenAtlasInfoData | undefined
  );
  const selectedToken = useAppSelector(
    (state) => state.tokenAtlas.selectedToken as SelectedTokenType | undefined
  );

  // Set container ready when ref is available
  useEffect(() => {
    if (chartContainerRef.current) {
      setContainerReady(true);
    }
  }, []);

  const contracts = useMemo(
    () => tokenDataInfo?.contracts || [],
    [tokenDataInfo?.contracts]
  );

  const chartSymbol = tokenDataInfo?.symbol || tokenDataInfo?.name || '';
  const chartName = tokenDataInfo?.name || 'Unknown Token';

  const address = selectedToken?.address || contracts[0]?.address;

  const numericChainId: number | undefined = useMemo(() => {
    if (selectedToken?.chainId) return selectedToken.chainId;
    const blockchainId =
      String(selectedToken?.chainId) ?? contracts[0]?.blockchainId;
    if (!blockchainId) return undefined;
    const parsed = parseInt(blockchainId, 10);
    return Number.isFinite(parsed) ? parsed : undefined;
  }, [contracts, selectedToken?.chainId]);

  // Mobula API v2 commonly accepts EVM chain IDs in `evm:<id>` format.
  const mobulaChainId = numericChainId ? `evm:${numericChainId}` : undefined;
  const canLoadChart = Boolean(address && mobulaChainId);

  // Get user's timezone from their device
  // Falls back to 'Etc/UTC' if timezone cannot be detected
  const userTimezone = useMemo((): Timezone => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return (timezone || 'Etc/UTC') as Timezone;
    } catch (error) {
      console.warn('Failed to detect user timezone, defaulting to UTC', error);
      return 'Etc/UTC' as Timezone;
    }
  }, []);

  // No need to fetch initial data - TradingView will request it via getBars
  // The datafeed will handle all data fetching dynamically based on resolution
  useEffect(() => {
    const container = chartContainerRef.current;
    if (!containerReady || !container) return () => {};
    if (!address || !mobulaChainId) return () => {};

    // Ensure we have valid symbol and name before creating the datafeed
    // chartSymbol can be empty if tokenDataInfo hasn't loaded yet
    if (!chartSymbol || !chartName) {
      return () => {};
    }

    setIsLoading(true);

    const datafeed = new MobulaDatafeed(chartSymbol, chartName, {
      address: isNativeToken(address || '')
        ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
        : address || undefined,
      chainId: mobulaChainId || undefined,
      apiKey: import.meta.env.VITE_MOBULA_API_KEY,
      timezone: userTimezone,
      onPriceUpdate: (price: number) => {
        // Use ref to call the latest callback without recreating the datafeed
        onPriceUpdateRef.current?.(price);
      },
    });

    // eslint-disable-next-line new-cap
    const chartWidget = new widget({
      symbol: chartSymbol,
      datafeed,
      interval: '1' as ResolutionString, // Default to 1 minute, user can change via UI
      container,
      library_path: '/charting_library/',
      locale: 'en' as LanguageCode,
      timezone: userTimezone,
      // Minimal disabled features - enable most TradingView features
      disabled_features: [
        'use_localstorage_for_settings', // Don't persist settings to localStorage
        'volume_force_overlay', // Let user choose volume display
      ],
      enabled_features: [
        'side_toolbar_in_fullscreen_mode',
        'header_widget',
        'header_symbol_search',
        'header_resolutions', // Enable resolution selector
        'header_chart_type',
        'header_settings',
        'header_indicators',
        'header_compare',
        'header_undo_redo',
        'header_screenshot',
        'header_fullscreen_button',
        'timeframes_toolbar', // Enable timeframes toolbar
        'edit_buttons_in_legend',
        'context_menus',
        'control_bar',
        'chart_crosshair_menu',
      ],
      // Disable charts storage to avoid JSON parsing errors
      charts_storage_url: undefined,
      charts_storage_api_version: undefined,
      client_id: 'token-atlas',
      user_id: 'public_user_id',
      fullscreen: false,
      autosize: true,
      studies_overrides: {},
      theme: 'dark',
      custom_css_url: '',
      loading_screen: { backgroundColor: '#222222' },
      overrides: {
        'paneProperties.background': '#222222',
        'paneProperties.backgroundType': 'solid',
        'mainSeriesProperties.candleStyle.upColor': '#6CFF00',
        'mainSeriesProperties.candleStyle.downColor': '#FF005C',
        'mainSeriesProperties.candleStyle.borderUpColor': '#6CFF00',
        'mainSeriesProperties.candleStyle.borderDownColor': '#FF005C',
        'mainSeriesProperties.candleStyle.wickUpColor': '#6CFF00',
        'mainSeriesProperties.candleStyle.wickDownColor': '#FF005C',
        'scalesProperties.textColor': '#DDDDDD',
        'scalesProperties.lineColor': '#444444',
      },
    });

    widgetRef.current = chartWidget;

    chartWidget.onChartReady(() => {
      setIsLoading(false);
    });

    return () => {
      // Cleanup datafeed WebSocket connections
      if (datafeed && typeof datafeed.destroy === 'function') {
        datafeed.destroy();
      }

      if (widgetRef.current) {
        widgetRef.current.remove();
        widgetRef.current = null;
      }
    };
  }, [
    chartSymbol,
    chartName,
    address,
    mobulaChainId,
    containerReady,
    userTimezone,
  ]);

  const showLoadingOverlay = canLoadChart && isLoading;

  return (
    <div
      id="token-atlas-tradingview-chart"
      className="relative w-[99%] mb-20 h-full max-h-[400px] mobile:mb-0"
      data-testid="tradingview-chart"
    >
      {showLoadingOverlay && (
        <div className="absolute inset-0 z-10">
          <SkeletonLoader $height="400px" $radius="6px" />
        </div>
      )}
      <div
        ref={chartContainerRef}
        style={{
          width: '100%',
          height: '400px',
          minHeight: '400px',
          opacity: showLoadingOverlay ? 0 : 1,
          transition: 'opacity 120ms ease',
        }}
      />
    </div>
  );
};

export default TradingViewChart;
