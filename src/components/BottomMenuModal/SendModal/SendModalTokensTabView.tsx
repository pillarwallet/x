/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  EtherspotBatch,
  EtherspotBatches,
  EtherspotContractTransaction,
  EtherspotTokenTransferTransaction,
  EtherspotTransaction,
  ISentBatches,
  useEtherspot,
  useEtherspotPrices,
  useEtherspotTransactions,
  useEtherspotUtils,
  useWalletAddress,
} from '@etherspot/transaction-kit';
import * as Sentry from '@sentry/react';
import { BigNumber, ethers, utils } from 'ethers';
import {
  ArrangeVertical as ArrangeVerticalIcon,
  ClipboardText as IconClipboardText,
  ClipboardTick as IconClipboardTick,
  Flash as IconFlash,
} from 'iconsax-react';
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Address, encodeFunctionData, erc20Abi, parseUnits } from 'viem';

// components
import AssetSelect from '../../Form/AssetSelect';
import FormGroup from '../../Form/FormGroup';
import Label from '../../Form/Label';
import Select from '../../Form/Select';
import TextInput from '../../Form/TextInput';
import Card from '../../Text/Card';
import SendModalBottomButtons from './SendModalBottomButtons';

// providers
import { AccountNftsContext } from '../../../providers/AccountNftsProvider';

