/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { Address, encodeFunctionData, erc20Abi, parseUnits } from 'viem';
import {
  EtherspotBatch,
  EtherspotBatches,
  EtherspotContractTransaction,
  EtherspotTokenTransferTransaction,
  EtherspotTransaction,
  useEtherspot,
  useEtherspotPrices,
  useEtherspotTransactions,
  useEtherspotUtils,
  useWalletAddress,
} from '@etherspot/transaction-kit';
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

// components
import AssetSelect, {
  AssetSelectOption,
  TokenAssetSelectOption,
} from '../../Form/AssetSelect';
import FormGroup from '../../Form/FormGroup';
import Label from '../../Form/Label';
import TextInput from '../../Form/TextInput';
import Card from '../../Text/Card';
import SendModalBottomButtons from './SendModalBottomButtons';
import Select, { SelectOption } from '../../Form/Select';

// providers
import { AccountBalancesContext } from '../../../providers/AccountBalancesProvider';
import { AccountNftsContext } from '../../../providers/AccountNftsProvider';

// hooks
import useAccountBalances from '../../../hooks/useAccountBalances';
import useBottomMenuModal from '../../../hooks/useBottomMenuModal';
import useGlobalTransactionsBatch from '../../../hooks/useGlobalTransactionsBatch';
import { useTransactionDebugLogger } from '../../../hooks/useTransactionDebugLogger';

// services
import { useRecordPresenceMutation } from '../../../services/pillarXApiPresence';
import {
  getAllGaslessPaymasters,
  getGasPrice,
} from '../../../services/gasless';

// utils
import {
  decodeSendTokenCallData,
  getNativeAssetForChainId,
  isPolygonAssetNative,
  isValidEthereumAddress,
} from '../../../utils/blockchain';
import { pasteFromClipboard } from '../../../utils/common';
import { formatAmountDisplay, isValidAmount } from '../../../utils/number';

// types
import { processEth } from '../../../apps/the-exchange/utils/blockchain';
import { SendModalData } from '../../../types';
import {
  chainNameToChainIdTokensData,
  Token,
} from '../../../services/tokensData';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../apps/the-exchange/hooks/useReducerHooks';
import {
  convertPortfolioAPIResponseToToken,
  useGetWalletPortfolioQuery,
} from '../../../services/pillarXApiWalletPortfolio';
import { PortfolioData } from '../../../types/api';
import { setWalletPortfolio } from '../../../apps/the-exchange/reducer/theExchangeSlice';

