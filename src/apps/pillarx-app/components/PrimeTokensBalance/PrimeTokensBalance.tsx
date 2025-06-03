import { useMemo, useState } from 'react';

// services
import { getPrimeAssetsWithBalances } from '../../../../services/pillarXApiWalletPortfolio';

// types
import { PortfolioData } from '../../../../types/api';

// utils
import { PRIME_ASSETS_MOBULA } from '../../utils/constants';

// reducer
import { useAppSelector } from '../../hooks/useReducerHooks';

// images
import PrimeTokensIcon from '../../images/prime-tokens-icon.png';
import PrimeTokensQuestionIcon from '../../images/prime-tokens-question-icon.png';

// components
import BodySmall from '../Typography/BodySmall';

const PrimeTokensBalance = () => {
  const [isHovered, setIsHovered] = useState(false);

  const walletPortfolio = useAppSelector(
    (state) =>
      state.walletPortfolio.walletPortfolio as PortfolioData | undefined
  );

  const isWalletPortfolioLoading = useAppSelector(
    (state) => state.walletPortfolio.isWalletPortfolioLoading as boolean
  );

  const primeAssetsBalance = useMemo(() => {
    if (!walletPortfolio) return undefined;

    const allPrimeAssets = getPrimeAssetsWithBalances(
      walletPortfolio,
      PRIME_ASSETS_MOBULA
    );

    const totalBalance = allPrimeAssets
      .flatMap((assetGroup) => assetGroup.primeAssets)
      .reduce((sum, asset) => sum + asset.usd_balance, 0);

    return totalBalance;
  }, [walletPortfolio]);

  if (isWalletPortfolioLoading) {
    return (
      <div className="flex w-[150px] h-[20px] rounded-[10px] animate-pulse bg-white/[.5]" />
    );
  }

  return (
    <div className="flex items-center gap-[5px] relative">
      <img
        src={PrimeTokensIcon}
        alt="prime-tokens-icon"
        className={`w-4 h-4 ${((primeAssetsBalance && primeAssetsBalance === 0) || !primeAssetsBalance) && 'opacity-50'}`}
      />
      <BodySmall
        className={`${((primeAssetsBalance && primeAssetsBalance === 0) || !primeAssetsBalance) && 'text-white text-opacity-50'}`}
      >
        Prime Tokens Balance: $
        {primeAssetsBalance && primeAssetsBalance > 0
          ? primeAssetsBalance.toFixed(2)
          : '0.00'}
      </BodySmall>

      <div
        className="relative flex items-center w-auto"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={PrimeTokensQuestionIcon}
          alt="prime-tokens-question-icon"
          className="w-3 h-3 cursor-pointer"
        />

        {isHovered && (
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-[85%] desktop:-translate-x-1/2 z-10">
            <div className="bg-lighter_container_grey text-white text-[10px] italic font-normal px-2.5 py-2 rounded shadow-lg border border-white/[.05] max-w-[270px] w-[calc(100vw-2rem)] break-words">
              Prime Tokens are used for trading and paying gas fees across all
              chains. You’ll use them when buying assets and receive them when
              selling.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrimeTokensBalance;
