import { useEtherspotUtils, UserOpTransaction, useWalletAddress } from '@etherspot/transaction-kit';
import moment from 'moment';
import styled from 'styled-components';
import { ExportSquare as IconExportSquare } from 'iconsax-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// hooks
import useAccountTransactionHistory from '../../hooks/useAccountTransactionHistory';
import useAssets from '../../hooks/useAssets';

// utils
import { humanizeAddress, visibleChains } from '../../utils/blockchain';

// components
import ChainAssetIcon from '../ChainAssetIcon';
import SkeletonLoader from '../SkeletonLoader';
import Alert from '../Text/Alert';


interface HistoryModalProps {
  isContentVisible?: boolean; // for animation purpose to not render rest of content and return main wrapper only
}

// TODO: replace once exportable from Prime SDK
interface EtherspotErc20TransfersEntity {
  from: string;
  to: string;
  value: number;
  asset?: string;
  address: string;
  decimal: number;
}

// TODO: replace once exportable from Prime SDK
interface EtherspotNativeTransfersEntity {
  from: string;
  to: string;
  value: string;
  asset?: string;
  address: string;
  decimal: number;
  data: string;
}

// TODO: replace once exportable from Prime SDK
interface EtherspotNftTransfersEntity {
  from: string;
  to: string;
  value: number;
  tokenId: number;
  asset?: string;
  category: string;
  address: string;
}

type HistoryTransaction = UserOpTransaction & {
  id: string;
  assetTransfer?: (EtherspotErc20TransfersEntity & { type: 'erc20'})
    | (EtherspotNativeTransfersEntity & { type: 'native'})
    | (EtherspotNftTransfersEntity & { type: 'nft'});
}