const getAmountLeft = (
  selectedAsset: AssetSelectOption | undefined,
  amount: string,
  selectedAssetBalance: number | undefined
): string | number => {
  if (!selectedAsset || selectedAsset?.type !== 'token') return '0.00';
  if (!selectedAssetBalance) return '0.00';
  return selectedAssetBalance - +(amount || 0);
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
  const { addressesEqual } = useEtherspotUtils();
  const accountAddress = useWalletAddress();
  const { addToBatch, setWalletConnectTxHash } = useGlobalTransactionsBatch();
  const [pasteClicked, setPasteClicked] = React.useState<boolean>(false);
  const accountBalances = useAccountBalances();
  const { getTransactionHash } = useEtherspotTransactions();
  const {
    hide,
    showHistory,
    showBatchSendModal,
    setShowBatchSendModal,
    setWalletConnectPayload,
  } = useBottomMenuModal();
  const contextNfts = useContext(AccountNftsContext);
  const contextBalances = useContext(AccountBalancesContext);
  const paymasterUrl = process.env.REACT_APP_PAYMASTER_URL;
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
  }>();
  const [feeAssetOptions, setFeeAssetOptions] = React.useState<
    TokenAssetSelectOption[]
  >([]);
  const [queryString, setQueryString] = React.useState<string>(
    `?apiKey=${process.env.REACT_APP_PAYMASTER_API_KEY}`
  );
  const [approveData, setApproveData] = React.useState<string>('');
  const [gasPrice, setGasPrice] = React.useState<string>();
  const [feeMin, setFeeMin] = React.useState<string>();

  const dispatch = useAppDispatch();
  const walletPortfolio = useAppSelector(
    (state) => state.swap.walletPortfolio as PortfolioData | undefined
  );

  const {
    data: walletPortfolioData,
    isSuccess: isWalletPortfolioDataSuccess,
    error: walletPortfolioDataError,
  } = useGetWalletPortfolioQuery({ wallet: accountAddress || '' });

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

  const [feeType, setFeeType] = React.useState([
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
  ]);

  useEffect(() => {
    if (!walletPortfolio) return;
    const tokens = convertPortfolioAPIResponseToToken(walletPortfolio);
    if (!selectedAsset) return;
    setQueryString(
      `?apiKey=${process.env.REACT_APP_PAYMASTER_API_KEY}&chainId=${selectedAsset.chainId}&useVp=true`
    );
    getAllGaslessPaymasters(selectedAsset.chainId, tokens).then(
      (paymasterObject) => {
        // eslint-disable-next-line no-console
        console.log(paymasterObject);
        if (paymasterObject) {
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
                    token.contract === item.gasToken.toLowerCase()
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
                  } as TokenAssetSelectOption;
              }
            )
            .filter(
              (value): value is TokenAssetSelectOption => value !== undefined
            );
          if (feeOptions && feeOptions.length > 0 && feeOptions[0]) {
            setFeeAssetOptions(feeOptions);
            // get Skandha gas price
            getGasPrice(selectedAsset.chainId).then((res) => {
              setGasPrice(res);
            });
            setSelectedFeeAsset({
              token: feeOptions[0].asset.contract,
              decimals: feeOptions[0].asset.decimals,
            });
            setSelectedPaymasterAddress(feeOptions[0].id.split('-')[2]);
            setPaymasterContext({
              mode: 'commonerc20',
              token: feeOptions[0].asset.contract,
            });
            setIsPaymaster(true);
          } else {
            setFeeType([]);
          }
        } else {
          setPaymasterContext(null);
          setIsPaymaster(false);
          setFeeType([]);
        }
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAsset, walletPortfolio]);

  const setApprovalData = async (gasCost: number) => {
    if (selectedFeeAsset && gasPrice) {
      const estimatedCost = Number(
        utils.formatEther(BigNumber.from(gasCost).mul(gasPrice))
      );
      const costAsFiat = +estimatedCost * nativeAssetPrice;
      const feeTokenPrice = await getPrices([selectedFeeAsset.token]);
      let estimatedCostInToken;
      if (feeTokenPrice) {
        const feeTokenPriceInUSD = feeTokenPrice[0].usd;
        estimatedCostInToken = (costAsFiat / feeTokenPriceInUSD).toFixed(
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
    if (selectedAsset.chainId === 42161) {
      if (selectedAsset.type === 'token') {
        if (selectedAsset.asset.contract === ethers.constants.AddressZero) {
          gasCost = Number(
            process.env.REACT_APP_NATIVE_GAS_CONSUMPTION_ARBITRUM
          ); // estimated gas consumption for native asset transfer for undeployed wallet + 15% markup
        } else {
          gasCost = Number(
            process.env.REACT_APP_TOKEN_GAS_CONSUMPTION_ARBITRUM
          ); // estimated gas consumption for token asset transfer for undeployed wallet + 15% markup
        }
      } else if (selectedAsset.type === 'nft') {
        gasCost = Number(process.env.REACT_APP_NFT_GAS_CONSUMPTION_ARBITRUM); // estimated gas consumption for token asset transfer for undeployed wallet + 15% markup
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (selectedAsset.type === 'token') {
        if (selectedAsset.asset.contract === ethers.constants.AddressZero) {
          gasCost = Number(process.env.REACT_APP_NATIVE_GAS_CONSUMPTION); // estimated gas consumption for native asset transfer for deployed wallet + 15% markup
        } else {
          gasCost = Number(process.env.REACT_APP_TOKEN_GAS_CONSUMPTION); // estimated gas consumption for token asset transfer for deployed wallet + 15% markup
        }
      } else if (selectedAsset.type === 'nft') {
        gasCost = Number(process.env.REACT_APP_NFT_GAS_CONSUMPTION); // estimated gas consumption for token asset transfer for deployed wallet + 15% markup
      }
    }
    setApprovalData(gasCost);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gasPrice, selectedFeeAsset]);

  const { transactionDebugLog } = useTransactionDebugLogger();

  /**
   * Import the recordPresence mutation from the
   * pillarXApiPresence service. We use this to
   * collect data on what apps are being opened
   */
  const [recordPresence] = useRecordPresenceMutation();

  useEffect(() => {
    if (!isSending) {
      contextNfts?.data.setUpdateData(true);
      contextBalances?.data.setUpdateData(true);
    }

    if (isSending) {
      contextNfts?.data.setUpdateData(false);
      contextBalances?.data.setUpdateData(false);
    }
  }, [contextNfts?.data, contextBalances?.data, isSending]);

  const selectedAssetBalance = React.useMemo(() => {
    if (!selectedAsset || selectedAsset.type !== 'token') return 0;
    const assetBalance = accountBalances?.[selectedAsset.chainId]?.[
      accountAddress as string
    ]?.find(
      (b) =>
        (b.token === null && isZeroAddress(selectedAsset.asset.contract)) ||
        addressesEqual(b.token, selectedAsset.asset.contract)
    )?.balance;
    return assetBalance
      ? +ethers.utils.formatUnits(assetBalance, selectedAsset.asset.decimals)
      : 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAsset, accountBalances, accountAddress]);

  React.useEffect(() => {
    if (!selectedAsset) return;

    let expired = false;

    (async () => {
      if (selectedAsset.type !== 'token') return;
      const [priceNative, priceSelected] = await getPrices(
        [ethers.constants.AddressZero, selectedAsset.asset.contract],
        selectedAsset.chainId
      );
      if (expired) return;
      if (priceNative?.usd) setNativeAssetPrice(priceNative.usd);
      if (priceSelected?.usd) setSelectedAssetPrice(priceSelected.usd);
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

  const amountInFiat = React.useMemo(() => {
    if (selectedAssetPrice === 0) return 0;
    return selectedAssetPrice * +(amount || 0);
  }, [amount, selectedAssetPrice]);

  const amountForPrice = React.useMemo(() => {
    if (selectedAssetPrice === 0) return 0;
    return +(amount || 0) / selectedAssetPrice;
  }, [amount, selectedAssetPrice]);

  const maxAmountAvailable = React.useMemo(() => {
    if (selectedAsset?.type !== 'token' || !selectedAssetBalance) return 0;
    return isAmountInputAsFiat
      ? selectedAssetPrice * selectedAssetBalance
      : selectedAssetBalance;
  }, [
    isAmountInputAsFiat,
    selectedAsset?.type,
    selectedAssetPrice,
    selectedAssetBalance,
  ]);

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
      +getAmountLeft(selectedAsset, amount, selectedAssetBalance) >= 0);

  const isSendModalInvokedFromHook = !!payload;
  const isRegularSendModal = !isSendModalInvokedFromHook && !showBatchSendModal;
  const isSendDisabled =
    isSending || (isRegularSendModal && !isTransactionReady);

  const onSend = async (ignoreSafetyWarning?: boolean) => {
    if (isSendDisabled) {
      transactionDebugLog(
        'Another single transaction is being sent, cannot process the sending of this transaction'
      );
      return;
    }
    setIsSending(true);
    setEstimatedCostFormatted('');
    setErrorMessage('');

    // warning if sending more than half of the balance
    if (
      !ignoreSafetyWarning &&
      selectedAsset?.type === 'token' &&
      selectedAssetBalance &&
      selectedAssetBalance / 2 < +amount
    ) {
      setSafetyWarningMessage(
        t`warning.transactionSafety.amountMoreThanHalfOfBalance`
      );
      setIsSending(false);
      setErrorMessage('');
      return;
    }

    if (isPaymaster && paymasterContext?.mode === 'commonerc20') {
      const amountLeft = +getAmountLeft(
        selectedAsset,
        amount,
        selectedAssetBalance
      );
      if (!feeMin) return;
      if (amountLeft < +feeMin) {
        setErrorMessage(t`error.insufficientBalanceForGasless`);
        setIsSending(false);
        return;
      }
    }

    transactionDebugLog('Preparing to send transaction');

    const startTime = performance.now();

    const sent = await send();

    const endTime = performance.now();
    const elapsedMs = endTime - startTime;

    transactionDebugLog(
      `Time taken to send transaction (ms): ${elapsedMs.toFixed(2)}`
    );

    transactionDebugLog('Transaction send details:', sent);

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
      costAsFiat = +estimatedCost * nativeAssetPrice;

      transactionDebugLog('Transaction estimated cost:', estimatedCost);

      setEstimatedCostFormatted(
        `${formatAmountDisplay(estimatedCost, 0, 6)} ${nativeAsset.symbol}`
      );
    } else {
      console.warn('Unable to get estimated cost', sent);
    }

    const estimationErrorMessage =
      sent?.[0]?.estimatedBatches?.[0]?.errorMessage;
    if (estimationErrorMessage) {
      setErrorMessage(estimationErrorMessage);
      setIsSending(false);
      return;
    }

    // warning if cost in fiat is higher than amount
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
      return;
    }

    // Record the sending of this asset
    recordPresence({
      address: accountAddress,
      action: 'actionSendAsset',
      value: selectedAsset?.id,
      data: {
        ...selectedAsset,
      },
    });

    const sendingErrorMessage = sent?.[0]?.sentBatches?.[0]?.errorMessage;
    if (sendingErrorMessage) {
      setErrorMessage(sendingErrorMessage);
      setIsSending(false);
      return;
    }

    const newUserOpHash = sent?.[0]?.sentBatches[0]?.userOpHash;

    transactionDebugLog('Transaction new userOpHash:', newUserOpHash);

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
        const txHash = await getTransactionHash(
          newUserOpHash,
          chainIdForTxHash
        );
        if (!txHash) {
          setWalletConnectTxHash(undefined);
        } else {
          setWalletConnectTxHash(txHash);
        }
      }
    }

    if (!newUserOpHash) {
      setErrorMessage(t`error.failedToGetTransactionHashReachSupport`);
      setIsSending(false);
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
    }

    showHistory();
    setIsSending(false);
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

    const transactionDescription = () => {
      if (selectedAsset?.type === 'token') {
        if (transactionToBatch?.value) {
          return `${processEth(transactionToBatch.value as BigNumber, selectedAsset.asset.decimals)} ${selectedAsset.asset.symbol} to ${transactionToBatch.to.substring(0, 6)}...${transactionToBatch.to.substring(transactionToBatch.to.length - 5)}`;
        }
        if (!transactionToBatch?.value && transactionToBatch?.data) {
          const decodedTransferData = decodeSendTokenCallData(
            transactionToBatch.data
          );
          return `${processEth(decodedTransferData[1] as BigNumber, selectedAsset.asset.decimals)} ${selectedAsset.asset.symbol} to ${decodedTransferData[0].substring(0, 6)}...${decodedTransferData[0].substring(transactionToBatch.to.length - 5)}`;
        }
      }

      return payload?.description;
    };

    transactionDebugLog('Adding transaction to batch:', transactionToBatch);

    addToBatch({
      title: payload?.title || t`action.sendAsset`,
      description: payload?.description || transactionDescription(),
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
    const values = value.id.split('-');
    const tokenAddress = values[0];
    setSelectedFeeAsset({
      token: tokenAddress,
      decimals: Number(values[3]) ?? 18,
    });
    const paymasterAddress = value.id.split('-')[2];
    setSelectedPaymasterAddress(paymasterAddress);
  };

  const handleOnChangeFeeAsset = (value: SelectOption) => {
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
            {feeType.length > 0 && (
              <>
                <Label>{t`label.feeType`}</Label>
                <Select
                  type="token"
                  onChange={handleOnChangeFeeAsset}
                  options={feeType}
                  defaultSelectedId={feeType[0].id}
                />
              </>
            )}
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
                  {maxAmountAvailable > 0 && (
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
