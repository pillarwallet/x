import React from 'react';

// types
import { TransactionStatusState } from '../../types/types';

// components
import TransactionStatusButton from './TransactionStatusButton';
import TransactionStatusIcon from './TransactionStatusIcon';

interface TransactionStatusContainerProps {
  status: TransactionStatusState;
  onViewDetails: () => void;
}

const TransactionStatusContainer: React.FC<TransactionStatusContainerProps> = ({
  status,
  onViewDetails,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <TransactionStatusIcon status={status} />
      <div className="text-white font-normal text-[20px] mt-3">{status}</div>
      <TransactionStatusButton status={status} onClick={onViewDetails} />
    </div>
  );
};

export default React.memo(TransactionStatusContainer);
