import styled, { keyframes, css } from 'styled-components';
import { darken } from 'polished';
import { colors, typography } from './shared.styles';

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const skeletonAnimation = css`
  background: linear-gradient(
    90deg,
    ${colors.background} 0%,
    rgba(139, 92, 246, 0.1) 50%,
    ${colors.background} 100%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite linear;
  border-radius: 4px;
`;


export const S = {
  MainContainer: styled.div`
    background: #1A1B1E;
    border-radius: 16px;
    padding: 24px;
    width: 100%;
    max-width: 1400px;
    color: #FFFFFF;
    display: flex;
    gap: 32px;

    @media (max-width: 768px) {
      flex-direction: column;
      max-width: 480px;
      gap: 24px;
    }
  `,

  LeftSection: styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
    min-width: 400px;

    @media (max-width: 768px) {
      min-width: auto;
    }
  `,

  RightSection: styled.div`
    flex: 1.5;

    @media (max-width: 768px) {
      flex: 1;
    }
  `,

  Header: styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 16px;
  `,

  TitleSection: styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
  `,

  Icon: styled.span`
    font-size: 24px;
  `,

  IconImage: styled.img`
    width: 24px;
    height: 24px;
    object-fit: contain;
  `,

  Title: styled.h2`
    font-size: 20px;
    font-weight: 600;
    margin: 0;
    color: #FFFFFF;
  `,

  RefreshButton: styled.button`
    background: rgba(139, 92, 246, 0.1);
    color: ${colors.text.accent};
    border: 1px solid rgba(139, 92, 246, 0.3);
    border-radius: 6px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;

    &:hover {
      background: rgba(139, 92, 246, 0.2);
      border-color: rgba(139, 92, 246, 0.5);
      transform: rotate(90deg);
    }
  `,

  BalanceSection: styled.div`
    margin-bottom: 24px;
    display: flex;
    align-items: baseline;
    gap: 8px;
  `,

  BalanceAmount: styled.div`
    font-size: 48px;
    font-weight: 600;
    color: #FFFFFF;
  `,

  LoadingBalance: styled.div`
    ${skeletonAnimation}
    display: flex;
    align-items: center;
    gap: 12px;
    color: #9ca3af;
    padding: 20px;
    justify-content: center;
    height: 48px;
    width: 180px;
  `,

  LoadingContainer: styled.div`
    display: flex;
    gap: 32px;
    width: 100%;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 24px;
    }
  `,

  LoadingLeftSection: styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
    min-width: 400px;

    @media (max-width: 768px) {
      min-width: auto;
    }
  `,

  LoadingRightSection: styled.div`
    flex: 1.5;
    display: flex;
    flex-direction: column;
    gap: 16px;

    @media (max-width: 768px) {
      flex: 1;
    }
  `,

  LoadingHeader: styled.div`
    ${skeletonAnimation}
    height: 24px;
    width: 200px;
    margin-bottom: 16px;
  `,

  LoadingBalanceAmount: styled.div`
    ${skeletonAnimation}
    height: 40px;
    width: 150px;
    margin-bottom: 8px;
  `,

  LoadingNetworkLabel: styled.div`
    ${skeletonAnimation}
    height: 16px;
    width: 120px;
    margin-bottom: 24px;
  `,

  LoadingButton: styled.div`
    ${skeletonAnimation}
    height: 44px;
    width: 100%;
    border-radius: 12px;
    margin-bottom: 16px;
  `,

  LoadingDescription: styled.div`
    ${skeletonAnimation}
    height: 16px;
    width: 100%;
    margin-bottom: 16px;
  `,

  LoadingSpendInfo: styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 16px 0;
  `,

  LoadingSpendLabel: styled.div`
    ${skeletonAnimation}
    height: 16px;
    width: 80px;
  `,

  LoadingSpendAmount: styled.div`
    ${skeletonAnimation}
    height: 16px;
    width: 60px;
  `,

  LoadingDetailedDescription: styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 16px;
  `,

  LoadingDetailedLine: styled.div`
    ${skeletonAnimation}
    height: 14px;
    width: 100%;

    &:last-child {
      width: 70%;
    }
  `,

  LoadingHistoryHeader: styled.div`
    ${skeletonAnimation}
    height: 20px;
    width: 180px;
    margin-bottom: 16px;
  `,

  LoadingTableHeader: styled.div`
    display: grid;
    grid-template-columns: 0.5fr 1.5fr 1fr 1fr 1.5fr;
    gap: 16px;
    padding: 12px 16px;
    border-bottom: 1px solid ${colors.border};
    margin-bottom: 12px;
  `,

  LoadingTableHeaderCell: styled.div`
    ${skeletonAnimation}
    height: 14px;
    width: 80%;
  `,

  LoadingTableRow: styled.div`
    display: grid;
    grid-template-columns: 0.5fr 1.5fr 1fr 1fr 1.5fr;
    gap: 16px;
    padding: 12px 16px;
    margin-bottom: 12px;
  `,

  LoadingTableCell: styled.div`
    ${skeletonAnimation}
    height: 16px;
    width: 90%;

    &:first-child {
      width: 30px;
    }

    &:last-child {
      width: 100%;
    }
  `,

  ErrorBalance: styled.div`
    ${typography.body};
    color: ${colors.status.error};
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  `,

  RetryButton: styled.button`
    background: ${colors.status.error};
    color: ${colors.text.primary};
    border: none;
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 12px;
    cursor: pointer;
    
    &:hover {
      background: #dc2626;
    }
  `,

  NetworkLabel: styled.div`
    color: #3B82F6;
    font-size: 12px;
  `,

  TopUpButton: styled.button`
    background: #6D28D9;
    color: #FFFFFF;
    border: none;
    border-radius: 12px;
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    width: fit-content;
    min-width: 200px;

    &:hover {
      background: ${darken(0.1, '#6D28D9')};
    }
  `,

  Description: styled.p`
    ${typography.body};
    margin: 0 0 16px 0;
  `,

  SpendInfo: styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 16px 0;
  `,

  SpendLabel: styled.span`
    color: #22C55E;
    font-size: 14px;
  `,

  SpendAmount: styled.span`
    color: #FFFFFF;
    font-size: 14px;
    font-weight: 600;
  `,

  DetailedDescription: styled.p`
    color: #A1A1AA;
    font-size: 14px;
    line-height: 1.6;
    margin: 0;
  `
};