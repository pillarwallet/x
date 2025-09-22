import { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { MdCheck } from 'react-icons/md';
import ArrowDown from '../../assets/arrow-down.svg';
import CopyIcon from '../../assets/copy-icon.svg';
import TransactionFailedIcon from '../../assets/transaction-failed-details-icon.svg';

interface TransactionErrorBoxProps {
  technicalDetails?: string;
}

const TransactionErrorBox = ({
  technicalDetails = 'Error: No technical details available.',
}: TransactionErrorBoxProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isCopied]);

  const handleCopy = () => setIsCopied(true);

  return (
    <div className="w-full h-fit rounded-[10px] p-3 gap-4 border border-[#FF366C] bg-[#FF366C]/10 flex flex-col">
      <div className="flex gap-1.5 items-center pb-4 border-b border-[#FF366C]">
        <img className="w-8 h-8" src={TransactionFailedIcon} alt="Error" />
        <div className="flex flex-col">
          <p className="text-[13px] font-normal text-[#FF366C]">
            Transaction failed.
          </p>
          <p className="text-[13px] font-normal text-white">
            Something went wrong. Please try again.
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-2 py-1.5 rounded-[6px] bg-[#FF366C]/30 text-white text-[13px] font-normal flex items-center gap-2"
        >
          Technical Details
          <span
            className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          >
            <img src={ArrowDown} alt="arrow-down" className="w-2 h-2" />
          </span>
        </button>

        <CopyToClipboard text={technicalDetails} onCopy={handleCopy}>
          <button
            type="button"
            className="px-2 py-1.5 rounded-[6px] bg-[#FF366C]/30 text-white text-[13px] font-normal flex items-center gap-2"
          >
            Copy
            {isCopied ? (
              <MdCheck className="w-[10px] h-3 text-white" />
            ) : (
              <img src={CopyIcon} alt="copy-icon" className="w-[10px] h-3" />
            )}
          </button>
        </CopyToClipboard>
      </div>

      {isExpanded && (
        <div className="mt-2 p-3 bg-black/20 rounded-[6px] border border-[#FF366C]/30">
          <p className="text-white/70 text-[12px] font-mono whitespace-pre-wrap break-all">
            {technicalDetails}
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionErrorBox;
