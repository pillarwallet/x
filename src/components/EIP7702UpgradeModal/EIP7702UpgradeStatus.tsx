import React from 'react';

// types
import { UpgradeStatus } from './types';

// utils
import { getStatusConfig } from '../../utils/upgrade';

// components
import EIP7702UpgradeStatusButton from './EIP7702UpgradeStatusButton';
import EIP7702UpgradeStatusIcon from './EIP7702UpgradeStatusIcon';

interface EIP7702UpgradeStatusProps {
  status: UpgradeStatus;
  onViewDetails: () => void;
}

const EIP7702UpgradeStatus: React.FC<EIP7702UpgradeStatusProps> = ({
  status,
  onViewDetails,
}) => {
  const statusConfig = getStatusConfig(status);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <EIP7702UpgradeStatusIcon status={status} />
      <div className="text-white font-normal text-[20px] mt-3">
        {statusConfig.label}
      </div>
      <EIP7702UpgradeStatusButton status={status} onClick={onViewDetails} />
    </div>
  );
};

export default EIP7702UpgradeStatus;
