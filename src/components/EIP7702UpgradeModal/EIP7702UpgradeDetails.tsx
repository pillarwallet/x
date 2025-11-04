import { format } from 'date-fns';
import { useRef } from 'react';

// types
import { UpgradeStatus } from './types';

// components
import EIP7702UpgradeProgressStep from './EIP7702UpgradeProgressStep';

interface EIP7702UpgradeDetailsProps {
  onClose: () => void;
  onCloseModal?: () => void;
  status: UpgradeStatus;
  submittedAt?: Date;
  pendingCompletedAt?: Date;
  errorDetails?: string;
}

/**
 * Formats timestamp for progress steps
 */
interface FormatStepTimestampProps {
  date: Date;
  step: UpgradeStatus;
}

export const FormatStepTimestamp = ({
  date,
  step,
}: FormatStepTimestampProps): React.ReactNode => {
  if (step === 'submitted') {
    return (
      <>
        <span className="text-white">{format(date, 'MMM d, yyyy')}</span>
        <span className="text-white"> • </span>
        <span className="text-white/50">{format(date, 'HH:mm')}</span>
      </>
    );
  }

  return <span className="text-white/50">{format(date, 'HH:mm')}</span>;
};

const EIP7702UpgradeDetails = ({
  onClose,
  onCloseModal,
  status,
  submittedAt,
  pendingCompletedAt,
  errorDetails,
}: EIP7702UpgradeDetailsProps) => {
  const detailsRef = useRef<HTMLDivElement>(null);

  // Function to get step status based on overall status
  const getStepStatus = (
    step: 'Submitted' | 'Upgrading' | 'Completed'
  ): UpgradeStatus => {
    if (step === 'Submitted') {
      if (status === 'submitted') return 'upgrading'; // in progress
      if (
        status === 'upgrading' ||
        status === 'completed' ||
        status === 'failed'
      ) {
        return 'completed'; // done
      }
      return 'submitted'; // inactive
    }
    if (step === 'Upgrading') {
      if (status === 'upgrading') return 'upgrading'; // in progress
      if (status === 'completed' || status === 'failed') return 'completed'; // done
      return 'submitted'; // inactive
    }
    if (step === 'Completed') {
      if (status === 'completed') return 'completed';
      if (status === 'failed') return 'failed';
      return 'submitted'; // inactive
    }
    return 'submitted';
  };

  // Function to format timestamps for completed steps
  const getStepTimestamp = (step: 'Submitted' | 'Upgrading' | 'Completed') => {
    const stepStatus = getStepStatus(step);

    // Only show timestamp if step is completed
    if (stepStatus !== 'completed') return undefined;

    // No timestamp for the final "Completed/Failed" step itself
    if (step === 'Completed') return undefined;

    // Show timestamp for completed intermediate steps
    if (step === 'Submitted' && submittedAt) {
      return <FormatStepTimestamp date={submittedAt} step="submitted" />;
    }

    if (step === 'Upgrading' && pendingCompletedAt) {
      return <FormatStepTimestamp date={pendingCompletedAt} step="upgrading" />;
    }

    return undefined;
  };

  return (
    <div ref={detailsRef} className="flex flex-col gap-4 h-full w-full">
      <p className="text-xl text-white font-normal">Upgrade Details</p>

      {errorDetails && (
        <div className="bg-[#FF366C]/30 border border-[#FF366C] rounded-lg p-3">
          <p className="text-white text-sm">{errorDetails}</p>
        </div>
      )}

      <div className="flex h-full w-full rounded-[10px] border border-dashed border-[#25232D] p-3">
        <div className="flex flex-col items-center justify-center w-full">
          {/* Progress Steps */}
          <div className="flex flex-col w-full">
            {/* Submitted Step */}
            <EIP7702UpgradeProgressStep
              status={getStepStatus('Submitted')}
              label="Submitted"
              lineStatus={getStepStatus('Upgrading')}
              timestamp={getStepTimestamp('Submitted')}
            />

            {/* Upgrading Step */}
            <EIP7702UpgradeProgressStep
              status={getStepStatus('Upgrading')}
              label="Upgrading"
              lineStatus={getStepStatus('Completed')}
              timestamp={getStepTimestamp('Upgrading')}
            />

            {/* Completed Step */}
            <EIP7702UpgradeProgressStep
              status={getStepStatus('Completed')}
              label={
                getStepStatus('Completed') === 'failed' ? 'Failed' : 'Completed'
              }
              isLast
              timestamp={getStepTimestamp('Completed')}
            />
          </div>
        </div>
      </div>

      {/* Done Button */}
      <div className="w-full rounded-[10px] bg-[#121116] p-[2px_2px_6px_2px]">
        <button
          className="flex items-center justify-center w-full rounded-[8px] h-[42px] p-[1px_6px_1px_6px] bg-[#8A77FF] text-white font-normal text-[14px]"
          type="button"
          onClick={() => {
            // In completed or failed state, close the whole modal
            if (status === 'completed' || status === 'failed') {
              onCloseModal?.();
            } else {
              // Otherwise, just close details view
              onClose();
            }
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default EIP7702UpgradeDetails;
