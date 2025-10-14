import { parseInt } from 'lodash';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';

// types
import { WalletPortfolioMobulaResponse } from '../../../../types/api';
import { SelectedToken } from '../../types/tokens';

// utils
import { getLogoForChainId } from '../../../../utils/blockchain';
import {
  formatExponentialSmallNumber,
  limitDigitsNumber,
} from '../../../../utils/number';

// components
import RandomAvatar from '../../../pillarx-app/components/RandomAvatar/RandomAvatar';
import ArrowDown from '../../assets/arrow-down.svg';
import WarningIcon from '../../assets/warning.svg';
import SellButton from './SellButton';

// hooks
import useRelaySell, { SellOffer } from '../../hooks/useRelaySell';

interface SellProps {
  setSearching: Dispatch<SetStateAction<boolean>>;
  token: SelectedToken | null;
  walletPortfolioData: WalletPortfolioMobulaResponse | undefined;
  setPreviewSell: Dispatch<SetStateAction<boolean>>;
  setSellOffer: Dispatch<SetStateAction<SellOffer | null>>;
  setTokenAmount: Dispatch<SetStateAction<string>>;
  isRefreshing?: boolean;
}

const Sell = (props: SellProps) => {
  const {
    setSearching,
    token,
    walletPortfolioData,
    setPreviewSell,
    setSellOffer,
    setTokenAmount: setParentTokenAmount,
    isRefreshing = false,
  } = props;
  const [tokenAmount, setTokenAmount] = useState<string>('');
  const [debouncedTokenAmount, setDebouncedTokenAmount] = useState<string>('');
  const [inputPlaceholder, setInputPlaceholder] = useState<string>('0.00');
  const [notEnoughLiquidity, setNotEnoughLiquidity] = useState<boolean>(false);
  const [minAmount, setMinAmount] = useState<boolean>(false);
  const [sellOffer, setLocalSellOffer] = useState<SellOffer | null>(null);
  const [isLoadingOffer, setIsLoadingOffer] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const { getBestSellOffer, isInitialized, error: relayError } = useRelaySell();

  const fetchSellOffer = useCallback(async () => {
    if (
      debouncedTokenAmount &&
      token &&
      isInitialized &&
      parseFloat(debouncedTokenAmount) > 0 &&
      !notEnoughLiquidity
    ) {
      setIsLoadingOffer(true);
      try {
        const offer = await getBestSellOffer({
          fromAmount: debouncedTokenAmount,
          fromTokenAddress: token.address,
          fromChainId: token.chainId,
          fromTokenDecimals: token.decimals,
        });
        setLocalSellOffer(offer);
      } catch (error) {
        console.error('Failed to fetch sell offer:', error);
        setLocalSellOffer(null);
      } finally {
        setIsLoadingOffer(false);
      }
    } else if (!debouncedTokenAmount || parseFloat(debouncedTokenAmount) <= 0) {
      setLocalSellOffer(null);
      setIsLoadingOffer(false);
    } else if (notEnoughLiquidity) {
      setLocalSellOffer(null);
      setIsLoadingOffer(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTokenAmount, token, isInitialized, notEnoughLiquidity]);

  // Get the user's balance for the selected token
  const getTokenBalance = () => {
    try {
      if (!token || !walletPortfolioData?.result?.data?.assets) return 0;

      // Find the asset in the portfolio
      const assetData = walletPortfolioData.result.data.assets.find(
        (asset) => asset.asset.symbol === token.symbol
      );

      if (!assetData) return 0;

      // Find the contract balance for the specific token address and chain
      const contractBalance = assetData.contracts_balances.find(
        (contract) =>
          contract.address.toLowerCase() === token.address.toLowerCase() &&
          contract.chainId === `evm:${token.chainId}`
      );
      return contractBalance?.balance || 0;
    } catch (error) {
      console.error('Error getting token balance:', error);
      return 0;
    }
  };

  const tokenBalance = getTokenBalance();

  const handleTokenAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (!input || !Number.isNaN(parseFloat(input))) {
      setInputPlaceholder('0.00');
      setTokenAmount(input);
      setParentTokenAmount(input);

      if (input && token) {
        const inputAmount = parseFloat(input);
        if (!Number.isNaN(token?.usdValue)) {
          setMinAmount(inputAmount * Number(token?.usdValue) < 1);
        } else {
          setMinAmount(false);
        }
        setNotEnoughLiquidity(inputAmount > tokenBalance);
      } else {
        setMinAmount(false);
        setNotEnoughLiquidity(false);
      }
    }
  };

  // Debounce token amount changes to fetch sell offers
  useEffect(() => {
    const timer = setTimeout(() => {
      // Always update debouncedTokenAmount, even if empty
      // This ensures clearing input properly clears the offer
      setDebouncedTokenAmount(tokenAmount);
    }, 1000);

    return () => clearTimeout(timer);
  }, [tokenAmount]);

  // Recalculate liquidity when token, balance, or amount changes
  useEffect(() => {
    if (tokenAmount && tokenAmount.trim() !== '') {
      const inputAmount = parseFloat(tokenAmount);
      if (!Number.isNaN(inputAmount)) {
        if (!Number.isNaN(token?.usdValue)) {
          setMinAmount(inputAmount * Number(token?.usdValue) < 1);
        } else {
          setMinAmount(false);
        }
        setNotEnoughLiquidity(inputAmount > tokenBalance);
      } else {
        setNotEnoughLiquidity(false);
        setMinAmount(false);
      }
    } else {
      setMinAmount(false);
      setNotEnoughLiquidity(false);
    }
  }, [token, tokenBalance, tokenAmount]);

  // Fetch sell offer when debounced amount changes
  useEffect(() => {
    fetchSellOffer();
  }, [fetchSellOffer]);

  return (
    <div className="flex flex-col w-full" data-testid="pulse-sell-component">
      <div className="bg-[#121116] m-2.5 rounded-[10px]">
        <div className="flex items-center justify-between p-3">
          <button
            onClick={() => {
              setSearching(true);
            }}
            type="button"
            className="flex-shrink-0"
            data-testid="pulse-sell-token-selector"
          >
            {token ? (
              <div
                className="flex items-center mobile:w-36 xs:w-36 desktop:w-full h-9 bg-[#1E1D24] rounded-md"
                data-testid={`pulse-sell-token-selected-${token.chainId}-${token.name}`}
              >
                <div className="relative inline-block">
                  {token.logo ? (
                    <img
                      src={token.logo}
                      alt="Main"
                      className="w-6 h-6 ml-1 mr-1"
                      data-testid="pulse-sell-token-selector-logo"
                      style={{
                        borderRadius: 50,
                      }}
                    />
                  ) : (
                    <div className="w-full h-full overflow-hidden rounded-full w-[34px] h-6 ml-1 mr-1">
                      <RandomAvatar name={token.name || ''} />
                      <span className="absolute inset-0 flex items-center justify-center text-white text-xs">
                        {token.name?.slice(0, 2)}
                      </span>
                    </div>
                  )}
                  <img
                    src={getLogoForChainId(token.chainId)}
                    className="absolute w-2.5 h-2.5"
                    style={{
                      bottom: '-2px',
                      right: '2px',
                      borderRadius: '50%',
                    }}
                    alt="Chain Logo"
                    data-testid="pulse-sell-token-selector-chain-logo"
                  />
                </div>
                <div
                  className="flex flex-col mt-1"
                  style={{ height: 40, width: 91 }}
                >
                  <div className="flex">
                    <p
                      className="desktop:text-sm mobile:text-xs xs:text-xs font-normal"
                      data-testid="pulse-sell-token-selector-symbol"
                    >
                      {token.symbol}
                    </p>
                    {token.symbol.length + token.name.length <= 13 && (
                      <p
                        className="opacity-30 desktop:text-sm mobile:text-xs xs:text-xs font-normal ml-1"
                        style={{
                          color: '#FFFFFF',
                        }}
                        data-testid="pulse-sell-token-selector-name"
                      >
                        {token.name}
                      </p>
                    )}
                  </div>
                  <div className="flex">
                    <p
                      style={{
                        fontSize: 10,
                        fontWeight: 400,
                        color: '#FFFFFF',
                        height: 10,
                        opacity: 0.5,
                      }}
                    >
                      ${token.usdValue}
                    </p>
                  </div>
                </div>
                <div className="flex ml-1.5">
                  <img src={ArrowDown} className="w-2 h-1" alt="arrow-down" />
                </div>
              </div>
            ) : (
              <div className="flex ml-1.5 h-9 bg-[#1E1D24] items-center max-w-[150px] w-32 rounded-md justify-center font-normal desktop:text-sm mobile:text-xs xs:text-xs justify-items-end">
                <div
                  className="flex font-normal desktop:text-sm tablet:text-sm mobile:text-xs xs:text-xs"
                  data-testid="pulse-sell-token-selector-placeholder"
                >
                  Select token
                </div>
                <div className="flex ml-1.5">
                  <img
                    src={ArrowDown}
                    className="w-2 h-1"
                    alt="arrow-down"
                    data-testid="pulse-sell-token-selector-arrow-placeholder"
                  />
                </div>
              </div>
            )}
          </button>
          <div className="flex max-w-60 desktop:w-60 tablet:w-60 mobile:w-52 xs:w-44 items-right">
            <div
              className="flex items-center max-w-60 desktop:w-60 tablet:w-60 mobile:w-52 xs:w-44 text-right justify-end bg-transparent outline-none pr-0"
              style={{ height: 36 }}
            >
              {/* <div className="flex-1 min-w-0 overflow-hidden"> */}
              <input
                className={`no-spinner flex mobile:text-4xl xs:text-4xl desktop:text-4xl tablet:text-4xl font-medium text-right ${token
                  ? "desktop:w-40 tablet:w-40 mobile:w-32 xs:w-24 mr-1" : "desktop:w-60 tablet:w-60 mobile:w-52 xs:w-44"}`}
                placeholder={inputPlaceholder}
                onChange={handleTokenAmountChange}
                value={tokenAmount}
                type="text"
                onFocus={() => setInputPlaceholder('')}
                data-testid="pulse-sell-amount-input"
              />
              {/* </div> */}
              {token && (
                <>
                  <p
                    className={`text-grey opacity-50 mobile:text-4xl xs:text-4xl desktop:text-4xl tablet:text-4xl font-medium ${token.symbol.length > 3 ? 'cursor-help' : ''}`}
                    data-testid="pulse-sell-token-symbol"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    {token.symbol.slice(0, 3)}
                  </p>
                  {showTooltip && token.symbol.length > 3 && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded shadow-lg z-10 whitespace-nowrap">
                      {token.symbol}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-between p-3">
          <div className="flex">
            {(notEnoughLiquidity || relayError || minAmount) && (
              <>
                <div className="flex items-center justify-center">
                  <img
                    src={WarningIcon}
                    alt="warning"
                    data-testid="pulse-sell-warning-icon"
                  />
                </div>
                <div
                  className="underline text-[#FF366C] text-xs ml-1.5"
                  data-testid="pulse-sell-error-message"
                >
                  {relayError ||
                    (notEnoughLiquidity ? 'Not enough balance' : '') ||
                    (minAmount ? 'Min amount is $1 worth of tokens' : '')}
                </div>
              </>
            )}
          </div>
          <div className="flex">
            {token && (
              <img
                src={token.logo}
                alt={token.symbol}
                className="w-3.5 h-3.5 rounded-full"
                data-testid="pulse-sell-token-logo"
              />
            )}
            <div
              className="text-[#8A77FF] ml-1.5 text-xs"
              data-testid="pulse-sell-token-balance"
            >
              {token ? (
                <>
                  {formatExponentialSmallNumber(
                    limitDigitsNumber(tokenBalance)
                  )}{' '}
                  {token.symbol}($
                  {formatExponentialSmallNumber(
                    limitDigitsNumber(tokenBalance * parseFloat(token.usdValue))
                  )}
                  )
                </>
              ) : (
                '0.00($0.00)'
              )}
            </div>
          </div>
        </div>
      </div>

      {/* amounts */}
      <div
        className="flex w-full"
        data-testid="pulse-sell-percentage-buttons"
      >
        {['10%', '25%', '50%', '75%', 'MAX'].map((item) => {
          const isMax = item === 'MAX';
          const percentage = isMax ? 100 : parseInt(item);
          const isDisabled = !token;

          return (
            <div
              key={item}
              className="flex bg-black ml-2.5 mr-2.5 w-[75px] h-[30px] rounded-[10px] p-0.5 pb-1 pt-0.5"
            >
              <button
                className={`flex-1 items-center justify-center rounded-[10px] ${isDisabled
                  ? 'bg-[#1E1D24] text-grey cursor-not-allowed'
                  : 'bg-[#121116] text-white cursor-pointer'
                  }`}
                onClick={() => {
                  if (!isDisabled) {
                    if (isMax) {
                      const decimals = token?.decimals || 18;
                      const multiplier = 10 ** decimals;
                      const amount =
                        Math.floor(tokenBalance * multiplier) / multiplier;
                      const formattedAmount =
                        formatExponentialSmallNumber(amount);
                      setTokenAmount(formattedAmount);
                      setParentTokenAmount(formattedAmount);
                    } else {
                      const amount = (
                        (tokenBalance * percentage) /
                        100
                      ).toFixed(6);
                      const formattedAmount =
                        formatExponentialSmallNumber(amount);
                      setTokenAmount(formattedAmount);
                      setParentTokenAmount(formattedAmount);
                    }
                  }
                }}
                type="button"
                disabled={isDisabled}
                data-testid={`pulse-sell-percentage-button-${item.toLowerCase()}`}
              >
                <span
                  className="font-normal text-center opacity-50 text-sm"
                >
                  {item}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* sell button */}
      <div
        className="flex w-full m-2.5"
        style={{
          width: 'auto',
          height: 50,
          borderRadius: 10,
          backgroundColor: 'black',
          padding: '2px 2px 6px 2px',
        }}
        data-testid="pulse-sell-button-container"
      >
        <SellButton
          token={token}
          tokenAmount={tokenAmount}
          notEnoughLiquidity={notEnoughLiquidity || minAmount}
          setPreviewSell={setPreviewSell}
          setSellOffer={setSellOffer}
          sellOffer={sellOffer}
          isLoadingOffer={isLoadingOffer || isRefreshing}
          isInitialized={isInitialized}
        />
      </div>
    </div>
  );
};

export default Sell;
