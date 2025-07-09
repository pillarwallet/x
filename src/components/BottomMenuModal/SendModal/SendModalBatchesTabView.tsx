/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  EtherspotBatch,
  EtherspotBatches,
  EtherspotTransaction,
  ISentBatches,
  useEtherspotTransactions,
  useWalletAddress,
} from '@etherspot/transaction-kit';
import * as Sentry from '@sentry/react';
import { ethers } from 'ethers';
import {
  ArrowRight2 as ArrowRightIcon,
  Send2 as SendIcon,
  Trash as TrashIcon,
} from 'iconsax-react';
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

// services
import { getUserOperationStatus } from '../../../services/userOpStatus';

// components
import Button from '../../Button';
import FormGroup from '../../Form/FormGroup';
import Alert from '../../Text/Alert';
import Card from '../../Text/Card';

// hooks
import useAccountTransactionHistory from '../../../hooks/useAccountTransactionHistory';
import useBottomMenuModal from '../../../hooks/useBottomMenuModal';
import useGlobalTransactionsBatch from '../../../hooks/useGlobalTransactionsBatch';
import { useTransactionDebugLogger } from '../../../hooks/useTransactionDebugLogger';

// providers
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
  const {
    transactions: globalTransactionsBatch,
    removeFromBatch,
    addToBatch,
  } = useGlobalTransactionsBatch();
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
  const accountAddress = useWalletAddress();
  const contextNfts = useContext(AccountNftsContext);
  const { transactionDebugLog } = useTransactionDebugLogger();
  const {
    userOpStatus,
    setTransactionHash,
    setUserOpStatus,
    setLatestUserOpInfo,
    setLatestUserOpChainId,
  } = useAccountTransactionHistory();

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
    }

    if (anyChainSending) {
      contextNfts?.data.setUpdateData(false);
    }
  }, [contextNfts?.data, anyChainSending]);

  const onSend = async (chainId: number, batchId: string) => {
    if (isSending[chainId]) {
      transactionDebugLog(
        'Another batch is being sent, cannot process the sending of this batch:',
        batchId
      );
      return;
    }

    // remove previously saved userOp for a new one
    localStorage.removeItem('latestUserOpStatus');
    localStorage.removeItem('latestTransactionHash');
    localStorage.removeItem('latestUserOpInfo');
    localStorage.removeItem('latestUserOpChainId');

    setIsSending((prev) => ({ ...prev, [chainId]: true }));
    setEstimatedCostFormatted((prev) => ({ ...prev, [chainId]: '' }));
    setErrorMessage((prev) => ({ ...prev, [chainId]: '' }));

    transactionDebugLog('Preparing to send batch:', batchId);

    let sent: ISentBatches[];

    try {
      sent = await send([batchId], {
        retryOnFeeTooLow: true,
        maxRetries: 3,
        feeMultiplier: 1.2, // 20% increase per retry
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMes =
        'Something went wrong while sending the assets, please try again later. If the problem persists, contact the PillarX team for support.';
      console.warn('Final send() failed after retries:', errorMes);
      setErrorMessage((prev) => ({ ...prev, [chainId]: errorMes }));
      setIsSending((prev) => ({ ...prev, [chainId]: false }));
      return;
    }

    const estimatedCostBN = sent?.[0]?.estimatedBatches?.[0]?.cost;
    if (estimatedCostBN) {
      const nativeAsset = getNativeAssetForChainId(
        sent[0].estimatedBatches[0].chainId as number
      );
      const estimatedCost = ethers.utils.formatUnits(
        estimatedCostBN,
        nativeAsset.decimals
      );

      transactionDebugLog('Transaction batch estimated cost:', estimatedCost);

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
        [chainId]:
          'Something went wrong while estimating the asset transfer. Please try again later. If the problem persists, contact the PillarX team for support.',
      }));
      setIsSending((prev) => ({ ...prev, [chainId]: false }));
      return;
    }

    const sendingErrorMessage = sent?.[0]?.sentBatches?.[0]?.errorMessage;
    if (sendingErrorMessage) {
      setErrorMessage((prev) => ({
        ...prev,
        [chainId]:
          'Something went wrong while sending the assets, please try again later. If the problem persists, contact the PillarX team for support.',
      }));
      setIsSending((prev) => ({ ...prev, [chainId]: false }));
      return;
    }

    const newUserOpHash = sent?.[0]?.sentBatches?.[0]?.userOpHash;

    transactionDebugLog('Transaction batch new userOpHash:', newUserOpHash);

    if (!newUserOpHash) {
      setErrorMessage(t`error.failedToGetTransactionHashReachSupport`);
      setIsSending((prev) => ({ ...prev, [chainId]: false }));
      return;
    }

    setLatestUserOpInfo(`Batched transaction on ${getChainName(chainId)}`);

    setLatestUserOpChainId(chainId);

    const userOpStatusInterval = 5000; // 5 seconds
    const maxAttempts = 9; // 9 * 5sec = 45sec
    let attempts = 0;
    let sentryCaptured = false;

    const userOperationStatus = setInterval(async () => {
      attempts += 1;
      try {
        const response = await getUserOperationStatus(chainId, newUserOpHash);
        transactionDebugLog(`UserOp status attempt ${attempts}`, response);

        const status = response?.status;

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

        const sentryPayload = {
          walletAddress: accountAddress,
          userOpHash: newUserOpHash,
          chainId,
          transactionHash: response?.transaction,
          attempts,
          status,
        };

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
              if (chainId === 137) {
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
              if (chainId === 137) {
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
              chainId,
              attempts,
            },
          }
        );
      }
    }, userOpStatusInterval);

    groupedTransactionsByChainId[+chainId].forEach((transaction) =>
      removeFromBatch(transaction.id as string)
    );
    setIsSending((prev) => ({ ...prev, [chainId]: false }));
    showHistory();
  };

  // To remove one transaction the entire batch needs to be rebuilt by
  // removing all transactions then re-adding all transactions minus
  // the one that has been deleted
  const removeOneTransaction = (transactionId: string, chainId: number) => {
    // All transactions for this chain
    const chainTransactions = globalTransactionsBatch.filter(
      (tx) => tx.chainId === chainId
    );
    // Remove all transactions from UI state
    chainTransactions.forEach((tx) => {
      removeFromBatch(tx.id as string);
    });

    // Wait for state update
    setTimeout(() => {
      // Adding back all transactions except the one we wanted to remove
      chainTransactions.forEach((tx) => {
        if (tx.id !== transactionId) {
          addToBatch(tx);
        }
      });
    }, 0);
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
                            removeOneTransaction(
                              transaction.id as string,
                              +chainId
                            )
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
