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
import { ethers } from 'ethers';
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
import AssetSelect, { AssetSelectOption } from '../../Form/AssetSelect';
import FormGroup from '../../Form/FormGroup';
import Label from '../../Form/Label';
import TextInput from '../../Form/TextInput';
import Card from '../../Text/Card';
import SendModalBottomButtons from './SendModalBottomButtons';

// providers
import { AccountBalancesContext } from '../../../providers/AccountBalancesProvider';
import { AccountNftsContext } from '../../../providers/AccountNftsProvider';

// hooks
import useAccountBalances from '../../../hooks/useAccountBalances';
import useAccountTransactionHistory from '../../../hooks/useAccountTransactionHistory';
import useBottomMenuModal from '../../../hooks/useBottomMenuModal';
import useDeployWallet from '../../../hooks/useDeployWallet';
import useGlobalTransactionsBatch from '../../../hooks/useGlobalTransactionsBatch';
import { useTransactionDebugLogger } from '../../../hooks/useTransactionDebugLogger';

// services
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
import { SendModalData } from '../../../types';

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
  const [deploymentCost, setDeploymentCost] = React.useState(0);
  const [isDeploymentCostLoading, setIsDeploymentCostLoading] =
    React.useState(true);
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
  const { transactionDebugLog } = useTransactionDebugLogger();
  const { getWalletDeploymentCost } = useDeployWallet();
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
    if (selectedAsset?.type !== 'token' || !selectedAssetBalance) return 0;

    const adjustedBalance = isNativeToken(selectedAsset.asset.contract)
      ? selectedAssetBalance - deploymentCost
      : selectedAssetBalance;

    return isAmountInputAsFiat
      ? selectedAssetPrice * adjustedBalance
      : adjustedBalance;
  }, [
    selectedAsset,
    deploymentCost,
    isAmountInputAsFiat,
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
    isSending ||
    (isRegularSendModal && !isTransactionReady) ||
    Number(amount) > maxAmountAvailable;

  const onSend = async (ignoreSafetyWarning?: boolean) => {
    if (isSendDisabled) {
      transactionDebugLog(
        'Another single transaction is being sent, cannot process the sending of this transaction'
      );
      return;
    }

    // remove previously saved userOp for a new one
    localStorage.removeItem('latestUserOpStatus');
    localStorage.removeItem('latestTransactionHash');
    localStorage.removeItem('latestUserOpInfo');
    localStorage.removeItem('latestUserOpChainId');

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

    transactionDebugLog('Preparing to send transaction');

    const trySend = async (
      maxRetries = 3,
      retryDelay = 2000
    ): Promise<ISentBatches[]> => {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const startTime = performance.now();

          const sent = await send();

          const endTime = performance.now();
          const elapsedMs = endTime - startTime;

          transactionDebugLog(
            `Time taken to send transaction (ms): ${elapsedMs.toFixed(2)}`
          );

          transactionDebugLog(
            `Transaction send succeeded on attempt ${attempt}:`,
            sent
          );

          return sent;
        } catch (error) {
          const rawMessage =
            typeof error === 'string' ? error : JSON.stringify(error);
          transactionDebugLog(`Send attempt ${attempt} failed`, rawMessage);

          const shouldRetry =
            rawMessage.includes(
              'maxFeePerGas must be greater or equal to baseFee'
            ) ||
            rawMessage.includes('fee too low') ||
            rawMessage.includes('User op cannot be replaced');

          if (!shouldRetry || attempt === maxRetries) {
            throw error;
          }

          transactionDebugLog(
            `Retrying send() in ${retryDelay}ms due to gas-related error...`
          );
          await new Promise((resolve) => {
            setTimeout(resolve, retryDelay);
          });
        }
      }
      throw new Error('Retry logic exhausted without success');
    };

    let sent: ISentBatches[];

    try {
      sent = await trySend();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMes = error?.message || 'Unknown send error';
      console.warn('Final send() failed after retries:', errorMes);
      setErrorMessage(errorMes);
      setIsSending(false);
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

      const transactionToSend = sent?.[0]?.batches?.[0]?.transactions?.[0];

      setLatestUserOpInfo(
        transactionDescription(selectedAsset, transactionToSend, payload)
      );

      setLatestUserOpChainId(selectedAsset?.chainId);

      const userOpStatusInterval = 5000; // 5 seconds
      const maxAttempts = 9; // 9 * 5sec = 45sec
      let attempts = 0;

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
            clearInterval(userOperationStatus);
            return;
          }

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
              setTransactionHash(response?.transaction);
            }
          }
        } catch (err) {
          transactionDebugLog('Error getting userOp status:', err);
          clearInterval(userOperationStatus);
          setUserOpStatus('Failed');
        }
      }, userOpStatusInterval);
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
          <EtherspotBatches>
            <EtherspotBatch chainId={payload.transaction.chainId}>
              <EtherspotTransaction
                to={payload.transaction.to}
                value={payload.transaction.value || '0'}
                data={payload.transaction.data || undefined}
              />
            </EtherspotBatch>
          </EtherspotBatches>
        )}
        {'batches' in payload && (
          <EtherspotBatches>
            {payload.batches.map((batch, index) => (
              <EtherspotBatch
                key={`${batch.chainId}-${index}`}
                chainId={batch.chainId}
              >
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
        <EtherspotBatches>
          <EtherspotBatch chainId={selectedAsset.chainId}>
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
