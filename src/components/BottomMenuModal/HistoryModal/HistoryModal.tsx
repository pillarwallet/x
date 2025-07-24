/* eslint-disable @typescript-eslint/no-use-before-define */
import styled from 'styled-components';

// hooks
import useTransactionKit from '../../../hooks/useTransactionKit';

// components
import SkeletonLoader from '../../SkeletonLoader';
import TransactionInfo from './TransactionInfo';

interface HistoryModalProps {
  isContentVisible?: boolean; // for animation purpose to not render rest of content and return main wrapper only
}

const HistoryModal = ({ isContentVisible }: HistoryModalProps) => {
  const { walletAddress: accountAddress } = useTransactionKit();

  if (!isContentVisible) {
    return <Wrapper />;
  }

  if (!accountAddress) {
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

  return (
    <Wrapper id="history-modal">
      <TransactionInfo />
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
