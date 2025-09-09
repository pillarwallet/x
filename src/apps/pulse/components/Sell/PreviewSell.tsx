import { useCallback, useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MdCheck } from 'react-icons/md';
import { TailSpin } from 'react-loader-spinner';

// utils
import { getLogoForChainId } from '../../../../utils/blockchain';
import { limitDigitsNumber } from '../../../../utils/number';

// icons
import RandomAvatar from '../../../pillarx-app/components/RandomAvatar/RandomAvatar';
import CopyIcon from '../../assets/copy-icon.svg';
import MoreInfo from '../../assets/moreinfo-icon.svg';

// hooks
import { useTransactionDebugLogger } from '../../../../hooks/useTransactionDebugLogger';
import useRelaySell, { SellOffer } from '../../hooks/useRelaySell';

// types
import { WalletPortfolioMobulaResponse } from '../../../../types/api';
import { SelectedToken } from '../../types/tokens';

// components
import Esc from '../Misc/Esc';
import Refresh from '../Misc/Refresh';

// context
import { useLoading } from '../../contexts/LoadingContext';
import { useRefresh } from '../../contexts/RefreshContext';

interface PreviewSellProps {
  closePreview: () => void;
  sellToken: SelectedToken | null;
  sellOffer: SellOffer | null;
  tokenAmount: string;
  walletPortfolioData: WalletPortfolioMobulaResponse | undefined;
  onRefresh?: () => void;
}

