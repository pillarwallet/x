import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { MdCheck } from 'react-icons/md';

// icons
import ExternalLinkLogo from '../../../token-atlas/images/external-link-audit.svg';
import CopyIcon from '../../assets/copy-icon.svg';

// components
import Tooltip from '../Misc/Tooltip';

// utils
import { getBlockScan } from '../../../../utils/blockchain';

interface TransactionInfoProps {
  status:
    | 'Starting Transaction'
    | 'Transaction Pending'
    | 'Transaction Complete'
    | 'Transaction Failed';
  userOpHash: string;
  txHash?: string;
  chainId: number;
  gasFee?: string;
  completedAt?: Date;
}

const TransactionInfo = ({
  status,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  userOpHash,
  txHash,
  chainId,
  gasFee,
  completedAt,
}: TransactionInfoProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const displayTxHash = txHash;
  const hasValidTxHash = displayTxHash && displayTxHash !== '-';

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isCopied]);

  const handleExternalLink = () => {
    window.open(
      `${getBlockScan(chainId)}${displayTxHash}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const getStatusInfo = () => {
    switch (status) {
      case 'Transaction Pending':
        return { text: 'Pending', color: 'text-[#FFAB36]' };
      case 'Transaction Failed':
        return { text: 'Failed', color: 'text-[#FF366C]' };
      case 'Transaction Complete':
        return { text: 'Success', color: 'text-[#5CFF93]' };
      default:
        return { text: 'Starting...', color: 'text-white/50' };
    }
  };

  const statusInfo = getStatusInfo();

  const detailsEntry = (
    lhs: string,
    rhs: string,
    showExternalLink = false,
    showCopy = false,
    tooltipContent = ''
  ) => (
    <div className="flex justify-between">
      <div className="flex items-center text-white/50 text-[13px] font-normal">
        {lhs}
        {tooltipContent && (
          <div className="ml-1.5">
            <Tooltip content={tooltipContent}>
              <div className="w-3 h-3 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-white/50 text-[10px] font-normal">?</span>
              </div>
            </Tooltip>
          </div>
        )}
        {showExternalLink && hasValidTxHash && (
          <button
            type="button"
            onClick={handleExternalLink}
            className="w-3 h-3 ml-1"
          >
            <img
              src={ExternalLinkLogo}
              alt="external-link"
              className="w-3 h-3"
            />
          </button>
        )}
      </div>
      <div className="flex items-center text-[13px] font-normal text-white">
        <div className="flex w-full items-center gap-1">
          <div
            className={`${lhs !== 'Status' || statusInfo.text !== 'Success' ? 'hidden' : ''} w-[14px] h-[14px] rounded-full border border-[#5CFF93] bg-[#5CFF93]/30 flex items-center justify-center flex-shrink-0`}
          >
            <img
              src="/src/apps/pulse/assets/confirmed-icon.svg"
              alt="confirmed"
              className="w-[8px] h-[5px]"
            />
          </div>
          <span className={`${lhs === 'Status' && statusInfo.color}`}>
            {rhs}
          </span>
        </div>
        {showCopy && hasValidTxHash && (
          <CopyToClipboard
            text={displayTxHash}
            onCopy={() => setIsCopied(true)}
          >
            <div className="flex items-center ml-1 cursor-pointer">
              {isCopied ? (
                <MdCheck className="w-[10px] h-3 text-white" />
              ) : (
                <img
                  src={CopyIcon}
                  alt="copy-address-icon"
                  className="w-[10px] h-3"
                />
              )}
            </div>
          </CopyToClipboard>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full gap-3">
      {detailsEntry('Status', statusInfo.text)}
      {status === 'Transaction Complete' &&
        completedAt &&
        detailsEntry('Time', format(completedAt, 'MMM d, yyyy HH:mm'))}
      {detailsEntry(
        'Tx Hash',
        hasValidTxHash
          ? `${displayTxHash.slice(0, 6)}...${displayTxHash.slice(-4)}`
          : '-',
        true,
        true
      )}
      {detailsEntry(
        'Gas Fee',
        gasFee || '-',
        false,
        false,
        'Fee that will be deducted from your universal gas tank.'
      )}
    </div>
  );
};

export default TransactionInfo;
