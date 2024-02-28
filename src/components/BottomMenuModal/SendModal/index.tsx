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
import { BigNumberish, ethers } from 'ethers';
import Chip from '@mui/joy/Chip';
import { Alert, CssVarsProvider } from '@mui/joy';
import { PiShieldWarningBold as WarningIcon } from 'react-icons/pi';

// components
import TextInput from '../../Form/TextInput';
import Label from '../../Form/Label';
import FormGroup from '../../Form/FormGroup';
import HorizontalDivider from '../../HorizontalDivider';
import AssetSelect, { AssetSelectOption } from '../../Form/AssetSelect';
import Paragraph from '../../Text/Paragraph';
import Button from '../../Button';
import IdenticonImage from '../../IdenticonImage';

// hooks
import useBottomMenuModal from '../../../hooks/useBottomMenuModal';

// utils
import { getNativeAssetForChainId, isValidEthereumAddress } from '../../../utils/blockchain';
import { formatAmountDisplay, isValidAmount } from '../../../utils/number';

export interface SendModalData {
  title: string;
  description?: string;
  onSent?: (userOpHashes: string[]) => void;
  transactions: {
    chainId?: number;
    to: string;
    value?: BigNumberish;
    data?: string;
  }[];
}

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

  const isSendDisabled = isSending || (!payload && !isTransactionReady);

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
      setErrorMessage('');
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
      setErrorMessage(t`error.transactionFailedReasonUnknown`);
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
        {payload.transactions.map((transaction, index) => (
          <>
            <EtherspotBatches key={index}>
              <EtherspotBatch chainId={transaction.chainId}>
                <EtherspotTransaction
                  to={transaction.to}
                  value={transaction.value || '0'}
                  data={transaction.data || undefined}
                />
              </EtherspotBatch>
            </EtherspotBatches>
          </>
        ))}
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

export default SendModal;
