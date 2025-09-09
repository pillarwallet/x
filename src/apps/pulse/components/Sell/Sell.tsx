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
import { limitDigitsNumber } from '../../../../utils/number';

// components
import RandomAvatar from '../../../pillarx-app/components/RandomAvatar/RandomAvatar';
import ArrowDown from '../../assets/arrow-down.svg';
import WarningIcon from '../../assets/warning.svg';
import SellButton from './SellButton';

// hooks
import useRelaySell, { SellOffer } from '../../hooks/useRelaySell';

// context
import { useRefresh } from '../../contexts/RefreshContext';

interface SellProps {
  setSearching: Dispatch<SetStateAction<boolean>>;
  token: SelectedToken | null;
  walletPortfolioData: WalletPortfolioMobulaResponse | undefined;
  setPreviewSell: Dispatch<SetStateAction<boolean>>;
  setSellOffer: Dispatch<SetStateAction<SellOffer | null>>;
  setTokenAmount: Dispatch<SetStateAction<string>>;
}

const Sell = (props: SellProps) => {
  const {
    setSearching,
    token,
    walletPortfolioData,
    setPreviewSell,
    setSellOffer,
    setTokenAmount: setParentTokenAmount,
  } = props;
  const [tokenAmount, setTokenAmount] = useState<string>('');
  const [debouncedTokenAmount, setDebouncedTokenAmount] = useState<string>('');
  const [inputPlaceholder, setInputPlaceholder] = useState<string>('0.00');
  const [notEnoughLiquidity, setNotEnoughLiquidity] = useState<boolean>(false);
  const [sellOffer, setLocalSellOffer] = useState<SellOffer | null>(null);
  const [isLoadingOffer, setIsLoadingOffer] = useState<boolean>(false);

  const { getBestSellOffer, isInitialized, error: relayError } = useRelaySell();
  const { setRefreshSellCallback } = useRefresh();

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
        setNotEnoughLiquidity(inputAmount > tokenBalance);
      } else {
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
        setNotEnoughLiquidity(inputAmount > tokenBalance);
      } else {
        setNotEnoughLiquidity(false);
      }
    } else {
      setNotEnoughLiquidity(false);
    }
  }, [token, tokenBalance, tokenAmount]);

  // Fetch sell offer when debounced amount changes
  useEffect(() => {
    fetchSellOffer();
  }, [fetchSellOffer]);

  // Refresh function for Sell component
  const refreshSellData = useCallback(async () => {
    if (debouncedTokenAmount && token && isInitialized) {
      // Re-trigger the getBestSellOffer call by calling fetchSellOffer directly
      await fetchSellOffer();
    }
  }, [debouncedTokenAmount, token, isInitialized, fetchSellOffer]);

  // Register refresh callback
  useEffect(() => {
    setRefreshSellCallback(refreshSellData);
  }, [setRefreshSellCallback, refreshSellData]);

  return (
    <>
      <div className="m-2.5 bg-black w-[422px] h-[100px] rounded-[10px]">
        <div className="flex items-center gap-3 p-3">
          <button
            onClick={() => {
              setSearching(true);
            }}
            type="button"
            className="flex-shrink-0"
          >
            {token ? (
              <div className="flex items-center justify-center w-[150px] h-9 bg-[#1E1D24] rounded-[10px]">
                <div className="relative inline-block">
                  {token.logo ? (
                    <img
                      src={token.logo}
                      alt="Main"
                      className="w-6 h-6 rounded-full ml-1.5 mr-1.5"
                    />
                  ) : (
                    <div className="w-full h-full overflow-hidden rounded-full w-6 h-6 ml-1.5 mr-1.5">
                      <RandomAvatar name={token.name || ''} />
                      <span className="absolute inset-0 flex items-center justify-center text-white text-lg font-bold">
                        {token.name?.slice(0, 2)}
                      </span>
                    </div>
                  )}
                  <img
                    src={getLogoForChainId(token.chainId)}
                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
                    alt="Chain Logo"
                  />
                </div>
                <div className="flex flex-col ml-1.5 mt-1.5 h-9">
                  <div className="flex">
                    <p className="text-xs font-normal">{token.symbol}</p>
                    <p className="text-xs font-normal ml-0.5 text-grey">
                      {token.name.length >= 10
                        ? `${token.name.slice(0, 6)}...`
                        : token.name}
                    </p>
                  </div>
                  <div className="flex">
                    <p className="text-[10px] font-normal text-grey h-2.5">
                      ${token.usdValue}
                    </p>
                  </div>
                </div>
                <img src={ArrowDown} alt="arrow-down" />
              </div>
            ) : (
              <div className="flex items-center justify-center w-[150px] h-9 bg-[#1E1D24] rounded-[10px]">
                <div className="flex font-normal text-xs ml-1.5">
                  Select token
                </div>
                <div className="flex ml-2">
                  <img src={ArrowDown} alt="arrow-down" />
                </div>
              </div>
            )}
          </button>
          <div className="flex-1 min-w-0">
            <div
              className="flex items-center justify-between"
              style={{ height: 36 }}
            >
              <div className="flex-1 min-w-0 overflow-hidden">
                <input
                  className="w-full no-spinner text-right bg-transparent outline-none pr-0"
                  style={{
                    fontSize: '36px',
                    lineHeight: '1.2',
                    fontWeight: '500',
                  }}
                  placeholder={inputPlaceholder}
                  onChange={handleTokenAmountChange}
                  value={tokenAmount}
                  type="text"
                  onFocus={() => setInputPlaceholder('')}
                />
              </div>
              <p
                className="text-grey ml-0 flex-shrink-0 opacity-50"
                style={{ fontSize: '36px', fontWeight: '500' }}
              >
                {token ? token.symbol : 'TOKEN'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-between m-2.5">
          <div className="flex">
            {(notEnoughLiquidity || relayError) && (
              <>
                <div className="flex items-center justify-center">
                  <img src={WarningIcon} alt="warning" />
                </div>
                <div className="underline text-[#FF366C] text-xs ml-1.5">
                  {relayError || 'Not enough liquidity'}
                </div>
              </>
            )}
          </div>
          <div className="flex float-right">
            {token && (
              <img
                src={token.logo}
                alt={token.symbol}
                className="w-3.5 h-3.5 rounded-full"
              />
            )}
            <div className="text-[#8A77FF] ml-1.5 text-xs">
              {token ? (
                <>
                  {limitDigitsNumber(tokenBalance)} {token.symbol} ($
                  {limitDigitsNumber(tokenBalance * parseFloat(token.usdValue))}
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
      <div className="flex">
        {['10%', '25%', '50%', '75%', 'MAX'].map((item) => {
          const isMax = item === 'MAX';
          const percentage = isMax ? 100 : parseInt(item);
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
                      const amount = tokenBalance.toFixed(6);
                      setTokenAmount(amount);
                      setParentTokenAmount(amount);
                    } else {
                      const amount = (
                        (tokenBalance * percentage) /
                        100
                      ).toFixed(6);
                      setTokenAmount(amount);
                      setParentTokenAmount(amount);
                    }
                  }
                }}
                type="button"
                disabled={isDisabled}
              >
                {item}
              </button>
            </div>
          );
        })}
      </div>

      {/* sell button */}
      <div className="flex m-2.5 w-[422px] h-[50px] rounded-[10px] bg-black p-0.5 pb-1 pt-0.5">
        <SellButton
          token={token}
          tokenAmount={tokenAmount}
          notEnoughLiquidity={notEnoughLiquidity}
          setPreviewSell={setPreviewSell}
          setSellOffer={setSellOffer}
          sellOffer={sellOffer}
          isLoadingOffer={isLoadingOffer}
          isInitialized={isInitialized}
        />
      </div>
    </>
  );
};

export default Sell;
