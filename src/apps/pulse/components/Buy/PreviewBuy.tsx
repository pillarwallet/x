/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { ExpressIntentResponse } from '@etherspot/intent-sdk/dist/cjs/sdk/types/user-intent-types';
import { useState } from 'react';
import { getLogoForChainId } from '../../../../utils/blockchain';
import RandomAvatar from '../../../pillarx-app/components/RandomAvatar/RandomAvatar';
import CopyIcon from '../../assets/copy-icon.svg';
import MoreInfo from '../../assets/moreinfo-icon.svg';
import useIntentSdk from '../../hooks/useIntentSdk';
import {
  PayingToken as PayingTokenType,
  SelectedToken,
} from '../../types/tokens';
import Esc from '../Misc/Esc';
import Refresh from '../Misc/Refresh';
import IntentTracker from '../Status/IntentTracker';
import PayingToken from './PayingToken';

interface PreviewBuyProps {
  closePreview: () => void;
  buyToken?: SelectedToken | null;
  payingTokens: PayingTokenType[];
  expressIntentResponse: ExpressIntentResponse | null;
}

export default function PreviewBuy(props: PreviewBuyProps) {
  const { closePreview, buyToken, payingTokens, expressIntentResponse } = props;
  const totalPay = payingTokens
    .reduce((acc, curr) => acc + curr.totalUsd, 0)
    .toFixed(2);

  const [isLoading, setIsLoading] = useState(false);
  const [showTracker, setShowTracker] = useState(false);

  const detailsEntry = (
    lhs: string,
    rhs: string,
    moreInfo = true,
    tokenName = ''
  ) => {
    return (
      <div className="flex justify-between" style={{ margin: 10 }}>
        <div className="flex" style={{ color: 'grey', fontSize: 13 }}>
          <div>{lhs}</div>
          {moreInfo && (
            <div style={{ marginTop: 4, marginLeft: 4 }}>
              <img src={MoreInfo} alt="more-info-icon" />
            </div>
          )}
        </div>
        <div>
          <div className="flex" style={{ fontSize: 13 }}>
            <div>{rhs}</div>
            {tokenName && <div style={{ color: 'grey' }}>{tokenName}</div>}
          </div>
        </div>
      </div>
    );
  };

  const { intentSdk } = useIntentSdk();

  const shortlistBid = async () => {
    setIsLoading(true);
    try {
      await intentSdk?.shortlistBid(
        expressIntentResponse?.intentHash!,
        expressIntentResponse?.bids[0].bidHash!
      );
      setShowTracker(true);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('shortlisting bid failed:: ', error);
    }
    setIsLoading(false);
  };

  return (
    <div
      className="flex flex-col"
      style={{
        border: '2px solid #1E1D24',
        width: 446,
        backgroundColor: '#121116',
        borderRadius: 10,
      }}
    >
      {showTracker ? (
        <IntentTracker
          closePreview={closePreview}
          bidHash={expressIntentResponse?.bids[0].bidHash!}
          token={buyToken!}
          isBuy
        />
      ) : (
        <>
          <div className="flex justify-between" style={{ margin: 10 }}>
            <div style={{ fontSize: 20 }}>Preview</div>
            <div className="flex">
              <div
                style={{
                  backgroundColor: '#121116',
                  borderRadius: 10,
                  width: 40,
                  height: 40,
                  padding: '2px 2px 4px 2px',
                }}
              >
                <Refresh />
              </div>

              <div
                style={{
                  backgroundColor: '#121116',
                  borderRadius: 10,
                  width: 40,
                  height: 40,
                  padding: '2px 2px 4px 2px',
                  marginLeft: 10,
                }}
              >
                <Esc onClose={closePreview} />
              </div>
            </div>
          </div>

          <div
            className="flex justify-between"
            style={{ margin: 10, marginBottom: 0, fontSize: 13, color: 'grey' }}
          >
            <div>You’re paying</div>
            <div className="flex">Total: ${totalPay}</div>
          </div>

          <div
            className="rounded-[10px]"
            style={{
              width: 422,
              minHeight: 50,
              background: 'black',
              margin: 10,
            }}
          >
            {payingTokens.map((item) => (
              <PayingToken payingToken={item} key={item.name} />
            ))}
          </div>

          <div
            className="flex justify-between"
            style={{ margin: 10, marginBottom: 0, fontSize: 13, color: 'grey' }}
          >
            <div>You’re buying</div>
          </div>

          <div>
            <div
              className="flex justify-between"
              style={{
                width: 422,
                height: 50,
                background: 'black',
                borderRadius: 10,
                margin: 10,
              }}
            >
              <div className="flex items-center">
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  {buyToken?.logo ? (
                    <img
                      src={buyToken?.logo}
                      alt="Main"
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 50,
                        marginLeft: 5,
                        marginRight: 5,
                      }}
                    />
                  ) : (
                    <div
                      className="w-full h-full overflow-hidden rounded-full"
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 50,
                        marginLeft: 5,
                        marginRight: 5,
                      }}
                    >
                      <RandomAvatar name={buyToken?.name || ''} />
                      <span className="absolute inset-0 flex items-center justify-center text-white text-lg font-bold">
                        {buyToken?.name?.slice(0, 2)}
                      </span>
                    </div>
                  )}
                  <img
                    src={getLogoForChainId(buyToken?.chainId!)}
                    style={{
                      position: 'absolute',
                      bottom: '-1px',
                      right: '2px',
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                    }}
                    alt="Chain logo"
                  />
                </div>
                <div style={{ marginLeft: 5 }}>
                  <div className="flex">
                    <div style={{ fontSize: 13 }}>{buyToken?.name}</div>
                    <div style={{ color: 'grey', marginLeft: 5, fontSize: 13 }}>
                      {buyToken?.symbol}
                    </div>
                  </div>
                  <div className="flex">
                    <div style={{ fontSize: 13, color: 'grey' }}>
                      {buyToken?.address?.slice(0, 6)}...
                      {buyToken?.address.slice(-4)}
                    </div>
                    <button
                      style={{ marginLeft: 5 }}
                      onClick={() => {
                        navigator.clipboard.writeText(buyToken?.address ?? '');
                      }}
                      type="button"
                      aria-label="Copy address"
                    >
                      <img src={CopyIcon} alt="copy-icon" />
                    </button>
                  </div>
                </div>
              </div>
              <div
                className="flex flex-col justify-center"
                style={{ marginRight: 10 }}
              >
                <div
                  className="flex"
                  style={{ fontSize: 13, textAlign: 'right' }}
                >
                  {buyToken?.usdValue
                    ? (Number(totalPay) / Number(buyToken.usdValue)).toFixed(6)
                    : ''}
                </div>
                <div
                  className="flex justify-end"
                  style={{ fontSize: 12, color: 'grey', textAlign: 'right' }}
                >
                  ${totalPay}
                </div>
              </div>
            </div>
          </div>

          <div
            className="flex justify-between"
            style={{ margin: 10, marginBottom: 0, fontSize: 13, color: 'grey' }}
          >
            <div>Details</div>
          </div>

          <div>
            <div
              style={{
                width: 422,
                height: 137,
                background: 'black',
                borderRadius: 10,
                margin: 10,
              }}
            >
              {detailsEntry(
                'Rate',
                `1 USD ≈ ${buyToken?.usdValue ? Number(1 / Number(buyToken.usdValue)).toFixed(3) : 1.0}`,
                false,
                buyToken?.symbol ?? ''
              )}
              {detailsEntry('Minimum Receive', totalPay)}
              {detailsEntry('Price Impact', '0.00%')}
              {detailsEntry('Max Spillage', '0.0%')}
              {detailsEntry('Gas Fee', '≈ $0.00')}
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
                borderRadius: 10,
                backgroundColor: isLoading ? '#121116' : '#8A77FF',
                margin: 2,
              }}
              onClick={shortlistBid}
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  Waiting for signature...
                </div>
              ) : (
                <>Confirm</>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
