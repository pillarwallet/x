/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { TransactionEstimateResult } from '@etherspot/transaction-kit';
import * as Sentry from '@sentry/react';
import { BigNumber, ethers, utils } from 'ethers';
import {
  ArrangeVertical as ArrangeVerticalIcon,
  ClipboardText as IconClipboardText,
  ClipboardTick as IconClipboardTick,
  Flash as IconFlash,
} from 'iconsax-react';
import { isNaN } from 'lodash';
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  Address,
  encodeFunctionData,
  erc20Abi,
  formatUnits,
  isAddress,
  parseUnits,
} from 'viem';

// api
import { useGetTokenMarketDataQuery } from '../../../apps/token-atlas/api/token';

// components
import AssetSelect from '../../Form/AssetSelect';
import FormGroup from '../../Form/FormGroup';
import Label from '../../Form/Label';
import Select from '../../Form/Select';
import TextInput from '../../Form/TextInput';
import Card from '../../Text/Card';
import SendModalBottomButtons from './SendModalBottomButtons';

// hooks
import useAccountTransactionHistory from '../../../hooks/useAccountTransactionHistory';
import useBottomMenuModal from '../../../hooks/useBottomMenuModal';
import useDeployWallet from '../../../hooks/useDeployWallet';
import useGlobalTransactionsBatch from '../../../hooks/useGlobalTransactionsBatch';
import { useTransactionDebugLogger } from '../../../hooks/useTransactionDebugLogger';
import useTransactionKit from '../../../hooks/useTransactionKit';

// services
import {
  GasConsumptions,
  getAllGaslessPaymasters,
} from '../../../services/gasless';
import { useRecordPresenceMutation } from '../../../services/pillarXApiPresence';
import { getUserOperationStatus } from '../../../services/userOpStatus';

// utils
import { isNativeToken } from '../../../apps/the-exchange/utils/wrappedTokens';
import {
  buildTransactionData,
  getNativeAssetForChainId,
  isValidEthereumAddress,
  safeBigIntConversion,
} from '../../../utils/blockchain';
import {
  pasteFromClipboard,
  transactionDescription,
} from '../../../utils/common';
import { formatAmountDisplay, isValidAmount } from '../../../utils/number';

// types
import {
  useAppDispatch,
  useAppSelector,
} from '../../../apps/the-exchange/hooks/useReducerHooks';
import { setWalletPortfolio } from '../../../apps/the-exchange/reducer/theExchangeSlice';
import {
  convertPortfolioAPIResponseToToken,
  useGetWalletPortfolioQuery,
} from '../../../services/pillarXApiWalletPortfolio';
import {
  Token,
  chainNameToChainIdTokensData,
} from '../../../services/tokensData';
import {
  AssetSelectOption,
  SelectOption,
  SendModalData,
  TokenAssetSelectOption,
} from '../../../types';
import { PortfolioData } from '../../../types/api';
import { ITransaction } from '../../../types/blockchain';

const getAmountLeft = (
  selectedAsset: AssetSelectOption | undefined,
  amount: string,
  selectedAssetBalance: number | undefined
): string | number => {
  if (!selectedAsset || selectedAsset?.type !== 'token') return '0.00';
  if (!selectedAssetBalance) return '0.00';
  return selectedAssetBalance - +(amount || 0);
};

const getAssetSymbol = (
  selectedAsset: AssetSelectOption | undefined
): string => {
  if (!selectedAsset) return '';
  if (selectedAsset.type === 'token') {
    return selectedAsset.asset.symbol;
  }
  return selectedAsset.collection.contractName;
};

const getAssetContract = (
  selectedAsset: AssetSelectOption | undefined
): string => {
  if (!selectedAsset) return '';
  if (selectedAsset.type === 'token') {
    return selectedAsset.asset.contract;
  }
  return selectedAsset.collection.contractAddress;
};

