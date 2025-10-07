import {
  DispensableAsset,
  ExpressIntentResponse,
  UserIntent,
} from '@etherspot/intent-sdk/dist/cjs/sdk/types/user-intent-types';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { TailSpin } from 'react-loader-spinner';
import { useLocation, useNavigate } from 'react-router-dom';
import { Hex, getAddress, isAddress } from 'viem';
import useTransactionKit from '../../../../hooks/useTransactionKit';
import { useGetSearchTokensQuery } from '../../../../services/pillarXApiSearchTokens';
import { chainNameToChainIdTokensData } from '../../../../services/tokensData';
import {
  PairResponse,
  TokenAssetResponse,
  WalletPortfolioMobulaResponse,
} from '../../../../types/api';
import { getLogoForChainId } from '../../../../utils/blockchain';
import RandomAvatar from '../../../pillarx-app/components/RandomAvatar/RandomAvatar';
import ArrowDown from '../../assets/arrow-down.svg';
import WalletIcon from '../../assets/wallet.svg';
import WarningIcon from '../../assets/warning.svg';
import { STABLE_CURRENCIES } from '../../constants/tokens';
import useIntentSdk from '../../hooks/useIntentSdk';
import useModularSdk from '../../hooks/useModularSdk';
import { PayingToken, SelectedToken } from '../../types/tokens';
import { MobulaChainNames, getChainId } from '../../utils/constants';
import { getDesiredAssetValue, getDispensableAssets } from '../../utils/intent';
import BuyButton from './BuyButton';

interface BuyProps {
  setSearching: Dispatch<SetStateAction<boolean>>;
  token: SelectedToken | null;
  walletPortfolioData: WalletPortfolioMobulaResponse | undefined;
  payingTokens: PayingToken[];
  setPreviewBuy: Dispatch<SetStateAction<boolean>>;
  setPayingTokens: Dispatch<SetStateAction<PayingToken[]>>;
  setExpressIntentResponse: Dispatch<
    SetStateAction<ExpressIntentResponse | null>
  >;
  setUsdAmount: Dispatch<SetStateAction<string>>;
  setDispensableAssets: Dispatch<SetStateAction<DispensableAsset[]>>;
  setBuyRefreshCallback?: Dispatch<
    SetStateAction<(() => Promise<void>) | null>
  >;
  setBuyToken?: Dispatch<SetStateAction<SelectedToken | null>>;
  setChains: Dispatch<SetStateAction<MobulaChainNames>>;
}

