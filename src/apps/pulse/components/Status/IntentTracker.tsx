/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Hex } from 'viem';
import Esc from '../Misc/Esc';
import useIntentSdk from '../../hooks/useIntentSdk';
import TransactionStatus from './TxStatus';
import RandomAvatar from '../../../pillarx-app/components/RandomAvatar/RandomAvatar';
import { SelectedToken } from '../../types/tokens';

interface IntentTrackerProps {
  closePreview: () => void;
  token: SelectedToken;
  bidHash: Hex;
  isBuy: boolean;
}

const getStatusIndex = (
  status: 'PENDING' | 'SHORTLISTING_INITIATED' | 'SHORTLISTED' | 'EXECUTED'
) => {
  if (status === 'PENDING') return 0;
  if (status === 'SHORTLISTING_INITIATED') return 1;
  if (status === 'SHORTLISTED') return 2;
  if (status === 'EXECUTED') return 3;
  if (status === 'CLAIMED') return 4;
  if (status === 'RESOURCE_LOCK_RELEASED') return 5;
  return -1;
};

export default function IntentTracker(props: IntentTrackerProps) {
  const { bidHash, closePreview, isBuy, token } = props;
  const { intentSdk } = useIntentSdk();
  const [bid, setBid] = useState<any>(null);
  const [resourceLockInfo, setResourceLockInfo] = useState<any>(null);

  const getCircleCss = (
    status: 'PENDING' | 'SHORTLISTING_INITIATED' | 'SHORTLISTED' | 'EXECUTED',
    f = true
  ) => {
    const index = getStatusIndex(status);
    if (f) {
      if (resourceLockInfo?.resourceLocks?.[0]?.transactionHash) {
        return {
          backgroundColor: '#8A77FF',
        };
      }
      return {
        border: '1px solid white',
      };
    }
    if (index >= 3)
      return {
        backgroundColor: '#8A77FF',
      };
    return {
      border: '1px solid white',
    };
  };

  useEffect(() => {
    let isCancelled = false;

    const poll = async () => {
      if (isCancelled || !intentSdk) return;

      try {
        const res = await intentSdk.searchBidByBidHash(bidHash);
        if (res && res.length > 0) {
          setBid(res[0]);
        }
      } catch (err) {
        console.error(err);
      }

      try {
        const res = await intentSdk.getResourceLockInfoByBidHash(bidHash);
        if (res) {
          setResourceLockInfo(res.resourceLockInfo);
        }
      } catch (err) {
        console.error(err);
      }

      if (!isCancelled) {
        setTimeout(poll, 15000);
      }
    };

    poll(); // Start polling

    return () => {
      isCancelled = true; // Cleanup
    };
  }, [bidHash, intentSdk]);
  return (
    <>
      <div className="flex justify-between" style={{ margin: 10 }}>
        <div className="flex" style={{ fontSize: 20 }}>
          {`${isBuy ? 'Buy' : 'Sell'}`}
          {token.logo ? (
            <img
              src={token.logo}
              alt="Token Logo"
              style={{
                borderRadius: 50,
                height: 32,
                width: 32,
                marginLeft: 10,
              }}
            />
          ) : (
            <div
              className="flex w-full h-full overflow-hidden rounded-full"
              style={{
                width: 32,
                height: 32,
                borderRadius: 50,
                marginLeft: 10,
              }}
            >
              <RandomAvatar name={token?.name || ''} />
              <span
                className="absolute flex items-center justify-center text-white text-lg font-bold"
                style={{ marginLeft: 5 }}
              >
                {token?.name?.slice(0, 2)}
              </span>
            </div>
          )}
        </div>
        <div className="flex">
          <div style={{ marginLeft: 10 }}>
            <Esc closePreview={closePreview} />
          </div>
        </div>
      </div>
      <div
        className="flex justify-between"
        style={{
          width: 422,
          height: 180,
          background: 'black',
          borderRadius: 10,
          margin: 10,
        }}
      >
        {/* Vertical Timeline */}
        <div className="p-8">
          <div className="flex items-start gap-8">
            <div className="flex flex-col items-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm"
                style={{ ...getCircleCss(bid?.bidStatus), color: 'white' }}
              >
                1
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 pb-6" style={{ height: 40 }}>
              <div>Resource Lock Creation</div>
              <TransactionStatus
                chainId={resourceLockInfo?.resourceLocks?.[0]?.chainId}
                completed={
                  resourceLockInfo?.resourceLocks?.[0]?.transactionHash
                }
                text={
                  bid?.bidStatus === 'SHORTLISTING_FAILED'
                    ? 'Failed to create resource lock'
                    : 'Creating Resource Lock'
                }
                txHash={resourceLockInfo?.resourceLocks?.[0]?.transactionHash}
              />
            </div>
          </div>

          <div
            style={{
              height: 25,
              marginLeft: 19,
              width: 1,
              backgroundColor: resourceLockInfo?.resourceLocks?.[0]
                ?.transactionHash
                ? '#8A77FF'
                : 'white',
            }}
          />
          <div
            style={{
              height: 25,
              marginLeft: 19,
              width: 1,
              backgroundColor:
                getStatusIndex(bid?.bidStatus) >= 3 ? '#8A77FF' : 'white',
            }}
          />

          <div className="flex items-start gap-8">
            <div className="flex flex-col items-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm"
                style={{
                  ...getCircleCss(bid?.bidStatus, false),
                  color: 'white',
                }}
              >
                2
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 pb-6">
              <div>{isBuy ? 'Buy' : 'Sell'} Complete</div>
              <TransactionStatus
                chainId={token.chainId}
                text={
                  bid?.bidStatus === 'FAILED_EXECUTION'
                    ? 'Transaction failed'
                    : ''
                }
                completed={getStatusIndex(bid?.bidStatus) >= 3}
                txHash={
                  bid?.executionResult?.executedTransactions?.[0]
                    ?.transactionHash
                }
              />
            </div>
          </div>
        </div>
      </div>
      <div
        className="flex"
        style={{
          margin: 10,
          width: 422,
          height: 50,
          borderRadius: 10,
          backgroundColor: 'black',
        }}
      >
        <button
          className="flex-1 items-center justify-center"
          style={{
            margin: 2,
            borderRadius: 10,
            backgroundColor:
              getStatusIndex(bid?.bidStatus) < 3 ? '#121116' : '#8A77FF',
          }}
          disabled={getStatusIndex(bid?.bidStatus) < 3}
          onClick={closePreview}
          type="button"
        >
          Close
        </button>
      </div>
    </>
  );
}
