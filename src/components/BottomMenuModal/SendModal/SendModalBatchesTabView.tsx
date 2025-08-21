/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { TransactionBuilder } from '@etherspot/transaction-kit';
import * as Sentry from '@sentry/react';
import { ethers } from 'ethers';
import {
  ArrowRight2 as ArrowRightIcon,
  Send2 as SendIcon,
  Trash as TrashIcon,
} from 'iconsax-react';
import React from 'react';
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
import useTransactionKit from '../../../hooks/useTransactionKit';

// utils
import {
  getChainName,
  getLogoForChainId,
  getNativeAssetForChainId,
} from '../../../utils/blockchain';
import { formatAmountDisplay } from '../../../utils/number';

const SendModalBatchesTabView = () => {
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
  const { showHistory } = useBottomMenuModal();
  const { walletAddress: accountAddress, kit } = useTransactionKit();
  const { transactionDebugLog } = useTransactionDebugLogger();

  const {
    userOpStatus,
    setTransactionHash,
    setUserOpStatus,
    setLatestUserOpInfo,
    setLatestUserOpChainId,
  } = useAccountTransactionHistory();
  const { transactionMeta } = useGlobalTransactionsBatch();

  // Force UI update after removals
  const [, forceUpdate] = React.useState(0);
  const triggerUpdate = () => forceUpdate((n) => n + 1);

  // Get batches from kit state
  const kitState = kit.getState();
  const { batches } = kitState;

  // Group batches by chainId
  const groupedBatchesByChainId = React.useMemo(() => {
    const grouped: Record<
      number,
      { batchName: string; transactions: TransactionBuilder[] }[]
    > = {};
    Object.entries(batches).forEach(([batchName, transactions]) => {
      if (!transactions.length) return;
      const { chainId } = transactions[0];
      if (typeof chainId !== 'number') return; // skip if chainId is undefined
      if (!grouped[chainId]) grouped[chainId] = [];
      grouped[chainId].push({ batchName, transactions });
    });
    return grouped;
  }, [batches]);

  const anyChainSending = Object.values(isSending).some((s) => s);

  const onSend = async (chainId: number, batchName: string) => {
    if (isSending[chainId]) {
      const chainName = getChainName(chainId);
      setErrorMessage((prev) => ({
        ...prev,
        [chainId]: t('error.batchAlreadyInProgressWithChain', { chainName }),
      }));

      transactionDebugLog(
        'Batch send blocked - another batch already in progress on this chain:',
        { chainId, batchName, isSending: isSending[chainId] }
      );

      return;
    }

    const sendId = `send_batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Start Sentry transaction for batch send flow
    Sentry.setContext('send_batch', {
      sendId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      chainId,
      batchName,
      isSending: isSending[chainId],
      groupedTransactionsCount: groupedBatchesByChainId[chainId]?.length || 0,
    });

    if (isSending[chainId]) {
      transactionDebugLog(
        'Another batch is being sent, cannot process the sending of this batch:',
        batchName
      );

      Sentry.captureMessage('Batch send disabled - another batch in progress', {
        level: 'warning',
        tags: {
          component: 'send_flow',
          action: 'batch_send_disabled',
          sendId,
        },
        contexts: {
          batch_send_disabled: {
            sendId,
            chainId,
            batchName,
            isSending: isSending[chainId],
          },
        },
      });

      return;
    }

    Sentry.addBreadcrumb({
      category: 'send_flow',
      message: 'Starting batch send transaction',
      level: 'info',
      data: { sendId, chainId, batchName },
    });

    // remove previously saved userOp for a new one
    localStorage.removeItem('latestUserOpStatus');
    localStorage.removeItem('latestTransactionHash');
    localStorage.removeItem('latestUserOpInfo');
    localStorage.removeItem('latestUserOpChainId');

    setIsSending((prev) => ({ ...prev, [chainId]: true }));
    setEstimatedCostFormatted((prev) => ({ ...prev, [chainId]: '' }));
    setErrorMessage((prev) => ({ ...prev, [chainId]: '' }));
    transactionDebugLog('Preparing to send batch:', batchName);
    try {
      // 1. Estimate the batch
      const batchEstimate = await kit.estimateBatches({
        onlyBatchNames: [batchName],
      });
      const batchEst = batchEstimate.batches[batchName];
      if (!batchEstimate.isEstimatedSuccessfully || batchEst?.errorMessage) {
        Sentry.captureMessage('Batch estimation error during send', {
          level: 'error',
          tags: {
            component: 'send_flow',
            action: 'batch_estimation_error',
            sendId,
          },
          contexts: {
            batch_estimation_error: {
              sendId,
              chainId,
              batchName,
              errorMessage: batchEst?.errorMessage || 'Batch estimation failed',
            },
          },
        });
        setErrorMessage((prev) => ({
          ...prev,
          [chainId]: batchEst?.errorMessage || t('error.failedBatchEstimation'),
        }));
        setIsSending((prev) => ({ ...prev, [chainId]: false }));
        return;
      }
      // 2. Show estimated cost
      const estimatedCostBN = batchEst?.transactions?.[0]?.cost;
      if (estimatedCostBN) {
        const nativeAsset = getNativeAssetForChainId(
          batchEst.transactions[0].chainId as number
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

        Sentry.addBreadcrumb({
          category: 'send_flow',
          message: 'Batch transaction cost estimated',
          level: 'info',
          data: {
            sendId,
            chainId,
            batchName,
            estimatedCost,
            nativeAssetSymbol: nativeAsset.symbol,
          },
        });
      } else {
        transactionDebugLog('Unable to get estimated cost', batchEst);

        Sentry.captureMessage('Unable to get batch estimated cost', {
          level: 'warning',
          tags: {
            component: 'send_flow',
            action: 'batch_no_estimated_cost',
            sendId,
          },
          contexts: {
            batch_no_estimated_cost: {
              sendId,
              chainId,
              batchName,
              batchEst,
            },
          },
        });
      }
      // 3. Send the batch
      const batchSend = await kit.sendBatches({ onlyBatchNames: [batchName] });
      const sentBatch = batchSend.batches[batchName];
      if (!batchSend.isSentSuccessfully || sentBatch?.errorMessage) {
        Sentry.captureMessage('Batch sending error during send', {
          level: 'error',
          tags: {
            component: 'send_flow',
            action: 'batch_sending_error',
            sendId,
          },
          contexts: {
            batch_sending_error: {
              sendId,
              chainId,
              batchName,
              errorMessage: sentBatch?.errorMessage || 'Batch send failed',
            },
          },
        });
        setErrorMessage((prev) => ({
          ...prev,
          [chainId]: sentBatch?.errorMessage || t('error.failedBatchSend'),
        }));
        setIsSending((prev) => ({ ...prev, [chainId]: false }));
        return;
      }

      Sentry.addBreadcrumb({
        category: 'send_flow',
        message: 'Batch transaction sent successfully',
        level: 'info',
        data: {
          sendId,
          chainId,
          batchName,
          sentBatchesCount: 1,
          estimatedBatchesCount: 1,
        },
      });

      const newUserOpHash = sentBatch?.userOpHash;
      transactionDebugLog('Transaction batch new userOpHash:', newUserOpHash);
      if (!newUserOpHash) {
        Sentry.captureMessage('Failed to get UserOp hash for batch', {
          level: 'error',
          tags: {
            component: 'send_flow',
            action: 'batch_no_userop_hash',
            sendId,
          },
          contexts: {
            batch_no_userop_hash: {
              sendId,
              chainId,
              batchName,
              groupedTransactionsCount:
                groupedBatchesByChainId[chainId]?.length || 0,
            },
          },
        });
        setErrorMessage((prev) => ({
          ...prev,
          [chainId]: t('error.failedToGetTransactionHashReachSupport'),
        }));
        setIsSending((prev) => ({ ...prev, [chainId]: false }));
        return;
      }

      Sentry.addBreadcrumb({
        category: 'send_flow',
        message: 'UserOp hash received for batch',
        level: 'info',
        data: { sendId, chainId, batchName, userOpHash: newUserOpHash },
      });

      setLatestUserOpInfo(`Batched transaction on ${getChainName(chainId)}`);
      setLatestUserOpChainId(chainId);

      const userOpStatusInterval = 5000; // 5 seconds
      const maxAttempts = 9; // 9 * 5sec = 45sec
      let attempts = 0;
      let sentryCaptured = false;

      Sentry.addBreadcrumb({
        category: 'send_flow',
        message: 'Starting UserOp status monitoring for batch',
        level: 'info',
        data: {
          sendId,
          chainId,
          batchName,
          maxAttempts,
          interval: userOpStatusInterval,
        },
      });

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

            Sentry.captureMessage('Batch transaction confirmed on chain', {
              level: 'info',
              tags: {
                component: 'send_flow',
                action: 'batch_transaction_confirmed',
                sendId,
              },
              contexts: {
                batch_transaction_confirmed: {
                  sendId,
                  chainId,
                  batchName,
                  userOpHash: newUserOpHash,
                  transactionHash: response.transaction,
                  attempts,
                },
              },
            });

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
                    { level: 'warning', extra: sentryPayload }
                  );
                } else {
                  // Other chains
                  Sentry.captureException(
                    `Max attempts reached with userOp status "${status}"`,
                    { level: 'error', extra: sentryPayload }
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
                    { level: 'warning', extra: sentryPayload }
                  );
                } else {
                  // Other chains
                  Sentry.captureException(
                    `Max attempts reached with userOp status "${status}"`,
                    { level: 'error', extra: sentryPayload }
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
      setIsSending((prev) => ({ ...prev, [chainId]: false }));
      showHistory();

      Sentry.captureMessage('Batch send transaction completed successfully', {
        level: 'info',
        tags: {
          component: 'send_flow',
          action: 'batch_send_success',
          sendId,
        },
        contexts: {
          batch_send_success: {
            sendId,
            chainId,
            batchName,
            estimatedCost: estimatedCostBN
              ? ethers.utils.formatUnits(estimatedCostBN, 18)
              : null,
            groupedTransactionsCount:
              groupedBatchesByChainId[chainId]?.length || 0,
          },
        },
      });
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          component: 'send_flow',
          action: 'batch_send_error',
          sendId: `send_batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        },
        contexts: {
          batch_send_error: {
            sendId: `send_batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            chainId,
            batchName,
            error: error instanceof Error ? error.message : String(error),
          },
        },
      });
      setErrorMessage((prev) => ({
        ...prev,
        [chainId]: t('error.failedBatchSend'),
      }));
      setIsSending((prev) => ({ ...prev, [chainId]: false }));
    }
  };

  // Remove a batch by name
  const onRemoveBatch = (batchName: string) => {
    if (!batchName || batchName === 'batch-undefined') return;

    const removeId = `remove_batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    Sentry.addBreadcrumb({
      category: 'send_flow',
      message: 'Remove batch button clicked',
      level: 'info',
      data: {
        removeId,
        batchName,
        batchTransactionsCount: batches[batchName]?.length || 0,
      },
    });

    try {
      kit.batch({ batchName }).remove();
      triggerUpdate();

      Sentry.captureMessage('Batch removed successfully', {
        level: 'info',
        tags: {
          component: 'send_flow',
          action: 'remove_batch',
          removeId,
        },
        contexts: {
          remove_batch: {
            removeId,
            batchName,
            removedTransactionsCount: batches[batchName]?.length || 0,
          },
        },
      });
    } catch (e) {
      console.error('Failed to remove batch:', e);

      const batchTransactions = batches[batchName];
      const chainId = batchTransactions?.[0]?.chainId;
      if (typeof chainId === 'number') {
        setErrorMessage((prev) => ({
          ...prev,
          [chainId]: t`error.failedToRemoveBatch`,
        }));
      }

      Sentry.captureMessage('Failed to remove batch', {
        level: 'warning',
        tags: {
          component: 'send_flow',
          action: 'remove_batch_failed',
          removeId,
        },
        contexts: {
          remove_batch_failed: {
            removeId,
            batchName,
            error: e instanceof Error ? e.message : String(e),
          },
        },
      });
    }
  };

  // Remove a single transaction from a batch
  const onRemoveTransaction = (batchName: string, transactionName: string) => {
    if (!batchName || !transactionName) return;

    const removeId = `remove_transaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    Sentry.addBreadcrumb({
      category: 'send_flow',
      message: 'Remove single transaction button clicked',
      level: 'info',
      data: {
        removeId,
        batchName,
        transactionName,
        batchTransactionsCount: batches[batchName]?.length || 0,
      },
    });

    try {
      kit.name({ transactionName }); // select the transaction
      kit.remove(); // remove the selected transaction
      triggerUpdate();

      Sentry.captureMessage('Single transaction removed from batch', {
        level: 'info',
        tags: {
          component: 'send_flow',
          action: 'remove_single_transaction',
          removeId,
        },
        contexts: {
          remove_single_transaction: {
            removeId,
            batchName,
            transactionName,
            remainingTransactionsCount: (batches[batchName]?.length || 1) - 1,
          },
        },
      });
    } catch (e) {
      console.error('Failed to remove single transaction:', e);

      const batchTransactions = batches[batchName];
      const chainId = batchTransactions?.[0]?.chainId;
      if (typeof chainId === 'number') {
        setErrorMessage((prev) => ({
          ...prev,
          [chainId]: t`error.failedToRemoveTransaction`,
        }));
      }

      Sentry.captureMessage('Failed to remove single transaction', {
        level: 'warning',
        tags: {
          component: 'send_flow',
          action: 'remove_single_transaction_failed',
          removeId,
        },
        contexts: {
          remove_single_transaction_failed: {
            removeId,
            batchName,
            transactionName,
            error: e instanceof Error ? e.message : String(e),
          },
        },
      });
    }
  };

  return (
    <FormGroup>
      {!Object.keys(groupedBatchesByChainId).length && (
        <Card
          title={t`title.batches`}
          content={t`warning.noBatchesAddedToExecute`}
        />
      )}
      {Object.entries(groupedBatchesByChainId).map(([chainId, batchesArr]) => (
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
                count: batchesArr.reduce(
                  (acc, b) => acc + b.transactions.length,
                  0
                ),
              })}
            </TransactionCount>
            <ToggleButton
              $expanded={!!expanded[+chainId]}
              onClick={() => {
                const newExpandedState = !expanded[+chainId];
                setExpanded((prev) => ({
                  ...prev,
                  [chainId]: newExpandedState,
                }));

                Sentry.addBreadcrumb({
                  category: 'send_flow',
                  message: 'Batch expansion toggled',
                  level: 'info',
                  data: {
                    chainId: +chainId,
                    newExpandedState,
                    transactionCount: batchesArr.reduce(
                      (acc, b) => acc + b.transactions.length,
                      0
                    ),
                  },
                });
              }}
            >
              <ArrowRightIcon size={15} />
            </ToggleButton>
          </BatchTopDetails>
          {/* Only map over valid batches */}
          {batchesArr
            .filter(
              ({ batchName }) => batchName && batchName !== 'batch-undefined'
            )
            .map(({ batchName, transactions }) => (
              <div key={batchName} id={`batch-${batchName}`}>
                <div className="flex flex-col gap-2 w-full">
                  {/* Render all transactions in this batch as Cards with remove buttons */}
                  {transactions.map((transaction, index) => (
                    <div key={`${transaction.to}-${index}`}>
                      {!!expanded[+chainId] && (
                        <Card
                          key={transaction.transactionName || index}
                          title={
                            (transaction.transactionName &&
                              transactionMeta[transaction.transactionName]
                                ?.title) ||
                            `Transaction ${index + 1}`
                          }
                          content={
                            (transaction.transactionName &&
                              transactionMeta[transaction.transactionName]
                                ?.description) ||
                            `Transaction ${index + 1}`
                          }
                        >
                          <RemoveButton
                            onClick={() => {
                              Sentry.addBreadcrumb({
                                category: 'send_flow',
                                message: 'Remove transaction button clicked',
                                level: 'info',
                                data: {
                                  transactionName: transaction.transactionName,
                                  chainId: +chainId,
                                  batchName,
                                  transactionTo: transaction.to,
                                },
                              });

                              onRemoveTransaction(
                                batchName,
                                transaction.transactionName || ''
                              );
                            }}
                          >
                            <TrashIcon size={15} />
                          </RemoveButton>
                        </Card>
                      )}
                    </div>
                  ))}
                </div>
                {/* Only one remove button per batch */}
                <BatchesButtons>
                  <Button
                    id="delete-queue-button-batch-send-modal"
                    onClick={() => {
                      Sentry.addBreadcrumb({
                        category: 'send_flow',
                        message: 'Delete queue button clicked',
                        level: 'info',
                        data: {
                          chainId: +chainId,
                          batchName,
                          chainName: getChainName(+chainId),
                          batchTransactionsCount: transactions.length,
                        },
                      });

                      onRemoveBatch(batchName);
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
                    onClick={() => {
                      Sentry.addBreadcrumb({
                        category: 'send_flow',
                        message: 'Send batch button clicked',
                        level: 'info',
                        data: {
                          chainId: +chainId,
                          batchName,
                          chainName: getChainName(+chainId),
                          batchTransactionsCount: transactions.length,
                          anyChainSending,
                        },
                      });

                      onSend(+chainId, batchName);
                    }}
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
                {!!estimatedCostFormatted[+chainId] && (
                  <Cost id="cost--batch-send-modal">
                    {t`label.transactionCost`}:{' '}
                    {estimatedCostFormatted[+chainId]}
                  </Cost>
                )}
                {!!errorMessage[+chainId] && (
                  <Alert>{`${t`label.error`}: ${errorMessage[+chainId]}`}</Alert>
                )}
              </div>
            ))}
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
  margin-top: 8px;

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