export default function Buy(props: BuyProps) {
  const {
    setExpressIntentResponse: setExInResp,
    setPayingTokens,
    setPreviewBuy,
    setSearching,
    setUsdAmount: setParentUsdAmount,
    setDispensableAssets: setParentDispensableAssets,
    setBuyRefreshCallback,
    token,
    walletPortfolioData,
    payingTokens,
    setBuyToken,
    setChains,
  } = props;
  const [usdAmount, setUsdAmount] = useState<string>('');
  const [debouncedUsdAmount, setDebouncedUsdAmount] = useState<string>('');
  const { intentSdk } = useIntentSdk();

  // Simple background search for token-atlas
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const tokenToSearch = query.get('asset');
  const blockchain = query.get('blockchain');
  const fromTokenAtlas = query.get('from') === 'token-atlas';
  const [isSearchingToken, setIsSearchingToken] = useState(false);

  const removeQueryParams = () => {
    navigate(location.pathname, { replace: true });
  };

  const { data: searchData, isLoading: isSearchLoading } =
    useGetSearchTokensQuery(
      {
        searchInput: tokenToSearch || '',
        filterBlockchains: getChainId(
          (blockchain as MobulaChainNames) || 'Ethereum'
        ),
      },
      {
        skip: !fromTokenAtlas || !tokenToSearch || !!token,
      }
    );

  const { areModulesInstalled, isInstalling, installModules, isFetching } =
    useModularSdk({
      payingTokens,
    });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [expressIntentResponse, setExpressIntentResponse] =
    useState<ExpressIntentResponse | null>(null);
  const [notEnoughLiquidity, setNoEnoughLiquidity] = useState(false);
  const [insufficientWalletBalance, setInsufficientWalletBalance] =
    useState(false);
  const [belowMinimumAmount, setBelowMinimumAmount] = useState(false);
  const { walletAddress: accountAddress } = useTransactionKit();
  const [inputPlaceholder, setInputPlaceholder] = useState<string>('0.00');
  const [dispensableAssets, setDispensableAssets] = useState<
    DispensableAsset[]
  >([]);
  const [permittedChains, setPermittedChains] = useState<bigint[]>([]);

  // Helper function to calculate stable currency balance
  const getStableCurrencyBalance = () => {
    return (
      walletPortfolioData?.result.data.assets
        ?.filter((asset) =>
          asset.contracts_balances.some((contract) =>
            STABLE_CURRENCIES.some(
              (stable) =>
                stable.address.toLowerCase() ===
                  contract.address.toLowerCase() &&
                stable.chainId === Number(contract.chainId.split(':').at(-1))
            )
          )
        )
        .reduce((total, asset) => {
          const stableContracts = asset.contracts_balances.filter((contract) =>
            STABLE_CURRENCIES.some(
              (stable) =>
                stable.address.toLowerCase() ===
                  contract.address.toLowerCase() &&
                stable.chainId === Number(contract.chainId.split(':').at(-1))
            )
          );
          return (
            total +
            stableContracts.reduce(
              (sum, contract) => sum + asset.price * contract.balance,
              0
            )
          );
        }, 0) || 0
    );
  };

  const handleUsdAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (!input || !Number.isNaN(parseFloat(input))) {
      setInputPlaceholder('0.00');
      setUsdAmount(input);
      setBelowMinimumAmount(false);
      setNoEnoughLiquidity(false);
      setInsufficientWalletBalance(false);
    }
  };

  const handleBuySubmit = async () => {
    if (!areModulesInstalled) {
      await installModules();
    } else {
      setExInResp(expressIntentResponse);
      setPreviewBuy(true);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (usdAmount && !Number.isNaN(parseFloat(usdAmount))) {
        const amount = parseFloat(usdAmount);

        if (amount < 2) {
          setBelowMinimumAmount(true);
          setNoEnoughLiquidity(false);
          setInsufficientWalletBalance(false);
          return;
        }

        setBelowMinimumAmount(false);
        setNoEnoughLiquidity(false);
        setInsufficientWalletBalance(false);
        setDebouncedUsdAmount(usdAmount);
        const [dAssets, pChains, pTokens] = getDispensableAssets(
          usdAmount,
          walletPortfolioData?.result.data
        );
        if (
          pChains.length === 0 ||
          dAssets.length === 0 ||
          pTokens.length === 0
        ) {
          setNoEnoughLiquidity(true);
          return;
        }
        // Always update payingTokens to ensure correct USD amounts are passed to PreviewBuy
        setDispensableAssets(dAssets);
        setPermittedChains(pChains);
        setPayingTokens(pTokens);
        setParentDispensableAssets(dAssets);
        setParentUsdAmount(usdAmount);
      }
    }, 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    usdAmount,
    setPayingTokens,
    walletPortfolioData?.result.data,
    dispensableAssets.length,
  ]);

  const refreshBuyIntent = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (isLoading) {
      return;
    }

    if (
      !debouncedUsdAmount ||
      !token ||
      !accountAddress ||
      !intentSdk ||
      !areModulesInstalled ||
      parseFloat(debouncedUsdAmount) <= 0
    ) {
      return;
    }

    const inputAmount = parseFloat(debouncedUsdAmount);
    const stableCurrencyBalance = getStableCurrencyBalance();

    // Check if input amount higher than stable currency balance
    if (inputAmount > stableCurrencyBalance) {
      setInsufficientWalletBalance(true);
      setNoEnoughLiquidity(false);
      return;
    }

    // Reset stable currency balance error if first check passes
    setInsufficientWalletBalance(false);

    // Check if enough dispensable assets liquidity
    if (dispensableAssets.length === 0 && permittedChains.length === 0) {
      setNoEnoughLiquidity(true);
      return;
    }

    if (notEnoughLiquidity) {
      return;
    }

    setNoEnoughLiquidity(false);
    setInsufficientWalletBalance(false);
    setIsLoading(true);

    try {
      const intent: UserIntent = {
        constraints: {
          deadline: BigInt(Math.floor(Date.now() / 1000)) + BigInt(60),
          desiredAssets: [
            {
              asset: getAddress(token.address) as Hex,
              chainId: BigInt(token.chainId),
              value: getDesiredAssetValue(
                debouncedUsdAmount,
                token.decimals,
                token.usdValue
              ),
            },
          ],
          dispensableAssets,
          slippagePercentage: 3,
        },
        intentHash:
          '0x000000000000000000000000000000000000000000000000000000000000000',
        account: accountAddress as Hex,
      };
      const response = await intentSdk.expressIntent(intent);
      setExpressIntentResponse(response);
    } catch (error) {
      console.error('express intent failed:: ', error);
      setExpressIntentResponse(null);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debouncedUsdAmount,
    token,
    accountAddress,
    intentSdk,
    areModulesInstalled,
    dispensableAssets,
    permittedChains,
    isLoading,
    notEnoughLiquidity,
    walletPortfolioData?.result.data.total_wallet_balance,
  ]);

  // Call refreshBuyIntent when input changes
  useEffect(() => {
    // Only call refreshBuyIntent if we have a token selected
    if (token) {
      refreshBuyIntent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debouncedUsdAmount,
    token,
    accountAddress,
    intentSdk,
    areModulesInstalled,
    dispensableAssets,
    permittedChains,
  ]);

  // Register refresh callback with HomeScreen
  useEffect(() => {
    if (setBuyRefreshCallback) {
      setBuyRefreshCallback(() => refreshBuyIntent);
    }
    return () => {
      if (setBuyRefreshCallback) {
        setBuyRefreshCallback(null);
      }
    };
  }, [setBuyRefreshCallback, refreshBuyIntent]);

  // Start searching when coming from token-atlas
  useEffect(() => {
    if (fromTokenAtlas && tokenToSearch && !token) {
      setIsSearchingToken(true);
    }
  }, [fromTokenAtlas, tokenToSearch, token]);

  // Auto-select token when search results are ready
  useEffect(() => {
    if (
      fromTokenAtlas &&
      tokenToSearch &&
      !token &&
      searchData?.result?.data &&
      !isSearchLoading
    ) {
      const foundToken = searchData.result.data.find(
        (searchToken: TokenAssetResponse | PairResponse | undefined) => {
          if (isAddress(tokenToSearch)) {
            return (
              (
                searchToken as TokenAssetResponse
              )?.contracts?.[0]?.toLowerCase() === tokenToSearch.toLowerCase()
            );
          }
          return (
            (searchToken as TokenAssetResponse)?.symbol?.toLowerCase() ===
            tokenToSearch.toLowerCase()
          );
        }
      );

      if (foundToken && 'name' in foundToken && setBuyToken) {
        const chainIdFromUrl = blockchain
          ? chainNameToChainIdTokensData(blockchain)
          : 1;

        const tokenToSelect = {
          name: foundToken.name,
          symbol: foundToken.symbol,
          logo: foundToken.logo ?? '',
          address: foundToken.contracts?.[0] || '',
          chainId: chainIdFromUrl,
          decimals: Array.isArray(foundToken.decimals)
            ? foundToken.decimals[0] || 18
            : foundToken.decimals || 18,
          usdValue: foundToken.price?.toString() || '0',
          dailyPriceChange: 0,
        };

        setBuyToken(tokenToSelect as SelectedToken);

        // Set the correct chain based on the blockchain parameter
        if (blockchain) {
          setChains(blockchain as MobulaChainNames);
        }

        setIsSearchingToken(false);

        // Clean up URL parameters after successfully selecting token from token-atlas
        removeQueryParams();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fromTokenAtlas,
    tokenToSearch,
    token,
    searchData,
    isSearchLoading,
    setBuyToken,
    blockchain,
    setChains,
  ]);

  return (
    <div className="flex flex-col" data-testid="pulse-buy-component">
      <div
        style={{
          margin: 10,
          backgroundColor: 'black',
          width: 422,
          height: 100,
          borderRadius: 10,
        }}
      >
        <div className="flex p-3">
          <button
            onClick={() => {
              setSearching(true);
            }}
            type="button"
            data-testid="pulse-buy-token-selector"
          >
            {token ? (
              <div
                className="flex items-center justify-center"
                style={{
                  width: 150,
                  height: 36,
                  backgroundColor: '#1E1D24',
                  borderRadius: 10,
                }}
                data-testid={`pulse-buy-token-selected-${token.chainId}-${token.name}`}
              >
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  {token.logo ? (
                    <img
                      src={token.logo}
                      alt="Main"
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 50,
                        marginLeft: 5,
                        marginRight: 5,
                      }}
                    />
                  ) : (
                    <div
                      className="w-full h-full overflow-hidden rounded-full"
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 50,
                        marginLeft: 5,
                        marginRight: 5,
                      }}
                    >
                      <RandomAvatar name={token.name || ''} />
                      <span className="absolute inset-0 flex items-center justify-center text-white text-lg font-bold">
                        {token.name?.slice(0, 2)}
                      </span>
                    </div>
                  )}
                  <img
                    src={getLogoForChainId(token.chainId)}
                    style={{
                      position: 'absolute',
                      bottom: '-2px',
                      right: '-2px',
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                    }}
                    alt="Chain Logo"
                  />
                </div>
                <div
                  className="flex flex-col"
                  style={{ marginLeft: 5, marginTop: 5, height: 36 }}
                >
                  <div className="flex">
                    <p style={{ fontSize: 12, fontWeight: 400 }}>
                      {token.symbol}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 400,
                        marginLeft: 3,
                        color: 'grey',
                      }}
                    >
                      {token.name.length >= 10
                        ? `${token.name.slice(0, 6)}...`
                        : token.name}
                    </p>
                  </div>
                  <div className="flex">
                    <p
                      style={{
                        fontSize: 10,
                        fontWeight: 400,
                        color: 'grey',
                        height: 10,
                      }}
                    >
                      ${token.usdValue}
                    </p>
                  </div>
                </div>
                <img src={ArrowDown} alt="arrow-down" />
              </div>
            ) : (
              <div
                className="flex items-center justify-center"
                style={{
                  width: 150,
                  height: 36,
                  backgroundColor: '#1E1D24',
                  borderRadius: 10,
                }}
              >
                {isSearchingToken ? (
                  <div className="flex items-center">
                    <TailSpin width={16} height={16} />
                    <div className="flex font-normal text-xs">Searching...</div>
                  </div>
                ) : (
                  <>
                    <div
                      className="flex"
                      style={{ fontWeight: 400, fontSize: 12, marginLeft: 5 }}
                    >
                      Select token
                    </div>
                    <div className="flex ml-2">
                      <img src={ArrowDown} alt="arrow-down" />
                    </div>
                  </>
                )}
              </div>
            )}
          </button>
          <div className="flex-1">
            <div
              className="flex"
              style={{ height: 36, fontSize: 36, width: 189 }}
            >
              <input
                className="no-spinner"
                placeholder={inputPlaceholder}
                style={{ width: 185, textAlign: 'right' }}
                onChange={handleUsdAmountChange}
                value={usdAmount}
                type="text"
                disabled={isLoading}
                onFocus={() => setInputPlaceholder('')}
                data-testid="pulse-buy-amount-input"
              />
              <p style={{ lineHeight: 1, color: 'grey' }}>USD</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between" style={{ margin: 10 }}>
          <div className="flex">
            {(() => {
              const showError =
                belowMinimumAmount ||
                insufficientWalletBalance ||
                (notEnoughLiquidity && token) ||
                (!isLoading &&
                  expressIntentResponse &&
                  expressIntentResponse.bids?.length === 0);

              if (!showError) return null;

              let message = '';
              if (belowMinimumAmount) {
                message = 'Min. amount 2 USD';
              } else if (insufficientWalletBalance) {
                message = 'Insufficient wallet balance';
              } else if (notEnoughLiquidity && token) {
                message = 'Not enough liquidity';
              } else {
                message = 'No available routes for this amount';
              }

              return (
                <>
                  <div className="flex items-center justify-center">
                    <img
                      src={WarningIcon}
                      alt="warning"
                      data-testid="pulse-buy-warning-icon"
                    />
                  </div>

                  <div
                    style={{
                      textDecoration: 'underline',
                      color: '#FF366C',
                      fontSize: 12,
                      marginLeft: 5,
                    }}
                    data-testid="pulse-buy-error-message"
                  >
                    {message}
                  </div>
                </>
              );
            })()}
          </div>
          <div className="flex" style={{ float: 'right' }}>
            <img
              src={WalletIcon}
              alt="wallet-icon"
              data-testid="pulse-buy-wallet-icon"
            />
            <div
              style={{
                color: '#8A77FF',
                marginLeft: 5,
                fontSize: 12,
              }}
              data-testid="pulse-buy-wallet-balance"
            >
              ${getStableCurrencyBalance().toFixed(2)}
            </div>
          </div>
        </div>
      </div>
      {/* amounts */}
      <div className="flex">
        {['10', '20', '50', '100', 'MAX'].map((item) => {
          const isMax = item === 'MAX';
          const isDisabled = !token;

          return (
            <div
              key={item}
              className="flex bg-black ml-2.5 w-[75px] h-[30px] rounded-[10px] p-0.5 pb-1 pt-0.5"
            >
              <button
                className={`flex-1 items-center justify-center rounded-[10px] ${
                  isDisabled
                    ? 'bg-[#1E1D24] text-grey cursor-not-allowed'
                    : 'bg-[#121116] text-white cursor-pointer'
                }`}
                onClick={() => {
                  if (!isDisabled) {
                    if (isMax) {
                      setUsdAmount(getStableCurrencyBalance().toFixed(2));
                    } else {
                      setUsdAmount(parseFloat(item).toFixed(2));
                    }
                  }
                }}
                type="button"
                disabled={isDisabled}
                data-testid={`pulse-buy-percentage-button-${item.toLowerCase()}`}
              >
                ${item}
              </button>
            </div>
          );
        })}
      </div>

      {/* buy/sell button */}
      <div
        className="flex"
        style={{
          margin: 10,
          width: 422,
          height: 50,
          borderRadius: 10,
          backgroundColor: 'black',
          padding: '2px 2px 4px 2px',
        }}
      >
        <BuyButton
          areModulesInstalled={areModulesInstalled}
          debouncedUsdAmount={debouncedUsdAmount}
          expressIntentResponse={expressIntentResponse}
          handleBuySubmit={handleBuySubmit}
          isFetching={isFetching}
          isInstalling={isInstalling}
          isLoading={isLoading}
          notEnoughLiquidity={
            belowMinimumAmount ||
            notEnoughLiquidity ||
            insufficientWalletBalance
          }
          payingTokens={payingTokens}
          token={token}
          usdAmount={usdAmount}
        />
      </div>
    </div>
  );
}
