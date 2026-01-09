import { Dispatch, SetStateAction } from 'react';
import { useGasTankHistory } from '../../hooks/useGasTankHistory';
import { GasTankBalanceCard } from '../Balance/GasTankBalanceCard';
import { GasTankHistoryCard } from '../History/GasTankHistoryCard';
import { SkeletonBalanceCard, SkeletonHistoryCard } from '../History/GasTankSkeleton';
import TopUpScreen from '../../../pulse/components/Onboarding/TopUpScreen';
import { SelectedToken } from '../../../pulse/types/tokens';
import { PortfolioToken } from '../../../../services/tokensData';
import PillarXLogo from '../../../../assets/images/pillarX_full_white.png';

interface HomeScreenProps {
  accountAddress: string | null;
  setSearching: Dispatch<SetStateAction<boolean>>;
  buyToken: SelectedToken | null;
  setBuyToken: Dispatch<SetStateAction<SelectedToken | null>>;
  sellToken: SelectedToken | null;
  setSellToken: Dispatch<SetStateAction<SelectedToken | null>>;
  isBuy: boolean;
  setIsBuy: Dispatch<SetStateAction<boolean>>;
  refetchWalletPortfolio: () => void;
  refetchGasTankBalance: () => void;
  setIsSearchingFromTopup: Dispatch<SetStateAction<boolean>>;
  portfolioTokens: PortfolioToken[];
  isPortfolioLoading: boolean;
  topupToken: SelectedToken | null;
  setTopupToken: Dispatch<SetStateAction<SelectedToken | null>>;
  onboardingScreen: 'welcome' | 'topup' | null;
  setOnboardingScreen: Dispatch<SetStateAction<'welcome' | 'topup' | null>>;
  totalBalance: number;
  isBalanceLoading: boolean;
  hasPortfolioLoaded: boolean;
}

/**
 * Main gas tank home screen
 * Displays balance card and transaction history card
 * Manages top-up flow
 */
export const HomeScreen: React.FC<HomeScreenProps> = ({
  accountAddress,
  setSearching,
  buyToken,
  setBuyToken,
  sellToken,
  setSellToken,
  isBuy,
  setIsBuy,
  refetchWalletPortfolio,
  refetchGasTankBalance,
  setIsSearchingFromTopup,
  portfolioTokens,
  isPortfolioLoading,
  topupToken,
  setTopupToken,
  onboardingScreen,
  setOnboardingScreen,
  totalBalance,
  isBalanceLoading,
  hasPortfolioLoaded,
}) => {


  
  const {
    transactions,
    isLoading: isHistoryLoading,
    error: historyError,
    refetch: refetchHistory,
  } = useGasTankHistory(accountAddress);

  // Show TopUpScreen if in top-up mode
  if (onboardingScreen === 'topup') {
    return (
      <div className="min-h-screen bg-[#121116] flex items-center justify-center p-4">
        <TopUpScreen
          onBack={() => {
            setOnboardingScreen(null);
            refetchGasTankBalance();
          }}
          initialBalance={totalBalance}
          setSearching={() => {
            setIsSearchingFromTopup(true);
            setSearching(true);
          }}
          selectedToken={topupToken}
          portfolioTokens={portfolioTokens}
          setOnboardingScreen={setOnboardingScreen}
          markOnboardingComplete={() => {}}
          isPortfolioLoading={isPortfolioLoading}
          hasPortfolioData={hasPortfolioLoaded}
          showCloseButton={true}
        />
      </div>
    );
  }


// ... existing code ...

  // Main Gas Tank display
  return (
    <div className="min-h-screen bg-[#121116] overflow-y-auto font-['Poppins']">

      {/* PillarX Logo */}
      <div className="flex justify-center mt-[42px] mb-[40px]">
        <img src={PillarXLogo} alt="PillarX" className="h-[24px]" />
      </div>

      {/* Container with specific gradient background */}
      <div className="relative w-full max-w-[1320px] mx-auto min-h-[380px] bg-[#1E1D24] rounded-[24px]">
        {/* Main content - Flex column on mobile, Row on larger screens */}
        <div className="flex flex-row justify-center gap-[36px] p-[36px]">
          {/* Left card - Balance */}
          {isBalanceLoading ? (
            <SkeletonBalanceCard />
          ) : (
            <GasTankBalanceCard
              balance={totalBalance}
              isLoading={isBalanceLoading}
              transactions={transactions}
              onTopUpClick={() => setOnboardingScreen('topup')}
            />
          )}

          {/* Right card - History */}
          {isHistoryLoading && transactions.length === 0 ? (
            <SkeletonHistoryCard />
          ) : (
            <GasTankHistoryCard
              transactions={transactions}
              isLoading={isHistoryLoading}
              error={historyError}
              onRetry={refetchHistory}
            />
          )}
        </div>
      </div>
    </div>
  );
};
