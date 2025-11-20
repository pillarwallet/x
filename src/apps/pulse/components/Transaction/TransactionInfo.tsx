import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { MdCheck } from 'react-icons/md';

// icons
import ExternalLinkLogo from '../../../token-atlas/images/external-link-audit.svg';
import ConfirmedIcon from '../../assets/confirmed-icon.svg';
import CopyIcon from '../../assets/copy-icon.svg';

// components
import Tooltip from '../Misc/Tooltip';

// utils
import { getBlockScan } from '../../../../utils/blockchain';
import { getStatusInfo, isValidHash, truncateHash } from '../../utils/utils';

// types
import { TransactionInfoProps } from '../../types/types';

const TransactionInfo = ({
  status,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  userOpHash,
  txHash,
  chainId,
  gasFee,
  completedAt,
  isBuy = false,
  resourceLockTxHash,
  resourceLockChainId,
  completedTxHash,
  completedChainId,
  useRelayBuy = false,
  fromChainId,
}: TransactionInfoProps) => {
  const [isCopied, setIsCopied] = useState(false);

  // For Intent SDK Buy, use completedTxHash; for Relay Buy and Sell, use txHash
  const displayTxHash = isBuy && !useRelayBuy ? completedTxHash || '-' : txHash;

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isCopied]);

  const handleExternalLink = (hash: string, cId: number) => {
    window.open(`${getBlockScan(cId)}${hash}`, '_blank', 'noopener,noreferrer');
  };

  const statusInfo = getStatusInfo(status);

  const detailsEntry = (
    lhs: string,
    rhs: string,
    showExternalLink = false,
    showCopy = false,
    tooltipContent = '',
    transactionHash?: string,
    txChainId?: number
  ) => {
    const isHashValid = isValidHash(transactionHash);
    const effectiveChainId = txChainId || chainId;

    return (
      <div className="flex justify-between">
        <div className="flex items-center text-white/50 text-[13px] font-normal">
          {lhs}
          {tooltipContent && (
            <div className="ml-1.5">
              <Tooltip content={tooltipContent}>
                <div className="w-3 h-3 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-white/50 text-[10px] font-normal">
                    ?
                  </span>
                </div>
              </Tooltip>
            </div>
          )}
          {showExternalLink && isHashValid && transactionHash && (
            <button
              type="button"
              onClick={() =>
                handleExternalLink(transactionHash, effectiveChainId)
              }
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
                src={ConfirmedIcon}
                alt="confirmed"
                className="w-[8px] h-[5px]"
              />
            </div>
            <span className={`${lhs === 'Status' && statusInfo.color}`}>
              {rhs}
            </span>
          </div>
          {showCopy && isHashValid && transactionHash && (
            <CopyToClipboard
              text={transactionHash}
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
  };

  return (
    <div className="flex flex-col w-full gap-3">
      {detailsEntry('Status', statusInfo.text)}
      {status === 'Transaction Complete' &&
        completedAt &&
        detailsEntry('Time', format(completedAt, 'MMM d, yyyy HH:mm'))}
      {isBuy && !useRelayBuy ? (
        <>
          {detailsEntry(
            'Resource Lock',
            truncateHash(resourceLockTxHash || '-'),
            !!resourceLockTxHash,
            !!resourceLockTxHash,
            '',
            resourceLockTxHash,
            resourceLockChainId
          )}
          {detailsEntry(
            'Completed',
            truncateHash(completedTxHash || '-'),
            !!completedTxHash,
            !!completedTxHash,
            '',
            completedTxHash,
            completedChainId
          )}
        </>
      ) : (
        detailsEntry(
          'Tx Hash',
          truncateHash(displayTxHash || '-'),
          !!displayTxHash,
          !!displayTxHash,
          '',
          displayTxHash,
          // For Relay Buy, use fromChainId (where USDC is taken from)
          // For Sell, use chainId (selling token's chain)
          isBuy && useRelayBuy ? fromChainId || chainId : chainId
        )
      )}
      {detailsEntry(
        'Gas Fee',
        (() => {
          const gasFeeDisplay = gasFee || '-';
          return gasFeeDisplay;
        })(),
        false,
        false,
        'Fee that will be deducted from your universal gas tank.'
      )}
    </div>
  );
};

export default TransactionInfo;