const HistoryModal = ({ isContentVisible }: HistoryModalProps) => {
  const accountAddress = useWalletAddress();
  const history = useAccountTransactionHistory();
  const { addressesEqual } = useEtherspotUtils();
  const assets = useAssets();
  const [t] = useTranslation();

  const allTransactions = useMemo(() => Object.values(history).reduce<HistoryTransaction[]>((
    acc,
    chainHistory: Record<string, UserOpTransaction[]>
  ) => {
    Object.values(chainHistory).forEach((accountTransactions) => {
      const transfersAsTransactions = accountTransactions.reduce<HistoryTransaction[]>((
        acc2,
        transaction: UserOpTransaction,
      ) => {
        if (transaction.erc20Transfers) {
          acc2.push(...transaction.erc20Transfers.map((transfer, index) => ({
            ...transaction,
            id: `${transaction.transactionHash ?? transaction.userOpHash}-erc20-${index}`,
            assetTransfer: {
              ...transfer,
              type: 'erc20',
            },
          } as HistoryTransaction)))
        }

        if (transaction.nftTransfers) {
          acc2.push(...transaction.nftTransfers.map((transfer, index) => ({
            ...transaction,
            id: `${transaction.transactionHash ?? transaction.userOpHash}-nft-${index}`,
            assetTransfer: {
              ...transfer,
              type: 'nft',
            },
          } as HistoryTransaction)))
        }

        if (transaction.nativeTransfers) {
          acc2.push(...transaction.nativeTransfers.map((transfer, index) => ({
            ...transaction,
            id: `${transaction.transactionHash ?? transaction.userOpHash}-native-${index}`,
            assetTransfer: {
              ...transfer,
              type: 'native',
            },
          } as HistoryTransaction)))
        }
        return acc2;
      }, []);
      acc.push(...transfersAsTransactions);
    });
    return acc;
  }, []), [history]);

  if (!isContentVisible) {
    return <Wrapper />
  }

  // no account txs per chain = loading
  const isLoadingHistory = !Object.values(history).length;

  if (!accountAddress || isLoadingHistory) {
    return (
      <Wrapper>
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
    )
  }

  const sortedTransactions = allTransactions.sort((a, b) => b.timestamp - a.timestamp);

  return (
    <Wrapper>
      {!sortedTransactions.length && (
        <Alert>{t`error.pageNotFound`}</Alert>
      )}
      {sortedTransactions.map((transaction) => {
        const chain = visibleChains.find((c) => c.id === transaction.chainId);
        const isAssetOut = addressesEqual(accountAddress, transaction?.assetTransfer?.from ?? transaction.sender);
        const momentTs = moment.unix(transaction.timestamp);

        let assetSymbol;
        let assetValue;
        if (transaction.assetTransfer?.type === 'erc20' || transaction.assetTransfer?.type === 'native') {
          assetSymbol = ` ${transaction.assetTransfer.asset ?? `${transaction.assetTransfer.type.toUpperCase()} TOKEN`}`
          assetValue = transaction.assetTransfer.value;
        } else if (transaction.assetTransfer?.type === 'nft') {
          assetSymbol = ` ${transaction.assetTransfer.asset ?? `${transaction.assetTransfer.category.toUpperCase()} NFT`}`
          assetValue = transaction.assetTransfer.tokenId && ` ID ${transaction.assetTransfer.tokenId}`;
        }

        const successToStatus: {
          [key in UserOpTransaction['success']]: 'pending' | 'completed' | 'reverted';
        } = {
          Pending: 'pending',
          Completed: 'completed',
          Reverted: 'reverted',
        }

        const transactionStatus = successToStatus[transaction.success];
        const asset = assets[transaction.chainId].find((a) => transaction.assetTransfer?.address
          && addressesEqual(a.address, transaction.assetTransfer.address));

        return (
          <HistoryCard key={transaction.id}>
            <DetailsRow>
              <ChainAssetIcon asset={asset} chainId={transaction.chainId} />
              <div>
                <ActionText>
                  {isAssetOut ? t`label.sent` : t`label.received`}
                  {assetSymbol}
                  {!!chain && (
                    <a
                      href={transaction.blockExplorerUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <IconExportSquare size={11} />
                    </a>
                  )}
                </ActionText>
                <ActionSubtext>
                  {t`label.on`} {chain?.name ?? t('helper.unknownNetwork', { chainId: transaction.chainId })}
                </ActionSubtext>
              </div>
              {!!assetValue && (
                <div>
                  <ActionText>
                    {isAssetOut ? '-' : '+'} {assetValue}
                  </ActionText>
                  {/* TODO: add price when returned from Prime SDK */}
                  {/*<ActionSubtext>*/}
                  {/*  $100*/}
                  {/*</ActionSubtext>*/}
                </div>
              )}
            </DetailsRow>
            <ActionSubtext>
              {isAssetOut && !!transaction.assetTransfer?.to && (
                `${t`label.to`} ${humanizeAddress(transaction.assetTransfer?.to)}`
              )}
              {(!isAssetOut || !transaction.assetTransfer?.to) && (
                `${t`label.from`}: ${humanizeAddress(transaction.assetTransfer?.from ?? transaction.sender)}`
              )}
            </ActionSubtext>
            <DetailsRow $noBorder>
              <Timestamp>
                {momentTs.format('DD-MM-YYYY')}
                <span />
                {momentTs.format('HH:mm')}
              </Timestamp>
              <TransactionStatus $status={transactionStatus}>
                {t(`status.${transactionStatus}`)}
              </TransactionStatus>
            </DetailsRow>
          </HistoryCard>
        )
      })}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
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
  
  ${({ $noBorder, theme }) => !$noBorder && `
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
  color: ${({ theme }) => theme.color.text.cardContent}
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
    background: ${({ theme }) => theme.color.border.cardContentVerticalSeparator}
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

const TransactionStatus = styled.div<{ $status: 'pending' | 'completed' | 'reverted' }>`
  padding: 4px 6px;
  font-size: 12px;
  border-radius: 3px;
  background: ${({ theme, $status }) => theme.color.background.transactionStatus[$status]};
  color: ${({ theme, $status }) => theme.color.text.transactionStatus[$status]};
`;

export default HistoryModal;
