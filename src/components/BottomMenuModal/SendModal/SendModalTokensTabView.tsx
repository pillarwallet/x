import {
  EtherspotBatch,
  EtherspotBatches,
  EtherspotContractTransaction,
  EtherspotTokenTransferTransaction,
  EtherspotTransaction, useEtherspot,
  useEtherspotPrices,
  useEtherspotTransactions,
  useEtherspotUtils,
  useWalletAddress
} from '@etherspot/transaction-kit';
import { ethers } from 'ethers';
import {
  ArrangeVertical as ArrangeVerticalIcon,
  ClipboardText as IconClipboardText,
  ClipboardTick as IconClipboardTick,
  Flash as IconFlash,
} from 'iconsax-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

// components
import AssetSelect, { AssetSelectOption } from '../../Form/AssetSelect';
import FormGroup from '../../Form/FormGroup';
import Label from '../../Form/Label';
import TextInput from '../../Form/TextInput';
import Card from '../../Text/Card';
import SendModalBottomButtons from './SendModalBottomButtons';

// hooks
import useAccountBalances from '../../../hooks/useAccountBalances';
import useBottomMenuModal from '../../../hooks/useBottomMenuModal';
import useGlobalTransactionsBatch from '../../../hooks/useGlobalTransactionsBatch';

// services
import { useRecordPresenceMutation } from '../../../services/pillarXApiPresence';

// utils
import { getNativeAssetForChainId, isValidEthereumAddress } from '../../../utils/blockchain';
import { pasteFromClipboard } from '../../../utils/common';
import { formatAmountDisplay, isValidAmount } from '../../../utils/number';

// types
import { SendModalData } from './index';

const getAmountLeft = (
  selectedAsset: AssetSelectOption | undefined,
  amount: string,
  selectedAssetBalance: number | undefined,
): string | number => {
  if (!selectedAsset || selectedAsset?.type !== 'token') return '0.00';
  if (!selectedAssetBalance) return '0.00';
  return selectedAssetBalance - +(amount || 0);
}

