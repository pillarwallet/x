import React from 'react';

// assets
import ConfirmedIcon from '../../assets/confirmed-icon.svg';
import FailedIcon from '../../assets/failed-icon.svg';
import PendingIcon from '../../assets/pending.svg';

// types
import { TransactionStatusState } from '../../types/types';

// utils
import { getStatusConfig } from '../../utils/utils';

interface TransactionStatusIconProps {
  status: TransactionStatusState;
}

const TransactionStatusIcon: React.FC<TransactionStatusIconProps> = ({
  status,
}) => {
  const config = getStatusConfig(status);

  const getIcon = () => {
    switch (config.icon) {
      case 'confirmed':
        return ConfirmedIcon;
      case 'failed':
        return FailedIcon;
      case 'pending':
      default:
        return PendingIcon;
    }
  };

  return (
    <div className={config.containerClasses}>
      <img src={getIcon()} alt={status} className={config.iconClasses} />
    </div>
  );
};

export default React.memo(TransactionStatusIcon);
