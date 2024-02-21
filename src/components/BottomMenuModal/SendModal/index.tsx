import React, { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { useTheme } from 'styled-components';
import { HiOutlineSwitchVertical } from 'react-icons/hi';
import {
  EtherspotBatch,
  EtherspotBatches, EtherspotTokenTransferTransaction,
  EtherspotTransaction,
  useEtherspotPrices,
  useEtherspotTransactions, useEtherspotUtils
} from '@etherspot/transaction-kit';

// components
import TextInput from '../../Form/TextInput';
import Label from '../../Form/Label';
import FormGroup from '../../Form/FormGroup';
import HorizontalDivider from '../../HorizontalDivider';
import AssetSelect, { AssetSelectOption } from '../../Form/AssetSelect';
import Paragraph from '../../Text/Paragraph';
import Button from '../../Button';

// hooks
import useBottomMenuModal from '../../../hooks/useBottomMenuModal';

// utils
import { isValidEthereumAddress } from '../../../utils/blockchain';
import { formatAmountDisplay, isValidAmount } from '../../../utils/number';
import { BigNumberish } from 'ethers';
import IdenticonImage from '../../IdenticonImage';

export interface SendModalData {
  title: string;
  subtitle?: string;
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

const SendModal = ({ isContentVisible, payload }: SendModalProps) => {
  const [t] = useTranslation();
  const [recipient, setRecipient] = React.useState<string>('');
  const [selectedAsset, setSelectedAsset] = React.useState<AssetSelectOption | undefined>(undefined);
  const [amount, setAmount] = React.useState<string>('');
  const [selectedAssetPrice, setSelectedAssetPrice] = React.useState<number>(0);
  const theme = useTheme();
  const { isZeroAddress } = useEtherspotUtils();
  const { getPrice } = useEtherspotPrices();
  const { send } = useEtherspotTransactions();
  const [amountAsFiat, setAmountAsFiat] = React.useState<boolean>(false);
  const [isSending, setIsSending] = React.useState<boolean>(false);
  const [userOpHash, setUserOpHash] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const formRef = useRef(null);
  const { hide } = useBottomMenuModal();

  const resetForm = () => {
    setRecipient('');
    setSelectedAsset(undefined);
    setAmount('');
    setSelectedAssetPrice(0);
    setAmountAsFiat(false);
    setIsSending(false);
    setUserOpHash('');
    setErrorMessage('');
  }

  useEffect(() => {
    if (!selectedAsset) return;

    let expired = false;

    (async () => {
      const price = await getPrice(selectedAsset.asset.address);
      if (expired || !price?.usd) return;
      setSelectedAssetPrice(price.usd);
    })();

    return () => {
      expired = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAsset?.asset?.address]);

  const amountLeft = useMemo(() => {
    if (!selectedAsset?.balance) return '0.00';
    return +selectedAsset.balance - +(amount || 0);
  }, [amount, selectedAsset?.balance]);

  const price = useMemo(() => {
    if (selectedAssetPrice === 0) return 0;
    return selectedAssetPrice * +(amount || 0);
  }, [amount, selectedAssetPrice]);

  const amountForPrice = useMemo(() => {
    if (selectedAssetPrice === 0) return 0;
    return +(amount || 0) / selectedAssetPrice;
  }, [amount, selectedAssetPrice]);

  const isTransactionReady = isValidEthereumAddress(recipient)
    && selectedAsset?.asset?.address
    && isValidAmount(amount)
    && +amountLeft >= 0;

  const isSendDisabled = isSending || (!payload && !isTransactionReady);

  const onSend = async () => {
    if (isSendDisabled) return;
    setIsSending(true);

    const result = await send();

    const newErrorMessage = result?.[0]?.estimatedBatches?.[0]?.errorMessage
      || result?.[0]?.sentBatches?.[0]?.errorMessage;

    if (newErrorMessage) {
      setErrorMessage(newErrorMessage);
      setIsSending(false);
      return;
    }

    const newUserOpHash = result?.[0]?.sentBatches[0]?.userOpHash;
    if (!newUserOpHash) {
      setErrorMessage(t`error.transactionFailedReasonUnknown`);
      setIsSending(false);
      return;
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

  const assetValueToSend = amountAsFiat ? amountForPrice : amount;

  if (payload) {
    return (
      <Wrapper>
        <PayloadContentRow>
          <IdenticonImage text={payload.title} size={45} rounded />
          <PayloadContentText>
            <PayloadActionTitle>{payload.title}</PayloadActionTitle>
            {!!payload.subtitle && <PayloadActionSubtitle>{payload.subtitle}</PayloadActionSubtitle>}
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
        <Button disabled={isSendDisabled} onClick={onSend} $fontSize={15} $fullWidth>
          {isSending ? 'Sending...' : 'Send'}
        </Button>
        {errorMessage && <Paragraph $fontSize={12} $center>{errorMessage}</Paragraph>}
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
        <Label>{t`label.chooseToken`}</Label>
        <AssetSelect onChange={setSelectedAsset} />
      </FormGroup>
      <FormGroup>
        <Label>{t`label.enterAmount`}</Label>
        <TextInput
          value={amount}
          onValueChange={setAmount}
          disabled={!selectedAsset}
          placeholder="0.00"
          rightAddon={<Paragraph $fontSize={14} $fontWeight={400}>{amountAsFiat ? 'USD' : selectedAsset?.asset?.symbol}</Paragraph>}
        />
        <AmountHelper>
          {price !== 0 && (
            <AmountHelperLeft onClick={() => setAmountAsFiat(!amountAsFiat)}>
              <HiOutlineSwitchVertical color={theme?.color?.icon?.inputHelper} />
              {!amountAsFiat && <Paragraph $fontSize={14} $fontWeight={400}>${formatAmountDisplay(price)}</Paragraph>}
              {amountAsFiat && <Paragraph $fontSize={14} $fontWeight={400}>{formatAmountDisplay(amountForPrice, 0, 6)} {selectedAsset?.asset.symbol}</Paragraph>}
            </AmountHelperLeft>
          )}
          <Paragraph $fontSize={14} $fontWeight={400}>{t('helper.amountLeft', { amount: amountLeft })}</Paragraph>
        </AmountHelper>
      </FormGroup>
      <BottomActionBar>
        <Button disabled={isSendDisabled} onClick={onSend} $fontSize={15} $fullWidth>{isSending ? 'Sending...' : 'Send'}</Button>
        {errorMessage && <Paragraph $fontSize={12} $center>{errorMessage}</Paragraph>}
      </BottomActionBar>
      {isTransactionReady && (
        <EtherspotBatches>
          <EtherspotBatch chainId={selectedAsset.asset.chainId}>
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
  padding-bottom: 150px;
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
  position: absolute;
  bottom: 0;
  padding: 34px 17px 22px;
  left: 0;
  width: 100%;
  background: linear-gradient(180deg, rgba(16, 16, 16, 0.00) 0%, rgba(16, 16, 16, 0.90) 52.08%);
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

const PayloadActionSubtitle = styled.p`
  font-size: 14px;
`;

export default SendModal;
