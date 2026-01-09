
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// hooks
import { useGasTankBalance } from '../../../pulse/hooks/useGasTankBalance';
import { useGasTankHistory } from '../../../gas-tank/hooks/useGasTankHistory';
import useTransactionKit from '../../../../hooks/useTransactionKit';

// assets
import GasTankIcon from '../../../pulse/assets/gas-tank-icon.svg';

// components
import { TransactionRow } from '../../../gas-tank/components/History/TransactionRow';
import { SkeletonTransactionRow } from '../../../gas-tank/components/History/GasTankSkeleton';
import PillarXTile from '../../components/TileContainer/TileContainer';

const GasTankTile = () => {
  const navigate = useNavigate();
  const { walletAddress } = useTransactionKit();

  const { totalBalance, isLoading: isBalanceLoading } = useGasTankBalance(walletAddress || null);
  const { transactions, isLoading: isHistoryLoading } = useGasTankHistory(walletAddress || null);

  // Take first 5 transactions
  const formatTransactions = transactions.slice(0, 5);

  const handleClick = () => {
    navigate('/gas-tank');
  };

  return (
    <Container onClick={handleClick}>
      {/* Left Panel: Detailed Balance Card */}
      <div className="flex flex-col w-full md:w-[40%] relative p-4 gap-4">
        {/* Header with icon */}
        <div className="flex items-center gap-[5px] z-10">
          <div className="w-[25px] h-[22px] relative flex items-center justify-center">
            <img src={GasTankIcon} alt="Gas Tank" className="w-full h-full" />
          </div>
          <span className="font-['Poppins'] font-normal text-[16px] leading-[16px] text-white">
            Universal Gas Tank
          </span>
        </div>

        {/* Balance */}
        <div className="z-10 mt-2">
          {isBalanceLoading ? (
            <SkeletonBalance />
          ) : (
            <div className="flex items-end gap-2 flex-wrap">
              <span className="font-['Poppins'] font-medium text-[36px] leading-[36px] tracking-[-0.02em] text-white">
                ${totalBalance.toFixed(2)}
              </span>
              <span className="font-['Poppins'] font-normal text-[14px] leading-[26px] tracking-[-0.02em] text-[#8A77FF]">
                On All Networks
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="z-10 mt-auto">
          <p className="font-['Poppins'] font-light text-[13px] leading-[20px] tracking-[-0.02em] text-white opacity-50 m-0">
             The PillarX Gas Tank is your universal balance for covering transaction
             fees across all networks.
          </p>
        </div>
      </div>

      {/* Right Panel: History */}
      <div className="flex flex-col w-full md:w-[60%] border-t md:border-t-0 md:border-l border-[#25232D] pt-4 md:pt-0 md:pl-6 h-full">
         {/* Column Headers */}
         <div className="w-full flex items-center pb-2 border-b border-[#25232D] mb-3">
          <div className="w-[120px] text-left font-['Poppins'] font-normal text-[14px] leading-[14px] tracking-[-0.02em] text-white opacity-50">
            Date
          </div>
          <div className="w-[80px] text-left font-['Poppins'] font-normal text-[14px] leading-[14px] tracking-[-0.02em] text-white opacity-50">
            Type
          </div>
          <div className="w-[120px] text-right font-['Poppins'] font-normal text-[14px] leading-[14px] tracking-[-0.02em] text-white opacity-50">
            Amount
          </div>
          <div className="flex-1 text-right font-['Poppins'] font-normal text-[14px] leading-[14px] tracking-[-0.02em] text-white opacity-50">
            Token
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-[200px]">
          {isHistoryLoading ? (
            <div className="flex flex-col gap-2">
              {[...Array(3)].map((_, i) => (
                <SkeletonTransactionRow key={i} />
              ))}
            </div>
          ) : formatTransactions.length === 0 ? (
            <EmptyState>No recent transactions</EmptyState>
          ) : (
            <div className="flex flex-col gap-[12px]">
              {formatTransactions.map((tx) => (
                <TransactionRow key={tx.id} transaction={tx} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

// Reuse styles similar to GasTankBalanceCard but adapted for Tile
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #1E1D24;
  border: 1px solid #25232D;
  border-radius: 20px;
  padding: 24px;
  cursor: pointer;
  transition: border-color 0.2s;
  min-height: 350px;
  gap: 24px;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: stretch;
  }

  &:hover {
    border-color: #353340;
  }
`;

const EmptyState = styled.div`
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  text-align: center;
  padding: 20px 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const SkeletonBalance = styled.div`
  width: 120px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: .5;
    }
  }
`;

export default GasTankTile;