const SendModalTokensTabView = ({ payload }: { payload?: SendModalData }) => {
  const [t] = useTranslation();
  const [recipient, setRecipient] = React.useState<string>('');
  const [selectedAsset, setSelectedAsset] = React.useState<AssetSelectOption | undefined>(undefined);
  const [amount, setAmount] = React.useState<string>('');
  const [selectedAssetPrice, setSelectedAssetPrice] = React.useState<number>(0);
  const [nativeAssetPrice, setNativeAssetPrice] = React.useState<number>(0);
  const { isZeroAddress } = useEtherspotUtils();
  const { getPrices } = useEtherspotPrices();
  const { chainId: etherspotDefaultChainId } = useEtherspot();
  const { send, estimate, batches } = useEtherspotTransactions();
  const [isAmountInputAsFiat, setIsAmountInputAsFiat] = React.useState<boolean>(false);
  const [isSending, setIsSending] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [estimatedCostFormatted, setEstimatedCostFormatted] = React.useState<string>('');
  const [safetyWarningMessage, setSafetyWarningMessage] = React.useState<string>('');
  const { addressesEqual } = useEtherspotUtils();
  const accountAddress = useWalletAddress();
  const { addToBatch } = useGlobalTransactionsBatch();
  const [pasteClicked, setPasteClicked] = React.useState<boolean>(false);
  const accountBalances = useAccountBalances();
  const { hide, showHistory, showBatchSendModal, setShowBatchSendModal} = useBottomMenuModal();
  /**
   * Import the recordPresence mutation from the
   * pillarXApiPresence service. We use this to
   * collect data on what apps are being opened
   */
  const [recordPresence] = useRecordPresenceMutation();

  const selectedAssetBalance = React.useMemo(() => {
    if (!selectedAsset || selectedAsset.type !== 'token') return 0;
    const assetBalance = accountBalances
      ?.[selectedAsset.chainId]
      ?.[accountAddress as string]
      ?.find((b) => (b.token === null && isZeroAddress(selectedAsset.asset.address))
        || addressesEqual(b.token, selectedAsset.asset.address))
      ?.balance;
    return assetBalance ? +ethers.utils.formatUnits(assetBalance, selectedAsset.asset.decimals) : 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAsset, accountBalances, accountAddress]);

  React.useEffect(() => {
    if (!selectedAsset) return;

    let expired = false;

    (async () => {
      if (selectedAsset.type !== 'token') return;
      const [priceNative, priceSelected] = await getPrices(
        [ethers.constants.AddressZero, selectedAsset.asset.address],
        selectedAsset.chainId,
      );
      if (expired) return;
      if (priceNative?.usd) setNativeAssetPrice(priceNative.usd);
      if (priceSelected?.usd) setSelectedAssetPrice(priceSelected.usd);
    })();

    return () => {
      expired = true;
    }
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
  }, [isAmountInputAsFiat, selectedAsset?.type, selectedAssetPrice, selectedAssetBalance]);

  React.useEffect(() => {
    const addressPasteActionTimeout = setTimeout(() => {
      setPasteClicked(false);
    }, 500);

    return () => {
      clearTimeout(addressPasteActionTimeout);
    }
  }, [pasteClicked]);

  const isTransactionReady = isValidEthereumAddress(recipient)
    && !!selectedAsset
    && (selectedAsset?.type !== 'token' || isValidAmount(amount))
    && (selectedAsset?.type !== 'token' || +getAmountLeft(selectedAsset, amount, selectedAssetBalance) >= 0);

  const isSendModalInvokedFromHook = !!payload;
  const isRegularSendModal = !isSendModalInvokedFromHook && !showBatchSendModal;
  const isSendDisabled = isSending || (isRegularSendModal && !isTransactionReady);

  const onSend = async (ignoreSafetyWarning?: boolean) => {
    if (isSendDisabled) return;
    setIsSending(true);
    setEstimatedCostFormatted('');
    setErrorMessage('');

    // warning if sending more than half of the balance
    if (!ignoreSafetyWarning
      && selectedAsset?.type === 'token'
      && selectedAssetBalance
      && (selectedAssetBalance / 2) < +amount) {
      setSafetyWarningMessage(t`warning.transactionSafety.amountMoreThanHalfOfBalance`);
      setIsSending(false);
      setErrorMessage('');
      return;
    }

    const estimated = await estimate();

    const estimatedCostBN = estimated?.[0]?.estimatedBatches?.[0]?.cost;
    let costAsFiat = 0;
    if (estimatedCostBN) {
      const nativeAsset = getNativeAssetForChainId(estimated[0].estimatedBatches[0].chainId as number);
      const estimatedCost = ethers.utils.formatUnits(estimatedCostBN, nativeAsset.decimals);
      costAsFiat = +estimatedCost * nativeAssetPrice;
      setEstimatedCostFormatted(`${formatAmountDisplay(estimatedCost, 0, 6)} ${nativeAsset.symbol}`);
    } else {
      console.warn('Unable to get estimated cost', estimated);
    }

    const estimationErrorMessage = estimated?.[0]?.estimatedBatches?.[0]?.errorMessage
    if (estimationErrorMessage) {
      setErrorMessage(estimationErrorMessage);
      setIsSending(false);
      return;
    }

    // warning if cost in fiat is higher than amount
    if (!ignoreSafetyWarning && amountInFiat && costAsFiat && costAsFiat > amountInFiat) {
      setSafetyWarningMessage(t`warning.transactionSafety.costHigherThanAmount`);
      setIsSending(false);
      return;
    }

    // Record the sending of this asset
    recordPresence({
      address: accountAddress,
      action: 'actionSendAsset',
      value: selectedAsset?.id,
      data: {
        ...selectedAsset
      }
    })

    const sent = await send();

    const sendingErrorMessage = sent?.[0]?.sentBatches?.[0]?.errorMessage
    if (sendingErrorMessage) {
      setErrorMessage(sendingErrorMessage);
      setIsSending(false);
      return;
    }

    const newUserOpHash = sent?.[0]?.sentBatches[0]?.userOpHash;
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
  }

  const onAddToBatch = async () => {
    if (isSendDisabled) return;
    setErrorMessage('');

    const transactionToBatch = batches?.[0]?.batches?.[0]?.transactions?.[0];
    if (!transactionToBatch) {
      setErrorMessage(t`error.failedToGetTransactionDataForBatching`);
      return;
    }

    const chainIdForBatch = (payload && 'transaction' in payload && payload.transaction.chainId)
      || selectedAsset?.chainId
      || etherspotDefaultChainId;

    addToBatch({
      title: payload?.title || t`action.sendAsset`,
      description: payload?.description,
      chainId: chainIdForBatch,
      ...transactionToBatch,
    });

    setShowBatchSendModal(true);

    // hide modal if invoked from hook
    if (payload) hide();
  }

  const assetValueToSend = isAmountInputAsFiat ? amountForPrice : amount;

  // throw error if both transaction and batches are present in send modal invoked outside menu
  if (payload && 'transaction' in payload && 'batches' in payload) {
    throw new Error('Invalid Send payload: both transaction and batches are present');
  }

  const onAddressClipboardPasteClick = () => pasteFromClipboard((copied) => {
    setRecipient(copied);
    setPasteClicked(true);
  });

  if (payload) {
    return (
      <>
        <Card
          title={payload.title}
          content={payload.description ?? t`helper.transactionWillBeExecutedByApp`}
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
              <EtherspotBatch key={`${batch.chainId}-${index}`} chainId={batch.chainId}>
                {batch.transactions.map((transaction, index) => (
                  <EtherspotTransaction
                    key={`${transaction.to}-${index}`}
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
        />
      </>
    );
  }

  return (
    <>
      <FormGroup>
        <Label>{t`label.selectAsset`}</Label>
        <AssetSelect onChange={setSelectedAsset} />
      </FormGroup>
      {selectedAsset?.type === 'token' && (
        <FormGroup>
          <Label>{t`label.enterAmount`}</Label>
          <AmountInputRow>
            <TextInput
              value={amount}
              onValueChange={setAmount}
              disabled={!selectedAsset}
              placeholder="0.00"
              rightAddon={
                <AmountInputRight>
                  <AmountInputSymbol>{isAmountInputAsFiat ? 'USD' : selectedAsset.asset.symbol}</AmountInputSymbol>
                  {maxAmountAvailable > 0 && (
                    <TextInputButton onClick={() => setAmount(`${maxAmountAvailable}`)}>
                      {t`helper.max`}
                      <span>
                      <IconFlash size={16} variant="Bold"/>
                    </span>
                    </TextInputButton>
                  )}
                  {selectedAssetPrice !== 0 && (
                    <TextInputButton onClick={() => setIsAmountInputAsFiat(!isAmountInputAsFiat)}>
                      <ArrangeVerticalIcon size={16} variant="Bold"/>
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
                : `$${formatAmountDisplay(amountInFiat)}`
              }
            </AmountInputConversion>
          )}
        </FormGroup>
      )}
      {selectedAsset &&
        <FormGroup>
          <Label>{t`label.sendTo`}</Label>
          <TextInput
            value={recipient}
            onValueChange={setRecipient}
            placeholder={t`placeholder.enterAddress`}
            rightAddon={(
              <TextInputButton onClick={pasteClicked ? () => setPasteClicked(false) : onAddressClipboardPasteClick}>
                {t`action.paste`}
                <span>
                  {!pasteClicked && <IconClipboardText size={16} />}
                  {pasteClicked && <IconClipboardTick size={16} />}
                </span>
              </TextInputButton>
            )}
          />
        </FormGroup>
      }
      {isTransactionReady && (
        <EtherspotBatches>
          <EtherspotBatch chainId={selectedAsset.chainId}>
            {selectedAsset?.type === 'nft' && (
              <EtherspotContractTransaction
                contractAddress={selectedAsset.collection.contractAddress}
                methodName={'transferFrom'}
                abi={['function transferFrom(address from, address to, uint256 tokenId) external']}
                params={[accountAddress as string, recipient, selectedAsset.nft.tokenId]}
              />
            )}
            {selectedAsset?.type === 'token' && (
              <>
                {isZeroAddress(selectedAsset.asset.address) && (
                  <EtherspotTransaction
                    to={recipient}
                    value={assetValueToSend}
                  />
                )}
                {!isZeroAddress(selectedAsset.asset.address) && (
                  <EtherspotTokenTransferTransaction
                    receiverAddress={recipient}
                    tokenAddress={selectedAsset.asset.address}
                    value={assetValueToSend}
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
}

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
