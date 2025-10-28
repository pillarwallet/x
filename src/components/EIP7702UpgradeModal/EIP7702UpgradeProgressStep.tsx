import { TailSpin } from 'react-loader-spinner';

// types
import { UpgradeStatus } from './types';

export interface UpgradeProgressStepProps {
  status: UpgradeStatus;
  label: string;
  isLast?: boolean;
  showLine?: boolean;
  lineStatus?: UpgradeStatus;
  timestamp?: string | React.ReactNode;
}

const EIP7702UpgradeProgressStep = ({
  status,
  label,
  isLast = false,
  showLine = true,
  lineStatus = 'submitted',
  timestamp,
}: UpgradeProgressStepProps) => {
  const getCircleClasses = () => {
    const baseClasses =
      'w-4 h-4 rounded-full flex items-center justify-center relative z-10';

    if (status === 'completed') {
      return `${baseClasses} bg-[#8A77FF]`;
    }
    if (status === 'failed') {
      return `${baseClasses} bg-[#8A77FF]`;
    }
    if (status === 'upgrading') {
      return `${baseClasses} bg-[#8A77FF]`;
    }
    return `${baseClasses} bg-[#121116]`;
  };

  const getLineClasses = () => {
    return `w-0.5 h-4 ml-2 ${lineStatus === 'completed' || lineStatus === 'upgrading' || lineStatus === 'failed' ? 'bg-[#8A77FF]' : 'bg-[#121116]'}`;
  };

  const getTextClasses = () => {
    const baseClasses = 'font-normal text-[13px]';
    if (status === 'failed' || status === 'completed') {
      return `${baseClasses} text-white`;
    }
    if (status === 'upgrading') {
      return `${baseClasses} text-white/50`;
    }
    return `${baseClasses} text-white/50`;
  };

  const getTimestampDisplay = () => {
    if (typeof timestamp === 'string' && timestamp.includes('•')) {
      return timestamp.split('•')[1].trim();
    }
    if (typeof timestamp === 'string') {
      return timestamp;
    }
    return timestamp;
  };

  const renderIcon = () => {
    // Completed steps show check icon
    if (status === 'completed') {
      return (
        <svg
          className="w-3 h-3 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
          strokeWidth="2"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      );
    }

    // Failed steps show cross icon
    if (status === 'failed') {
      return (
        <svg
          className="w-3 h-3 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
          strokeWidth="2"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      );
    }

    // In-progress steps show loading spinner
    if (status === 'upgrading') {
      return (
        <TailSpin color="#FFFFFF" height={10} width={10} strokeWidth={8} />
      );
    }

    // Submitted/ready shows nothing (inactive)
    return null;
  };

  return (
    <>
      {/* Step Circle and Label */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className={getCircleClasses()}>{renderIcon()}</div>
          <span className={getTextClasses()}>{label}</span>
        </div>
        {status === 'completed' && timestamp && (
          <div className="text-[13px] font-normal text-right">
            {/* Full timestamp - hidden on small screens */}
            <span className="xs:hidden">{timestamp}</span>
            {/* Time only - shown on small screens */}
            <span className="hidden xs:inline">{getTimestampDisplay()}</span>
          </div>
        )}
      </div>

      {/* Connecting Line */}
      {showLine && !isLast && (
        <div
          className={getLineClasses()}
          style={{ marginTop: '-8px', marginBottom: '-8px', height: '24px' }}
        />
      )}
    </>
  );
};

export default EIP7702UpgradeProgressStep;
