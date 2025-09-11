import { ExpressIntentResponse } from '@etherspot/intent-sdk/dist/cjs/sdk/types/user-intent-types';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';

// services
import { useGetWalletPortfolioQuery } from '../../../../services/pillarXApiWalletPortfolio';

// types
import { PayingToken, SelectedToken } from '../../types/tokens';

// components
import SearchIcon from '../../assets/seach-icon.svg';
import Buy from '../Buy/Buy';
import PreviewBuy from '../Buy/PreviewBuy';
import Refresh from '../Misc/Refresh';
import Settings from '../Misc/Settings';
import PreviewSell from '../Sell/PreviewSell';
import Sell from '../Sell/Sell';

// hooks
import useTransactionKit from '../../../../hooks/useTransactionKit';
import useRelaySell, { SellOffer } from '../../hooks/useRelaySell';

interface HomeScreenProps {
  setSearching: Dispatch<SetStateAction<boolean>>;
  buyToken: SelectedToken | null;
  sellToken: SelectedToken | null;
  isBuy: boolean;
  setIsBuy: Dispatch<SetStateAction<boolean>>;
  refetchWalletPortfolio: () => void;
}

export default function HomeScreen(props: HomeScreenProps) {
  const {
    buyToken,
    sellToken,
    isBuy,
    setIsBuy,
    setSearching,
    refetchWalletPortfolio,
  } = props;
  const { walletAddress: accountAddress } = useTransactionKit();
  const { getBestSellOffer, isInitialized } = useRelaySell();
  const [previewBuy, setPreviewBuy] = useState(false);
  const [previewSell, setPreviewSell] = useState(false);
  const [payingTokens, setPayingTokens] = useState<PayingToken[]>([]);
  const [expressIntentResponse, setExpressIntentResponse] =
    useState<ExpressIntentResponse | null>(null);
  const [sellOffer, setSellOffer] = useState<SellOffer | null>(null);
  const [tokenAmount, setTokenAmount] = useState<string>('');
  const [isRefreshingHome, setIsRefreshingHome] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshingHome(true);

    try {
      const refreshPromises: Promise<void>[] = [
        Promise.resolve(refetchWalletPortfolio()),
      ];

      // If we have the required data, refresh the sell offer (regardless of whether one exists)
      if (sellToken && tokenAmount && isInitialized) {
        const sellOfferPromise = (async () => {
          try {
            const newOffer = await getBestSellOffer({
              fromAmount: tokenAmount,
              fromTokenAddress: sellToken.address,
              fromChainId: sellToken.chainId,
              fromTokenDecimals: sellToken.decimals,
            });
            setSellOffer(newOffer);
          } catch (error) {
            console.error('Failed to refresh sell offer:', error);
            setSellOffer(null);
          }
        })();
        refreshPromises.push(sellOfferPromise);
      }

      await Promise.all(refreshPromises);
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshingHome(false);
    }
  }, [
    refetchWalletPortfolio,
    sellToken,
    tokenAmount,
    isInitialized,
    getBestSellOffer,
  ]);

  const closePreviewBuy = () => {
    setPreviewBuy(false);
  };

  const closePreviewSell = () => {
    setPreviewSell(false);
    setSellOffer(null);
    setTokenAmount('');
  };

  const { data: walletPortfolioData } = useGetWalletPortfolioQuery(
    { wallet: accountAddress || '', isPnl: false },
    {
      skip: !accountAddress,
      refetchOnFocus: false,
    }
  );

  const renderPreview = () => {
    if (previewBuy) {
      return (
        <PreviewBuy
          closePreview={closePreviewBuy}
          buyToken={buyToken}
          payingTokens={payingTokens}
          expressIntentResponse={expressIntentResponse}
        />
      );
    }

    if (previewSell) {
      return (
        <PreviewSell
          closePreview={closePreviewSell}
          sellToken={sellToken}
          sellOffer={sellOffer}
          tokenAmount={tokenAmount}
          walletPortfolioData={walletPortfolioData}
          onSellOfferUpdate={setSellOffer}
        />
      );
    }

    return (
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
            <img src={SearchIcon} alt="search-icon" />
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
                data-testid="pulse-buy-toggle-button"
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
                data-testid="pulse-sell-toggle-button"
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
                <Refresh
                  onClick={isBuy ? undefined : handleRefresh}
                  isLoading={isBuy ? false : isRefreshingHome}
                  disabled={
                    isBuy || isRefreshingHome || (!buyToken && !sellToken)
                  }
                />
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
            <Sell
              setSearching={setSearching}
              token={sellToken}
              walletPortfolioData={walletPortfolioData}
              setPreviewSell={setPreviewSell}
              setSellOffer={setSellOffer}
              setTokenAmount={setTokenAmount}
              isRefreshing={isRefreshingHome}
            />
          )}
        </div>
      </>
    );
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{ backgroundColor: 'black' }}
      data-testid="pulse-home-view"
    >
      {renderPreview()}
    </div>
  );
}
