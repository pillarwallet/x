import React from 'react';
import styled from 'styled-components';
import {
  EtherspotBatch,
  EtherspotBatches,
  EtherspotTransaction,
  useEtherspotTransactions
} from '@etherspot/transaction-kit';
import { Trash as TrashIcon, ArrowRight2 as ArrowRightIcon, Send2 as SendIcon } from 'iconsax-react';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';

// components
import FormGroup from '../../Form/FormGroup';
import Card from '../../Text/Card';
import Alert from '../../Text/Alert';
import Button from '../../Button';

// hooks
import useGlobalTransactionsBatch from '../../../hooks/useGlobalTransactionsBatch';
import useBottomMenuModal from '../../../hooks/useBottomMenuModal';

// providers
import { IGlobalBatchTransaction } from '../../../providers/GlobalTransactionsBatchProvider';

// utils
import { getLogoForChainId, getNativeAssetForChainId, visibleChains } from '../../../utils/blockchain';
import { formatAmountDisplay } from '../../../utils/number';

const SendModalBatchesTabView = () => {
  const { transactions: globalTransactionsBatch, removeFromBatch } = useGlobalTransactionsBatch();
  const [t] = useTranslation();
  const [expanded, setExpanded] = React.useState<Record<number, boolean | undefined>>({});
  const [isSending, setIsSending] = React.useState<Record<number, boolean>>({});
  const [estimatedCostFormatted, setEstimatedCostFormatted] = React.useState<Record<number, string>>({});
  const [errorMessage, setErrorMessage] = React.useState<Record<number, string>>({});
  const { send, estimate } = useEtherspotTransactions();
  const { showHistory } = useBottomMenuModal();

  const groupedTransactionsByChainId = globalTransactionsBatch.reduce((acc, globalTransaction) => {
    const chainId = globalTransaction.chainId;
    if (!acc[chainId]) {
      acc[chainId] = [];
    }
    acc[chainId].push(globalTransaction);
    return acc;
  }, {} as Record<number, IGlobalBatchTransaction[]>);

  const onSend = async (chainId: number, batchId: string) => {
    if (isSending[chainId]) return;
    setIsSending((prev) => ({ ...prev, [chainId]: true }));
    setEstimatedCostFormatted((prev) => ({ ...prev, [chainId]: '' }));
    setErrorMessage((prev) => ({ ...prev, [chainId]: '' }));

    const estimated = await estimate([batchId]);

    const estimatedCostBN = estimated?.[0]?.estimatedBatches?.[0]?.cost;
    if (estimatedCostBN) {
      const nativeAsset = getNativeAssetForChainId(estimated[0].estimatedBatches[0].chainId as number);
      const estimatedCost = ethers.utils.formatUnits(estimatedCostBN, nativeAsset.decimals);
      setEstimatedCostFormatted((prev) => ({
        ...prev, [chainId]: `${formatAmountDisplay(estimatedCost, 0, 6)} ${nativeAsset.symbol}`
      }));
    } else {
      console.warn('Unable to get estimated cost', estimated);
    }

    const estimationErrorMessage = estimated?.[0]?.estimatedBatches?.[0]?.errorMessage
    if (estimationErrorMessage) {
      setErrorMessage((prev) => ({ ...prev, [chainId]: estimationErrorMessage }));
      setIsSending((prev) => ({ ...prev, [chainId]: false }));
      return;
    }

    const sent = await send([batchId]);

    const sendingErrorMessage = sent?.[0]?.sentBatches?.[0]?.errorMessage
    if (sendingErrorMessage) {
      setErrorMessage((prev) => ({ ...prev, [chainId]: sendingErrorMessage }));
      setIsSending((prev) => ({ ...prev, [chainId]: false }));
      return;
    }

    const newUserOpHash = sent?.[0]?.sentBatches[0]?.userOpHash;
    if (!newUserOpHash) {
      setErrorMessage(t`error.failedToGetTransactionHashReachSupport`);
      setIsSending((prev) => ({ ...prev, [chainId]: false }));
      return;
    }

    groupedTransactionsByChainId[+chainId].forEach((t) => removeFromBatch(t.id as string));
    setIsSending((prev) => ({ ...prev, [chainId]: false }));
    showHistory();
  }

  const anyChainSending = Object.values(isSending).some((s) => s);

  return (
    <FormGroup>
      {!Object.keys(groupedTransactionsByChainId).length && (
        <Card
          title={t`title.batches`}
          content={t`warning.noBatchesAddedToExecute`}
        />
      )}
      {Object.keys(groupedTransactionsByChainId).map((chainId) => (
        <ChainBatchWrapper key={`batch-${chainId}`}>
          <BatchTopDetails $expanded={!!expanded[+chainId]}>
            <ChainDetails>
              <ChainLogo src={getLogoForChainId(+chainId)} alt={`chain ${chainId} logo`} />
              <ChainTitle>{visibleChains.find((c) => c.id === +chainId)?.name ?? t('helper.unknownNetwork', { chainId })}</ChainTitle>
            </ChainDetails>
            <TransactionCount>{t('helper.items', { count: groupedTransactionsByChainId[+chainId].length })}</TransactionCount>
            <ToggleButton $expanded={!!expanded[+chainId]} onClick={() => setExpanded((prev) => ({ ...prev, [chainId]: !prev[+chainId] }))}>
              <ArrowRightIcon size={15} />
            </ToggleButton>
          </BatchTopDetails>
          <EtherspotBatches id={`batch-${chainId}`}>
            <EtherspotBatch chainId={+chainId}>
              {groupedTransactionsByChainId[+chainId].map((transaction, index) => (
                <EtherspotTransaction
                  key={`${transaction.to}-${index}`}
                  to={transaction.to}
                  value={transaction.value || '0'}
                  data={transaction.data || undefined}
                >
                  {!!expanded[+chainId] && (
                    <Card
                      key={transaction.id}
                      title={transaction.title}
                      content={transaction.description ?? t`helper.transactionWillBeExecutedByApp`}
                    >
                      <RemoveButton onClick={() => removeFromBatch(transaction.id as string)}>
                        <TrashIcon size={15} />
                      </RemoveButton>
                    </Card>
                  )}
                </EtherspotTransaction>
              ))}
            </EtherspotBatch>
          </EtherspotBatches>
          {!!errorMessage[+chainId] && <Alert>{`${t`label.error`}: ${errorMessage[+chainId]}`}</Alert>}
          <BatchesButtons>
            <Button
              onClick={() => {
                groupedTransactionsByChainId[+chainId].forEach((t) => removeFromBatch(t.id as string));
              }}
              disabled={anyChainSending}
              $fullWidth
              $secondary
              $small
            >
              {t`action.deleteQueue`}
            </Button>
            <Button
              onClick={() => onSend(+chainId, `batch-${chainId}`)}
              disabled={anyChainSending}
              $fullWidth
              $small
            >
              {isSending[+chainId] && t`progress.sending`}
              {!isSending[+chainId] && (
                <>
                  {t`action.send`}
                  <SendIcon size={15} />
                </>
              )}
            </Button>
          </BatchesButtons>
          {!!errorMessage[+chainId] && !!estimatedCostFormatted[+chainId] && (
            <Cost>{t`label.transactionCost`}: {estimatedCostFormatted[+chainId]}</Cost>
          )}
        </ChainBatchWrapper>
      ))}
    </FormGroup>
  );
}

