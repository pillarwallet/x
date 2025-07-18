import React from 'react';
import { getBlockScan } from '../../../utils/blockchain';

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
            <svg
              width="14"
              height="16"
              viewBox="0 0 14 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.70433 3.22114L1.31589 10.7442C0.732563 11.7442 1.45387 13 2.61156 13H11.3884C12.5461 13 13.2674 11.7442 12.6841 10.7442L8.29567 3.22115C7.71685 2.22889 6.28315 2.22889 5.70433 3.22114Z"
                fill="#FF366C"
                fillOpacity="0.3"
                stroke="#FF366C"
              />
              <path
                d="M7.64289 10.6428C7.64289 10.9979 7.35508 11.2857 7.00003 11.2857C6.64499 11.2857 6.35718 10.9979 6.35718 10.6428C6.35718 10.2878 6.64499 9.99999 7.00003 9.99999C7.35508 9.99999 7.64289 10.2878 7.64289 10.6428Z"
                fill="#FF366C"
              />
              <path
                d="M6.35718 5.92856C6.35718 5.57352 6.64499 5.28571 7.00003 5.28571C7.35508 5.28571 7.64289 5.57352 7.64289 5.92856L7.42861 9.14285C7.42861 9.37954 7.23673 9.57142 7.00003 9.57142C6.76334 9.57142 6.57146 9.37954 6.57146 9.14285L6.35718 5.92856Z"
                fill="#FF366C"
              />
            </svg>
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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="10"
        height="10"
        viewBox="0,0,256,256"
      >
        <g
          fill="#ffffff"
          fillRule="nonzero"
          stroke="none"
          strokeWidth="1"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          strokeMiterlimit="10"
          strokeDasharray=""
          strokeDashoffset="0"
          fontFamily="none"
          fontWeight="none"
          fontSize="none"
          textAnchor="none"
        >
          <g transform="scale(10.66667,10.66667)">
            <path d="M5,3c-1.09306,0 -2,0.90694 -2,2v14c0,1.09306 0.90694,2 2,2h14c1.09306,0 2,-0.90694 2,-2v-7h-2v7h-14v-14h7v-2zM14,3v2h3.58594l-9.29297,9.29297l1.41406,1.41406l9.29297,-9.29297v3.58594h2v-7z" />
          </g>
        </g>
      </svg>
    </a>
  );
};

export default TransactionStatus;
