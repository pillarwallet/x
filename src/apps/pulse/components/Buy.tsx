/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-syntax */
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  DispensableAsset,
  ExpressIntentResponse,
  UserIntent,
} from '@etherspot/intent-sdk/dist/cjs/sdk/types/user-intent-types';
import { Hex } from 'viem';
import { TailSpin } from 'react-loader-spinner';
import { useWalletAddress } from '@etherspot/transaction-kit';
import {
  PortfolioData,
  WalletPortfolioMobulaResponse,
} from '../../../types/api';
import { STABLE_CURRENCIES } from '../constants/tokens';
import useIntentSdk from '../hooks/useIntentSdk';
import { getLogoForChainId } from '../../../utils/blockchain';
import RandomAvatar from '../../pillarx-app/components/RandomAvatar/RandomAvatar';
import { PayingToken, SelectedToken } from '../types/tokens';
import useModularSdk from '../hooks/useModularSdk';
import { getChainName } from '../utils/constants';

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
}

function getDesiredAssetValue(
  input: string,
  decimals: number,
  usdValue: string
): bigint {
  const value = Number(parseFloat(input)) / Number(parseFloat(usdValue));
  return BigInt(Math.ceil(Number(value.toFixed(6))) * 10 ** decimals);
}

function getDispensableAssets(
  input: string,
  portfolioData: PortfolioData | undefined
): [DispensableAsset[], bigint[], PayingToken[]] {
  // TODO: build a logic to use multiple tokens from different chains.
  if (!portfolioData?.assets) {
    return [[], [], []];
  }

  for (const item of portfolioData.assets) {
    const { price } = item;
    for (const token of item.contracts_balances) {
      const tokenItem = {
        chainId: Number(token.chainId.split(':').at(-1)),
        address: token.address,
      };

      const usdEq = price * token.balance;
      const t = STABLE_CURRENCIES.find(
        (x) =>
          x.address.toLowerCase() === tokenItem.address.toLowerCase() &&
          x.chainId === tokenItem.chainId
      );
      if (usdEq > Number(input) && t) {
        return [
          [
            {
              asset: tokenItem.address as Hex,
              chainId: BigInt(tokenItem.chainId),
              maxValue: BigInt(
                Math.ceil(
                  Number(
                    (Number(Number(input).toFixed(6)) / price).toPrecision(6)
                  ) *
                    10 ** token.decimals
                )
              ),
            },
          ],
          [BigInt(tokenItem.chainId)],
          [
            {
              name: item.asset.name,
              logo: item.asset.logo,
              symbol: item.asset.symbol,
              chainId: tokenItem.chainId,
              actualBal: token.balance.toString(),
              totalUsd: Number(Number(input).toFixed(6)),
              totalRaw: (Number(Number(input).toFixed(6)) / price).toFixed(6),
            },
          ],
        ];
      }
    }
  }
  return [[], [], []];
}

function getButtonText(
  isLoading: boolean,
  isInstalling: boolean,
  isFetching: boolean,
  areModulesInstalled: boolean | undefined,
  selectedToken: SelectedToken | null,
  debouncedUsdAmount: string,
  payingToken?: PayingToken
) {
  if (areModulesInstalled === false && payingToken && !isInstalling) {
    return (
      <div className="flex items-center justify-center">{`Enable Trading on ${getChainName(payingToken.chainId)}`}</div>
    );
  }
  const usdAmount = parseFloat(debouncedUsdAmount);
  const tokenUsdValue = selectedToken?.usdValue
    ? Number(selectedToken.usdValue)
    : 0;

  let tokenAmount = '';
  if (!Number.isNaN(usdAmount) && usdAmount > 0 && tokenUsdValue > 0) {
    tokenAmount = (usdAmount / tokenUsdValue).toFixed(4);
  }

  return isLoading || isInstalling || isFetching ? (
    <div className="flex items-center justify-center">
      <TailSpin color="#FFFFFF" height={15} width={15} />
    </div>
  ) : (
    <div>
      {selectedToken?.symbol
        ? `Buy ${tokenAmount} ${selectedToken.symbol}`
        : 'Buy'}
    </div>
  );
}

