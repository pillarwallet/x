import { TailSpin } from 'react-loader-spinner';

// types
import { PortfolioData } from '../../../../types/api';

// utils
import { convertPortfolioAPIResponseToToken } from '../../../../services/pillarXApiWalletPortfolio';
import {
  chainNameToChainIdTokensData,
  Token,
} from '../../../../services/tokensData';
import { getLogoForChainId } from '../../../../utils/blockchain';
import {
  formatExponentialSmallNumber,
  limitDigitsNumber,
} from '../../../../utils/number';

// constants
import { STABLE_CURRENCIES } from '../../constants/tokens';

// components
import RandomAvatar from '../../../pillarx-app/components/RandomAvatar/RandomAvatar';

export interface PortfolioTokenListProps {
  walletPortfolioData: PortfolioData | undefined;
  handleTokenSelect: (item: Token) => void;
  isLoading?: boolean;
  isError?: boolean;
  searchText?: string;
}

const PortfolioTokenList = (props: PortfolioTokenListProps) => {
  const {
    walletPortfolioData,
    handleTokenSelect,
    isLoading,
    isError,
    searchText,
  } = props;

  const isStableCurrency = (token: Token) => {
    const chainId = chainNameToChainIdTokensData(token.blockchain);
    return STABLE_CURRENCIES.some(
      (stable) =>
        stable.chainId === chainId &&
        stable.address.toLowerCase() === token.contract.toLowerCase()
    );
  };

  // Filter out stable currencies and apply search filter
  const getFilteredPortfolioTokens = () => {
    if (!walletPortfolioData?.assets) return [];

    let tokens = convertPortfolioAPIResponseToToken(walletPortfolioData)
      .filter((token) => !isStableCurrency(token))
      .sort((a: Token, b: Token) => {
        const balanceUSDA = (a.price || 0) * (a.balance || 0);
        const balanceUSDB = (b.price || 0) * (b.balance || 0);
        return balanceUSDB - balanceUSDA; // Sort by highest USD value first
      });

    // Apply search filter if searchText is provided
    if (searchText && searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      tokens = tokens.filter(
        (token: Token) =>
          token.symbol.toLowerCase().includes(searchLower) ||
          token.name.toLowerCase().includes(searchLower) ||
          token.contract.toLowerCase().includes(searchLower)
      );
    }

    return tokens;
  };

  const portfolioTokens = getFilteredPortfolioTokens();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center m-[50px]">
        <TailSpin color="#FFFFFF" height={40} width={40} />
        <p className="text-gray-500 mt-2.5">Loading your portfolio...</p>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center m-[50px]">
        <p className="text-red-500 mb-2.5">⚠️ Failed to load portfolio</p>
        <p className="text-gray-500 text-xs text-center">
          Unable to fetch your wallet data. Please try again later.
        </p>
      </div>
    );
  }

  // No data state
  if (!walletPortfolioData) {
    return (
      <div className="flex flex-col items-center justify-center m-[50px]">
        <p className="text-gray-500 mb-2.5">🔍 No portfolio data</p>
        <p className="text-gray-500 text-xs text-center">
          Connect your wallet to see your holdings
        </p>
      </div>
    );
  }

  // Empty portfolio state (either no tokens or no search results)
  if (portfolioTokens.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center m-[50px]">
        <p className="text-gray-500 mb-2.5">
          {searchText && searchText.trim()
            ? '🔍 No matching tokens found'
            : '💰 Portfolio is empty'}
        </p>
        <p className="text-gray-500 text-xs text-center">
          {searchText && searchText.trim()
            ? `No tokens match '${searchText}' in your portfolio`
            : // eslint-disable-next-line quotes
              "You don't have any tokens in your portfolio yet"}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Column Headers */}
      <div className="flex w-full pt-3 pr-3 pb-0 pl-3">
        {/* Token/Price Column Header */}
        <div className="flex items-center w-[250px]">
          <p className="text-[13px] font-normal text-white opacity-50 tracking-[-0.26px]">
            Token/Price
          </p>
        </div>

        {/* Balance Column Header */}
        <div className="flex items-center ml-auto mr-2.5">
          <p className="text-[13px] font-normal text-white opacity-50 tracking-[-0.26px]">
            Balance
          </p>
        </div>
      </div>

      {portfolioTokens.map((token) => {
        const balanceUSD =
          token.price && token.balance ? token.price * token.balance : 0;

        return (
          <button
            key={`${token.blockchain}-${token.contract}`}
            className="flex w-full hover:bg-[#25232D] rounded-[10px] transition-colors h-[60px] p-3"
            onClick={() => {
              handleTokenSelect(token);
            }}
            type="button"
          >
            {/* Token/Price Column */}
            <div className="flex items-center w-[250px]">
              <div className="relative inline-block">
                {token.logo ? (
                  <img
                    src={token.logo}
                    className="w-8 h-8 rounded-full"
                    alt="token logo"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <RandomAvatar name={token.name} />
                    <span className="absolute inset-0 flex items-center justify-center text-white text-lg font-bold">
                      {token.name?.slice(0, 2)}
                    </span>
                  </div>
                )}
                <img
                  src={getLogoForChainId(
                    chainNameToChainIdTokensData(token.blockchain)
                  )}
                  className="absolute -bottom-px -right-px w-3.5 h-3.5 rounded-full border-[0.88px] border-[#25232D]"
                  alt="chain logo"
                />
              </div>
              <div className="flex flex-col ml-3 min-w-0">
                <div className="flex items-center min-w-0">
                  <p className="text-[13px] font-normal text-white tracking-[-0.26px] whitespace-nowrap">
                    {token.symbol}
                  </p>
                  <p
                    className="text-[13px] font-normal tracking-[-0.26px] ml-2 text-white opacity-50 whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px]"
                    title={token.name}
                  >
                    {token.name}
                  </p>
                </div>
                <p className="text-xs font-normal tracking-[-0.24px] text-white opacity-50 text-left">
                  $
                  {token.price
                    ? formatExponentialSmallNumber(
                        limitDigitsNumber(token.price)
                      )
                    : '0.00'}
                </p>
              </div>
            </div>

            {/* Balance Column */}
            <div className="flex flex-col ml-auto mr-2.5 items-end">
              <p className="text-[13px] font-normal tracking-[-0.26px] text-white text-right">
                ${formatExponentialSmallNumber(limitDigitsNumber(balanceUSD))}
              </p>
              <p className="text-xs font-normal tracking-[-0.24px] text-white text-right">
                {formatExponentialSmallNumber(
                  limitDigitsNumber(token.balance || 0)
                )}
              </p>
            </div>
          </button>
        );
      })}
    </>
  );
};

export default PortfolioTokenList;
