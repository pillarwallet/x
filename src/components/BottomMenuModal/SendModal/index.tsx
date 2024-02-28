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
  const theme = useTheme();
  const { isZeroAddress } = useEtherspotUtils();
  const { getPrice } = useEtherspotPrices();
  const { send, estimate } = useEtherspotTransactions();
  const [amountAsFiat, setAmountAsFiat] = React.useState<boolean>(false);
  const [isSending, setIsSending] = React.useState<boolean>(false);
  const [userOpHash, setUserOpHash] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [estimatedCostFormatted, setEstimatedCostFormatted] = React.useState<string>('');
  const formRef = useRef(null);
  const { hide } = useBottomMenuModal();
  const accountAddress = useWalletAddress();

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
      if (selectedAsset.type !== 'token') return;
      const price = await getPrice(selectedAsset.asset.address);
      if (expired || !price?.usd) return;
      setSelectedAssetPrice(price.usd);
    })();

    return () => {
      expired = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAsset]);

  const price = useMemo(() => {
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

  const onSend = async () => {
    if (isSendDisabled) return;
    setIsSending(true);
    setEstimatedCostFormatted('');
    setErrorMessage('');

    const estimated = await estimate();

    const estimatedCostBN = estimated?.[0]?.estimatedBatches?.[0]?.cost;
    if (estimatedCostBN) {
      const nativeAsset = getNativeAssetForChainId(estimated[0].estimatedBatches[0].chainId as number);
      const estimatedCost = ethers.utils.formatUnits(estimatedCostBN, nativeAsset.decimals);
      setEstimatedCostFormatted(`${formatAmountDisplay(estimatedCost, 0, 6)} ${nativeAsset.symbol}`);
    }

    const estimationErrorMessage = estimated?.[0]?.estimatedBatches?.[0]?.errorMessage
    if (estimationErrorMessage) {
      setErrorMessage(estimationErrorMessage);
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

  const assetValueToSend = amountAsFiat ? amountForPrice : amount;

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
        <Button disabled={isSendDisabled} onClick={onSend} $fontSize={15} $fullWidth>
          {isSending ? 'Sending...' : 'Send'}
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
      )}
      <BottomActionBar>
        <Button disabled={isSendDisabled} onClick={onSend} $fontSize={15} $fullWidth>{isSending ? 'Sending...' : 'Send'}</Button>
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
