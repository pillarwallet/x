import React from 'react';
import { getBlockScan } from '../../../../utils/blockchain';
import WarningIcon from '../../assets/warning.svg';
import NewTabIcon from '../../assets/new-tab.svg';

type TransactionStatusProps = {
  completed: boolean;
  txHash?: string;
  text: string;
  chainId: number;
};

const TransactionStatus: React.FC<TransactionStatusProps> = ({
  completed,
  txHash,
  text,
  chainId,
}) => {
  if (!txHash || !completed) {
    return (
      <span style={{ fontSize: 10 }}>
        {text === 'Failed to create resource lock' ||
        text === 'Transaction failed' ? (
          <div className="flex">
            <img src={WarningIcon} alt="warning-icon" />
            <p style={{ textDecoration: 'underline', color: '#FF366C' }}>
              {text}
            </p>
          </div>
        ) : (
          <p>{text}</p>
        )}
      </span>
    );
  }

  const txUrl = `${getBlockScan(chainId)}${txHash}`;

  return (
    <a
      href={txUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        textDecoration: 'none',
      }}
    >
      <span style={{ fontSize: 10, textDecoration: 'underline' }}>
        {txHash.slice(0, 6)}...{txHash.slice(-4)}
      </span>
      <img
        src={NewTabIcon}
        alt="new-tab-icon"
        style={{ width: 10, height: 10 }}
      />
    </a>
  );
};

export default TransactionStatus;
