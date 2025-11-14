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
import {
  chainNameToChainIdTokensData,
  PortfolioToken,
} from '../../../../services/tokensData';
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
import useIntentSdk from '../../hooks/useIntentSdk';
import useModularSdk from '../../hooks/useModularSdk';
import { PayingToken, SelectedToken } from '../../types/tokens';
import { MobulaChainNames, getChainId } from '../../utils/constants';
import { getDesiredAssetValue, getDispensableAssets } from '../../utils/intent';
import BuyButton from './BuyButton';
import {
  ChainNames,
  isNativeToken,
  NativeSymbols,
} from '../../utils/blockchain';

interface BuyProps {
  setSearching: Dispatch<SetStateAction<boolean>>;
  token: SelectedToken | null;
  walletPortfolioData: WalletPortfolioMobulaResponse | undefined;
  payingTokens: PayingToken[];
  portfolioTokens: PortfolioToken[];
  maxStableCoinBalance: {
    chainId: number;
    balance: number;
  };
  customBuyAmounts: string[];
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
    portfolioTokens,
    walletPortfolioData,
    payingTokens,
    setBuyToken,
    setChains,
    maxStableCoinBalance,
    customBuyAmounts,
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
  const [minimumStableBalance, setMinimumStableBalance] = useState(false);
  const [minGasFee, setMinGasFee] = useState(false);
  const [belowMinimumAmount, setBelowMinimumAmount] = useState(false);
  const { walletAddress: accountAddress } = useTransactionKit();
  const [inputPlaceholder, setInputPlaceholder] = useState<string>('0.00');
  const [dispensableAssets, setDispensableAssets] = useState<
    DispensableAsset[]
  >([]);
  const [permittedChains, setPermittedChains] = useState<bigint[]>([]);
  const [sumOfStableBalance, setSumOfStableBalance] = useState<number>(0);

