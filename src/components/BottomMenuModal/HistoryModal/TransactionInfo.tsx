/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { MdCheck } from 'react-icons/md';

// hooks
import useAccountTransactionHistory from '../../../hooks/useAccountTransactionHistory';
import useTransactionKit from '../../../hooks/useTransactionKit';

// images
import CopyIcon from '../../../apps/pillarx-app/images/copy-icon.svg';
import ExternalLinkLogo from '../../../apps/token-atlas/images/external-link-audit.svg';

// utils
import { getBlockScan, getBlockScanName } from '../../../utils/blockchain';

const TransactionInfo = () => {
  const {
    userOpStatus,
    transactionHash,
    latestUserOpInfo,
    latestUserOpChainId,
  } = useAccountTransactionHistory();
  const { walletAddress } = useTransactionKit();

  const [copied, setCopied] = useState(false);

  const [displayStatus, setDisplayStatus] = useState<string | undefined>();
  const [displayHash, setDisplayHash] = useState<string | undefined>();
  const [displayInfo, setDisplayInfo] = useState<string | undefined>();
  const [displayChainId, setDisplayChainId] = useState<string | undefined>();

  // Load from localStorage as soon as History Tab shows
  useEffect(() => {
    const storedStatus =
      localStorage.getItem('latestUserOpStatus') ?? undefined;
    const storedHash =
      localStorage.getItem('latestTransactionHash') ?? undefined;
    const storedInfo = localStorage.getItem('latestUserOpInfo') ?? undefined;
    const storedChainId =
      localStorage.getItem('latestUserOpChainId') ?? undefined;

    setDisplayStatus(storedStatus);
    setDisplayHash(storedHash);
    setDisplayInfo(storedInfo);
    setDisplayChainId(storedChainId);
  }, []);

  // Update the localStorage only when values change
  useEffect(() => {
    if (
      userOpStatus &&
      userOpStatus !== localStorage.getItem('latestUserOpStatus')
    ) {
      localStorage.setItem('latestUserOpStatus', userOpStatus);
      setDisplayStatus(userOpStatus);
    }

    if (
      transactionHash &&
      transactionHash !== localStorage.getItem('latestTransactionHash')
    ) {
      localStorage.setItem('latestTransactionHash', transactionHash);
      setDisplayHash(transactionHash);
    }

    if (
      latestUserOpInfo &&
      latestUserOpInfo !== localStorage.getItem('latestUserOpInfo')
    ) {
      localStorage.setItem('latestUserOpInfo', latestUserOpInfo);
      setDisplayInfo(latestUserOpInfo);
    }

    if (
      latestUserOpChainId &&
      latestUserOpChainId.toString() !==
        localStorage.getItem('latestUserOpChainId')
    ) {
      localStorage.setItem(
        'latestUserOpChainId',
        latestUserOpChainId.toString()
      );
      setDisplayChainId(latestUserOpChainId.toString());
    }
  }, [userOpStatus, transactionHash, latestUserOpInfo, latestUserOpChainId]);

  const steps = ['Sending', 'Sent'] as const;

  const stepIndex = (() => {
    if (displayStatus === 'Sending') return 0;
    if (
      displayStatus === 'Sent' ||
      displayStatus === 'Confirmed' ||
      displayStatus === 'Failed'
    )
      return 1;
    return -1;
  })();

  const stepsStatus = () => {
    if (displayStatus === 'Sending') {
      return 'Sending';
    }
    if (
      displayStatus === 'Sent' ||
      displayStatus === 'Confirmed' ||
      displayStatus === 'Failed'
    ) {
      return 'Sent';
    }
    return '...';
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 3000);
      return () => clearTimeout(timer);
    }

    return undefined;
  }, [copied]);

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {/* Progress Bar */}
      <div className="flex w-full mb-2">
        {steps.map((_, index) => {
          const isStepCompleted = index <= stepIndex;
          return (
            <div
              key={index}
              className={`flex-1 h-2 mx-1 rounded ${
                isStepCompleted ? 'bg-medium_purple' : 'bg-white/[.5]'
              }`}
            />
          );
        })}
      </div>
      {/* UserOp status */}
      <p className="text-sm font-medium text-light_purple">
        Status: <span className="font-normal text-white">{stepsStatus()}</span>
      </p>

      <div className="flex flex-col items-start w-full space-y-2 mt-4">
        {/* Transaction info */}
        <p className="text-xs text-light_purple font-medium ">
          Tx info:{' '}
          <span className="font-normal text-white">{displayInfo ?? '...'}</span>
        </p>
        {/* Transaction hash */}
        {displayStatus !== 'Confirmed' && displayStatus !== 'Failed' ? (
          <div className="flex items-center justify-between max-w-full">
            <p className="text-xs text-light_purple font-normal truncate">
              Tx Hash:{' '}
              <span className="font-normal text-white">
                {displayHash ?? '...'}
              </span>
            </p>
          </div>
        ) : (
          <CopyToClipboard
            text={displayHash || ''}
            onCopy={() => setCopied(true)}
          >
            <div className="flex items-center justify-between max-w-full cursor-pointer">
              {displayStatus !== 'Confirmed' ||
              !displayHash ||
              displayChainId === '137' ? (
                <p className="text-xs white font-normal">
                  Please check the transaction status on{' '}
                  {getBlockScanName(Number(displayChainId))}:
                </p>
              ) : (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-light_purple font-normal truncate">
                      Tx Hash:{' '}
                      <span className="font-normal text-white">
                        {displayHash}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 pl-2">
                    {copied ? (
                      <MdCheck
                        style={{
                          width: '12px',
                          height: '12px',
                          color: 'white',
                          opacity: 0.5,
                        }}
                      />
                    ) : (
                      <img
                        src={CopyIcon}
                        alt="copy-evm-address"
                        className="w-3 h-3.5"
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          </CopyToClipboard>
        )}
        {displayHash &&
          displayChainId &&
          displayStatus === 'Confirmed' &&
          displayChainId !== '137' && (
            <button
              type="button"
              data-url={`${getBlockScan(Number(displayChainId))}${displayHash}`}
              className="flex bg-purple_medium rounded-md justify-between px-4 py-2 self-center items-center gap-1"
              onClick={() =>
                window.open(
                  `${getBlockScan(Number(displayChainId))}${displayHash}`,
                  '_blank',
                  'noopener,noreferrer'
                )
              }
            >
              <p className="text-sm text-white font-normal">View transaction</p>
              <img
                className="w-3 h-3"
                src={ExternalLinkLogo}
                alt="external-link-icon"
              />
            </button>
          )}

        {(displayStatus === 'Failed' || displayChainId === '137') &&
          displayChainId && (
            <button
              type="button"
              className="flex bg-purple_medium rounded-md justify-between px-4 py-2 self-center items-center gap-1"
              data-url={`${getBlockScan(Number(displayChainId), true)}${walletAddress}`}
              onClick={() =>
                window.open(
                  `${getBlockScan(Number(displayChainId), true)}${walletAddress}`,
                  '_blank',
                  'noopener,noreferrer'
                )
              }
            >
              <p className="text-sm text-white font-normal">
                View {getBlockScanName(Number(displayChainId))}
              </p>
              <img
                className="w-3 h-3"
                src={ExternalLinkLogo}
                alt="external-link-icon"
              />
            </button>
          )}

        <div className="flex text-[10px] italic text-white/[.5] font-normal p-3 border-[1px] border-medium_grey rounded-md">
          Please note that this information confirms whether the transaction was
          sent but does not indicate its status. To verify the status, please
          check the transaction hash on relevant blockchain explorer.
        </div>
      </div>
    </div>
  );
};

export default TransactionInfo;
