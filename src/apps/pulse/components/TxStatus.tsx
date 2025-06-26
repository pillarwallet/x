import React from 'react';
import { getBlockScan } from '../../../utils/blockchain';

type TransactionStatusProps = {
  completed: boolean,
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
    return <span style={{fontSize: 10}}>{text}</span>;
  }

  const txUrl = `${getBlockScan(chainId)}${txHash}`;

  return (
    <a
      href={txUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
    >
      <span style={{ fontSize: 10, textDecoration: "underline" }}>{txHash.slice(0, 6)}...{txHash.slice(-4)}</span>
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="10" height="10" viewBox="0,0,256,256">
        <g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none">
          <g transform="scale(10.66667,10.66667)">
          <path d="M5,3c-1.09306,0 -2,0.90694 -2,2v14c0,1.09306 0.90694,2 2,2h14c1.09306,0 2,-0.90694 2,-2v-7h-2v7h-14v-14h7v-2zM14,3v2h3.58594l-9.29297,9.29297l1.41406,1.41406l9.29297,-9.29297v3.58594h2v-7z"></path>
          </g>
        </g>
      </svg>
    </a>
  );
};

export default TransactionStatus;
