import { TailSpin } from 'react-loader-spinner';

interface ProgressStepProps {
  step: 'Submitted' | 'Pending' | 'Completed';
  status: 'completed' | 'pending' | 'failed';
  label: string;
  isLast?: boolean;
  showLine?: boolean;
  lineStatus?: 'completed' | 'pending' | 'failed';
  timestamp?: string;
}

const ProgressStep = ({
  step,
  status,
  label,
  isLast = false,
  showLine = true,
  lineStatus = 'pending',
  timestamp,
}: ProgressStepProps) => {
  const getCircleClasses = () => {
    const baseClasses =
      'w-4 h-4 rounded-full flex items-center justify-center relative z-10';

    if (status === 'completed') {
      return `${baseClasses} bg-[#8A77FF]`;
    }
    if (status === 'failed') {
      return `${baseClasses} bg-[#8A77FF]`;
    }
    if (status === 'pending' && step === 'Pending') {
      return `${baseClasses} bg-[#8A77FF]`;
    }
    return `${baseClasses} bg-[#121116]`;
  };

  const getLineClasses = () => {
    return `w-0.5 h-4 ml-2 ${lineStatus === 'completed' ? 'bg-[#8A77FF]' : 'bg-[#121116]'}`;
  };

  const getTextClasses = () => {
    const baseClasses = 'font-normal text-[13px]';
    if (status === 'failed' || status === 'completed') {
      return `${baseClasses} text-white`;
    }
    return `${baseClasses} text-white/50`;
  };

  const renderIcon = () => {
    if (status === 'completed') {
      return (
        <svg
          className="w-2 h-2 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      );
    }

    if (status === 'failed') {
      return (
        <svg
          className="w-2 h-2 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      );
    }

    if (status === 'pending' && step === 'Pending') {
      return (
        <TailSpin color="#FFFFFF" height={10} width={10} strokeWidth={8} />
      );
    }

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
          <div className="text-white/50 text-[13px] font-normal text-right">
            {/* Full timestamp - hidden on small screens */}
            <span className="xs:hidden">{timestamp}</span>
            {/* Time only - shown on small screens */}
            <span className="hidden xs:inline">
              {timestamp.includes('•')
                ? timestamp.split('•')[1].trim()
                : timestamp}
            </span>
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

export default ProgressStep;
