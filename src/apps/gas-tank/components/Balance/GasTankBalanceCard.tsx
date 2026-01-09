import { ProcessedGasTankTransaction } from '../../types/gasTank';
import { TailSpin } from 'react-loader-spinner';
import GasTankIcon from '../../../pulse/assets/gas-tank-icon.svg';

interface GasTankBalanceCardProps {
  balance: number;
  isLoading: boolean;
  transactions: ProcessedGasTankTransaction[];
  onTopUpClick: () => void;
}

/**
 * Gas tank balance card component
 * Displays: balance, "On All Networks" subtitle, total spend, and top-up button
 */
export const GasTankBalanceCard: React.FC<GasTankBalanceCardProps> = ({
  balance,
  isLoading,
  transactions,
  onTopUpClick,
}) => {
  // Calculate total spend from transactions (sum of all Spend type transactions)
  const totalSpend = transactions
    .filter((tx) => tx.type === 'Spend')
    .reduce((sum, tx) => sum + parseFloat(tx.usdcAmount), 0);

  return (
    <div className="w-full md:w-auto md:flex-1 max-w-[606px] min-w-[300px] h-[460px] bg-[#1E1D24] border border-[#25232D] rounded-[12px] overflow-hidden p-[16px] flex flex-col relative">
      {/* Background Vectors Removed */}

      {/* Header with icon */}
      <div className="flex items-center gap-[5px] mb-[10px]">
        {/* Group 1171278651 */}
        <div className="w-[25px] h-[22px] relative flex items-center justify-center">
            <img src={GasTankIcon} alt="Gas Tank" className="w-full h-full" />
        </div>
        <span className="font-['Poppins'] font-normal text-[16px] leading-[16px] text-white">
          Universal Gas Tank
        </span>
      </div>

      {/* Balance display */}
      <div className="mb-[20px]">
        {isLoading ? (
          <div className="flex items-center justify-start h-[30px]">
            <TailSpin color="#FFFFFF" height={24} width={24} />
          </div>
        ) : (
          <div className="flex items-end gap-2">
            <span className="font-['Poppins'] font-medium text-[36px] leading-[36px] tracking-[-0.02em] text-white">
              ${balance.toFixed(2)}
            </span>
            <span className="font-['Poppins'] font-normal text-[14px] leading-[26px] tracking-[-0.02em] text-[#8A77FF]">
              On All Networks
            </span>
          </div>
        )}
      </div>

      {/* Top up button */}
      <div className="mb-[20px] w-[106px] h-[43px] bg-[#121116] rounded-[10px] pt-[2px] pr-[2px] pb-[6px] pl-[2px] flex flex-col gap-[10px] flex-shrink-0">
        <button
          onClick={onTopUpClick}
          className="w-[102px] h-[35px] bg-[#4E448A] rounded-[8px] flex items-center justify-center gap-[10px] hover:bg-[#5A52A0] transition-colors px-[6px] py-[1px]"
        >
          <span className="font-['Poppins'] font-semibold text-[14px] leading-[21px] text-center tracking-[-0.02em] text-white">
            Top up
          </span>
        </button>
      </div>

      {/* Subtitle */}
      <div className="mb-[12px]">
        <span className="font-['Poppins'] font-normal text-[13px] leading-[20px] tracking-[-0.02em] text-white">
          Top up your Gas Tank so you pay for network fees on every chain.
        </span>
      </div>

      {/* Total spend badge - If user meant "balance needs to be on bottom", maybe they meant "Total Spend"? Positioned here. */}
      {totalSpend > 0 && (
        <div className="mb-[12px] self-start inline-flex items-center justify-center gap-2 px-[6px] py-[4px] bg-[rgba(92,255,147,0.1)] rounded-[4px]">
          <span className="font-['Poppins'] font-normal text-[14px] leading-[14px] tracking-[-0.02em] text-[#5CFF93]">
            Total Spend: ${totalSpend.toFixed(2)}
          </span>
        </div>
      )}

      {/* Description */}
      <div className="w-full">
        <p className="font-['Poppins'] font-light text-[13px] leading-[20px] tracking-[-0.02em] text-white opacity-50 m-0">
          The PillarX Gas Tank is your universal balance for covering transaction
          fees across all networks. When you top up your Tank, you’re allocating
          tokens specifically for paying gas. You can increase your balance
          anytime, and the tokens in your Tank can be used to pay network fees on
          any supported chain.
        </p>
      </div>
    </div>
  );
};
