import { Dispatch, SetStateAction } from 'react';
import { TailSpin } from 'react-loader-spinner';

// hooks
import { SellOffer } from '../../hooks/useRelaySell';

// types
import { SelectedToken } from '../../types/tokens';

function getButtonText(
  isLoading: boolean,
  isInitialized: boolean,
  selectedToken: SelectedToken | null,
  tokenAmount: string,
  sellOffer?: SellOffer | null
) {
  if (!isInitialized) {
    return 'Initializing...';
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <TailSpin color="#FFFFFF" height={15} width={15} />
      </div>
    );
  }

  const amount = parseFloat(tokenAmount);
  if (!Number.isNaN(amount) && amount > 0 && sellOffer?.tokenAmountToReceive) {
    return `Sell ${amount.toFixed(4)} ${selectedToken?.symbol} for ${sellOffer.tokenAmountToReceive.toFixed(4)} USDC`;
  }

  return selectedToken?.symbol ? `Sell ${selectedToken.symbol}` : 'Sell';
}

export interface SellButtonProps {
  token: SelectedToken | null;
  tokenAmount: string;
  notEnoughLiquidity: boolean;
  setPreviewSell: Dispatch<SetStateAction<boolean>>;
  setSellOffer: Dispatch<SetStateAction<SellOffer | null>>;
  sellOffer: SellOffer | null;
  isLoadingOffer: boolean;
  isInitialized: boolean;
}

const SellButton = (props: SellButtonProps) => {
  const {
    token,
    tokenAmount,
    notEnoughLiquidity,
    setPreviewSell,
    setSellOffer,
    sellOffer,
    isLoadingOffer,
    isInitialized,
  } = props;

  const handleSellClick = () => {
    if (sellOffer) {
      setSellOffer(sellOffer);
      setPreviewSell(true);
    }
  };

  const isDisabled = () => {
    return (
      isLoadingOffer ||
      !token ||
      !(parseFloat(tokenAmount) > 0) ||
      !sellOffer ||
      sellOffer.tokenAmountToReceive === 0 ||
      notEnoughLiquidity ||
      !isInitialized
    );
  };

  return (
    <button
      className="flex-1 items-center justify-center"
      onClick={handleSellClick}
      disabled={isDisabled()}
      style={{
        backgroundColor: isDisabled() ? '#29292F' : '#8A77FF',
        color: isDisabled() ? 'grey' : '#FFFFFF',
        borderRadius: 8,
      }}
      type="button"
    >
      {getButtonText(
        isLoadingOffer,
        isInitialized,
        token,
        tokenAmount,
        sellOffer
      )}
    </button>
  );
};

export default SellButton;
