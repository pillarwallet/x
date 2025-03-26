/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  EtherspotBatch,
  EtherspotBatches,
  EtherspotTransaction,
  useEtherspotTransactions,
} from '@etherspot/transaction-kit';
import { ethers } from 'ethers';
import {
  ArrowRight2 as ArrowRightIcon,
  Send2 as SendIcon,
  Trash as TrashIcon,
} from 'iconsax-react';
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

// components
import Button from '../../Button';
import FormGroup from '../../Form/FormGroup';
import Alert from '../../Text/Alert';
import Card from '../../Text/Card';

// hooks
import useBottomMenuModal from '../../../hooks/useBottomMenuModal';
import useGlobalTransactionsBatch from '../../../hooks/useGlobalTransactionsBatch';

// providers
import { AccountBalancesContext } from '../../../providers/AccountBalancesProvider';
import { AccountNftsContext } from '../../../providers/AccountNftsProvider';
import { IGlobalBatchTransaction } from '../../../providers/GlobalTransactionsBatchProvider';

// utils
import {
  getChainName,
  getLogoForChainId,
  getNativeAssetForChainId,
} from '../../../utils/blockchain';
import { formatAmountDisplay } from '../../../utils/number';

const SendModalBatchesTabView = () => {
  const { transactions: globalTransactionsBatch, removeFromBatch } =
    useGlobalTransactionsBatch();
  const [t] = useTranslation();
  const [expanded, setExpanded] = React.useState<
    Record<number, boolean | undefined>
  >({});
  const [isSending, setIsSending] = React.useState<Record<number, boolean>>({});
  const [estimatedCostFormatted, setEstimatedCostFormatted] = React.useState<
    Record<number, string>
  >({});
  const [errorMessage, setErrorMessage] = React.useState<
    Record<number, string>
  >({});
  const { send } = useEtherspotTransactions();
  const { showHistory } = useBottomMenuModal();
  const contextNfts = useContext(AccountNftsContext);
  const contextBalances = useContext(AccountBalancesContext);

  const groupedTransactionsByChainId = globalTransactionsBatch.reduce(
    (acc, globalTransaction) => {
      const { chainId } = globalTransaction;
      if (!acc[chainId]) {
        acc[chainId] = [];
      }
      acc[chainId].push(globalTransaction);
      return acc;
    },
    {} as Record<number, IGlobalBatchTransaction[]>
  );

  const anyChainSending = Object.values(isSending).some((s) => s);

  useEffect(() => {
    if (!anyChainSending) {
      contextNfts?.data.setUpdateData(true);
      contextBalances?.data.setUpdateData(true);
    }

    if (anyChainSending) {
      contextNfts?.data.setUpdateData(false);
      contextBalances?.data.setUpdateData(false);
    }
  }, [contextNfts?.data, contextBalances?.data, anyChainSending]);

  const onSend = async (chainId: number, batchId: string) => {
    if (isSending[chainId]) return;
    setIsSending((prev) => ({ ...prev, [chainId]: true }));
    setEstimatedCostFormatted((prev) => ({ ...prev, [chainId]: '' }));
    setErrorMessage((prev) => ({ ...prev, [chainId]: '' }));

    const sent = await send([batchId]);

    const estimatedCostBN = sent?.[0]?.estimatedBatches?.[0]?.cost;
    if (estimatedCostBN) {
      const nativeAsset = getNativeAssetForChainId(
        sent[0].estimatedBatches[0].chainId as number
      );
      const estimatedCost = ethers.utils.formatUnits(
        estimatedCostBN,
        nativeAsset.decimals
      );
      setEstimatedCostFormatted((prev) => ({
        ...prev,
        [chainId]: `${formatAmountDisplay(estimatedCost, 0, 6)} ${nativeAsset.symbol}`,
      }));
    } else {
      console.warn('Unable to get estimated cost', sent);
    }

    const estimationErrorMessage =
      sent?.[0]?.estimatedBatches?.[0]?.errorMessage;
    if (estimationErrorMessage) {
      setErrorMessage((prev) => ({
        ...prev,
        [chainId]: estimationErrorMessage,
      }));
      setIsSending((prev) => ({ ...prev, [chainId]: false }));
      return;
    }

    const sendingErrorMessage = sent?.[0]?.sentBatches?.[0]?.errorMessage;
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

    groupedTransactionsByChainId[+chainId].forEach((transaction) =>
      removeFromBatch(transaction.id as string)
    );
    setIsSending((prev) => ({ ...prev, [chainId]: false }));
    showHistory();
  };

  return (
    <FormGroup>
      {!Object.keys(groupedTransactionsByChainId).length && (
        <Card
          title={t`title.batches`}
          content={t`warning.noBatchesAddedToExecute`}
        />
      )}
      {Object.keys(groupedTransactionsByChainId).map((chainId) => (
        <ChainBatchWrapper id="chain-batch-send-modal" key={`batch-${chainId}`}>
          <BatchTopDetails $expanded={!!expanded[+chainId]}>
            <ChainDetails>
              <ChainLogo
                src={getLogoForChainId(+chainId)}
                alt={`chain ${chainId} logo`}
              />
              <ChainTitle id="chain-title-batch-send-modal">
                {getChainName(Number(chainId)) ??
                  t('helper.unknownNetwork', { chainId })}
              </ChainTitle>
            </ChainDetails>
            <TransactionCount id="transaction-count-batch-send-modal">
              {t('helper.items', {
                count: groupedTransactionsByChainId[+chainId].length,
              })}
            </TransactionCount>
            <ToggleButton
              $expanded={!!expanded[+chainId]}
              onClick={() =>
                setExpanded((prev) => ({ ...prev, [chainId]: !prev[+chainId] }))
              }
            >
              <ArrowRightIcon size={15} />
            </ToggleButton>
          </BatchTopDetails>
          <EtherspotBatches id={`batch-${chainId}`}>
            <EtherspotBatch chainId={+chainId}>
              {groupedTransactionsByChainId[+chainId].map(
                (transaction, index) => (
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
                        content={
                          transaction.description ??
                          t`helper.transactionWillBeExecutedByApp`
                        }
                      >
                        <RemoveButton
                          onClick={() =>
                            removeFromBatch(transaction.id as string)
                          }
                        >
                          <TrashIcon size={15} />
                        </RemoveButton>
                      </Card>
                    )}
                  </EtherspotTransaction>
                )
              )}
            </EtherspotBatch>
          </EtherspotBatches>
          {!!errorMessage[+chainId] && (
            <Alert>{`${t`label.error`}: ${errorMessage[+chainId]}`}</Alert>
          )}
          <BatchesButtons>
            <Button
              id="delete-queue-button-batch-send-modal"
              onClick={() => {
                groupedTransactionsByChainId[+chainId].forEach((transaction) =>
                  removeFromBatch(transaction.id as string)
                );
              }}
              disabled={anyChainSending}
              $fullWidth
              $secondary
              $small
            >
              {t`action.deleteQueue`}
            </Button>
            <Button
              id="send-button-batch-send-modal"
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
            <Cost id="cost--batch-send-modal">
              {t`label.transactionCost`}: {estimatedCostFormatted[+chainId]}
            </Cost>
          )}
        </ChainBatchWrapper>
      ))}
    </FormGroup>
  );
};

const BatchTopDetails = styled.div<{ $expanded: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ $expanded }) => ($expanded ? 10 : 0)}px;
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
  border-right: 1px solid
    ${({ theme }) => theme.color.border.cardContentVerticalSeparator};
  padding-right: 9px;
`;

const ToggleButton = styled.span<{ $expanded: boolean }>`
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
  transform: ${({ $expanded }) => ($expanded ? 'rotate(-90deg)' : 'rotate(0)')};
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