// hooks
import useAccountTransactionHistory from '../../../hooks/useAccountTransactionHistory';
import useBottomMenuModal from '../../../hooks/useBottomMenuModal';
import useDeployWallet from '../../../hooks/useDeployWallet';
import useGlobalTransactionsBatch from '../../../hooks/useGlobalTransactionsBatch';
import { useTransactionDebugLogger } from '../../../hooks/useTransactionDebugLogger';

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
  getNativeAssetForChainId,
  isPolygonAssetNative,
  isValidEthereumAddress,
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
  const { isZeroAddress } = useEtherspotUtils();
  const { getPrices } = useEtherspotPrices();
  const { chainId: etherspotDefaultChainId } = useEtherspot();
  const { send, batches } = useEtherspotTransactions();
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
  const accountAddress = useWalletAddress();
  const { addToBatch, setWalletConnectTxHash } = useGlobalTransactionsBatch();
  const [pasteClicked, setPasteClicked] = React.useState<boolean>(false);
  const { getTransactionHash } = useEtherspotTransactions();
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
  const contextNfts = useContext(AccountNftsContext);
  const [selectedPaymasterAddress, setSelectedPaymasterAddress] =
    React.useState<string>('');
  const [selectedFeeAsset, setSelectedFeeAsset] = React.useState<{
    token: string;
    decimals: number;
    tokenPrice?: string;
    balance?: string;
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

  const dispatch = useAppDispatch();
  const walletPortfolio = useAppSelector(
    (state) => state.swap.walletPortfolio as PortfolioData | undefined
  );

  const {
    data: walletPortfolioData,
    isSuccess: isWalletPortfolioDataSuccess,
    error: walletPortfolioDataError,
  } = useGetWalletPortfolioQuery(
    {
      wallet: accountAddress || '',
      isPnl: false,
    },
    { skip: !accountAddress }
  );

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

  const feeTypeOptions = [
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
  ];

  const [feeType, setFeeType] = React.useState(feeTypeOptions);

  useEffect(() => {
    if (!walletPortfolio) return;
    const tokens = convertPortfolioAPIResponseToToken(walletPortfolio);
    if (!selectedAsset) return;
    setQueryString(`?chainId=${selectedAsset.chainId}`);
    getAllGaslessPaymasters(selectedAsset.chainId, tokens).then(
      (paymasterObject) => {
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
            setSelectedFeeAsset({
              token: feeOptions[0].asset.contract,
              decimals: feeOptions[0].asset.decimals,
              tokenPrice: feeOptions[0].asset.price?.toString(),
              balance: feeOptions[0].value?.toString(),
            });
            setSelectedPaymasterAddress(feeOptions[0].id.split('-')[2]);
            if (selectedFeeType === 'Gasless') {
              setPaymasterContext({
                mode: 'commonerc20',
                token: feeOptions[0].asset.contract,
              });
              setIsPaymaster(true);
            }
          } else {
            setIsPaymaster(false);
            setPaymasterContext(null);
            setFeeAssetOptions([]);
            setFeeType([]);
          }
        } else {
          setPaymasterContext(null);
          setIsPaymaster(false);
          setFeeAssetOptions([]);
          setFeeType([]);
        }
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAsset, walletPortfolio]);

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

  const { transactionDebugLog } = useTransactionDebugLogger();
  const { getWalletDeploymentCost, getGasPrice } = useDeployWallet();
  const {
    userOpStatus,
    setTransactionHash,
    setUserOpStatus,
    setLatestUserOpInfo,
    setLatestUserOpChainId,
  } = useAccountTransactionHistory();

  /**
   * Import the recordPresence mutation from the
   * pillarXApiPresence service. We use this to
   * collect data on what apps are being opened
   */
  const [recordPresence] = useRecordPresenceMutation();

  useEffect(() => {
    if (!isSending) {
      contextNfts?.data.setUpdateData(true);
    }

    if (isSending) {
      contextNfts?.data.setUpdateData(false);
    }
  }, [contextNfts?.data, isSending]);

  React.useEffect(() => {
    if (!selectedAsset) return;

    let expired = false;

    (async () => {
      if (selectedAsset.type !== 'token') return;
      const [priceNative] = await getPrices(
        [ethers.constants.AddressZero],
        selectedAsset.chainId
      );
      if (expired) return;
      if (priceNative?.usd) setNativeAssetPrice(priceNative.usd);
      if (selectedAsset.asset.price)
        setSelectedAssetPrice(selectedAsset.asset.price);
    })();

    // eslint-disable-next-line consistent-return
    return () => {
      expired = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAsset]);

  React.useEffect(() => {
    setSafetyWarningMessage('');
  }, [selectedAsset, recipient, amount]);

  React.useEffect(() => {
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

  const amountInFiat = React.useMemo(() => {
    if (selectedAssetPrice === 0) return 0;
    return selectedAssetPrice * +(amount || 0);
  }, [amount, selectedAssetPrice]);

  const amountForPrice = React.useMemo(() => {
    if (selectedAssetPrice === 0) return 0;
    return +(amount || 0) / selectedAssetPrice;
  }, [amount, selectedAssetPrice]);

  const maxAmountAvailable = React.useMemo(() => {
    if (selectedAsset?.type !== 'token' || !selectedAsset.balance) return 0;

    const adjustedBalance = isNativeToken(selectedAsset.asset.contract)
      ? selectedAsset.balance - deploymentCost
      : selectedAsset.balance;

    return isAmountInputAsFiat
      ? selectedAssetPrice * adjustedBalance
      : adjustedBalance;
  }, [selectedAsset, deploymentCost, isAmountInputAsFiat, selectedAssetPrice]);

  React.useEffect(() => {
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

    setIsSending(true);
    setEstimatedCostFormatted('');
    setErrorMessage('');

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
      setIsSending(false);
      setErrorMessage('');

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

    if (isPaymaster && paymasterContext?.mode === 'commonerc20') {
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
        setErrorMessage(t`error.insufficientBalanceForGasless`);
        setIsSending(false);

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

    let sent: ISentBatches[];

    try {
      sent = await send(undefined, {
        retryOnFeeTooLow: true,
        maxRetries: 3,
        feeMultiplier: 1.2, // 20% increase per retry
      });

      Sentry.addBreadcrumb({
        category: 'send_flow',
        message: 'Transaction sent successfully',
        level: 'info',
        data: {
          sendId,
          sentBatchesCount: sent?.length || 0,
          estimatedBatchesCount: sent?.[0]?.estimatedBatches?.length || 0,
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMes =
        'Something went wrong while sending the assets, please try again later. If the problem persists, contact the PillarX team for support.';
      setErrorMessage(errorMes);
      setIsSending(false);

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

      return;
    }

    const estimatedCostBN = sent?.[0]?.estimatedBatches?.[0]?.cost;
    let costAsFiat = 0;
    if (estimatedCostBN) {
      const nativeAsset = getNativeAssetForChainId(
        sent[0].estimatedBatches[0].chainId as number
      );
      const estimatedCost = ethers.utils.formatUnits(
        estimatedCostBN,
        nativeAsset.decimals
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      costAsFiat = +estimatedCost * nativeAssetPrice;

      transactionDebugLog('Transaction estimated cost:', estimatedCost);

      setEstimatedCostFormatted(
        `${formatAmountDisplay(estimatedCost, 0, 6)} ${nativeAsset.symbol}`
      );

      Sentry.addBreadcrumb({
        category: 'send_flow',
        message: 'Transaction cost estimated',
        level: 'info',
        data: {
          sendId,
          estimatedCost,
          nativeAssetSymbol: nativeAsset.symbol,
          costAsFiat,
        },
      });
    } else {
      console.warn('Unable to get estimated cost', sent);

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
            sentData: sent,
          },
        },
      });
    }

    const estimationErrorMessage =
      sent?.[0]?.estimatedBatches?.[0]?.errorMessage;
    if (estimationErrorMessage) {
      setErrorMessage(
        'Something went wrong while estimating the asset transfer. Please try again later. If the problem persists, contact the PillarX team for support.'
      );
      setIsSending(false);

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
            errorMessage: estimationErrorMessage,
            selectedAsset: selectedAsset?.id,
            amount,
          },
        },
      });

      return;
    }

    // TO DO - reintroduce this warning when Transaction Kit 2.0 is released
    // // warning if cost in fiat is higher than amount
    // if (
    //   !ignoreSafetyWarning &&
    //   amountInFiat &&
    //   costAsFiat &&
    //   costAsFiat > amountInFiat
    // ) {
    //   setSafetyWarningMessage(
    //     t`warning.transactionSafety.costHigherThanAmount`
    //   );
    //   setIsSending(false);
    //   return;
    // }

    // Record the sending of this asset
    recordPresence({
      address: accountAddress,
      action: 'actionSendAsset',
      value: selectedAsset?.id,
      data: {
        ...selectedAsset,
      },
    });

    Sentry.addBreadcrumb({
      category: 'send_flow',
      message: 'Asset presence recorded',
      level: 'info',
      data: { sendId, selectedAsset: selectedAsset?.id },
    });

    const sendingErrorMessage = sent?.[0]?.sentBatches?.[0]?.errorMessage;
    if (sendingErrorMessage) {
      setErrorMessage(
        'Something went wrong while sending the assets, please try again later. If the problem persists, contact the PillarX team for support.'
      );
      setIsSending(false);

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
            errorMessage: sendingErrorMessage,
            selectedAsset: selectedAsset?.id,
            amount,
          },
        },
      });

      return;
    }

    const newUserOpHash = sent?.[0]?.sentBatches[0]?.userOpHash;

    transactionDebugLog('Transaction new userOpHash:', newUserOpHash);

    Sentry.addBreadcrumb({
      category: 'send_flow',
      message: 'UserOp hash received',
      level: 'info',
      data: { sendId, userOpHash: newUserOpHash },
    });

    const userOpChainId = sent?.[0]?.sentBatches[0]?.chainId;

    const chainIdForTxHash =
      (payload && 'transaction' in payload && payload.transaction.chainId) ||
      userOpChainId ||
      etherspotDefaultChainId;

    if (newUserOpHash) {
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

        const txHash = await getTransactionHash(
          newUserOpHash,
          chainIdForTxHash
        );
        if (!txHash) {
          setWalletConnectTxHash(undefined);

          Sentry.captureMessage(
            'Failed to get WalletConnect transaction hash',
            {
              level: 'warning',
              tags: {
                component: 'send_flow',
                action: 'walletconnect_no_txhash',
                sendId,
              },
              contexts: {
                walletconnect_error: {
                  sendId,
                  userOpHash: newUserOpHash,
                  chainId: chainIdForTxHash,
                },
              },
            }
          );
        } else {
          setWalletConnectTxHash(txHash);

          Sentry.addBreadcrumb({
            category: 'send_flow',
            message: 'WalletConnect transaction hash received',
            level: 'info',
            data: { sendId, txHash },
          });
        }
      }

      const transactionToSend = sent?.[0]?.batches?.[0]?.transactions?.[0];

      setLatestUserOpInfo(
        transactionDescription(selectedAsset, transactionToSend, payload)
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
        data: { sendId, maxAttempts, interval: userOpStatusInterval },
      });

      const userOperationStatus = setInterval(async () => {
        attempts += 1;
        try {
          const response = await getUserOperationStatus(
            chainIdForTxHash,
            newUserOpHash
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
                  userOpHash: newUserOpHash,
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
            userOpHash: newUserOpHash,
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
                userOpHash: newUserOpHash,
                chainId: chainIdForTxHash,
                attempts,
              },
            }
          );
        }
      }, userOpStatusInterval);
    }

    if (!newUserOpHash) {
      setErrorMessage(t`error.failedToGetTransactionHashReachSupport`);
      setIsSending(false);

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

      return;
    }

    if (payload?.onSent) {
      const allUserOpHashes = sent.reduce((hashes: string[], r) => {
        r.sentBatches.forEach((b) => {
          if (!b.userOpHash) return;
          hashes.push(b.userOpHash);
        });
        return hashes;
      }, []);
      payload.onSent(allUserOpHashes);

      Sentry.addBreadcrumb({
        category: 'send_flow',
        message: 'Payload onSent callback executed',
        level: 'info',
        data: { sendId, userOpHashesCount: allUserOpHashes.length },
      });
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
          estimatedCost: estimatedCostBN
            ? ethers.utils.formatUnits(estimatedCostBN, 18)
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
  };

  const onAddToBatch = async () => {
    if (isSendDisabled) return;
    setErrorMessage('');

    if (isPaymaster) {
      setErrorMessage(t`error.paymasterNotSupported`);
      return;
    }

    const transactionToBatch = batches?.[0]?.batches?.[0]?.transactions?.[0];
    if (!transactionToBatch) {
      setErrorMessage(t`error.failedToGetTransactionDataForBatching`);
      return;
    }

    const chainIdForBatch =
      (payload && 'transaction' in payload && payload.transaction.chainId) ||
      selectedAsset?.chainId ||
      etherspotDefaultChainId;

    transactionDebugLog('Adding transaction to batch:', transactionToBatch);

    addToBatch({
      title: payload?.title || t`action.sendAsset`,
      description:
        payload?.description ||
        transactionDescription(selectedAsset, transactionToBatch, payload),
      chainId: chainIdForBatch,
      ...transactionToBatch,
    });

    setShowBatchSendModal(true);

    // hide modal if invoked from hook
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

  const assetValueToSend = isAmountInputAsFiat ? amountForPrice : amount;

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

  const handleOnChange = (value: SelectOption) => {
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
    });
    const paymasterAddress = value.id.split('-')[2];
    setSelectedPaymasterAddress(paymasterAddress);
  };

  const handleOnChangeFeeAsset = (value: SelectOption) => {
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
  };

  useEffect(() => {
    if (!selectedFeeAsset) return;
    if (isPaymaster && paymasterContext?.mode === 'commonerc20') {
      setPaymasterContext({
        mode: 'commonerc20',
        token: selectedFeeAsset.token,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFeeAsset]);

  const transferFromAbi = {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  };

  if (payload) {
    return (
      <>
        <Card
          title={payload.title}
          content={
            payload.description ?? t`helper.transactionWillBeExecutedByApp`
          }
        />
        {'transaction' in payload && (
          <>
            <EtherspotBatches
              paymaster={
                isPaymaster
                  ? {
                      url: `${paymasterUrl}${queryString}`,
                      context: paymasterContext,
                    }
                  : undefined
              }
              id="batch-1"
            >
              <EtherspotBatch chainId={payload.transaction.chainId}>
                {isPaymaster &&
                  selectedPaymasterAddress &&
                  selectedFeeAsset && (
                    <EtherspotTransaction
                      to={selectedFeeAsset.token}
                      data={approveData}
                    />
                  )}
                <EtherspotTransaction
                  to={payload.transaction.to}
                  value={payload.transaction.value || '0'}
                  data={payload.transaction.data || undefined}
                />
              </EtherspotBatch>
            </EtherspotBatches>
            {feeType.length > 0 && feeAssetOptions.length > 0 && (
              <>
                <Label>{t`label.feeType`}</Label>
                <Select
                  type="token"
                  onChange={handleOnChangeFeeAsset}
                  options={feeType}
                  isLoadingOptions={feeAssetOptions.length === 0}
                  defaultSelectedId={feeType[0].id}
                />
              </>
            )}
            {paymasterContext?.mode === 'commonerc20' &&
              selectedFeeType === 'Gasless' &&
              feeAssetOptions.length > 0 && (
                <>
                  <Label>{t`label.selectFeeAsset`}</Label>
                  <Select
                    type="token"
                    onChange={handleOnChange}
                    options={feeAssetOptions}
                    defaultSelectedId={feeAssetOptions[0]?.id}
                  />
                </>
              )}
          </>
        )}
        {'batches' in payload && (
          <EtherspotBatches
            paymaster={
              isPaymaster
                ? {
                    url: `${paymasterUrl}${queryString}`,
                    context: paymasterContext,
                  }
                : undefined
            }
            id="batch-1"
          >
            {payload.batches.map((batch, index) => (
              <EtherspotBatch
                key={`${batch.chainId}-${index}`}
                chainId={batch.chainId}
              >
                {isPaymaster &&
                  selectedPaymasterAddress &&
                  approveData &&
                  selectedFeeAsset && (
                    <EtherspotTransaction
                      to={selectedFeeAsset.token}
                      data={approveData}
                    />
                  )}
                {batch.transactions.map((transaction, idx) => (
                  <EtherspotTransaction
                    key={`${transaction.to}-${idx}`}
                    to={transaction.to}
                    value={transaction.value || '0'}
                    data={transaction.data || undefined}
                  />
                ))}
              </EtherspotBatch>
            ))}
          </EtherspotBatches>
        )}
        <SendModalBottomButtons
          onSend={onSend}
          safetyWarningMessage={safetyWarningMessage}
          isSendDisabled={isSendDisabled}
          isSending={isSending}
          errorMessage={errorMessage}
          estimatedCostFormatted={estimatedCostFormatted}
          onAddToBatch={onAddToBatch}
          allowBatching={!payload.title.includes('WalletConnect')}
          onCancel={
            !payload.title.includes('WalletConnect') ? undefined : onCancel
          }
        />
      </>
    );
  }

  return (
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
                    {isAmountInputAsFiat ? 'USD' : selectedAsset.asset.symbol}
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
            type="token"
            onChange={handleOnChangeFeeAsset}
            options={feeType}
            isLoadingOptions={feeAssetOptions.length === 0}
            defaultSelectedId={feeType[0].id}
          />
          {paymasterContext?.mode === 'commonerc20' &&
            feeAssetOptions.length > 0 && (
              <>
                <Label>{t`label.selectFeeAsset`}</Label>
                <Select
                  type="token"
                  onChange={handleOnChange}
                  options={feeAssetOptions}
                  defaultSelectedId={feeAssetOptions[0]?.id}
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
      {isTransactionReady && (
        <EtherspotBatches
          paymaster={
            isPaymaster
              ? {
                  url: `${paymasterUrl}${queryString}`,
                  context: paymasterContext,
                }
              : undefined
          }
          id="batch-1"
        >
          <EtherspotBatch chainId={selectedAsset.chainId}>
            {isPaymaster &&
              selectedPaymasterAddress &&
              selectedFeeAsset &&
              approveData && (
                <EtherspotTransaction
                  to={selectedFeeAsset.token}
                  data={approveData}
                />
              )}
            {selectedAsset?.type === 'nft' && (
              <EtherspotContractTransaction
                contractAddress={selectedAsset.collection.contractAddress}
                methodName="transferFrom"
                abi={[transferFromAbi]}
                params={[
                  accountAddress as string,
                  recipient,
                  selectedAsset.nft.tokenId,
                ]}
              />
            )}
            {selectedAsset?.type === 'token' && (
              <>
                {(isZeroAddress(selectedAsset.asset.contract) ||
                  isPolygonAssetNative(
                    selectedAsset.asset.contract,
                    selectedAsset.chainId
                  )) && (
                  <EtherspotTransaction
                    to={recipient}
                    value={formatAmountDisplay(
                      assetValueToSend,
                      0,
                      selectedAsset.asset.decimals
                    )}
                  />
                )}
                {!isZeroAddress(selectedAsset.asset.contract) &&
                  !isPolygonAssetNative(
                    selectedAsset.asset.contract,
                    selectedAsset.chainId
                  ) && (
                    <EtherspotTokenTransferTransaction
                      receiverAddress={recipient}
                      tokenAddress={selectedAsset.asset.contract}
                      value={formatAmountDisplay(
                        assetValueToSend,
                        0,
                        selectedAsset.asset.decimals
                      )}
                      tokenDecimals={selectedAsset.asset.decimals}
                    />
                  )}
              </>
            )}
          </EtherspotBatch>
        </EtherspotBatches>
      )}
      <SendModalBottomButtons
        onSend={onSend}
        safetyWarningMessage={safetyWarningMessage}
        isSendDisabled={isSendDisabled}
        isSending={isSending}
        errorMessage={errorMessage}
        estimatedCostFormatted={estimatedCostFormatted}
        onAddToBatch={onAddToBatch}
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
