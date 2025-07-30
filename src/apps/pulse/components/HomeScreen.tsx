import { Dispatch, SetStateAction, useState } from 'react';
import { useWalletAddress } from '@etherspot/transaction-kit';
import { ExpressIntentResponse } from '@etherspot/intent-sdk/dist/cjs/sdk/types/user-intent-types';
import Buy from './Buy';
import Sell from './Sell';
import { useGetWalletPortfolioQuery } from '../../../services/pillarXApiWalletPortfolio';
import PreviewBuy from './PreviewBuy';
import { PayingToken, SelectedToken } from '../types/tokens';
import Refresh from './Refresh';
import Settings from './Settings';

interface HomeScreenProps {
  setSearching: Dispatch<SetStateAction<boolean>>;
  buyToken: SelectedToken | null;
  isBuy: boolean;
  setIsBuy: Dispatch<SetStateAction<boolean>>;
}

export default function HomeScreen(props: HomeScreenProps) {
  const { buyToken, isBuy, setIsBuy, setSearching } = props;
  const accountAddress = useWalletAddress();
  const [previewBuy, setPreviewBuy] = useState(false);
  const [payingTokens, setPayingTokens] = useState<PayingToken[]>([]);
  const [expressIntentResponse, setExpressIntentResponse] =
    useState<ExpressIntentResponse | null>(null);

  const closePreviewBuy = () => {
    setPreviewBuy(false);
  };

  const { data: walletPortfolioData } = useGetWalletPortfolioQuery(
    { wallet: accountAddress || '', isPnl: false },
    { skip: !accountAddress }
  );

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{ backgroundColor: 'black' }}
    >
      {previewBuy ? (
        <PreviewBuy
          closePreview={closePreviewBuy}
          buyToken={buyToken}
          payingTokens={payingTokens}
          expressIntentResponse={expressIntentResponse}
        />
      ) : (
        <>
          <button
            className="flex items-center justify-center"
            style={{
              border: '2px solid #1E1D24',
              width: 446,
              height: 40,
              backgroundColor: '#121116',
              borderRadius: 10,
            }}
            onClick={() => {
              setSearching(true);
            }}
            type="button"
          >
            <span style={{ marginLeft: 10 }}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </span>
            <div className="flex-1 w-fit" style={{ color: 'grey' }}>
              Search by token or paste address
            </div>
          </button>
          <div
            className="flex flex-col"
            style={{
              border: '2px solid #1E1D24',
              width: 446,
              height: 264,
              backgroundColor: '#121116',
              borderRadius: 10,
              marginTop: 40,
            }}
          >
            {/* buy/sell, refresh, settings */}
            <div className="flex">
              <div
                className="flex"
                style={{
                  width: 318,
                  height: 40,
                  backgroundColor: 'black',
                  borderRadius: 10,
                  marginTop: 10,
                  marginLeft: 10,
                }}
              >
                <button
                  className="flex-1"
                  style={
                    isBuy
                      ? {
                          backgroundColor: '#121116',
                          borderRadius: 10,
                          margin: 4,
                        }
                      : {
                          backgroundColor: 'black',
                          borderRadius: 10,
                          margin: 4,
                          color: 'grey',
                        }
                  }
                  onClick={() => setIsBuy(true)}
                  type="button"
                >
                  <p className="text-center">Buy</p>
                </button>
                <button
                  className="flex-1 items-center justify-center"
                  style={
                    !isBuy
                      ? {
                          backgroundColor: '#121116',
                          borderRadius: 10,
                          margin: 4,
                        }
                      : {
                          backgroundColor: 'black',
                          borderRadius: 10,
                          margin: 4,
                          color: 'grey',
                        }
                  }
                  onClick={() => setIsBuy(false)}
                  type="button"
                >
                  <p className="text-center">Sell</p>
                </button>
              </div>
              <div className="flex" style={{ marginTop: 10 }}>
                <div
                  style={{
                    marginLeft: 12,
                    backgroundColor: 'black',
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
                    marginLeft: 12,
                    backgroundColor: 'black',
                    borderRadius: 10,
                    width: 40,
                    height: 40,
                    padding: '2px 2px 4px 2px',
                  }}
                >
                  <Settings />
                </div>
              </div>
            </div>
            {isBuy ? (
              <Buy
                setSearching={setSearching}
                token={buyToken}
                walletPortfolioData={walletPortfolioData}
                payingTokens={payingTokens}
                setPreviewBuy={setPreviewBuy}
                setPayingTokens={setPayingTokens}
                setExpressIntentResponse={setExpressIntentResponse}
              />
            ) : (
              <Sell />
            )}
          </div>
        </>
      )}
    </div>
  );
}
