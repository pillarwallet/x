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

type SortKey = 'symbol' | 'price' | 'balance' | 'pnl';
type SortOrder = 'asc' | 'desc';

export interface PortfolioTokenListProps {
  walletPortfolioData: PortfolioData | undefined;
  handleTokenSelect: (item: Token) => void;
  isLoading?: boolean;
  isError?: boolean;
  searchText?: string;
  sortKey?: SortKey | null;
  sortOrder?: SortOrder;
}

const PortfolioTokenList = (props: PortfolioTokenListProps) => {
  const {
    walletPortfolioData,
    handleTokenSelect,
    isLoading,
    isError,
    searchText,
    sortKey,
    sortOrder = 'desc',
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
      .filter((token) => !isStableCurrency(token));

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

    // Apply sorting
    if (sortKey) {
      tokens.sort((a: Token, b: Token) => {
        let valueA: number | string;
        let valueB: number | string;

        switch (sortKey) {
          case 'symbol':
            valueA = a.symbol.toLowerCase();
            valueB = b.symbol.toLowerCase();
            break;
          case 'price':
            valueA = a.price || 0;
            valueB = b.price || 0;
            break;
          case 'balance':
            valueA = (a.price || 0) * (a.balance || 0);
            valueB = (b.price || 0) * (b.balance || 0);
            break;
          case 'pnl':
            valueA = a.price_change_24h || 0;
            valueB = b.price_change_24h || 0;
            break;
          default:
            return 0;
        }

        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return sortOrder === 'asc'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        } else {
          const numA = Number(valueA);
          const numB = Number(valueB);
          return sortOrder === 'asc' ? numA - numB : numB - numA;
        }
      });
    } else {
      // Default sort by highest USD balance
      tokens.sort((a: Token, b: Token) => {
        const balanceUSDA = (a.price || 0) * (a.balance || 0);
        const balanceUSDB = (b.price || 0) * (b.balance || 0);
        return balanceUSDB - balanceUSDA;
      });
    }

    return tokens;
  };

  const portfolioTokens = getFilteredPortfolioTokens();

  // Loading state
  if (isLoading) {
    return (
      <tr>
        <td colSpan={3} className="py-12 text-center">
          <div className="flex flex-col items-center justify-center">
            <TailSpin color="#FFFFFF" height={40} width={40} />
            <p className="text-gray-500 mt-2.5">Loading your portfolio...</p>
          </div>
        </td>
      </tr>
    );
  }

  // Error state
  if (isError) {
    return (
      <tr>
        <td colSpan={3} className="py-12 text-center">
          <div className="flex flex-col items-center justify-center">
            <p className="text-red-500 mb-2.5">⚠️ Failed to load portfolio</p>
            <p className="text-gray-500 text-xs text-center">
              Unable to fetch your wallet data. Please try again later.
            </p>
          </div>
        </td>
      </tr>
    );
  }

  // No data state
  if (!walletPortfolioData) {
    return (
      <tr>
        <td colSpan={3} className="py-12 text-center">
          <div className="flex flex-col items-center justify-center">
            <p className="text-gray-500 mb-2.5">🔍 No portfolio data</p>
            <p className="text-gray-500 text-xs text-center">
              Connect your wallet to see your holdings
            </p>
          </div>
        </td>
      </tr>
    );
  }

  // Empty portfolio state (either no tokens or no search results)
  if (portfolioTokens.length === 0) {
    return (
      <tr>
        <td colSpan={3} className="py-12 text-center">
          <div className="flex flex-col items-center justify-center">
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
        </td>
      </tr>
    );
  }

  return (
    <>
      {portfolioTokens.map((token) => {
        const balanceUSD =
          token.price && token.balance ? token.price * token.balance : 0;

        return (
          <tr
            key={`${token.blockchain}-${token.contract}`}
            className="hover:bg-gray-100 hover:bg-opacity-10 cursor-pointer transition-colors"
            onClick={() => {
              handleTokenSelect(token);
            }}
          >
            <td className="py-3 px-2">
              <div className="flex items-center">
                <div className="relative inline-block w-10 h-10 flex-shrink-0 mr-3">
                  {token.logo ? (
                    <img
                      src={token.logo}
                      className="w-10 h-10 rounded-full object-cover"
                      alt="token logo"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-600 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {token.symbol?.slice(0, 2) || token.name?.slice(0, 2)}
                      </span>
                    </div>
                  )}
                  <img
                    src={getLogoForChainId(
                      chainNameToChainIdTokensData(token.blockchain)
                    )}
                    className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#1E1D24] object-cover"
                    alt="chain logo"
                  />
                </div>
                <div className="flex flex-col">
                  <p className="text-white font-medium text-base">
                    {token.symbol}
                  </p>
                  <p className="text-gray-400 text-sm">
                    $
                    {token.price
                      ? formatExponentialSmallNumber(
                          limitDigitsNumber(token.price)
                        )
                      : '0.00'}
                  </p>
                </div>
              </div>
            </td>

            <td className="py-3 px-2 text-center">
              <div className="flex flex-col items-center">
                <p className="text-white font-medium text-base">
                  ${Math.floor(balanceUSD * 100) / 100}
                </p>
                <p className="text-gray-400 text-sm">
                  {Math.floor((token.balance || 0) * 100000) / 100000}
                </p>
              </div>
            </td>

            <td className="py-3 px-2 text-right">
              <div className="flex flex-col items-end">
                <p className={`font-medium text-base ${
                  (token.price_change_24h || 0) >= 0 ? 'text-[#4ADE80]' : 'text-[#F87171]'
                }`}>
                  ${(Math.abs(balanceUSD * (token.price_change_24h || 0) / 100)).toFixed(2)}
                </p>
                <p className={`text-sm ${
                  (token.price_change_24h || 0) >= 0 ? 'text-[#4ADE80]' : 'text-[#F87171]'
                }`}>
                  {(token.price_change_24h || 0).toFixed(2)}%
                </p>
              </div>
            </td>
          </tr>
        );
      })}
    </>
  );
};

export default PortfolioTokenList;
