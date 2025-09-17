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
import { Hex, getAddress } from 'viem';
import { WalletPortfolioMobulaResponse } from '../../../../types/api';
import { getLogoForChainId } from '../../../../utils/blockchain';
import RandomAvatar from '../../../pillarx-app/components/RandomAvatar/RandomAvatar';
import ArrowDown from '../../assets/arrow-down.svg';
import WalletIcon from '../../assets/wallet.svg';
import WarningIcon from '../../assets/warning.svg';
import useIntentSdk from '../../hooks/useIntentSdk';
import useModularSdk from '../../hooks/useModularSdk';
import { PayingToken, SelectedToken } from '../../types/tokens';
import { getDesiredAssetValue, getDispensableAssets } from '../../utils/intent';
import BuyButton from './BuyButton';

// hooks
import useTransactionKit from '../../../../hooks/useTransactionKit';

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
  } = props;
  const [usdAmount, setUsdAmount] = useState<string>('');
  const [debouncedUsdAmount, setDebouncedUsdAmount] = useState<string>('');
  const { intentSdk } = useIntentSdk();
  const { areModulesInstalled, isInstalling, installModules, isFetching } =
    useModularSdk({
      payingTokens,
    });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [expressIntentResponse, setExpressIntentResponse] =
    useState<ExpressIntentResponse | null>(null);
  const [notEnoughLiquidity, setNoEnoughLiquidity] = useState(false);
  const { walletAddress: accountAddress } = useTransactionKit();
  const [inputPlaceholder, setInputPlaceholder] = useState<string>('0.00');
  const [dispensableAssets, setDispensableAssets] = useState<
    DispensableAsset[]
  >([]);
  const [permittedChains, setPermittedChains] = useState<bigint[]>([]);

  const handleUsdAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (!input || !Number.isNaN(parseFloat(input))) {
      setInputPlaceholder('0.00');
      setUsdAmount(input);
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
        setNoEnoughLiquidity(false);
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
        if (
          payingTokens.length > 0 &&
          pTokens[0].chainId === payingTokens[0].chainId &&
          pTokens[0].name === payingTokens[0].name &&
          pTokens[0].symbol === payingTokens[0].symbol
        ) {
          setDispensableAssets(dAssets);
          setPermittedChains(pChains);
          setParentDispensableAssets(dAssets);
          setParentUsdAmount(usdAmount);
        } else {
          setDispensableAssets(dAssets);
          setPermittedChains(pChains);
          setPayingTokens(pTokens);
          setParentDispensableAssets(dAssets);
          setParentUsdAmount(usdAmount);
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    usdAmount,
    setPayingTokens,
    walletPortfolioData?.result.data,
    dispensableAssets.length,
    payingTokens,
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

    if (dispensableAssets.length === 0 && permittedChains.length === 0) {
      setNoEnoughLiquidity(true);
      return;
    }

    setNoEnoughLiquidity(false);
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
  }, [
    debouncedUsdAmount,
    token,
    accountAddress,
    intentSdk,
    areModulesInstalled,
    dispensableAssets,
    permittedChains,
    isLoading,
  ]);

  // Call refreshBuyIntent when input changes
  useEffect(() => {
    refreshBuyIntent();
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
                <div
                  className="flex"
                  style={{ fontWeight: 400, fontSize: 12, marginLeft: 5 }}
                >
                  Select token
                </div>
                <div className="flex ml-2">
                  <img src={ArrowDown} alt="arrow-down" />
                </div>
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
              />
              <p style={{ lineHeight: 1, color: 'grey' }}>USD</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between" style={{ margin: 10 }}>
          <div className="flex">
            {(() => {
              const showNotEnoughLiquidity =
                notEnoughLiquidity ||
                (!isLoading &&
                  expressIntentResponse &&
                  expressIntentResponse.bids?.length === 0);

              if (!showNotEnoughLiquidity) return null;

              const message = notEnoughLiquidity
                ? 'Not enough liquidity'
                : 'No available routes for this amount';

              return (
                <>
                  <div className="flex items-center justify-center">
                    <img src={WarningIcon} alt="warning" />
                  </div>

                  <div
                    style={{
                      textDecoration: 'underline',
                      color: '#FF366C',
                      fontSize: 12,
                      marginLeft: 5,
                    }}
                  >
                    {message}
                  </div>
                </>
              );
            })()}
          </div>
          <div className="flex" style={{ float: 'right' }}>
            <img src={WalletIcon} alt="wallet-icon" />
            <div
              style={{
                color: '#8A77FF',
                marginLeft: 5,
                fontSize: 12,
              }}
            >
              $
              {walletPortfolioData?.result.data.total_wallet_balance.toFixed(
                2
              ) || 0.0}
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
                      setUsdAmount(
                        walletPortfolioData?.result.data.total_wallet_balance.toFixed(
                          2
                        ) ?? '0.00'
                      );
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
          notEnoughLiquidity={notEnoughLiquidity}
          payingTokens={payingTokens}
          token={token}
          usdAmount={usdAmount}
        />
      </div>
    </div>
  );
}
