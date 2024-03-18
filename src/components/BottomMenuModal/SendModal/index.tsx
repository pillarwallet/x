import React, { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { useTheme } from 'styled-components';
import { HiOutlineSwitchVertical } from 'react-icons/hi';
import {
  EtherspotBatch,
  EtherspotBatches,
  EtherspotContractTransaction,
  EtherspotTokenTransferTransaction,
  EtherspotTransaction,
  useEtherspotPrices,
  useEtherspotTransactions,
  useEtherspotUtils,
  useWalletAddress
} from '@etherspot/transaction-kit';
import { ethers } from 'ethers';
import Chip from '@mui/joy/Chip';
import { Alert, Box, Card, CardContent, CssVarsProvider, Typography } from '@mui/joy';
import { PiShieldWarningBold as WarningIcon } from 'react-icons/pi';
import { MdDelete } from 'react-icons/md';

// components
import TextInput from '../../Form/TextInput';
import Label from '../../Form/Label';
import FormGroup from '../../Form/FormGroup';
import HorizontalDivider from '../../HorizontalDivider';
import AssetSelect, { AssetSelectOption } from '../../Form/AssetSelect';
import Paragraph from '../../Text/Paragraph';
import Button from '../../Button';
import IdenticonImage from '../../IdenticonImage';
import Select from '../../Form/Select';

// hooks
import useBottomMenuModal from '../../../hooks/useBottomMenuModal';
import useGlobalTransactionsBatch from '../../../hooks/useGlobalTransactionsBatch';

// utils
import { getNativeAssetForChainId, isValidEthereumAddress, supportedChains } from '../../../utils/blockchain';
import { formatAmountDisplay, isValidAmount } from '../../../utils/number';

// providers
import { IGlobalBatchTransaction } from '../../../providers/GlobalTransactionsBatchProvider';

// types
import { ITransaction } from '../../../types/blockchain';

interface SendModalDataBase {
  title: string;
  description?: string;
  onSent?: (userOpHashes: string[]) => void;
}

export interface SendModalSingleTransactionData extends SendModalDataBase {
  transaction: ITransaction
}

interface SendModalSingleBatchedTransactionsData extends SendModalDataBase {
  batches: {
    chainId: number;
    transactions: Omit<ITransaction, 'chainId'>[];
  }[];
}

export type SendModalData = SendModalSingleTransactionData | SendModalSingleBatchedTransactionsData;

interface SendModalProps extends React.PropsWithChildren {
  isContentVisible?: boolean; // for animation purpose to not render rest of content and return main wrapper only
  payload?: SendModalData;
}

const getAmountLeft = (selectedAsset: AssetSelectOption | undefined, amount: string): string | number => {
  if (!selectedAsset || selectedAsset?.type !== 'token') return '0.00';
  if (!selectedAsset?.balance) return '0.00';
  return +selectedAsset.balance - +(amount || 0);
}

const SendModal = ({ isContentVisible, payload }: SendModalProps) => {
  const [t] = useTranslation();
  const [recipient, setRecipient] = React.useState<string>('');
  const [selectedAsset, setSelectedAsset] = React.useState<AssetSelectOption | undefined>(undefined);
  const [amount, setAmount] = React.useState<string>('');
  const [selectedAssetPrice, setSelectedAssetPrice] = React.useState<number>(0);
  const [nativeAssetPrice, setNativeAssetPrice] = React.useState<number>(0);
  const theme = useTheme();
  const { isZeroAddress } = useEtherspotUtils();
  const { getPrices } = useEtherspotPrices();
  const { send, estimate } = useEtherspotTransactions();
  const [isAmountInputAsFiat, setIsAmountInputAsFiat] = React.useState<boolean>(false);
  const [isSending, setIsSending] = React.useState<boolean>(false);
  const [userOpHash, setUserOpHash] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [estimatedCostFormatted, setEstimatedCostFormatted] = React.useState<string>('');
  const [safetyWarningMessage, setSafetyWarningMessage] = React.useState<string>('');
  const formRef = useRef(null);
  const { hide } = useBottomMenuModal();
  const accountAddress = useWalletAddress();
  const { addToBatch, removeFromBatch, transactions: globalTransactionsBatch } = useGlobalTransactionsBatch();
  const [
    globalTransactionsBatchSelectedChainId,
    setGlobalTransactionsBatchSelectedChainId
  ] = React.useState<number | undefined>(undefined);

  const resetForm = () => {
    setRecipient('');
    setSelectedAsset(undefined);
    setAmount('');
    setSelectedAssetPrice(0);
    setIsAmountInputAsFiat(false);
    setIsSending(false);
    setUserOpHash('');
    setErrorMessage('');
  }

  useEffect(() => {
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

  useEffect(() => {
    setSafetyWarningMessage('');
  }, [selectedAsset, recipient, amount]);

  const amountInFiat = useMemo(() => {
    if (selectedAssetPrice === 0) return 0;
    return selectedAssetPrice * +(amount || 0);
  }, [amount, selectedAssetPrice]);

  const amountForPrice = useMemo(() => {
    if (selectedAssetPrice === 0) return 0;
    return +(amount || 0) / selectedAssetPrice;
  }, [amount, selectedAssetPrice]);

  const amountLeft = +getAmountLeft(selectedAsset, amount);

  const isTransactionReady = isValidEthereumAddress(recipient)
    && !!selectedAsset
    && (selectedAsset?.type !== 'token' || isValidAmount(amount))
    && (selectedAsset?.type !== 'token' || +getAmountLeft(selectedAsset, amount) >= 0);

  const isSendModalInvokedFromHook = !!payload;
  const isGlobalTransactionsBatchSendModal = globalTransactionsBatch.length > 0;
  const isRegularSendModal = !isSendModalInvokedFromHook && !isGlobalTransactionsBatchSendModal;
  const isSendDisabled = isSending || (isRegularSendModal && !isTransactionReady);

  const onSend = async (ignoreSafetyWarning?: boolean) => {
    if (isSendDisabled) return;
    setIsSending(true);
    setEstimatedCostFormatted('');
    setErrorMessage('');

    // warning if sending more than half of the balance
    if (!ignoreSafetyWarning
      && selectedAsset?.type === 'token'
      && selectedAsset.balance
      && (selectedAsset.balance / 2) < +amount) {
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

    setUserOpHash(newUserOpHash);
    setIsSending(false);
  }

  if (!isContentVisible) {
    return <Wrapper />
  }

  if (userOpHash) {
    return (
      <SuccessWrapper>
        <Paragraph $center>Sent!</Paragraph>
        <Button
          onClick={() => {
            hide();
            resetForm();
          }}
          $fontSize={15}
        >
          Done
        </Button>
      </SuccessWrapper>
    )
  }

  const assetValueToSend = isAmountInputAsFiat ? amountForPrice : amount;

  if (payload && 'transaction' in payload && 'batches' in payload) {
    throw new Error('Invalid Send payload: both transaction and batches are present');
  }

  if (payload) {
    return (
      <Wrapper>
        <PayloadContentRow>
          <IdenticonImage text={payload.title} size={45} rounded />
          <PayloadContentText>
            <PayloadActionTitle>{payload.title}</PayloadActionTitle>
            {!!payload.description && <PayloadActionDescription>{payload.description}</PayloadActionDescription>}
          </PayloadContentText>
        </PayloadContentRow>
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
        <Button disabled={isSendDisabled} onClick={() => onSend(true)} $fontSize={15} $fullWidth>
          {isSending ? `${t`progress.sending`}...` : t`action.send`}
        </Button>
        {'transaction' in payload && (
          <Button
            disabled={isSendDisabled}
            onClick={() => {
              addToBatch({
                ...payload.transaction,
                title: payload.title,
                description: payload.description
              });
              hide();
            }}
            $fontSize={15}
            $fullWidth
          >
            {t`action.addToBatch`}
          </Button>
        )}
        {!!errorMessage && (
          <>
            {!!estimatedCostFormatted && (
              <Chip size="sm" variant="solid" sx={{ mb: 1 }}>
                {t`label.cost`}: {estimatedCostFormatted}<br/>
              </Chip>
            )}
            <Paragraph $fontSize={12} $center>
              {t`label.error`}: {errorMessage}
            </Paragraph>
          </>
        )}
      </Wrapper>
    );
  }

  if (isGlobalTransactionsBatchSendModal) {
    const groupedTransactionsByChainId = globalTransactionsBatch.reduce((acc, globalTransaction) => {
      const chainId = globalTransaction.chainId;
      if (!acc[chainId]) {
        acc[chainId] = [];
      }
      acc[chainId].push(globalTransaction);
      return acc;
    }, {} as Record<number, IGlobalBatchTransaction[]>);

    const hasMoreChains = Object.keys(groupedTransactionsByChainId).length > 1;

    const globalBatchChainOptions = Object.keys(groupedTransactionsByChainId).map((chainId) => {
      const chainName = (supportedChains.find((c) => c.id === +chainId)?.name as string) || `Chain ID ${chainId}`;
      const chainTransactionCount = groupedTransactionsByChainId[+chainId].length;
      return {
        id: `${chainId}`,
        title: `${chainName} (${chainTransactionCount})`,
        value: chainId,
      };
    });

    const selectedChainBatch = hasMoreChains
      && globalTransactionsBatchSelectedChainId
      && groupedTransactionsByChainId[+globalTransactionsBatchSelectedChainId]
        ? groupedTransactionsByChainId[+globalTransactionsBatchSelectedChainId]
        : Object.values(groupedTransactionsByChainId)[0];

    return (
      <CssVarsProvider defaultMode="dark">
        <Wrapper>
          {!hasMoreChains && (
            <Card sx={{ mb: 0.5 }} variant="soft" size="sm">
              <Typography level="title-sm">
                {globalBatchChainOptions[0].title}
              </Typography>
            </Card>
          )}
          {hasMoreChains && (
            <Select
              options={globalBatchChainOptions}
              onChange={(option) => setGlobalTransactionsBatchSelectedChainId(+option.value)}
              defaultSelectedId={`${selectedChainBatch[0].chainId}`}
              hideValue
            />
          )}
          <Box sx={{ mt: 2, mb: 2.5 }}>
            <EtherspotBatches>
              <EtherspotBatch chainId={selectedChainBatch[0].chainId}>
                {selectedChainBatch.map((transaction, index) => (
                  <Card key={transaction.id} sx={{ mb: 0.5 }} variant="soft" size="sm">
                    <CardContent>
                      <RemoveButton onClick={() => removeFromBatch(transaction.id as string)}>
                        <MdDelete color={theme.color.icon.delete}/>
                      </RemoveButton>
                      <Typography level="title-sm">{index + 1}. {transaction.title}</Typography>
                      {!!transaction.description && <Typography level="body-sm">{transaction.description}</Typography>}
                    </CardContent>
                    <EtherspotTransaction
                      key={`${transaction.to}-${index}`}
                      to={transaction.to}
                      value={transaction.value || '0'}
                      data={transaction.data || undefined}
                    />
                  </Card>
                ))}
              </EtherspotBatch>
            </EtherspotBatches>
          </Box>
          <Button disabled={isSendDisabled} onClick={() => onSend(true)} $fontSize={15} $fullWidth>
            {isSending ? `${t`progress.sending`}...` : t`action.send`}
          </Button>
          {!!errorMessage && (
            <>
              {!!estimatedCostFormatted && (
                <Chip size="sm" variant="solid" sx={{ mb: 1 }}>
                  {t`label.cost`}: {estimatedCostFormatted}<br/>
                </Chip>
              )}
              <Paragraph $fontSize={12} $center>
                {t`label.error`}: {errorMessage}
              </Paragraph>
            </>
          )}
        </Wrapper>
      </CssVarsProvider>
    );
  }

  return (
    <Wrapper ref={formRef}>
      <FormGroup>
        <Label>{t`label.chooseRecipient`}</Label>
        <TextInput
          value={recipient}
          onValueChange={setRecipient}
          placeholder={t`placeholder.toNameAddress`}
        />
      </FormGroup>
      <FormGroup>
        <HorizontalDivider />
      </FormGroup>
      <FormGroup>
        <Label>{t`label.chooseAsset`}</Label>
        <AssetSelect onChange={setSelectedAsset} />
      </FormGroup>
      {selectedAsset?.type === 'token' && (
        <FormGroup>
          <Label>{t`label.enterAmount`}</Label>
          <TextInput
            value={amount}
            onValueChange={setAmount}
            disabled={!selectedAsset}
            placeholder="0.00"
            rightAddon={<Paragraph $fontSize={14} $fontWeight={400}>{isAmountInputAsFiat ? 'USD' : selectedAsset?.asset?.symbol}</Paragraph>}
          />
          <AmountHelper>
            {amountInFiat !== 0 && (
              <AmountHelperLeft onClick={() => setIsAmountInputAsFiat(!isAmountInputAsFiat)}>
                <HiOutlineSwitchVertical color={theme?.color?.icon?.inputHelper} />
                {!isAmountInputAsFiat && <Paragraph $fontSize={14} $fontWeight={400}>${formatAmountDisplay(amountInFiat)}</Paragraph>}
                {isAmountInputAsFiat && <Paragraph $fontSize={14} $fontWeight={400}>{formatAmountDisplay(amountForPrice, 0, 6)} {selectedAsset?.asset.symbol}</Paragraph>}
              </AmountHelperLeft>
            )}
            <Paragraph $fontSize={14} $fontWeight={400}>{t('helper.amountLeft', { amount: amountLeft })}</Paragraph>
          </AmountHelper>
        </FormGroup>
      )}
      <BottomActionBar>
        {!!safetyWarningMessage && (
          <CssVarsProvider defaultMode="dark">
            <Alert
              variant="outlined"
              color="neutral"
              startDecorator={<WarningIcon />}
              sx={{ mb: 2, width: '100%', textAlign: 'left' }}
            >
              {safetyWarningMessage}
            </Alert>
          </CssVarsProvider>
        )}
        <Button
          disabled={isSendDisabled}
          onClick={() => onSend(!!safetyWarningMessage)}
          $fontSize={15}
          $fullWidth
        >
          {isSending && `${t`progress.sending`}...`}
          {!isSending && (safetyWarningMessage ? t`action.sendAnyway` : t`action.send`)}
        </Button>
        {!!errorMessage && (
          <>
            {!!estimatedCostFormatted && (
              <Chip size="sm" variant="solid" sx={{ mb: 1 }}>
                {t`label.cost`}: {estimatedCostFormatted}<br/>
              </Chip>
            )}
            <Paragraph $fontSize={12} $center>
              {t`label.error`}: {errorMessage}
            </Paragraph>
          </>
        )}
      </BottomActionBar>
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
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  max-height: calc(100vh - 240px);
  overflow: hidden;
  min-height: 100%;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;


const SuccessWrapper = styled(Wrapper)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  padding-bottom: 0;
  gap: 20px;
`;

const BottomActionBar = styled.div`
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const AmountHelper = styled.div`
  padding: 0 17px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
  margin-top: 14px;
  color: ${({ theme }) => theme.color.text.inputHelper};
  user-select: none;
  width: 100%;
`;

const AmountHelperLeft = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;
  gap: 6px;
  cursor: pointer;
`;

const PayloadContentRow = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;
  gap: 15px;
  margin-bottom: 30px;
  width: 100%;
  word-break: break-all;
`;

const PayloadContentText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const PayloadActionTitle = styled.p`
  font-size: 18px;
  font-weight: 700;
`;

const PayloadActionDescription = styled.p`
  font-size: 14px;
`;

const RemoveButton = styled.div`
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 5px;
  width: 20px;
  height: 20px;
  text-align: center;
  
  &:hover {
    opacity: 0.7;
  }
`;

export default SendModal;