const PreviewSell = (props: PreviewSellProps) => {
  const {
    closePreview,
    sellToken,
    sellOffer,
    tokenAmount,
    walletPortfolioData,
    onRefresh,
  } = props;
  const [isExecuting, setIsExecuting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { getUSDCAddress, executeSell, error, clearError } = useRelaySell();
  const { transactionDebugLog } = useTransactionDebugLogger();
  const { setRefreshPreviewSellCallback, isRefreshing } = useRefresh();
  const { isQuoteLoading } = useLoading();

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [isCopied]);

  // Clear errors when amount, token, or quote props change
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [tokenAmount, sellToken, sellOffer, clearError, error]);

  // Get the user's balance for the selected token
  const getTokenBalance = () => {
    try {
      if (!sellToken || !walletPortfolioData?.result?.data?.assets) return 0;

      // Find the asset in the portfolio
      const assetData = walletPortfolioData.result.data.assets.find(
        (asset) => asset.asset.symbol === sellToken.symbol
      );

      if (!assetData) return 0;

      // Find the contract balance for the specific token address and chain
      const contractBalance = assetData.contracts_balances.find(
        (contract) =>
          contract.address.toLowerCase() === sellToken.address.toLowerCase() &&
          contract.chainId === `evm:${sellToken.chainId}`
      );
      return contractBalance?.balance || 0;
    } catch (e) {
      console.error('Error getting token balance in preview:', e);
      return 0;
    }
  };

  const userTokenBalance = getTokenBalance();

  const usdcAddress = getUSDCAddress(sellToken?.chainId || 0);

  // Refresh function for PreviewSell component
  const refreshPreviewSellData = useCallback(async () => {
    if (onRefresh) {
      await onRefresh();
    }
  }, [onRefresh]);

  // Register refresh callback
  useEffect(() => {
    setRefreshPreviewSellCallback(refreshPreviewSellData);
  }, [setRefreshPreviewSellCallback, refreshPreviewSellData]);

  const detailsEntry = (
    lhs: string,
    rhs: string,
    moreInfo = false,
    tokenName = ''
  ) => {
    return (
      <div className="flex justify-between mb-3">
        <div className="flex items-center text-white/50 text-xs font-normal">
          <div>{lhs}</div>
          {moreInfo && (
            <div className="mt-1 ml-1">
              <img src={MoreInfo} alt="more-info-icon" />
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center text-xs font-normal text-white">
            <div>{rhs}</div>
            {tokenName && <div className="ml-1 text-white/50">{tokenName}</div>}
          </div>
        </div>
      </div>
    );
  };

  // TO DO - handle confirm sell differently once transaction status
  // and execution fow is within the app rather than within the Action Bar
  const handleConfirmSell = async () => {
    if (!sellToken || !sellOffer) return;

    // Clear any existing errors before attempting to execute
    if (error) {
      clearError();
    }

    setIsExecuting(true);
    setTxHash(null); // Reset previous transaction hash

    try {
      const result = await executeSell(sellToken, tokenAmount);
      if (result && typeof result === 'string') {
        setTxHash(result);
        transactionDebugLog('Sell transaction submitted successfully:', result);
      } else if (result) {
        transactionDebugLog('Sell transaction submitted successfully');
      }
    } catch (err) {
      console.error('Failed to execute sell:', err);
      // The error will be handled by the useRelaySell hook's error state
    } finally {
      setIsExecuting(false);
    }
  };

  if (!sellToken || !sellOffer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <div className="text-white text-lg">
          No offer was found. Please check the token and the inpu amount and try
          again.
        </div>
        <button
          type="button"
          onClick={closePreview}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded"
        >
          Close
        </button>
      </div>
    );
  }

  const usdcAmount = sellOffer.tokenAmountToReceive;
  const tokenAmountFormatted = parseFloat(tokenAmount).toFixed(6);
  const usdcAmountFormatted = usdcAmount.toFixed(6);

  return (
    <div className="flex flex-col w-full max-w-[446px] bg-[#1E1D24] border border-white/5 rounded-[10px] p-6">
      <div className="flex justify-between mb-6">
        <div className="text-xl font-medium">Preview</div>
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
            <Refresh
              onClick={refreshPreviewSellData}
              isLoading={isQuoteLoading || isRefreshing}
              disabled={
                !sellToken || !tokenAmount || isQuoteLoading || isRefreshing
              }
            />
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
            <Esc closePreview={closePreview} />
          </div>
        </div>
      </div>

      <div className="flex justify-between mb-3 text-xs font-normal text-white/50">
        <div>You&apos;re selling</div>
        <div className="flex">
          Total: {tokenAmountFormatted} {sellToken.symbol}
        </div>
      </div>

      <div className="flex justify-between w-full border border-[#25232D] rounded-[10px] p-3 mb-6">
        <div className="flex items-center">
          <div className="relative inline-block mr-2">
            {sellToken?.logo ? (
              <img
                src={sellToken?.logo}
                alt="Main"
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 overflow-hidden rounded-full">
                <RandomAvatar name={sellToken?.name || ''} />
                <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">
                  {sellToken?.name?.slice(0, 2)}
                </span>
              </div>
            )}
            <img
              src={getLogoForChainId(sellToken?.chainId)}
              className="absolute -bottom-px right-0.5 w-3 h-3 rounded-full border border-[#1E1D24]"
              alt="Chain logo"
            />
          </div>
          <div>
            <div className="text-xs font-normal text-white">
              {sellToken?.name}
            </div>
            <div className="text-xs font-normal text-white/50">
              {limitDigitsNumber(userTokenBalance)} {sellToken?.symbol}
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center text-right">
          <div className="text-xs font-normal text-white">
            {tokenAmountFormatted}
          </div>
          <div className="text-xs font-normal text-white/50">
            $
            {(parseFloat(tokenAmount) * parseFloat(sellToken.usdValue)).toFixed(
              2
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between mb-3 text-xs font-normal text-white/50">
        <div>You&apos;re receiving</div>
      </div>

      <div className="flex justify-between w-full border border-[#25232D] rounded-[10px] p-3 mb-6">
        <div className="flex items-center">
          <div className="relative inline-block mr-2">
            <div className="w-8 h-8 overflow-hidden rounded-full flex items-center justify-center bg-[#2775CA]">
              <span className="text-white font-bold text-sm">USD</span>
            </div>
            <img
              src={getLogoForChainId(sellToken?.chainId)}
              className="absolute -bottom-px right-0.5 w-3 h-3 rounded-full border border-[#1E1D24]"
              alt="Chain logo"
            />
          </div>
          <div>
            <div className="flex items-center text-xs font-normal text-white">
              <span>USD Coin</span>
              <span className="ml-1 text-white/50">USDC</span>
            </div>
            <div className="flex items-center text-xs font-normal text-white/50">
              <span>
                {usdcAddress
                  ? `${usdcAddress.slice(0, 6)}...${usdcAddress.slice(-4)}`
                  : 'USDC'}
              </span>
              {usdcAddress && (
                <CopyToClipboard
                  text={usdcAddress}
                  onCopy={() => setIsCopied(true)}
                >
                  <div className="flex items-center ml-1 cursor-pointer">
                    {isCopied ? (
                      <MdCheck className="w-[10px] h-3 text-white" />
                    ) : (
                      <img
                        src={CopyIcon}
                        alt="copy-address-icon"
                        className="w-[10px] h-3"
                      />
                    )}
                  </div>
                </CopyToClipboard>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center text-right">
          {isQuoteLoading ? (
            <div className="flex items-center justify-end">
              <TailSpin color="#FFFFFF" height={15} width={15} />
            </div>
          ) : (
            <>
              <div className="text-xs font-normal text-white">
                {usdcAmountFormatted}
              </div>
              <div className="text-xs font-normal text-white/50">
                ${usdcAmount.toFixed(2)}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-between mb-3 text-xs font-normal text-white/50">
        <div>Details</div>
      </div>

      <div className="flex flex-col w-full border border-[#25232D] rounded-[10px] p-3 mb-3">
        {detailsEntry(
          'Rate',
          `1 ${sellToken?.symbol} ≈ ${sellToken?.usdValue ? Number(sellToken.usdValue).toFixed(3) : 1.0}`,
          false,
          'USDC'
        )}
        {detailsEntry('Minimum Receive', `${usdcAmount.toFixed(6)} USDC`)}
        {detailsEntry('Price Impact', '0.00%')}
        {detailsEntry('Max Slippage', '3.0%')}
        {detailsEntry('Gas Fee', '≈ $0.00')}
      </div>

      {/* Error Display */}
      {error && (
        <div className="m-2.5 p-2.5 bg-red-500/10 border border-red-500 rounded-[10px]">
          <div className="text-red-300 text-xs">{error}</div>
        </div>
      )}

      {/* Transaction Hash Display */}
      {txHash && (
        <div className="m-2.5 p-2.5 bg-green-500/10 border border-green-500 rounded-[10px]">
          <div className="text-green-300 text-xs">
            Transaction submitted: {txHash.slice(0, 10)}...{txHash.slice(-8)}
          </div>
        </div>
      )}

      <div className="flex w-full h-[50px] rounded-[10px] bg-black">
        <button
          className={`flex items-center justify-center w-full rounded-[10px] m-0.5 ${
            isExecuting ? 'bg-[#121116]' : 'bg-[#8A77FF]'
          }`}
          onClick={handleConfirmSell}
          disabled={isExecuting}
          type="submit"
        >
          {isExecuting ? (
            <div className="flex items-center justify-center">
              Waiting for signature...
            </div>
          ) : (
            <>Confirm</>
          )}
        </button>
      </div>
    </div>
  );
};

export default PreviewSell;
