import { animated, useSpring } from '@react-spring/web';
import React, { useEffect, useRef } from 'react';
import { TailSpin } from 'react-loader-spinner';

// assets
import ConfirmedIcon from '../../assets/images/confirmed-icon.svg';
import FailedIcon from '../../assets/images/failed-icon.svg';

// types
import { UpgradeStatus } from './types';

// utils
import { getButtonConfig } from '../../utils/upgrade';

interface EIP7702UpgradeStatusButtonProps {
  status: UpgradeStatus;
  onClick: () => void;
}

const EIP7702UpgradeStatusButton: React.FC<EIP7702UpgradeStatusButtonProps> = ({
  status,
  onClick,
}) => {
  const config = getButtonConfig(status);
  const prevStatusRef = useRef<UpgradeStatus>(status);

  // Zoom animation spring
  const [springs, api] = useSpring(() => ({
    from: { scale: 1 },
    to: { scale: 1 },
  }));

  useEffect(() => {
    const prevStatus = prevStatusRef.current;

    // Only animate if there was a previous status (not initial mount)
    if (prevStatus) {
      // Check for status changes that should trigger zoom animation
      if (
        (prevStatus === 'submitted' && status === 'upgrading') ||
        (prevStatus === 'upgrading' &&
          (status === 'completed' || status === 'failed'))
      ) {
        // Start slightly smaller, grow, then settle to normal
        api.set({ scale: 0.7 });
        api.start({
          to: { scale: 1.15 },
          config: { duration: 150 },
          onRest: () => {
            api.start({
              to: { scale: 1 },
              config: { duration: 150 },
            });
          },
        });
      }
    }

    // Update the previous status
    prevStatusRef.current = status;
  }, [status, api]);

  const renderIcon = () => {
    if (status === 'upgrading' || status === 'submitted') {
      // Both submitted and upgrading use orange color (#FFAB36)
      return (
        <div className="w-[14px] h-[14px] rounded-full border-[2px] border-[#FFAB36]/[.23] bg-[#FFAB36]/30 flex items-center justify-center flex-shrink-0">
          <TailSpin color="#FFAB36" height={14} width={14} strokeWidth={6} />
        </div>
      );
    }

    if (status === 'completed') {
      return (
        <div className="w-[14px] h-[14px] rounded-full border border-[#5CFF93] bg-[#5CFF93]/30 flex items-center justify-center flex-shrink-0">
          <img
            src={ConfirmedIcon}
            alt="confirmed"
            className="w-[8px] h-[5px]"
          />
        </div>
      );
    }

    if (status === 'failed') {
      return (
        <div className="w-[14px] h-[14px] rounded-full border border-[#FF366C] bg-[#FF366C]/30 flex items-center justify-center flex-shrink-0">
          <img src={FailedIcon} alt="failed" className="w-[2px] h-[10px]" />
        </div>
      );
    }

    return null;
  };

  return (
    <animated.button
      className={`flex items-center justify-between rounded-[30px] px-2 py-2 ${config.bgColor} mt-[10px] w-[154px]`}
      style={springs}
      type="button"
      onClick={onClick}
      data-testid="pulse-transaction-status-button"
    >
      {renderIcon()}
      <span className={`${config.textColor} font-normal text-[13px]`}>
        {config.label}
      </span>
      <div
        className={`w-[14px] h-[14px] rounded-full border ${config.borderColor} ${config.bgColor} flex items-center justify-center flex-shrink-0`}
      >
        <span className={`${config.textColor} text-[10px] font-bold`}>i</span>
      </div>
    </animated.button>
  );
};

export default React.memo(EIP7702UpgradeStatusButton);
