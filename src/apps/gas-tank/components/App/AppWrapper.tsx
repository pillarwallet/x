import { useMemo, useState, useEffect } from 'react';
import { HomeScreen } from './HomeScreen';
import { useGasTankBalance } from '../../../pulse/hooks/useGasTankBalance';
import Search from '../../../pulse/components/Search/Search';
import {
  useGetWalletPortfolioQuery,
  convertPortfolioAPIResponseToToken,
} from '../../../../services/pillarXApiWalletPortfolio';
import { SelectedToken } from '../../../pulse/types/tokens';
import { MobulaChainNames } from '../../../pulse/utils/constants';
import useTransactionKit from '../../../../hooks/useTransactionKit';

/**
 * AppWrapper component
 * Main wrapper for the Gas Tank app
 * Follows the same pattern as Pulse AppWrapper
 */
export const AppWrapper: React.FC = () => {
  const { walletAddress: accountAddress } = useTransactionKit();
  const {
    totalBalance,
    isLoading: isBalanceLoading,
    refetch: refetchBalance,
  } = useGasTankBalance(accountAddress || null);

  // Smart loading state to prevent flickering on refetch
  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  useEffect(() => {
    if (!isBalanceLoading) {
      setHasInitialLoad(true);
    }
  }, [isBalanceLoading]);

  // Show loading only on initial fetch
  const displayLoading = isBalanceLoading && !hasInitialLoad;

  // State management
  const [searching, setSearching] = useState(false);
  const [isBuy, setIsBuy] = useState(true);
  const [chains, setChains] = useState<MobulaChainNames>(MobulaChainNames.All);
  const [buyToken, setBuyToken] = useState<SelectedToken | null>(null);
  const [sellToken, setSellToken] = useState<SelectedToken | null>(null);
  const [topupToken, setTopupToken] = useState<SelectedToken | null>(null);
  const [isSearchingFromTopup, setIsSearchingFromTopup] = useState(false);
  const [onboardingScreen, setOnboardingScreen] = useState<
    'welcome' | 'topup' | null
  >(null);

  // Fetch wallet portfolio
  const {
    data: walletPortfolioData,
    isLoading: walletPortfolioLoading,
    isFetching: walletPortfolioFetching,
    error: walletPortfolioError,
    refetch: refetchWalletPortfolio,
  } = useGetWalletPortfolioQuery(
    { wallet: accountAddress || '', isPnl: false },
    {
      skip: !accountAddress,
      refetchOnFocus: false,
    }
  );

  // Convert portfolio data to tokens format
  const portfolioTokens = useMemo(() => {
    if (!walletPortfolioData?.result?.data) return [];
    return convertPortfolioAPIResponseToToken(walletPortfolioData.result.data);
  }, [walletPortfolioData]);

  // Smart loading state for portfolio to prevent flickering on refetch
  const [hasPortfolioLoaded, setHasPortfolioLoaded] = useState(false);

  useEffect(() => {
    if (portfolioTokens.length > 0 || (!walletPortfolioLoading && walletPortfolioData)) {
      setHasPortfolioLoaded(true);
    }
  }, [portfolioTokens, walletPortfolioLoading, walletPortfolioData]);

  // Show loading only on initial fetch
  const displayPortfolioLoading = walletPortfolioLoading && !hasPortfolioLoaded;

  // Sync sellToken to topupToken when coming from search in topup mode
  useEffect(() => {
    if (isSearchingFromTopup && sellToken) {
      setTopupToken(sellToken);
      setIsSearchingFromTopup(false);
    }
  }, [isSearchingFromTopup, sellToken]);

  // Render Search if active
  if (searching) {
    return (
      <Search
        setSearching={setSearching}
        isBuy={false}
        setBuyToken={setBuyToken}
        setSellToken={setSellToken}
        chains={chains}
        setChains={setChains}
        walletPortfolioData={walletPortfolioData?.result?.data}
        walletPortfolioLoading={walletPortfolioLoading}
        walletPortfolioFetching={walletPortfolioFetching}
        walletPortfolioError={!!walletPortfolioError}
        refetchWalletPortfolio={refetchWalletPortfolio}
        isSearchingFromTopup={isSearchingFromTopup}
      />
    );
  }

  // Render HomeScreen - core Gas Tank functionality
  return (
    <HomeScreen
      accountAddress={accountAddress || null}
      setSearching={setSearching}
      buyToken={buyToken}
      setBuyToken={setBuyToken}
      sellToken={sellToken}
      setSellToken={setSellToken}
      isBuy={isBuy}
      setIsBuy={setIsBuy}
      refetchWalletPortfolio={refetchWalletPortfolio}
      refetchGasTankBalance={refetchBalance}
      setIsSearchingFromTopup={setIsSearchingFromTopup}
      portfolioTokens={portfolioTokens}
      isPortfolioLoading={displayPortfolioLoading}
      hasPortfolioLoaded={hasPortfolioLoaded}
      topupToken={topupToken}
      setTopupToken={setTopupToken}
      onboardingScreen={onboardingScreen}
      setOnboardingScreen={setOnboardingScreen}
      totalBalance={totalBalance}
      isBalanceLoading={displayLoading}
    />
  );
};
