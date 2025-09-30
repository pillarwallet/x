import React from 'react';
import { TailSpin } from 'react-loader-spinner';

// assets
import ConfirmedIcon from '../../assets/confirmed-icon.svg';
import FailedIcon from '../../assets/failed-icon.svg';

import { TransactionStatusState } from '../../types/types';
import { getButtonConfig } from '../../utils/utils';

interface TransactionStatusButtonProps {
  status: TransactionStatusState;
  onClick: () => void;
}

const TransactionStatusButton: React.FC<TransactionStatusButtonProps> = ({
  status,
  onClick,
}) => {
  const config = getButtonConfig(status);

  const renderIcon = () => {
    if (status === 'Transaction Pending') {
      return (
        <div className="w-[14px] h-[14px] rounded-full border-[2px] border-[#FFAB36]/[.23] bg-[#FFAB36]/30 flex items-center justify-center flex-shrink-0">
          <TailSpin color="#FFAB36" height={14} width={14} strokeWidth={6} />
        </div>
      );
    }

    if (status === 'Transaction Complete') {
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

    if (status === 'Transaction Failed') {
      return (
        <div className="w-[14px] h-[14px] rounded-full border border-[#FF366C] bg-[#FF366C]/30 flex items-center justify-center flex-shrink-0">
          <img src={FailedIcon} alt="failed" className="w-[2px] h-[10px]" />
        </div>
      );
    }

    return null;
  };

  if (status === 'Starting Transaction') {
    return (
      <div className="text-white/50 font-normal text-[16px] mt-[10px]">
        Just a moment...
      </div>
    );
  }

  return (
    <button
      className={`flex items-center justify-between rounded-[30px] px-2 py-2 ${config.bgColor} mt-[10px] w-[154px]`}
      type="button"
      onClick={onClick}
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
    </button>
  );
};

export default React.memo(TransactionStatusButton);
