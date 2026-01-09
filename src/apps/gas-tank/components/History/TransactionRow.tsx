import { ProcessedGasTankTransaction } from '../../types/gasTank';
import { getLogoForChainId, getBlockScan } from '../../../../utils/blockchain';
import moment from 'moment';

interface TransactionRowProps {
  transaction: ProcessedGasTankTransaction;
}

/**
 * Individual transaction row component
 * Displays: Date | Type | Amount | Chain Icon
 * Clickable to open block explorer if transaction hash is available
 */
export const TransactionRow: React.FC<TransactionRowProps> = ({
  transaction,
}) => {
  const chainLogo = getLogoForChainId(transaction.chainId);
  const formattedDate = moment.unix(transaction.timestamp).format('MMM DD');
  const formattedTime = moment.unix(transaction.timestamp).format('HH:mm');

  // Determine color based on transaction type
  const isTopUp = transaction.type === 'Top-up';
  const amountColor = isTopUp ? 'text-[#5CFF93]' : 'text-[#FF366C]';

  // Handle click to open block explorer
  const handleClick = () => {
    if (transaction.transactionHash) {
      const explorerUrl = getBlockScan(transaction.chainId, false);
      if (explorerUrl) {
        window.open(`${explorerUrl}${transaction.transactionHash}`, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const isClickable = !!transaction.transactionHash;

  return (
    <div 
      className={`flex items-center w-full h-[14px] ${isClickable ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
      onClick={handleClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      {/* Date Column */}
      <div className="w-[120px] flex items-center gap-[5px]">
        <span className="font-['Poppins'] font-normal text-[14px] leading-[14px] tracking-[-0.02em] text-white opacity-50">
          {formattedDate},
        </span>
        <span className="font-['Poppins'] font-normal text-[14px] leading-[14px] tracking-[-0.02em] text-white opacity-50">
          {formattedTime}
        </span>
      </div>

      {/* Type Column */}
      <div className="w-[80px] flex items-center">
        <span className="font-['Poppins'] font-normal text-[14px] leading-[14px] tracking-[-0.02em] text-white">
          {transaction.type}
        </span>
      </div>

      {/* Amount Column */}
      <div className="w-[120px] flex items-center justify-end">
        <span className={`font-['Poppins'] font-normal text-[14px] leading-[14px] tracking-[-0.02em] ${amountColor}`}>
          {transaction.displayAmount}
        </span>
      </div>

      {/* Token with Chain Icon Column */}
      <div className="flex-1 flex items-center justify-end gap-[10px]">
        <div className="relative w-[24px] h-[24px]">
          {/* Main Token Logo - using provided logo or default generic icon if missing */}
          <img
            src={transaction.tokenLogo || 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png'} // Fallback to USDC logo
            alt="Token"
            className="w-full h-full rounded-full object-cover"
          />
          
          {/* Chain Badge - Bottom Right */}
          {chainLogo && (
            <div className="absolute -bottom-1 -right-1 w-[12px] h-[12px] rounded-full border border-[#1E1D24] bg-[#1E1D24] overflow-hidden flex items-center justify-center">
              <img
                src={chainLogo}
                alt="Chain"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
        <span className="font-['Poppins'] font-normal text-[14px] leading-[14px] tracking-[-0.02em] text-white">
          {transaction.usdcAmount} <span className="opacity-50">{transaction.tokenSymbol}</span>
        </span>
      </div>
    </div>
  );
};