const BatchTopDetails = styled.div<{ $expanded: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ $expanded }) => $expanded ? 10 : 0}px;
`;

const ChainDetails = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

const ChainLogo = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 10px;
`;

const ChainTitle = styled.p`
  font-size: 14px;
`;

const TransactionCount = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.color.text.cardContent};
  border-right: 1px solid ${({ theme }) => theme.color.border.cardContentVerticalSeparator};
  padding-right: 9px;
`;

const ToggleButton = styled.span<{ $expanded: boolean }>`
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
  transform: ${({ $expanded }) => $expanded ? 'rotate(-90deg)' : 'rotate(0)'};
  padding: 3px 5px;
  margin-left: 4px;
  
  &:active {
    opacity: 0.4;
  }
`;

const ChainBatchWrapper = styled.div`
  background: ${({ theme }) => theme.color.background.card};
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 15px;
  &:last-child {
    margin-bottom: 0;
  }

  & > * {
    margin-bottom: 10px;
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;

const RemoveButton = styled.div`
  cursor: pointer;
  position: absolute;
  top: 11px;
  right: 11px;
  text-align: center;

  &:hover {
    opacity: 0.7;
  }
`;

const BatchesButtons = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-between;
  gap: 9px;

  & > * {
    margin-bottom: 0;
    height: 100%;
  }
`;

const Cost = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.color.text.formLabel};
  font-size: 12px;
`;

export default SendModalBatchesTabView;