export default function Buy(props: BuyProps) {
  const {
    setExpressIntentResponse: setExInResp,
    setPayingTokens,
    setPreviewBuy,
    setSearching,
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
  const accountAddress = useWalletAddress();
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

  const isDisabled = () => {
    if (isInstalling || isFetching) {
      return true;
    }
    if (!areModulesInstalled && payingTokens.length > 0) {
      return false;
    }
    return (
      isLoading ||
      !token ||
      !(parseFloat(usdAmount) > 0) ||
      !expressIntentResponse ||
      expressIntentResponse?.bids?.length === 0 ||
      notEnoughLiquidity
    );
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
        } else {
          setDispensableAssets(dAssets);
          setPermittedChains(pChains);
          setPayingTokens(pTokens);
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    usdAmount,
    setPayingTokens,
    walletPortfolioData?.result.data,
    dispensableAssets.length,
    payingTokens,
  ]);

  useEffect(() => {
    const manageIntent = async (input: string) => {
      setNoEnoughLiquidity(false);
      if (
        Number(parseFloat(input) > 0) &&
        token &&
        accountAddress &&
        intentSdk
      ) {
        if (dispensableAssets.length === 0 && permittedChains.length === 0) {
          setNoEnoughLiquidity(true);
          return;
        }
        const intent: UserIntent = {
          constraints: {
            deadline: BigInt(Math.floor(Date.now() / 1000)) + BigInt(60),
            desiredAssets: [
              {
                asset: token.address as Hex,
                chainId: BigInt(token.chainId),
                value: getDesiredAssetValue(
                  input,
                  token.decimals,
                  token.usdValue
                ),
              },
            ],
            dispensableAssets,
            maxGas: BigInt(6000000),
            permittedChains,
            slippagePercentage: 5,
          },
          intentHash:
            '0x000000000000000000000000000000000000000000000000000000000000000',
          core: {
            permittedAccounts: [
              {
                account: accountAddress as Hex,
                chainId: BigInt(token.chainId),
              },
            ],
          },
        };
        setIsLoading(true);
        try {
          const response = await intentSdk.expressIntent(intent);
          setExpressIntentResponse(response);
        } catch (error) {
          console.error('express intent failed:: ', error);
        }
        setIsLoading(false);
      }
    };
    if (debouncedUsdAmount && areModulesInstalled) {
      manageIntent(debouncedUsdAmount);
    }
  }, [
    accountAddress,
    debouncedUsdAmount,
    intentSdk,
    setPayingTokens,
    token,
    walletPortfolioData?.result.data,
    payingTokens,
    areModulesInstalled,
    dispensableAssets,
    permittedChains,
  ]);

  return (
    <>
      <div
        style={{
          margin: 10,
          backgroundColor: 'black',
          width: 422,
          height: 100,
          borderRadius: 10,
        }}
      >
        <div className="flex">
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
                  marginLeft: 10,
                  marginTop: 15,
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="size-6"
                  style={{ width: 30, height: 20 }}
                >
                  <path
                    fillRule="evenodd"
                    d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            ) : (
              <div
                className="flex items-center justify-center"
                style={{
                  width: 150,
                  height: 36,
                  backgroundColor: '#1E1D24',
                  borderRadius: 10,
                  marginLeft: 10,
                  marginTop: 15,
                }}
              >
                <div
                  className="flex"
                  style={{ fontWeight: 400, fontSize: 12, marginLeft: 5 }}
                >
                  Select token
                </div>
                <div className="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="size-6"
                    style={{ width: 30, height: 20, float: 'right' }}
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            )}
          </button>
          <div className="flex-1" style={{ marginTop: 15, marginRight: 10 }}>
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
            {(notEnoughLiquidity ||
              (!isLoading &&
                expressIntentResponse &&
                expressIntentResponse.bids?.length === 0)) && (
              <>
                <div className="flex items-center justify-center">
                  <svg
                    width="14"
                    height="16"
                    viewBox="0 0 14 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.70433 3.22114L1.31589 10.7442C0.732563 11.7442 1.45387 13 2.61156 13H11.3884C12.5461 13 13.2674 11.7442 12.6841 10.7442L8.29567 3.22115C7.71685 2.22889 6.28315 2.22889 5.70433 3.22114Z"
                      fill="#FF366C"
                      fillOpacity="0.3"
                      stroke="#FF366C"
                    />
                    <path
                      d="M7.64289 10.6428C7.64289 10.9979 7.35508 11.2857 7.00003 11.2857C6.64499 11.2857 6.35718 10.9979 6.35718 10.6428C6.35718 10.2878 6.64499 9.99999 7.00003 9.99999C7.35508 9.99999 7.64289 10.2878 7.64289 10.6428Z"
                      fill="#FF366C"
                    />
                    <path
                      d="M6.35718 5.92856C6.35718 5.57352 6.64499 5.28571 7.00003 5.28571C7.35508 5.28571 7.64289 5.57352 7.64289 5.92856L7.42861 9.14285C7.42861 9.37954 7.23673 9.57142 7.00003 9.57142C6.76334 9.57142 6.57146 9.37954 6.57146 9.14285L6.35718 5.92856Z"
                      fill="#FF366C"
                    />
                  </svg>
                </div>

                <div
                  style={{
                    textDecoration: 'underline',
                    color: '#FF366C',
                    fontSize: 12,
                    marginLeft: 5,
                  }}
                >
                  Not Enough liquidity
                </div>
              </>
            )}
          </div>
          <div className="flex" style={{ float: 'right' }}>
            <svg
              width="18"
              height="12"
              viewBox="0 0 18 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 3.5C1 2.39543 1.89543 1.5 3 1.5H15C16.1046 1.5 17 2.39543 17 3.5V9.5C17 10.6046 16.1046 11.5 15 11.5H3C1.89543 11.5 1 10.6046 1 9.5V3.5Z"
                fill="#8A77FF"
              />
              <path
                d="M5 0.25C6.79493 0.25 8.25 1.70507 8.25 3.5C8.25 5.29493 6.79493 6.75 5 6.75C3.20507 6.75 1.75 5.29493 1.75 3.5C1.75 1.70507 3.20507 0.25 5 0.25Z"
                fill="#0052FF"
                stroke="#121116"
                strokeWidth="0.5"
              />
              <path
                d="M4.99635 5.49985C6.10285 5.49985 6.99985 4.6044 6.99985 3.49985C6.99985 2.39528 6.10285 1.49985 4.99635 1.49985C3.94658 1.49985 3.08538 2.30583 2.99985 3.33172H5.64799V3.66795H2.99985C3.08538 4.69386 3.94658 5.49985 4.99635 5.49985Z"
                fill="#E3E7E9"
              />
              <path
                d="M13 0.25C14.7949 0.25 16.25 1.70507 16.25 3.5C16.25 5.29491 14.7949 6.75 13 6.75C11.2051 6.75 9.75 5.29491 9.75 3.5C9.75 1.70507 11.2051 0.25 13 0.25Z"
                fill="white"
                stroke="#121116"
                strokeWidth="0.5"
              />
              <path
                d="M13 0.5C11.3431 0.5 10 1.84315 10 3.5C10 5.15684 11.3431 6.5 13 6.5C14.6568 6.5 16 5.15684 16 3.5C16 1.84315 14.6568 0.5 13 0.5ZM13 5.02748V6.28022C11.8105 6.28022 10.8462 5.3159 10.8462 4.12637C10.8462 2.93684 11.8105 1.97253 13 1.97253V0.71978C14.1895 0.71978 15.1538 1.68409 15.1538 2.87363C15.1538 4.06316 14.1895 5.02748 13 5.02748ZM14.033 3.49039V3.5096C13.5777 3.73652 13.2365 4.07765 13.0096 4.53296H12.9904C12.7635 4.07765 12.4223 3.73652 11.967 3.5096V3.49039C12.4223 3.26347 12.7635 2.92234 12.9904 2.46703H13.0096C13.2365 2.92234 13.5777 3.26347 14.033 3.49039Z"
                fill="#FF0420"
              />
              <path
                d="M9 0.25C10.7949 0.25 12.25 1.70507 12.25 3.5C12.25 5.29493 10.7949 6.75 9 6.75C7.20507 6.75 5.75 5.29493 5.75 3.5C5.75 1.70507 7.20507 0.25 9 0.25Z"
                fill="#627EEA"
                stroke="#121116"
                strokeWidth="0.5"
              />
              <path
                d="M9.09293 1.25V2.91312L10.4986 3.54125L9.09293 1.25Z"
                fill="white"
                fillOpacity="0.602"
              />
              <path
                d="M9.09337 1.25L7.6875 3.54125L9.09337 2.91312V1.25Z"
                fill="white"
              />
              <path
                d="M9.09293 4.61986V5.74993L10.4996 3.80386L9.09293 4.61986Z"
                fill="white"
                fillOpacity="0.602"
              />
              <path
                d="M9.09337 5.74993V4.61968L7.6875 3.80386L9.09337 5.74993Z"
                fill="white"
              />
              <path
                d="M9.09293 4.35718L10.4986 3.54099L9.09293 2.91324V4.35718Z"
                fill="white"
                fillOpacity="0.2"
              />
              <path
                d="M7.6875 3.54099L9.09337 4.35718V2.91324L7.6875 3.54099Z"
                fill="white"
                fillOpacity="0.602"
              />
              <path
                d="M4.5 4.25C5.2082 4.25 5.87488 4.58383 6.2998 5.15039L6.90039 5.9502L6.95703 6.01758C7.09767 6.16514 7.29362 6.25 7.5 6.25H10.5C10.7359 6.25 10.958 6.13886 11.0996 5.9502L11.7002 5.15039L11.7822 5.04688C12.2082 4.54321 12.8359 4.25 13.5 4.25H16C16.6904 4.25 17.25 4.80964 17.25 5.5V9.5C17.25 10.7426 16.2426 11.75 15 11.75H3C1.75736 11.75 0.75 10.7426 0.75 9.5V5.5C0.75 4.80964 1.30964 4.25 2 4.25H4.5Z"
                stroke="#121116"
                strokeWidth="0.5"
              />
              <path
                d="M1 5.5C1 4.94772 1.44772 4.5 2 4.5H4.5C5.12951 4.5 5.72229 4.79639 6.1 5.3L6.7 6.1C6.88885 6.35181 7.18524 6.5 7.5 6.5H10.5C10.8148 6.5 11.1111 6.35181 11.3 6.1L11.9 5.3C12.2777 4.79639 12.8705 4.5 13.5 4.5H16C16.5523 4.5 17 4.94772 17 5.5V9.5C17 10.6046 16.1046 11.5 15 11.5H3C1.89543 11.5 1 10.6046 1 9.5V5.5Z"
                fill="#4E448A"
              />
            </svg>
            <div
              style={{
                color: '#8A77FF',
                marginLeft: 5,
                fontSize: 12,
                lineHeight: 0.9,
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
          return (
            <div
              className="flex"
              style={{
                backgroundColor: 'black',
                marginLeft: 10,
                width: 75,
                height: 30,
                borderRadius: 10,
                padding: '2px 2px 4px 2px',
              }}
            >
              <button
                className="flex-1 items-center justify-center"
                style={{
                  backgroundColor: '#121116',
                  borderRadius: 10,
                  color: 'grey',
                }}
                onClick={() => {
                  if (item === 'MAX') {
                    setUsdAmount(
                      walletPortfolioData?.result.data.total_wallet_balance.toFixed(
                        2
                      ) ?? '0.00'
                    );
                  } else {
                    setUsdAmount(parseFloat(item).toFixed(2));
                  }
                }}
                type="button"
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
        <button
          className="flex-1 items-center justify-center"
          onClick={handleBuySubmit}
          disabled={isDisabled()}
          style={{
            backgroundColor: isDisabled() ? '#29292F' : '#8A77FF',
            color: isDisabled() ? 'grey' : '#FFFFFF',
            borderRadius: 8,
          }}
          type="button"
        >
          {getButtonText(
            isLoading,
            isInstalling,
            isFetching,
            areModulesInstalled,
            token,
            debouncedUsdAmount,
            payingTokens.length > 0 ? payingTokens[0] : undefined
          )}
        </button>
      </div>
    </>
  );
}