  useEffect(() => {
    if (!portfolioTokens || portfolioTokens.length === 0) {
      console.warn('No wallet portfolio data');
      return;
    }

    setSumOfStableBalance(maxStableCoinBalance.balance);
    if (maxStableCoinBalance.balance < 2) {
      setMinimumStableBalance(true);
      return;
    }
    setMinimumStableBalance(false);

    const nativeToken = portfolioTokens.find(
      (t) =>
        Number(getChainId(t.blockchain as MobulaChainNames)) ===
          maxStableCoinBalance.chainId && isNativeToken(t.contract)
    );

    if (!nativeToken) {
      setMinGasFee(true);
      return;
    }
    const nativeTokenUSDBalance =
      (nativeToken.balance ?? 0) * (nativeToken.price ?? 0);

    if (!nativeTokenUSDBalance || nativeTokenUSDBalance < 1) {
      setMinGasFee(true);
      return;
    }
    setMinGasFee(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portfolioTokens, maxStableCoinBalance]);

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
    console.log('=== BUY BUTTON CLICKED ===');
    console.log('areModulesInstalled:', areModulesInstalled);
    console.log('expressIntentResponse:', expressIntentResponse);
    console.log('token:', token);
    console.log('debouncedUsdAmount:', debouncedUsdAmount);
    console.log('payingTokens:', payingTokens);

    if (!areModulesInstalled) {
      console.log('Modules not installed, installing...');
      await installModules();
      console.log('Modules installation complete');
    } else {
      console.log('Modules already installed, navigating to preview...');
      console.log('Setting expressIntentResponse to:', expressIntentResponse);
      setExInResp(expressIntentResponse);
      console.log('Setting previewBuy to true');
      setPreviewBuy(true);
      console.log('=== PREVIEW BUY SHOULD NOW BE VISIBLE ===');
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
        console.log(
          '=== BUY: Calculating dispensable assets for usdAmount:',
          usdAmount
        );
        const [dAssets, pChains, pTokens] = getDispensableAssets(
          usdAmount,
          walletPortfolioData?.result.data,
          maxStableCoinBalance.chainId
        );
        console.log('=== BUY: Dispensable assets calculated ===');
        console.log('dispensableAssets:', dAssets);
        console.log('permittedChains:', pChains);
        console.log('payingTokens:', pTokens);

        if (
          pChains.length === 0 ||
          dAssets.length === 0 ||
          pTokens.length === 0
        ) {
          console.log('BUY: Not enough liquidity - no assets/chains/tokens');
          setNoEnoughLiquidity(true);
          return;
        }

        // Always update payingTokens to ensure correct USD amounts are passed to PreviewBuy
        console.log('=== BUY: Updating state with calculated values ===');
        setDispensableAssets(dAssets);
        setPermittedChains(pChains);
        setPayingTokens(pTokens);
        setParentDispensableAssets(dAssets);
        setParentUsdAmount(usdAmount);
        console.log('=== BUY: State updated ===');
      }
    }, 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sumOfStableBalance,
    usdAmount,
    setPayingTokens,
    walletPortfolioData?.result.data,
    dispensableAssets.length,
  ]);

  const refreshBuyIntent = useCallback(async () => {
    console.log('=== BUY: refreshBuyIntent called ===');
    // console.log('isLoading:', isLoading);
    // console.log('debouncedUsdAmount:', debouncedUsdAmount);
    // console.log('token:', token);
    // console.log('accountAddress:', accountAddress);
    console.log('intentSdk:', intentSdk);
    // console.log('areModulesInstalled:', areModulesInstalled);

    // Prevent multiple simultaneous calls
    if (isLoading) {
      console.log('BUY: Refresh blocked - already loading');
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
      console.log('BUY: Refresh blocked - missing required data');
      return;
    }

    const inputAmount = parseFloat(debouncedUsdAmount);
    console.log('inputAmount:', inputAmount);
    console.log('maxStableCoinBalance:', maxStableCoinBalance);

    // Check if input amount higher than stable currency balance
    if (inputAmount > maxStableCoinBalance.balance) {
      console.log('BUY: Insufficient wallet balance');
      setInsufficientWalletBalance(true);
      setNoEnoughLiquidity(false);
      return;
    }

    // Reset stable currency balance error if first check passes
    setInsufficientWalletBalance(false);

    console.log('dispensableAssets:', dispensableAssets);
    console.log('permittedChains:', permittedChains);
    console.log('payingTokens:', payingTokens);

    // Check if enough dispensable assets liquidity
    if (dispensableAssets.length === 0 && permittedChains.length === 0) {
      console.log('BUY: Not enough liquidity');
      setNoEnoughLiquidity(true);
      return;
    }

    if (notEnoughLiquidity) {
      console.log('BUY: Blocked by notEnoughLiquidity flag');
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
      console.log('=== BUY: Calling intentSdk.expressIntent ===');
      console.log(
        'Intent:',
        JSON.stringify(
          intent,
          (key, value) =>
            typeof value === 'bigint' ? value.toString() : value,
          2
        )
      );
      const response = await intentSdk.expressIntent(intent);
      console.log('=== BUY: expressIntent response received ===');
      console.log('Response bids count:', response?.bids?.length || 0);
      console.log('Response:', response);
      setExpressIntentResponse(response);
    } catch (error) {
      console.error('=== BUY: express intent failed ===', error);
      setExpressIntentResponse(null);
    } finally {
      setIsLoading(false);
      console.log('=== BUY: refreshBuyIntent completed ===');
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
    <div
      className="flex flex-col w-full desktop:min-w-[442px]"
      data-testid="pulse-buy-component"
    >
      <div className="m-2.5 bg-[#121116] min-h-[100px] rounded-lg">
        <div className="flex p-3 justify-between">
          <button
            onClick={() => {
              setSearching(true);
            }}
            type="button"
            data-testid="pulse-buy-token-selector"
          >
            {token ? (
              <div
                className="flex items-center mobile:w-32 xs:w-32 desktop:w-36 h-9 bg-[#1E1D24] rounded-md"
                data-testid={`pulse-buy-token-selected-${token.chainId}-${token.name}`}
              >
                <div className="relative inline-block">
                  {token.logo ? (
                    <img
                      src={token.logo}
                      alt="Main"
                      className="w-6 h-6 ml-1 mr-1 rounded-full"
                    />
                  ) : (
                    <div className="w-6 h-6 ml-1 mr-1 overflow-hidden rounded-full">
                      <RandomAvatar name={token.name || ''} />
                      <span className="absolute inset-0 flex items-center justify-center text-white text-lg">
                        {token.name?.slice(0, 2)}
                      </span>
                    </div>
                  )}
                  <img
                    src={getLogoForChainId(token.chainId)}
                    className="w-2.5 h-2.5 absolute bottom-[-2px] right-[2px] rounded-full"
                    alt="Chain Logo"
                  />
                </div>
                <div className="flex flex-col mt-2.5 h-10 w-[91px]">
                  <div className="flex">
                    <p className="font-normal desktop:text-sm mobile:text-xs xs:text-xs">
                      {token.symbol}
                    </p>
                    {token.symbol.length + token.name.length <= 13 && (
                      <p className="ml-1 opacity-30 font-normal desktop:text-sm mobile:text-xs xs:text-xs text-white">
                        {token.name}
                      </p>
                    )}
                  </div>
                  <div className="flex">
                    <p className="opacity-50 font-normal text-white h-[10px] text-[10px]">
                      ${token.usdValue}
                    </p>
                  </div>
                </div>
                <div className="flex m-1.5">
                  <img src={ArrowDown} className="w-2 h-1" alt="arrow-down" />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center max-w-[150px] w-32 h-9 bg-[#1E1D24] rounded-[10px]">
                {isSearchingToken ? (
                  <div className="flex items-center">
                    <TailSpin width={16} height={16} />
                    <div className="flex font-normal desktop:text-sm tablet:text-sm mobile:text-xs xs:text-xs">
                      Searching...
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex ml-1.5 font-normal desktop:text-sm tablet:text-sm mobile:text-xs xs:text-xs justify-items-end">
                      Select token
                    </div>
                    <div className="flex ml-1.5">
                      <img
                        src={ArrowDown}
                        className="w-2 h-1"
                        alt="arrow-down"
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </button>
          <div className="flex max-w-60 desktop:w-60 tablet:w-60 mobile:w-56 xs:w-44 items-right overflow-hidden">
            <div className="flex items-center max-w-60 desktop:w-60 tablet:w-60 mobile:w-56 xs:w-44 text-right justify-end bg-transparent outline-none pr-0 h-9">
              <input
                className="no-spinner flex mobile:text-4xl xs:text-4xl desktop:text-4xl tablet:text-4xl desktop:w-40 tablet:w-40 mobile:w-36 xs:w-24 font-medium text-right"
                placeholder={inputPlaceholder}
                onChange={handleUsdAmountChange}
                value={usdAmount}
                type="text"
                disabled={isLoading}
                onFocus={() => setInputPlaceholder('')}
                data-testid="pulse-buy-amount-input"
              />
              <span className="mobile:text-4xl xs:text-4xl desktop:text-4xl tablet:text-4xl desktop:w-20 tablet:w-20 mobile:w-20 xs:w-20 font-medium overflow-hidden text-[#FFFFFF4D]">
                USD
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-between p-3">
          <div className="flex">
            {(() => {
              const showError =
                belowMinimumAmount ||
                insufficientWalletBalance ||
                (notEnoughLiquidity && token) ||
                minimumStableBalance ||
                minGasFee ||
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
                message = `Not enough USDC to buy, reduce to ${Math.floor(maxStableCoinBalance.balance * 100) / 100}`;
              } else if (minimumStableBalance) {
                message = 'You need $2 USDC to trade, deposit USDC';
              } else if (minGasFee) {
                message = `Min. $1 ${NativeSymbols[maxStableCoinBalance.chainId]} required on ${ChainNames[maxStableCoinBalance.chainId]}`;
              } else {
                message = 'No available routes for this amount';
              }

              return (
                <div className="flex items-center justify-center">
                  <img
                    src={WarningIcon}
                    alt="warning"
                    data-testid="pulse-buy-warning-icon"
                  />
                  <span
                    className="text-xs m-1 underline text-[#FF366C]"
                    data-testid="pulse-buy-error-message"
                  >
                    {message}
                  </span>
                </div>
              );
            })()}
          </div>
          <div className="flex items-center">
            <img
              src={WalletIcon}
              className="w-4 h-3"
              alt="wallet-icon"
              data-testid="pulse-buy-wallet-icon"
            />
            <div
              className="ml-1 text-xs text-[#8A77FF]"
              data-testid="pulse-buy-wallet-balance"
            >
              ${sumOfStableBalance.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
      {/* amounts */}
      <div className="flex w-full">
        {customBuyAmounts.map((item) => {
          const isMax = item === 'MAX';
          const isDisabled = !token;

          return (
            <div
              key={item}
              className="flex bg-black ml-2.5 mr-2.5 w-[75px] h-[30px] rounded-[10px] p-0.5 pb-1 pt-0.5"
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
                      setUsdAmount(sumOfStableBalance.toFixed(2));
                    } else {
                      setUsdAmount(item);
                    }
                  }
                }}
                type="button"
                disabled={isDisabled}
                data-testid={`pulse-buy-percentage-button-${item.toLowerCase()}`}
              >
                <span className="opacity-50 font-normal text-sm">
                  {isMax ? 'MAX' : `$${item}`}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* buy/sell button */}
      <div className="flex w-auto h-[50px] rounded-[10px] bg-black p-[2px_2px_6px_2px] m-2.5">
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
            insufficientWalletBalance ||
            minimumStableBalance ||
            minGasFee
          }
          payingTokens={payingTokens}
          token={token}
          usdAmount={usdAmount}
        />
      </div>
    </div>
  );
}