const SendModalTokensTabView = ({ payload }: { payload?: SendModalData }) => {
  const [t] = useTranslation();
  const [recipient, setRecipient] = React.useState<string>('');
  const [selectedAsset, setSelectedAsset] = React.useState<
    AssetSelectOption | undefined
  >(undefined);
  const [amount, setAmount] = React.useState<string>('');
  const [selectedAssetPrice, setSelectedAssetPrice] = React.useState<number>(0);
  const [nativeAssetPrice, setNativeAssetPrice] = React.useState<number>(0);
  const { kit } = useTransactionKit();
  const { setTransactionMetaForName } = useGlobalTransactionsBatch();
  const [isAmountInputAsFiat, setIsAmountInputAsFiat] =
    React.useState<boolean>(false);
  const [isSending, setIsSending] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [estimatedCostFormatted, setEstimatedCostFormatted] =
    React.useState<string>('');
  const [safetyWarningMessage, setSafetyWarningMessage] =
    React.useState<string>('');
  const [deploymentCost, setDeploymentCost] = React.useState(0);
  const [isDeploymentCostLoading, setIsDeploymentCostLoading] =
    React.useState(true);
  const { walletAddress: accountAddress } = useTransactionKit();
  const { setWalletConnectTxHash } = useGlobalTransactionsBatch();
  const [pasteClicked, setPasteClicked] = React.useState<boolean>(false);
  const {
    hide,
    showHistory,
    showBatchSendModal,
    setShowBatchSendModal,
    setWalletConnectPayload,
  } = useBottomMenuModal();
  const paymasterUrl = import.meta.env.VITE_PAYMASTER_URL;
  const [isPaymaster, setIsPaymaster] = React.useState<boolean>(false);
  const [paymasterContext, setPaymasterContext] = React.useState<{
    mode: string;
    token?: string;
  } | null>({ mode: 'sponsor' });
  const [selectedPaymasterAddress, setSelectedPaymasterAddress] =
    React.useState<string>('');
  const [selectedFeeAsset, setSelectedFeeAsset] = React.useState<{
    token: string;
    decimals: number;
    tokenPrice?: string;
    balance?: string;
    id: string;
  }>();
  const [feeAssetOptions, setFeeAssetOptions] = React.useState<
    TokenAssetSelectOption[]
  >([]);
  const [queryString, setQueryString] = React.useState<string>('');
  const [approveData, setApproveData] = React.useState<string>('');
  const [gasPrice, setGasPrice] = React.useState<string>();
  const [feeMin, setFeeMin] = React.useState<string>();
  const [selectedFeeType, setSelectedFeeType] =
    React.useState<string>('Gasless');
  const [isLoadingFeeOptions, setIsLoadingFeeOptions] =
    React.useState<boolean>(false);

  const dispatch = useAppDispatch();
  const walletPortfolio = useAppSelector(
    (state) => state.swap.walletPortfolio as PortfolioData | undefined
  );

  const { transactionDebugLog } = useTransactionDebugLogger();
  const { getWalletDeploymentCost, getGasPrice } = useDeployWallet();
  const {
    userOpStatus,
    setTransactionHash,
    setUserOpStatus,
    setLatestUserOpInfo,
    setLatestUserOpChainId,
  } = useAccountTransactionHistory();

  const {
    data: walletPortfolioData,
    isSuccess: isWalletPortfolioDataSuccess,
    error: walletPortfolioDataError,
  } = useGetWalletPortfolioQuery(
    {
      wallet: accountAddress || '',
      isPnl: false,
    },
    { skip: !accountAddress, refetchOnFocus: false }
  );

  /**
   * Import the recordPresence mutation from the
   * pillarXApiPresence service. We use this to
   * collect data on what apps are being opened
   */
  const [recordPresence] = useRecordPresenceMutation();

  useEffect(() => {
    if (walletPortfolioData && isWalletPortfolioDataSuccess) {
      dispatch(setWalletPortfolio(walletPortfolioData?.result?.data));
    }
    if (!isWalletPortfolioDataSuccess || walletPortfolioDataError) {
      if (walletPortfolioDataError) {
        console.error(walletPortfolioDataError);
        setErrorMessage(t`error.failedWalletPortfolio`);
      }
      dispatch(setWalletPortfolio(undefined));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    walletPortfolioData,
    isWalletPortfolioDataSuccess,
    walletPortfolioDataError,
  ]);

  const feeTypeOptions = React.useMemo(
    () => [
      {
        id: 'Gasless',
        title: 'Gasless',
        type: 'token',
        value: '',
      },
      {
        id: 'Native Token',
        title: 'Native Token',
        type: 'token',
        value: '',
      },
    ],
    []
  );

  const [feeType, setFeeType] = React.useState(feeTypeOptions);

  // Set the default fee type
  React.useEffect(() => {
    setSelectedFeeType('Gasless');
  }, []);

  useEffect(() => {
    if (!walletPortfolio) return;
    const tokens = convertPortfolioAPIResponseToToken(walletPortfolio);
    if (!selectedAsset) return;

    // Reset paymaster context when asset changes to ensure clean state
    setPaymasterContext(null);
    setIsPaymaster(false);
    setSelectedPaymasterAddress(''); // Clear selected paymaster address
    setPaymasterContext(null);
    setIsPaymaster(false);

    setQueryString(`?chainId=${selectedAsset.chainId}`);
    setIsLoadingFeeOptions(true);
    getAllGaslessPaymasters(selectedAsset.chainId, tokens)
      .then((paymasterObject) => {
        if (paymasterObject) {
          const nativeToken = tokens.filter(
            (token: Token) =>
              isNativeToken(token.contract) &&
              chainNameToChainIdTokensData(token.blockchain) ===
                selectedAsset.chainId
          );
          if (nativeToken.length > 0) {
            setNativeAssetPrice(nativeToken[0]?.price || 0);
          }
          const feeOptions = paymasterObject
            .map(
              (item: {
                gasToken: string;
                chainId: number;
                epVersion: string;
                paymasterAddress: string;
                // eslint-disable-next-line consistent-return, array-callback-return
              }) => {
                const tokenData = tokens.find(
                  (token: Token) =>
                    token.contract.toLowerCase() === item.gasToken.toLowerCase()
                );
                if (tokenData)
                  return {
                    id: `${item.gasToken}-${item.chainId}-${item.paymasterAddress}-${tokenData.decimals}`,
                    type: 'token',
                    title: tokenData.name,
                    imageSrc: tokenData.logo,
                    chainId: chainNameToChainIdTokensData(tokenData.blockchain),
                    value: tokenData.balance,
                    price: tokenData.price,
                    asset: {
                      ...tokenData,
                      contract: item.gasToken,
                      decimals: tokenData.decimals,
                    },
                    balance: tokenData.balance ?? 0,
                  } as TokenAssetSelectOption;
              }
            )
            .filter(
              (value): value is TokenAssetSelectOption => value !== undefined
            );
          if (feeOptions && feeOptions.length > 0 && feeOptions[0]) {
            setFeeType(feeTypeOptions);
            setFeeAssetOptions(feeOptions);
            // get Skandha gas price
            getGasPrice(selectedAsset.chainId).then((res) => {
              setGasPrice(res);
            });

            // Set fee asset and paymaster context based on current selection
            if (selectedFeeType === 'Gasless') {
              // If Gasless is selected, set up the first gasless option to ensure gasless state is properly restored after asset switches
              const firstOption = feeOptions[0];
              if (selectedFeeAsset?.token) {
                // Fee asset already selected by user, try to keep it if available
                const userSelectedOption = feeOptions.find(
                  (value) =>
                    value.asset.contract.toLowerCase() ===
                    selectedFeeAsset.token.toLowerCase()
                );
                if (userSelectedOption) {
                  // Keep user's selected fee asset
                  setSelectedFeeAsset({
                    token: userSelectedOption.asset.contract,
                    decimals: userSelectedOption.asset.decimals,
                    tokenPrice: userSelectedOption.asset.price?.toString(),
                    balance: userSelectedOption.value?.toString(),
                    id: userSelectedOption.id,
                  });
                  setSelectedPaymasterAddress(
                    userSelectedOption.id.split('-')[2]
                  );
                  setPaymasterContext({
                    mode: 'commonerc20',
                    token: userSelectedOption.asset.contract,
                  });
                  setIsPaymaster(true);
                  setIsLoadingFeeOptions(false);
                  return; // Exit early
                }
              }
              setSelectedFeeAsset({
                token: firstOption.asset.contract,
                decimals: firstOption.asset.decimals,
                tokenPrice: firstOption.asset.price?.toString(),
                balance: firstOption.value?.toString(),
                id: firstOption.id,
              });
              setSelectedPaymasterAddress(firstOption.id.split('-')[2]);
              setPaymasterContext({
                mode: 'commonerc20',
                token: firstOption.asset.contract,
              });
              setIsPaymaster(true);
            }
          } else {
            setIsPaymaster(false);
            setPaymasterContext(null);
            setFeeAssetOptions([]);
            setFeeType([feeTypeOptions[1]]); // Only "Native Token" option when no gasless
          }
        } else {
          setPaymasterContext(null);
          setIsPaymaster(false);
          setFeeAssetOptions([]);
          setFeeType([]);
        }
        setIsLoadingFeeOptions(false);
      })
      .catch(() => {
        setIsLoadingFeeOptions(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAsset?.id, selectedAsset?.chainId, walletPortfolio]);

  const setApprovalData = async (gasCost: number) => {
    if (selectedFeeAsset && gasPrice && gasCost) {
      const estimatedCost = Number(
        utils.formatEther(BigNumber.from(gasCost).mul(gasPrice))
      );
      const costAsFiat = +estimatedCost * nativeAssetPrice;
      const feeTokenPrice = selectedFeeAsset.tokenPrice;
      let estimatedCostInToken;
      if (feeTokenPrice) {
        estimatedCostInToken = (costAsFiat / +feeTokenPrice).toFixed(
          selectedFeeAsset.decimals
        );
        setFeeMin(estimatedCostInToken);
        setApproveData(
          encodeFunctionData({
            abi: erc20Abi,
            functionName: 'approve',
            args: [
              selectedPaymasterAddress as Address,
              parseUnits(estimatedCostInToken, selectedFeeAsset.decimals),
            ],
          })
        );
      }
    }
  };

  // Clears when explicitly switching to Native Token
  useEffect(() => {
    if (selectedFeeType === 'Native Token') {
      setPaymasterContext(null);
      setIsPaymaster(false);
      setSelectedFeeAsset(undefined);
      setSelectedPaymasterAddress('');
    }
  }, [selectedFeeType]);

  useEffect(() => {
    if (!selectedAsset) return;
    if (!gasPrice) return;
    let gasCost = 0;
    /*
     * The gas cost is estimated based on the type of asset being sent.
     * The gas cost is calculated based on the type of asset being sent
     * and the chain ID of the asset. The gas cost is then used to calculate
     * the estimated cost in fiat.
     * And the token cost is generally estimated as $0.01 even for undeployed wallet
     * though it can be even lower for deployed wallet to save rpc call for checking
     * deployed wallet or not, we can use the same gas cost for both deployed and undeployed wallet
     */
    // See if its Arbitrum Chain as gas consumptions lend to be higher than all other chains
    if (selectedAsset.chainId === 42161) {
      if (selectedAsset.type === 'token') {
        if (selectedAsset.asset.contract === ethers.constants.AddressZero) {
          gasCost = GasConsumptions.native_arb; // estimated gas consumption for native asset transfer for undeployed wallet + 15% markup
        } else {
          gasCost = GasConsumptions.token_arb; // estimated gas consumption for token asset transfer for undeployed wallet + 15% markup
        }
      } else if (selectedAsset.type === 'nft') {
        gasCost = GasConsumptions.nft_arb; // estimated gas consumption for token asset transfer for undeployed wallet + 15% markup
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (selectedAsset.type === 'token') {
        if (selectedAsset.asset.contract === ethers.constants.AddressZero) {
          gasCost = GasConsumptions.native; // estimated gas consumption for native asset transfer for deployed wallet + 15% markup
        } else {
          gasCost = GasConsumptions.token; // estimated gas consumption for token asset transfer for deployed wallet + 15% markup
        }
      } else if (selectedAsset.type === 'nft') {
        gasCost = GasConsumptions.nft; // estimated gas consumption for token asset transfer for deployed wallet + 15% markup
      }
    }
    setApprovalData(gasCost);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gasPrice, selectedFeeAsset]);

  // Fetch native token price for the selected asset's chain
  const nativeSymbol = selectedAsset
    ? getNativeAssetForChainId(selectedAsset.chainId).symbol
    : undefined;

  const { data: tokenData } = useGetTokenMarketDataQuery(
    {
      symbol: nativeSymbol,
      blockchain: selectedAsset ? String(selectedAsset.chainId) : undefined,
    },
    { skip: !selectedAsset?.chainId }
  );

  useEffect(() => {
    if (!selectedAsset) return;
    if (selectedAsset.type !== 'token') return;
    if (
      tokenData &&
      tokenData.result &&
      tokenData.result.data &&
      tokenData.result.data.price
    ) {
      setNativeAssetPrice(tokenData.result.data.price);
    }
    if (selectedAsset.asset.price) {
      setSelectedAssetPrice(selectedAsset.asset.price);
    } else {
      setSelectedAssetPrice(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAsset, tokenData]);

  useEffect(() => {
    setSafetyWarningMessage('');
  }, [selectedAsset, recipient, amount]);

  useEffect(() => {
    const getDeploymentCost = async () => {
      if (!accountAddress || !selectedAsset?.chainId) return;
      setIsDeploymentCostLoading(true);
      const cost = await getWalletDeploymentCost({
        accountAddress,
        chainId: selectedAsset.chainId,
      });
      setDeploymentCost(cost);
      setIsDeploymentCostLoading(false);
    };

    getDeploymentCost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountAddress, selectedAsset]);

  const amountInFiat = useMemo(() => {
    if (selectedAssetPrice === 0) return 0;
    return selectedAssetPrice * +(amount || 0);
  }, [amount, selectedAssetPrice]);

  const amountForPrice = useMemo(() => {
    if (selectedAssetPrice === 0) return 0;
    return +(amount || 0) / selectedAssetPrice;
  }, [amount, selectedAssetPrice]);

  const maxAmountAvailable = useMemo(() => {
    if (selectedAsset?.type !== 'token' || !selectedAsset.balance) return 0;

    const adjustedBalance = isNativeToken(selectedAsset.asset.contract)
      ? selectedAsset.balance - deploymentCost
      : selectedAsset.balance;

    return isAmountInputAsFiat
      ? selectedAssetPrice * adjustedBalance
      : adjustedBalance;
  }, [selectedAsset, deploymentCost, isAmountInputAsFiat, selectedAssetPrice]);

  useEffect(() => {
    const addressPasteActionTimeout = setTimeout(() => {
      setPasteClicked(false);
    }, 500);

    return () => {
      clearTimeout(addressPasteActionTimeout);
    };
  }, [pasteClicked]);

  const isTransactionReady =
    isValidEthereumAddress(recipient) &&
    !!selectedAsset &&
    (selectedAsset?.type !== 'token' || isValidAmount(amount)) &&
    (selectedAsset?.type !== 'token' ||
      +getAmountLeft(selectedAsset, amount, selectedAsset.balance) >= 0);

  const isSendModalInvokedFromHook = !!payload;
  const isRegularSendModal = !isSendModalInvokedFromHook && !showBatchSendModal;
  const isSendDisabled =
    isSending ||
    (isRegularSendModal && !isTransactionReady) ||
    Number(amount) > maxAmountAvailable;

  const etherspotDefaultChainId = kit.getEtherspotProvider().getChainId();

  const clearUserOpState = () => {
    // remove previously saved userOp for a new one
    localStorage.removeItem('latestUserOpStatus');
    localStorage.removeItem('latestTransactionHash');
    localStorage.removeItem('latestUserOpInfo');
    localStorage.removeItem('latestUserOpChainId');

    // remove previously all states for userOp
    setTransactionHash(undefined);
    setUserOpStatus(undefined);
    setLatestUserOpInfo(undefined);
    setLatestUserOpChainId(undefined);
  };

  const handleEstimation = (
    estimated: TransactionEstimateResult,
    sendId: string
  ) => {
    const estimatedCostBN = estimated.cost;
    if (estimatedCostBN) {
      let symbol = '';
      let decimals = 18;
      let price = nativeAssetPrice;
      let estimatedCost = '0';
      // Determine if using ERC20 gas (gasless/paymaster mode)
      if (
        isPaymaster &&
        paymasterContext?.mode === 'commonerc20' &&
        selectedFeeAsset
      ) {
        symbol = selectedFeeAsset.token?.toUpperCase() || '';
        decimals = selectedFeeAsset.decimals ?? 18;
        price = Number(selectedFeeAsset.tokenPrice) || 0;
        estimatedCost = formatUnits(estimatedCostBN, decimals);
      } else {
        // Native token
        const nativeAsset = getNativeAssetForChainId(
          estimated.chainId || etherspotDefaultChainId
        );
        symbol = nativeAsset.symbol;
        decimals = nativeAsset.decimals;
        price = nativeAssetPrice;
        estimatedCost = formatUnits(estimatedCostBN, decimals);
      }
      const costAsFiat = +estimatedCost * price;
      transactionDebugLog('Transaction estimated cost:', estimatedCost, symbol);
      setEstimatedCostFormatted(
        `${formatAmountDisplay(estimatedCost, 0, 6)} ${symbol}`
      );
      return costAsFiat;
    }

    console.warn('Unable to get estimated cost', estimated);
    setEstimatedCostFormatted('');

    Sentry.captureMessage('Unable to get estimated cost', {
      level: 'warning',
      tags: {
        component: 'send_flow',
        action: 'no_estimated_cost',
        sendId,
      },
      contexts: {
        no_estimated_cost: {
          sendId,
          sentData: estimated,
        },
      },
    });

    return 0;
  };

  const handleError = (message: string) => {
    setErrorMessage(message);
    setIsSending(false);
  };

  // Helper to poll userOp status and handle Sentry, status, etc.
  function startUserOpPolling({
    userOpHash,
    chainIdForTxHash,
    recipientAddress,
    amountSent,
    sendId,
  }: {
    userOpHash: string;
    chainIdForTxHash: number;
    recipientAddress: string;
    amountSent: number;
    sendId: string;
  }) {
    transactionDebugLog('Polling userOp status for hash:', userOpHash);
    setLatestUserOpInfo(
      transactionDescription(
        selectedAsset,
        amountSent,
        recipientAddress,
        payload
      )
    );
    setLatestUserOpChainId(selectedAsset?.chainId);

    const userOpStatusInterval = 5000; // 5 seconds
    const maxAttempts = 9; // 9 * 5sec = 45sec
    let attempts = 0;
    let sentryCaptured = false;

    Sentry.addBreadcrumb({
      category: 'send_flow',
      message: 'Starting UserOp status monitoring',
      level: 'info',
      data: {
        sendId,
        maxAttempts,
        interval: userOpStatusInterval,
      },
    });

    const userOperationStatus = setInterval(async () => {
      attempts += 1;
      try {
        const response = await getUserOperationStatus(
          chainIdForTxHash,
          userOpHash
        );
        transactionDebugLog(`UserOp status attempt ${attempts}`, response);

        const status = response?.status;

        // If OnChain, it means it has been successfully added on chain
        if (status === 'OnChain' && response?.transaction) {
          setUserOpStatus('Confirmed');
          setTransactionHash(response.transaction);
          transactionDebugLog(
            'Transaction successfully submitted on chain with transaction hash:',
            response.transaction
          );

          Sentry.captureMessage('Transaction confirmed on chain', {
            level: 'info',
            tags: {
              component: 'send_flow',
              action: 'transaction_confirmed',
              sendId,
            },
            contexts: {
              transaction_confirmed: {
                sendId,
                userOpHash,
                chainId: chainIdForTxHash,
                transactionHash: response.transaction,
                attempts,
              },
            },
          });

          clearInterval(userOperationStatus);
          return;
        }

        const sentryPayload = {
          walletAddress: accountAddress,
          userOpHash,
          chainId: chainIdForTxHash,
          transactionHash: response?.transaction,
          attempts,
          status,
        };

        // Treat status Reverted as Sent until we timeout as this JSON-RPC call
        // can try again and be successful on Polygon only - known issue
        if (status === 'Reverted') {
          if (attempts < maxAttempts) {
            setUserOpStatus('Sent');
          } else {
            setUserOpStatus('Failed');
            transactionDebugLog(
              'UserOp Status remained Reverted after 45 sec timeout. Check transaction hash:',
              response?.transaction
            );

            // Sentry capturing
            if (!sentryCaptured) {
              sentryCaptured = true;
              // Polygon chain
              if (chainIdForTxHash === 137) {
                Sentry.captureMessage(
                  `Max attempts reached with userOp status "${status}" on Polygon`,
                  {
                    level: 'warning',
                    extra: sentryPayload,
                  }
                );
              } else {
                // Other chains
                Sentry.captureException(
                  `Max attempts reached with userOp status "${status}"`,
                  {
                    level: 'error',
                    extra: sentryPayload,
                  }
                );
              }
            }

            setTransactionHash(response?.transaction);
            clearInterval(userOperationStatus);
          }
          return;
        }

        // New, Pending, Submitted => still waiting
        if (['New', 'Pending'].includes(status)) {
          setUserOpStatus('Sending');
          transactionDebugLog(
            `UserOp Status is ${status}. Check transaction hash:`,
            response?.transaction
          );
        }

        if (['Submitted'].includes(status)) {
          setUserOpStatus('Sent');
          transactionDebugLog(
            `UserOp Status is ${status}. Check transaction hash:`,
            response?.transaction
          );
        }

        if (attempts >= maxAttempts) {
          clearInterval(userOperationStatus);
          transactionDebugLog(
            'Max attempts reached without userOp with OnChain status. Check transaction hash:',
            response?.transaction
          );
          if (userOpStatus !== 'Confirmed') {
            setUserOpStatus('Failed');

            // Sentry capturing
            if (!sentryCaptured) {
              sentryCaptured = true;
              // Polygon chain
              if (chainIdForTxHash === 137) {
                Sentry.captureMessage(
                  `Max attempts reached with userOp status "${status}" on Polygon`,
                  {
                    level: 'warning',
                    extra: sentryPayload,
                  }
                );
              } else {
                // Other chains
                Sentry.captureException(
                  `Max attempts reached with userOp status "${status}"`,
                  {
                    level: 'error',
                    extra: sentryPayload,
                  }
                );
              }
            }

            setTransactionHash(response?.transaction);
          }
        }
      } catch (err) {
        transactionDebugLog('Error getting userOp status:', err);
        clearInterval(userOperationStatus);
        setUserOpStatus('Failed');

        // Sentry capturing
        Sentry.captureException(
          err instanceof Error ? err.message : 'Error getting userOp status',
          {
            extra: {
              walletAddress: accountAddress,
              userOpHash,
              chainId: chainIdForTxHash,
              attempts,
            },
          }
        );
      }
    }, userOpStatusInterval);
  }

  // Helper to determine if we should use payload transaction
  const isPayloadTransaction = payload && 'transaction' in payload;

  // Helper to determine if we should use payload batches
  const isPayloadBatches = payload && 'batches' in payload;

  // If using payload transaction, extract its data
  const payloadTx = isPayloadTransaction ? payload.transaction : undefined;

  // --- Paymaster logic is only relevant for user-driven (no payload) flows ---

  const onSend = async (ignoreSafetyWarning?: boolean) => {
    const sendId = `send_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Start Sentry transaction for send flow
    Sentry.setContext('send_token', {
      sendId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      selectedAsset: selectedAsset
        ? {
            id: selectedAsset.id,
            type: selectedAsset.type,
            symbol: getAssetSymbol(selectedAsset),
            contract: getAssetContract(selectedAsset),
            balance:
              selectedAsset.type === 'token'
                ? selectedAsset.balance
                : undefined,
            chainId: selectedAsset.chainId,
          }
        : null,
      amount,
      recipient,
      ignoreSafetyWarning,
      isSendDisabled,
      isTransactionReady,
      isPaymaster,
    });

    if (isSendDisabled) {
      transactionDebugLog(
        'Another single transaction is being sent, cannot process the sending of this transaction'
      );

      Sentry.captureMessage('Send disabled - another transaction in progress', {
        level: 'warning',
        tags: {
          component: 'send_flow',
          action: 'send_disabled',
          sendId,
        },
        contexts: {
          send_disabled: {
            sendId,
            isSending,
            isTransactionReady,
            isSendDisabled,
          },
        },
      });

      return;
    }

    Sentry.addBreadcrumb({
      category: 'send_flow',
      message: 'Starting token send transaction',
      level: 'info',
      data: {
        sendId,
        selectedAsset: getAssetSymbol(selectedAsset),
        amount,
      },
    });

    clearUserOpState();
    setIsSending(true);
    setEstimatedCostFormatted('');
    setErrorMessage('');
    setSafetyWarningMessage('');

    // Compute paymasterDetails only for user-driven flows
    const paymasterDetails =
      !isPayloadTransaction && isPaymaster && paymasterContext
        ? {
            url: `${paymasterUrl}${queryString}`,
            context: paymasterContext,
          }
        : undefined;

    // warning if sending more than half of the balance
    if (
      !ignoreSafetyWarning &&
      selectedAsset?.type === 'token' &&
      selectedAsset.balance &&
      selectedAsset.balance / 2 < +amount
    ) {
      setSafetyWarningMessage(
        t`warning.transactionSafety.amountMoreThanHalfOfBalance`
      );
      handleError('');

      Sentry.captureMessage('Safety warning - amount more than half balance', {
        level: 'warning',
        tags: {
          component: 'send_flow',
          action: 'safety_warning',
          sendId,
        },
        contexts: {
          safety_warning: {
            sendId,
            amount,
            balance: selectedAsset.balance,
            threshold: selectedAsset.balance / 2,
          },
        },
      });

      return;
    }

    // Paymaster balance check only for user-driven flows
    if (
      !isPayloadTransaction &&
      isPaymaster &&
      paymasterContext?.mode === 'commonerc20'
    ) {
      let amountLeft = 0;
      if (
        selectedAsset?.type === 'token' &&
        selectedAsset?.asset?.contract?.toLowerCase() ===
          selectedFeeAsset?.token?.toLowerCase()
      ) {
        amountLeft = +getAmountLeft(
          selectedAsset,
          amount,
          selectedAsset.balance
        );
      } else {
        amountLeft = +(selectedFeeAsset?.balance ?? 0);
      }
      if (!feeMin) return;
      if (amountLeft < +feeMin) {
        handleError(t`error.insufficientBalanceForGasless`);

        Sentry.captureMessage('Insufficient balance for gasless transaction', {
          level: 'error',
          tags: {
            component: 'send_flow',
            action: 'insufficient_balance_gasless',
            sendId,
          },
          contexts: {
            insufficient_balance: {
              sendId,
              amountLeft,
              feeMin,
              selectedAsset: selectedAsset?.id,
              selectedFeeAsset: selectedFeeAsset?.token,
            },
          },
        });
        return;
      }
    }

    transactionDebugLog('Preparing to send transaction');

    Sentry.addBreadcrumb({
      category: 'send_flow',
      message: 'Preparing to send transaction',
      level: 'info',
      data: { sendId },
    });

    try {
      // --- PAYLOAD: BATCHES FLOW ---
      if (isPayloadBatches && Array.isArray(payload.batches)) {
        // Build all batches
        for (let batchIdx = 0; batchIdx < payload.batches.length; batchIdx++) {
          const batch = payload.batches[batchIdx];
          const batchName = `batch-${batch.chainId}`;
          // Add all transactions in the batch
          for (let txIdx = 0; txIdx < batch.transactions.length; txIdx++) {
            const tx = batch.transactions[txIdx];
            kit
              .transaction({
                chainId: batch.chainId,
                to: tx.to,
                value: safeBigIntConversion(tx.value),
                data: tx.data,
              })
              .name({ transactionName: `tx-${batch.chainId}-${txIdx}` })
              .addToBatch({ batchName });
          }
        }

        // Estimate all batches
        const batchNames = payload.batches.map(
          (batch) => `batch-${batch.chainId}`
        );
        transactionDebugLog('Estimating payload batches:', batchNames);
        const batchEstimate = await kit.estimateBatches({
          onlyBatchNames: batchNames,
        });
        transactionDebugLog('Payload batches estimated:', batchEstimate);

        if (!batchEstimate.isEstimatedSuccessfully) {
          Sentry.captureMessage('Estimation error during send', {
            level: 'error',
            tags: {
              component: 'send_flow',
              action: 'estimation_error',
              sendId,
            },
            contexts: {
              estimation_error: {
                sendId,
                errorMessage: 'Batch payload estimation failed',
                amount,
              },
            },
          });
          handleError('Batch payload estimation failed');
          return;
        }

        // Cost warning and error handling for each batch
        for (let batchIdx = 0; batchIdx < batchNames.length; batchIdx++) {
          const batchName = batchNames[batchIdx];
          const batchEst = batchEstimate.batches[batchName];
          if (batchEst?.errorMessage) {
            transactionDebugLog(
              'Batch estimation error:',
              batchEst.errorMessage
            );
            Sentry.captureMessage('Estimation error during send', {
              level: 'error',
              tags: {
                component: 'send_flow',
                action: 'estimation_error',
                sendId,
              },
              contexts: {
                estimation_error: {
                  sendId,
                  errorMessage: batchEst.errorMessage,
                  amount,
                },
              },
            });
            handleError(
              batchEst.errorMessage || 'Batch payload estimation failed'
            );
            return;
          }
          // Check cost warning for the first transfer transaction in the batch
          const transferTxEstimate = batchEst?.transactions?.[0];
          if (
            transferTxEstimate &&
            transferTxEstimate.cost &&
            nativeAssetPrice
          ) {
            // Always use 18 decimals for ETH/wei conversion
            const estimatedCost = formatUnits(transferTxEstimate.cost, 18);
            const costAsFiat = +estimatedCost * nativeAssetPrice;
            transactionDebugLog(
              `Batch ${batchName} transfer estimated cost:`,
              estimatedCost,
              'Fiat:',
              costAsFiat
            );

            Sentry.addBreadcrumb({
              category: 'send_flow',
              message: 'Transaction cost estimated',
              level: 'info',
              data: {
                sendId,
                estimatedCost,
                nativeAssetSymbol: getNativeAssetForChainId(
                  selectedAsset?.chainId || 1
                ).symbol,
                costAsFiat,
              },
            });

            // If amountInFiat is available, check warning
            if (
              !ignoreSafetyWarning &&
              amountInFiat &&
              costAsFiat > amountInFiat
            ) {
              setSafetyWarningMessage(
                t`warning.transactionSafety.costHigherThanAmount`
              );
              setIsSending(false);
              transactionDebugLog(
                `Batch ${batchName} cost warning: estimated cost higher than amount`
              );
              return;
            }
          }
        }

        // Send all batches
        transactionDebugLog('Sending payload batches:', batchNames);
        const batchSend = await kit.sendBatches({
          onlyBatchNames: batchNames,
        });
        transactionDebugLog('Payload batches sent:', batchSend);

        if (!batchSend.isSentSuccessfully) {
          Sentry.captureMessage('Sending error during send', {
            level: 'error',
            tags: {
              component: 'send_flow',
              action: 'sending_error',
              sendId,
            },
            contexts: {
              sending_error: {
                sendId,
                errorMessage: 'Batch payload send failed',
                amount,
              },
            },
          });
          handleError('Batch payload send failed');
          return;
        }

        Sentry.addBreadcrumb({
          category: 'send_flow',
          message: 'Transaction sent successfully',
          level: 'info',
          data: {
            sendId,
            sentBatchesCount: Object.keys(batchSend.batches).length || 0,
            estimatedBatchesCount: batchNames.length || 0,
          },
        });

        // For each sent batch, handle userOpHash, WalletConnect, polling
        const allUserOpHashes: string[] = [];
        for (let batchIdx = 0; batchIdx < batchNames.length; batchIdx++) {
          const batchName = batchNames[batchIdx];
          const sentBatch = batchSend.batches[batchName];
          const userOpHash = sentBatch?.userOpHash;
          if (userOpHash) {
            allUserOpHashes.push(userOpHash);
            const chainIdForTxHash = payload.batches[batchIdx].chainId;

            Sentry.addBreadcrumb({
              category: 'send_flow',
              message: 'UserOp hash received',
              level: 'info',
              data: { sendId, userOpHash },
            });

            // WalletConnect: set transaction hash if needed
            if (
              payload?.title === 'WalletConnect Approval Request' ||
              payload?.title === 'WalletConnect Transaction Request'
            ) {
              Sentry.addBreadcrumb({
                category: 'send_flow',
                message: 'Processing WalletConnect transaction',
                level: 'info',
                data: { sendId, payloadTitle: payload?.title },
              });

              const txHash = await kit.getTransactionHash(
                userOpHash,
                chainIdForTxHash
              );
              if (!txHash) {
                setWalletConnectTxHash(undefined);
              } else {
                setWalletConnectTxHash(txHash);
              }
            }

            startUserOpPolling({
              userOpHash,
              chainIdForTxHash,
              recipientAddress: recipient,
              amountSent: Number(amount),
              sendId,
            });
          }
        }

        Sentry.addBreadcrumb({
          category: 'send_flow',
          message: 'Payload onSent callback executed',
          level: 'info',
          data: { sendId, userOpHashesCount: allUserOpHashes.length },
        });

        if (payload.onSent) {
          payload.onSent(allUserOpHashes);
        }
        showHistory();
        setIsSending(false);

        Sentry.captureMessage('Token send transaction completed successfully', {
          level: 'info',
          tags: {
            component: 'send_flow',
            action: 'send_success',
            sendId,
          },
          contexts: {
            send_success: {
              sendId,
              selectedAsset: selectedAsset?.id,
              amount: selectedAsset?.value,
              recipient,
              estimatedCost: null,
              isPaymaster,
              paymasterContext,
              feeType,
              feeAssetOptions,
              selectedFeeAsset,
              selectedPaymasterAddress,
            },
          },
        });
        return;
      }
      // --- PAYLOAD: SINGLE TRANSACTION FLOW ---
      if (isPayloadTransaction) {
        // Paymaster logic is not supported for payload flows

        if (!payloadTx?.to || !isAddress(payloadTx.to)) {
          handleError(
            'Invalid or missing recipient address in payload transaction.'
          );
          return;
        }

        // TO DO - review this logic
        // Convert decimal value to wei if it's a decimal string
        const valueToUse = (() => {
          if (payloadTx?.value === undefined) return '0';

          const valueStr = payloadTx.value.toString();

          // If it's already a numeric string without decimals, assume it's in wei
          if (!valueStr.includes('.') && !isNaN(Number(valueStr))) {
            return valueStr;
          }

          // Convert decimal value to wei using parseUnits
          try {
            return parseUnits(valueStr, 18).toString();
          } catch {
            return '0';
          }
        })();

        const txData = {
          to: payloadTx.to,
          value: valueToUse,
          data: payloadTx?.data || undefined,
        };
        const chainIdToUse = payloadTx?.chainId;

        kit
          .transaction({
            chainId: chainIdToUse,
            to: txData.to,
            value: safeBigIntConversion(txData.value),
            data: txData.data,
          })
          .name({ transactionName: 'tx-payload-single-send' });

        // Estimate (no paymasterDetails)
        transactionDebugLog('Estimating single payload transaction');
        const estimated = await kit.estimate();
        transactionDebugLog('Single payload transaction estimated:', estimated);
        if (estimated.errorMessage) {
          Sentry.captureMessage('Estimation error during send', {
            level: 'error',
            tags: {
              component: 'send_flow',
              action: 'estimation_error',
              sendId,
            },
            contexts: {
              estimation_error: {
                sendId,
                errorMessage: estimated.errorMessage,
                amount,
              },
            },
          });
          handleError(
            'Something went wrong while estimating the asset transfer. Please try again later. If the problem persists, contact the PillarX team for support.'
          );
          return;
        }

        const costAsFiat = handleEstimation(estimated, sendId);
        if (
          !ignoreSafetyWarning &&
          amountInFiat &&
          costAsFiat &&
          costAsFiat > amountInFiat
        ) {
          setSafetyWarningMessage(
            t`warning.transactionSafety.costHigherThanAmount`
          );
          setIsSending(false);
          transactionDebugLog(
            'Single payload transaction cost warning: estimated cost higher than amount'
          );
          return;
        }

        // Send (no paymasterDetails)
        transactionDebugLog('Sending single payload transaction');
        let sent;
        try {
          sent = await kit.send();
          transactionDebugLog('Single payload transaction sent:', sent);

          if (sent.errorMessage) {
            Sentry.captureMessage('Sending error during send', {
              level: 'error',
              tags: {
                component: 'send_flow',
                action: 'sending_error',
                sendId,
              },
              contexts: {
                sending_error: {
                  sendId,
                  errorMessage: sent.errorMessage,
                  amount,
                },
              },
            });
            handleError(
              'Something went wrong while sending the assets, please try again later. If the problem persists, contact the PillarX team for support.'
            );
            return;
          }
        } catch (sendError) {
          Sentry.captureException(sendError, {
            tags: {
              component: 'send_flow',
              action: 'kit_send_error',
              sendId,
            },
            contexts: {
              kit_send_error: {
                sendId,
                error:
                  sendError instanceof Error
                    ? sendError.message
                    : String(sendError),
                amount,
                recipient,
              },
            },
          });
          handleError(
            'Something went wrong while sending the assets, please try again later. If the problem persists, contact the PillarX team for support.'
          );
          return;
        }

        const newUserOpHash = sent.userOpHash;
        transactionDebugLog('Transaction new userOpHash:', newUserOpHash);
        const chainIdForTxHash =
          (payloadTx && payloadTx.chainId) ||
          sent.chainId ||
          etherspotDefaultChainId;
        if (!newUserOpHash) {
          Sentry.captureMessage('Failed to get UserOp hash', {
            level: 'error',
            tags: {
              component: 'send_flow',
              action: 'no_userop_hash',
              sendId,
            },
            contexts: {
              no_userop_hash: {
                sendId,
                amount,
                recipient,
              },
            },
          });
          handleError(t`error.failedToGetTransactionHashReachSupport`);
          return;
        }

        Sentry.addBreadcrumb({
          category: 'send_flow',
          message: 'UserOp hash received',
          level: 'info',
          data: { sendId, userOpHash: newUserOpHash },
        });

        // WalletConnect: set transaction hash if needed
        if (
          payload?.title === 'WalletConnect Approval Request' ||
          payload?.title === 'WalletConnect Transaction Request'
        ) {
          Sentry.addBreadcrumb({
            category: 'send_flow',
            message: 'Processing WalletConnect transaction',
            level: 'info',
            data: { sendId, payloadTitle: payload?.title },
          });

          const txHash = await kit.getTransactionHash(
            newUserOpHash,
            chainIdForTxHash
          );
          if (!txHash) {
            setWalletConnectTxHash(undefined);
          } else {
            setWalletConnectTxHash(txHash);
          }
        }
        if (payload?.onSent && sent) {
          payload.onSent([sent.userOpHash || '']);
        }

        // Use helper for polling
        startUserOpPolling({
          userOpHash: newUserOpHash,
          chainIdForTxHash,
          recipientAddress: recipient,
          amountSent: Number(amount),
          sendId,
        });
        showHistory();
        setIsSending(false);

        Sentry.captureMessage('Token send transaction completed successfully', {
          level: 'info',
          tags: {
            component: 'send_flow',
            action: 'send_success',
            sendId,
          },
          contexts: {
            send_success: {
              sendId,
              selectedAsset: selectedAsset?.id,
              amount: selectedAsset?.value,
              recipient,
              estimatedCost: estimated.cost
                ? formatUnits(estimated.cost, 18)
                : null,
              isPaymaster,
              paymasterContext,
              feeType,
              feeAssetOptions,
              selectedFeeAsset,
              selectedPaymasterAddress,
            },
          },
        });
        return;
      }

      // --- USER INPUT: SINGLE OR BATCH FLOW ---
      // (No payload)
      if (
        !selectedAsset ||
        selectedAsset.type !== 'token' ||
        !('asset' in selectedAsset)
      ) {
        handleError('Only token transfers are supported in this flow.');
        return;
      }

      // --- BATCH FLOW (Paymaster) ---
      if (isPaymaster && selectedPaymasterAddress && selectedFeeAsset) {
        const batchName = 'paymaster-batch';

        // Clear any existing paymaster batch before creating a new one
        const existingBatches = kit.getState().batches;
        if (existingBatches[batchName]) {
          kit.batch({ batchName }).remove();
        }

        // 1. Approval transaction
        kit
          .transaction({
            chainId: selectedAsset.chainId,
            to: selectedFeeAsset.token,
            value: '0',
            data: approveData,
          })
          .name({ transactionName: 'approve' })
          .addToBatch({ batchName });

        // 2. Main transfer transaction
        const valueToSend = isAmountInputAsFiat
          ? amountForPrice.toString()
          : amount;
        const txData = buildTransactionData({
          tokenAddress: selectedAsset.asset.contract,
          recipient,
          amount: valueToSend,
          decimals: selectedAsset.asset.decimals,
        });
        kit
          .transaction({
            chainId: selectedAsset.chainId,
            to: txData.to,
            value: txData.value,
            data: txData.data,
          })
          .name({ transactionName: 'transfer' })
          .addToBatch({ batchName });

        // 3. Estimate batch
        transactionDebugLog('Estimating batch:', batchName);
        const batchEstimate = await kit.estimateBatches({
          onlyBatchNames: [batchName],
          paymasterDetails,
        });
        transactionDebugLog('Batch estimated:', batchEstimate);

        if (
          !batchEstimate.isEstimatedSuccessfully ||
          batchEstimate.batches[batchName]?.errorMessage
        ) {
          transactionDebugLog(
            'Batch estimation error:',
            batchEstimate.batches[batchName]?.errorMessage
          );
          // Clear the failed paymaster batch
          kit.batch({ batchName }).remove();

          Sentry.captureMessage('Estimation error during send', {
            level: 'error',
            tags: {
              component: 'send_flow',
              action: 'estimation_error',
              sendId,
            },
            contexts: {
              estimation_error: {
                sendId,
                errorMessage:
                  batchEstimate.batches[batchName]?.errorMessage ||
                  'Batch estimation failed',
                selectedAsset: selectedAsset?.id,
                amount,
              },
            },
          });
          handleError(
            batchEstimate.batches[batchName]?.errorMessage ||
              'Batch estimation failed'
          );
          return;
        }

        // Cost warning for paymaster batch
        const transferTxEstimate =
          batchEstimate.batches[batchName]?.transactions[1];
        if (transferTxEstimate && transferTxEstimate.cost && nativeAssetPrice) {
          // Always use 18 decimals for ETH/wei conversion
          const estimatedCost = formatUnits(transferTxEstimate.cost, 18);
          const costAsFiat = +estimatedCost * nativeAssetPrice;
          transactionDebugLog(
            'Batch transfer estimated cost:',
            estimatedCost,
            'Fiat:',
            costAsFiat
          );

          Sentry.addBreadcrumb({
            category: 'send_flow',
            message: 'Transaction cost estimated',
            level: 'info',
            data: {
              sendId,
              estimatedCost,
              nativeAssetSymbol: getNativeAssetForChainId(selectedAsset.chainId)
                .symbol,
              costAsFiat,
            },
          });

          if (
            !ignoreSafetyWarning &&
            amountInFiat &&
            costAsFiat > amountInFiat
          ) {
            setSafetyWarningMessage(
              t`warning.transactionSafety.costHigherThanAmount`
            );
            setIsSending(false);
            transactionDebugLog(
              'Batch cost warning: estimated cost higher than amount'
            );
            return;
          }
        }

        // 4. Send batch
        transactionDebugLog('Sending batch:', batchName);
        const batchSend = await kit.sendBatches({
          onlyBatchNames: [batchName],
          paymasterDetails,
        });
        transactionDebugLog('Batch sent:', batchSend);

        if (
          !batchSend.isSentSuccessfully ||
          batchSend.batches[batchName]?.errorMessage
        ) {
          transactionDebugLog(
            'Batch send error:',
            batchSend.batches[batchName]?.errorMessage
          );

          // Clear the failed paymaster batch
          kit.batch({ batchName }).remove();

          Sentry.captureMessage('Sending error during send', {
            level: 'error',
            tags: {
              component: 'send_flow',
              action: 'sending_error',
              sendId,
            },
            contexts: {
              sending_error: {
                sendId,
                errorMessage:
                  batchSend.batches[batchName]?.errorMessage ||
                  'Batch send failed',
                selectedAsset: selectedAsset?.id,
                amount,
              },
            },
          });
          handleError(
            batchSend.batches[batchName]?.errorMessage || 'Batch send failed'
          );
          return;
        }

        Sentry.addBreadcrumb({
          category: 'send_flow',
          message: 'Transaction sent successfully',
          level: 'info',
          data: {
            sendId,
            sentBatchesCount: 1,
            estimatedBatchesCount: 1,
          },
        });

        // Extract userOpHash
        const sentBatch = batchSend.batches[batchName];
        const userOpHash = sentBatch?.userOpHash;

        transactionDebugLog('Transaction new userOpHash:', userOpHash);
        const chainIdForTxHash = selectedAsset.chainId;
        if (!userOpHash) {
          transactionDebugLog('No userOpHash returned after batch send');

          // Clear the failed paymaster batch
          kit.batch({ batchName }).remove();

          Sentry.captureMessage('Failed to get UserOp hash', {
            level: 'error',
            tags: {
              component: 'send_flow',
              action: 'no_userop_hash',
              sendId,
            },
            contexts: {
              no_userop_hash: {
                sendId,
                selectedAsset: selectedAsset?.id,
                amount,
                recipient,
              },
            },
          });
          setErrorMessage(t`error.failedToGetTransactionHashReachSupport`);
          setIsSending(false);
          return;
        }

        Sentry.addBreadcrumb({
          category: 'send_flow',
          message: 'UserOp hash received',
          level: 'info',
          data: { sendId, userOpHash },
        });

        // Use helper for polling
        startUserOpPolling({
          userOpHash,
          chainIdForTxHash,
          recipientAddress: recipient,
          amountSent: Number(amount),
          sendId,
        });

        showHistory();
        setIsSending(false);

        Sentry.captureMessage('Token send transaction completed successfully', {
          level: 'info',
          tags: {
            component: 'send_flow',
            action: 'send_success',
            sendId,
          },
          contexts: {
            send_success: {
              sendId,
              selectedAsset: selectedAsset?.id,
              amount: selectedAsset?.value,
              recipient,
              estimatedCost: transferTxEstimate?.cost
                ? formatUnits(transferTxEstimate.cost, 18)
                : null,
              isPaymaster,
              paymasterContext,
              feeType,
              feeAssetOptions,
              selectedFeeAsset,
              selectedPaymasterAddress,
            },
          },
        });
        return;
      }

      // --- SINGLE TRANSACTION FLOW (no paymaster) ---
      const valueToSend = isAmountInputAsFiat
        ? amountForPrice.toString()
        : amount;
      const txData = buildTransactionData({
        tokenAddress: selectedAsset.asset.contract,
        recipient,
        amount: valueToSend,
        decimals: selectedAsset.asset.decimals,
      });
      // Use the correct chainId for the fee payment method
      const feeChainId = selectedAsset.chainId;

      kit
        .transaction({
          chainId: feeChainId,
          to: txData.to,
          value: txData.value !== undefined ? txData.value.toString() : '0',
          data: txData.data,
        })
        .name({ transactionName: 'tx-single-send' });

      transactionDebugLog('Estimating single transaction');
      const estimated = await kit.estimate();
      transactionDebugLog('Single transaction estimated:', estimated);
      if (estimated.errorMessage) {
        transactionDebugLog(
          'Single transaction estimation error:',
          estimated.errorMessage
        );
        Sentry.captureMessage('Estimation error during send', {
          level: 'error',
          tags: {
            component: 'send_flow',
            action: 'estimation_error',
            sendId,
          },
          contexts: {
            estimation_error: {
              sendId,
              errorMessage: estimated.errorMessage,
              selectedAsset: selectedAsset?.id,
              amount,
            },
          },
        });
        handleError(
          'Something went wrong while estimating the asset transfer. Please try again later. If the problem persists, contact the PillarX team for support.'
        );
        return;
      }

      const costAsFiat = handleEstimation(estimated, sendId);

      if (
        !ignoreSafetyWarning &&
        amountInFiat &&
        costAsFiat &&
        costAsFiat > amountInFiat
      ) {
        setSafetyWarningMessage(
          t`warning.transactionSafety.costHigherThanAmount`
        );
        setIsSending(false);
        transactionDebugLog(
          'Single transaction cost warning: estimated cost higher than amount'
        );
        return;
      }

      if (accountAddress) {
        recordPresence({
          address: accountAddress,
          action: 'actionSendAsset',
          value: selectedAsset?.id,
          data: { ...selectedAsset },
        });
      }

      Sentry.addBreadcrumb({
        category: 'send_flow',
        message: 'Asset presence recorded',
        level: 'info',
        data: { sendId, selectedAsset: selectedAsset?.id },
      });

      // Send
      transactionDebugLog('Sending single transaction');
      const sent = await kit.send();

      transactionDebugLog('Single transaction sent:', sent);
      if (sent.errorMessage) {
        transactionDebugLog(
          'Single transaction send error:',
          sent.errorMessage
        );
        Sentry.captureMessage('Sending error during send', {
          level: 'error',
          tags: {
            component: 'send_flow',
            action: 'sending_error',
            sendId,
          },
          contexts: {
            sending_error: {
              sendId,
              errorMessage: sent.errorMessage,
              selectedAsset: selectedAsset?.id,
              amount,
            },
          },
        });
        handleError(
          'Something went wrong while sending the assets, please try again later. If the problem persists, contact the PillarX team for support.'
        );
        return;
      }

      Sentry.addBreadcrumb({
        category: 'send_flow',
        message: 'Transaction sent successfully',
        level: 'info',
        data: {
          sendId,
          sentBatchesCount: 1,
          estimatedBatchesCount: 1,
        },
      });

      const newUserOpHash = sent.userOpHash;
      transactionDebugLog('Transaction new userOpHash:', newUserOpHash);

      const chainIdForTxHash =
        (payloadTx && payloadTx.chainId) || sent.chainId || 1;

      if (!newUserOpHash) {
        transactionDebugLog(
          'No userOpHash returned after single transaction send'
        );
        Sentry.captureMessage('Failed to get UserOp hash', {
          level: 'error',
          tags: {
            component: 'send_flow',
            action: 'no_userop_hash',
            sendId,
          },
          contexts: {
            no_userop_hash: {
              sendId,
              selectedAsset: selectedAsset?.id,
              amount,
              recipient,
            },
          },
        });
        setErrorMessage(t`error.failedToGetTransactionHashReachSupport`);
        setIsSending(false);
        return;
      }

      Sentry.addBreadcrumb({
        category: 'send_flow',
        message: 'UserOp hash received',
        level: 'info',
        data: { sendId, userOpHash: newUserOpHash },
      });

      // Use helper for polling
      startUserOpPolling({
        userOpHash: newUserOpHash,
        chainIdForTxHash,
        recipientAddress: recipient,
        amountSent: Number(amount),
        sendId,
      });

      showHistory();
      setIsSending(false);

      Sentry.captureMessage('Token send transaction completed successfully', {
        level: 'info',
        tags: {
          component: 'send_flow',
          action: 'send_success',
          sendId,
        },
        contexts: {
          send_success: {
            sendId,
            selectedAsset: selectedAsset?.id,
            amount: selectedAsset?.value,
            recipient,
            estimatedCost: estimated.cost
              ? formatUnits(estimated.cost, 18)
              : null,
            isPaymaster,
            paymasterContext,
            feeType,
            feeAssetOptions,
            selectedFeeAsset,
            selectedPaymasterAddress,
          },
        },
      });
    } catch (error: unknown) {
      Sentry.captureException(error, {
        tags: {
          component: 'send_flow',
          action: 'send_error',
          sendId,
        },
        contexts: {
          send_error: {
            sendId,
            error: error instanceof Error ? error.message : String(error),
            selectedAsset: getAssetSymbol(selectedAsset),
            amount,
            recipient,
          },
        },
      });

      handleError(
        'Something went wrong while sending the assets, please try again later. If the problem persists, contact the PillarX team for support.'
      );
    } finally {
      setIsSending(false);
    }
  };

  // Add to batch for user-driven, non-paymaster, non-payload flows
  const onAddToBatch = async () => {
    if (isSendDisabled) return;
    setErrorMessage('');

    // Only allow batching for user-driven, non-paymaster, non-payload flows
    if (isPaymaster) {
      setErrorMessage(t`error.paymasterNotSupported`);
      return;
    }
    if (isPayloadBatches) {
      setErrorMessage(t`error.batchingNotSupportedForPayloadBatches`);
      return;
    }
    // Prevent batching for WalletConnect flows
    if (payload?.title?.includes('WalletConnect')) {
      setErrorMessage(t`error.batchingNotSupportedForWalletConnect`);
      return;
    }

    let txData: ITransaction;
    let chainId: number | undefined;
    let description = '';

    if (!payload) {
      const valueToSend = isAmountInputAsFiat
        ? amountForPrice.toString()
        : amount;
      if (
        !selectedAsset ||
        selectedAsset.type !== 'token' ||
        !('asset' in selectedAsset)
      ) {
        setErrorMessage(t`error.invalidAssetForBatching`);
        return;
      }
      const builtTxData = buildTransactionData({
        tokenAddress: selectedAsset.asset.contract,
        recipient,
        amount: valueToSend,
        decimals: selectedAsset.asset.decimals,
      });
      txData = {
        ...builtTxData,
        value:
          typeof builtTxData.value === 'bigint'
            ? builtTxData.value
            : String(builtTxData.value ?? ''),
        chainId: Number(selectedAsset.chainId ?? etherspotDefaultChainId),
      };
      chainId = selectedAsset.chainId;
      description =
        transactionDescription(
          selectedAsset,
          parseFloat(valueToSend),
          recipient,
          payload
        ) || '';
    } else if (payload && 'transaction' in payload) {
      // Single payload transaction batching
      const payloadTxAddToBatch = payload.transaction as ITransaction;
      txData = {
        to: payloadTxAddToBatch?.to || '',
        value:
          payloadTxAddToBatch?.value !== undefined
            ? String(payloadTxAddToBatch.value)
            : '0',
        data: payloadTxAddToBatch?.data || undefined,
        chainId:
          payloadTxAddToBatch?.chainId ||
          (selectedAsset && selectedAsset.chainId) ||
          etherspotDefaultChainId,
      };
      chainId = txData.chainId;
      description =
        payload.description || t`helper.transactionWillBeExecutedByApp`;
    } else {
      setErrorMessage(t`error.invalidBatchingScenario`);
      return;
    }

    // Guard: do not add to batch if chainId is undefined
    if (typeof chainId !== 'number') {
      setErrorMessage(t`error.invalidChainIdForBatch`);
      return;
    }

    // Add to kit batch
    const batchName = `batch-${chainId}`;
    const transactionName = `tx-${chainId}-${txData.data}`;
    kit
      .transaction({
        chainId,
        to: txData.to,
        value: safeBigIntConversion(txData.value),
        data: txData.data,
      })
      .name({ transactionName })
      .addToBatch({ batchName });

    // Associate title and description with this transactionName
    setTransactionMetaForName(transactionName, {
      title: t('action.sendAsset'),
      description,
    });

    setShowBatchSendModal(true);
    if (payload) hide();
  };

  const onCancel = () => {
    setRecipient('');
    setSelectedAsset(undefined);
    setAmount('');
    setSafetyWarningMessage('');
    setErrorMessage('');
    setIsSending(false);

    if (payload) {
      setWalletConnectPayload(undefined);
      hide();
    }
  };

  // throw error if both transaction and batches are present in send modal invoked outside menu
  if (payload && 'transaction' in payload && 'batches' in payload) {
    throw new Error(
      'Invalid Send payload: both transaction and batches are present'
    );
  }

  const onAddressClipboardPasteClick = () =>
    pasteFromClipboard((copied) => {
      setRecipient(copied);
      setPasteClicked(true);
    });

  const handleTokenValueChange = (value: string) => {
    // max 6 decimals if no decimals are specified
    const tokenDecimals =
      selectedAsset?.type === 'token' ? selectedAsset.asset.decimals : 6;

    // regex pattern to limit the number of decimals to the max token decimals
    const pattern = `^\\d*\\.?\\d{0,${tokenDecimals}}`;
    const regex = new RegExp(pattern);

    const match = value.match(regex);
    setAmount(match ? match[0] : '');
  };

  const handleCloseTokenSelect = () => {
    setSelectedAsset(undefined);
    setAmount('');
    setRecipient('');
  };

  const handleOnChange = React.useCallback(
    (value: SelectOption) => {
      const tokenOption = feeAssetOptions.filter(
        (option) => option.id === value.id
      )[0] as TokenAssetSelectOption;
      const values = value.id.split('-');
      const tokenAddress = values[0];
      setSelectedFeeAsset({
        token: tokenAddress,
        decimals: Number(values[3]) ?? 18,
        tokenPrice: tokenOption.asset.price?.toString(),
        balance: tokenOption.value?.toString(),
        id: tokenOption.id,
      });
      const paymasterAddress = value.id.split('-')[2];
      setSelectedPaymasterAddress(paymasterAddress);
      setPaymasterContext({
        mode: 'commonerc20',
        token: tokenAddress,
      });
    },
    [feeAssetOptions]
  );

  const handleOnChangeFeeAsset = React.useCallback(
    (value: SelectOption) => {
      setSelectedFeeType(value.title);
      if (value.title === 'Gasless') {
        setPaymasterContext({
          mode: 'commonerc20',
          token: selectedFeeAsset?.token,
        });
        setIsPaymaster(true);
      } else {
        setPaymasterContext(null);
        setIsPaymaster(false);
      }
    },
    [selectedFeeAsset?.token]
  );

  return (
    <>
      {payload && (
        <Card
          title={payload.title}
          content={
            payload.description ?? t`helper.transactionWillBeExecutedByApp`
          }
        />
      )}
      {isPayloadTransaction ? null : (
        <>
          <FormGroup>
            <Label>{t`label.selectAsset`}</Label>
            <AssetSelect
              onClose={handleCloseTokenSelect}
              onChange={setSelectedAsset}
            />
          </FormGroup>
          {selectedAsset?.type === 'token' && (
            <FormGroup>
              <Label>{t`label.enterAmount`}</Label>
              <AmountInputRow id="enter-amount-input-send-modal">
                <TextInput
                  type="number"
                  value={amount}
                  onValueChange={handleTokenValueChange}
                  disabled={!selectedAsset}
                  placeholder="0.00"
                  rightAddon={
                    <AmountInputRight>
                      <AmountInputSymbol>
                        {isAmountInputAsFiat
                          ? 'USD'
                          : selectedAsset.asset.symbol}
                      </AmountInputSymbol>
                      {!isDeploymentCostLoading && maxAmountAvailable > 0 && (
                        <TextInputButton
                          onClick={() => setAmount(`${maxAmountAvailable}`)}
                        >
                          {t`helper.max`}
                          <span>
                            <IconFlash size={16} variant="Bold" />
                          </span>
                        </TextInputButton>
                      )}
                      {selectedAssetPrice !== 0 && (
                        <TextInputButton
                          onClick={() =>
                            setIsAmountInputAsFiat(!isAmountInputAsFiat)
                          }
                        >
                          <ArrangeVerticalIcon size={16} variant="Bold" />
                        </TextInputButton>
                      )}
                    </AmountInputRight>
                  }
                />
              </AmountInputRow>
              {selectedAssetPrice !== 0 && (
                <AmountInputConversion>
                  {isAmountInputAsFiat
                    ? `${formatAmountDisplay(amountForPrice, 0, 6)} ${selectedAsset.asset.symbol}`
                    : `$${formatAmountDisplay(amountInFiat)}`}
                </AmountInputConversion>
              )}
            </FormGroup>
          )}
          {selectedAsset && feeType.length > 0 && (
            <FormGroup>
              <Label>{t`label.feeType`}</Label>
              <Select
                key={`fee-type-select-${selectedFeeType}`}
                type="token"
                onChange={handleOnChangeFeeAsset}
                options={feeType}
                isLoadingOptions={isLoadingFeeOptions}
                defaultSelectedId={
                  feeType.find((option) => option.title === selectedFeeType)
                    ?.id || feeType[0]?.id
                }
              />
              {paymasterContext?.mode === 'commonerc20' &&
                selectedFeeType === 'Gasless' &&
                feeAssetOptions.length > 0 && (
                  <>
                    <Label>{t`label.selectFeeAsset`}</Label>
                    <Select
                      type="token"
                      onChange={handleOnChange}
                      options={feeAssetOptions}
                      isLoadingOptions={isLoadingFeeOptions}
                      defaultSelectedId={
                        selectedFeeAsset?.id ?? feeAssetOptions[0]?.id
                      }
                    />
                  </>
                )}
            </FormGroup>
          )}
          {selectedAsset && (
            <FormGroup>
              <Label>{t`label.sendTo`}</Label>
              <TextInput
                id="send-to-address-input-send-modal"
                type="text"
                value={recipient}
                onValueChange={setRecipient}
                placeholder={t`placeholder.enterAddress`}
                rightAddon={
                  <TextInputButton
                    onClick={
                      pasteClicked
                        ? () => setPasteClicked(false)
                        : onAddressClipboardPasteClick
                    }
                  >
                    {t`action.paste`}
                    <span>
                      {!pasteClicked && <IconClipboardText size={16} />}
                      {pasteClicked && <IconClipboardTick size={16} />}
                    </span>
                  </TextInputButton>
                }
              />
            </FormGroup>
          )}
        </>
      )}
      <SendModalBottomButtons
        onSend={onSend}
        safetyWarningMessage={safetyWarningMessage}
        isSendDisabled={isSendDisabled}
        isSending={isSending}
        errorMessage={errorMessage}
        estimatedCostFormatted={estimatedCostFormatted}
        onAddToBatch={
          payload?.title?.includes('WalletConnect') ? undefined : onAddToBatch
        }
        onCancel={
          payload?.title?.includes('WalletConnect') ? onCancel : undefined
        }
      />
    </>
  );
};

const TextInputButton = styled.div`
  color: ${({ theme }) => theme.color.text.inputButton};
  background: ${({ theme }) => theme.color.background.inputButton};
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 9px;
  gap: 7px;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }

  &:active {
    opacity: 0.4;
  }

  span {
    color: ${({ theme }) => theme.color.icon.inputButton};
  }
`;

const AmountInputRight = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

const AmountInputRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
`;

const AmountInputSymbol = styled.div`
  color: ${({ theme }) => theme.color.text.amountInputInsideSymbol};
  user-select: none;
  margin: 0 4px 0 0;
`;

const AmountInputConversion = styled.div`
  color: ${({ theme }) => theme.color.text.body};
  font-size: 12px;
  text-align: right;
  padding-right: 4px;
  font-weight: 400;
`;

export default SendModalTokensTabView;
