/* eslint-disable @typescript-eslint/no-use-before-define */
import { useWalletAddress } from '@etherspot/transaction-kit';
import { ExportSquare as IconExportSquare } from 'iconsax-react';
import moment from 'moment';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

// hooks
import { useSelectedChains } from '../../hooks/useSelectedChainsHistory';
import { useGetTransactionsHistoryQuery } from '../../services/pillarXApiTransactionsHistory';

// utils
import { getBlockScan, getChainName } from '../../utils/blockchain';

// types
import { FlairTransactionHistory } from '../../types/api';

// components
import ChainAssetIcon from '../ChainAssetIcon';
import HistoryChainDropdown from '../Form/HistoryChainDropdown/HistoryChainDropdown';
import SkeletonLoader from '../SkeletonLoader';
import Alert from '../Text/Alert';

interface HistoryModalProps {
  isContentVisible?: boolean; // for animation purpose to not render rest of content and return main wrapper only
}

const HistoryModal = ({ isContentVisible }: HistoryModalProps) => {
  const accountAddress = useWalletAddress();
  const [t] = useTranslation();
  const {
    data: history,
    isLoading: isHistoryLoading,
    isSuccess: isHistorySucess,
  } = useGetTransactionsHistoryQuery(accountAddress || '');
  const { selectedChains, setSelectedChains } = useSelectedChains();

  useEffect(() => {
    if (!isContentVisible) {
      setSelectedChains([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isContentVisible]);

  if (!isContentVisible) {
    return <Wrapper />;
  }

  if (!accountAddress || isHistoryLoading) {
    return (
      <Wrapper id="history-modal-loader">
        <HistoryCard>
          <DetailsRow>
            <SkeletonLoader $height="28px" $width="120px" />
            <SkeletonLoader $height="28px" $width="80px" />
          </DetailsRow>
          <DetailsRow $noBorder>
            <SkeletonLoader $height="28px" $width="100px" />
            <SkeletonLoader $height="28px" $width="90px" />
          </DetailsRow>
        </HistoryCard>
      </Wrapper>
    );
  }

  const transactions = (history as FlairTransactionHistory)?.results;

  const allIncomingTransactions = transactions?.incoming.length
    ? transactions.incoming.map((transaction) => ({
        ...transaction,
        type: 'incoming',
      }))
    : [];

  const allOutgoingTransactions = transactions?.outgoing.length
    ? transactions.outgoing.map((transaction) => ({
        ...transaction,
        type: 'outgoing',
      }))
    : [];

  // TODO - sort by transaction execution date and time
  const allTransactions = [
    ...allIncomingTransactions,
    ...allOutgoingTransactions,
  ];

  const filteredTransactions = allTransactions.filter((txs) =>
    selectedChains.length ? selectedChains.includes(Number(txs.chainId)) : txs
  );

  return (
    <Wrapper id="history-modal">
      <HistoryChainDropdown />
      {(!allTransactions.length && !isHistoryLoading && isHistorySucess) ||
        (!filteredTransactions.length && (
          <Alert>
            No transaction history found on {getChainName(selectedChains[0])}.
          </Alert>
        ))}
      {filteredTransactions.map((transaction) => {
        // TO DO - to replace with transaction execution time
        const momentTs = moment.unix(Number(transaction.entityUpdatedAt));
        return (
          <HistoryCard id="history-card" key={transaction.txHash}>
            <DetailsRow>
              <ChainAssetIcon
                asset="chain-only"
                chainId={Number(transaction.chainId)}
              />
              <div>
                <ActionText>
                  {transaction.txHash.slice(0, 8)}...
                  {transaction.txHash.slice(-8)}
                  {!!transaction.chainId && (
                    // eslint-disable-next-line jsx-a11y/control-has-associated-label
                    <a
                      href={`${getBlockScan(Number(transaction.chainId))}${transaction.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <IconExportSquare size={11} />
                    </a>
                  )}
                </ActionText>
                <ActionSubtext>
                  {t`label.on`}{' '}
                  {getChainName(Number(transaction.chainId)) ??
                    t('helper.unknownNetwork', {
                      chainId: transaction.chainId,
                    })}
                </ActionSubtext>
              </div>
              <div>
                <ActionText>
                  {transaction.type === 'outgoing' ? 'Sent' : 'Received'}
                </ActionText>
              </div>
            </DetailsRow>
            <DetailsRow $noBorder>
              <Timestamp>
                {momentTs.format('DD-MM-YYYY')}
                <span />
                {momentTs.format('HH:mm')}
              </Timestamp>
            </DetailsRow>
          </HistoryCard>
        );
      })}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  min-height: 30vh;
  max-height: 100%;

  &::-webkit-scrollbar {
    display: none;
  }

  overflow-y: scroll;

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const DetailsRow = styled.div<{ $noBorder?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 19px;

  ${({ $noBorder, theme }) =>
    !$noBorder &&
    `
    padding-bottom: 9px;
    margin-bottom: 9px;
    border-bottom: 1px solid ${theme.color.border.cardContentHorizontalSeparator};
  `}

  & > div ~ div:last-child {
    text-align: right;
    margin-left: auto;
  }
`;

const ActionText = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.color.text.cardTitle};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: 6px;

  a {
    color: ${({ theme }) => theme.color.text.cardLink};
    cursor: pointer;
  }

  a:hover {
    opacity: 0.7;
  }
`;

const ActionSubtext = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.color.text.cardContent};
`;

const Timestamp = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.color.text.cardContentSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: 7px;
  margin-top: 5px;
  font-weight: 500;

  & > span {
    height: 12px;
    width: 1px;
    background: ${({ theme }) =>
      theme.color.border.cardContentVerticalSeparator};
  }
`;

const HistoryCard = styled.div`
  padding: 12px;
  background: ${({ theme }) => theme.color.background.card};
  margin-bottom: 10px;
  border-radius: 6px;
  position: relative;

  &:last-child {
    margin-bottom: 0;
  }
`;

// TO DO - might need to use this in the future
// const TransactionStatus = styled.div<{
//   $status: 'pending' | 'completed' | 'failed';
// }>`
//   padding: 4px 6px;
//   font-size: 12px;
//   border-radius: 3px;
//   background: ${({ theme, $status }) =>
//     theme.color.background.transactionStatus[$status]};
//   color: ${({ theme, $status }) => theme.color.text.transactionStatus[$status]};
// `;

export default HistoryModal;
