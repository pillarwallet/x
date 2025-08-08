import { TailSpin } from 'react-loader-spinner';
import { ExpressIntentResponse } from '@etherspot/intent-sdk/dist/cjs/sdk/types/user-intent-types';
import { PayingToken, SelectedToken } from '../../types/tokens';
import { getChainName } from '../../utils/constants';

function getButtonText(
  isLoading: boolean,
  isInstalling: boolean,
  isFetching: boolean,
  areModulesInstalled: boolean | undefined,
  selectedToken: SelectedToken | null,
  debouncedUsdAmount: string,
  payingToken?: PayingToken
) {
  if (areModulesInstalled === false && payingToken && !isInstalling) {
    return (
      <div className="flex items-center justify-center">{`Enable Trading on ${getChainName(payingToken.chainId)}`}</div>
    );
  }
  const usdAmount = parseFloat(debouncedUsdAmount);
  const tokenUsdValue = selectedToken?.usdValue
    ? Number(selectedToken.usdValue)
    : 0;

  let tokenAmount = '';
  if (!Number.isNaN(usdAmount) && usdAmount > 0 && tokenUsdValue > 0) {
    tokenAmount = (usdAmount / tokenUsdValue).toFixed(4);
  }

  return isLoading || isInstalling || isFetching ? (
    <div className="flex items-center justify-center">
      <TailSpin color="#FFFFFF" height={15} width={15} />
    </div>
  ) : (
    <div>
      {selectedToken?.symbol
        ? `Buy ${tokenAmount} ${selectedToken.symbol}`
        : 'Buy'}
    </div>
  );
}

export interface BuyButtonProps {
  isLoading: boolean;
  isInstalling: boolean;
  isFetching: boolean;
  areModulesInstalled: boolean | undefined;
  token: SelectedToken | null;
  debouncedUsdAmount: string;
  payingTokens: PayingToken[];
  handleBuySubmit: () => Promise<void>;
  expressIntentResponse: ExpressIntentResponse | null;
  usdAmount: string;
  notEnoughLiquidity: boolean;
}

export default function BuyButton(props: BuyButtonProps) {
  const {
    areModulesInstalled,
    debouncedUsdAmount,
    expressIntentResponse,
    handleBuySubmit,
    isFetching,
    isInstalling,
    isLoading,
    payingTokens,
    token,
    usdAmount,
    notEnoughLiquidity,
  } = props;

  const isDisabled = () => {
    if (isInstalling || isFetching) {
      return true;
    }
    if (!areModulesInstalled && payingTokens.length > 0) {
      return false;
    }
    return (
      isLoading ||
      !token ||
      !(parseFloat(usdAmount) > 0) ||
      !expressIntentResponse ||
      expressIntentResponse?.bids?.length === 0 ||
      notEnoughLiquidity
    );
  };

  return (
    <button
      className="flex-1 items-center justify-center"
      onClick={handleBuySubmit}
      disabled={isDisabled()}
      style={{
        backgroundColor: isDisabled() ? '#29292F' : '#8A77FF',
        color: isDisabled() ? 'grey' : '#FFFFFF',
        borderRadius: 8,
      }}
      type="button"
    >
      {getButtonText(
        isLoading,
        isInstalling,
        isFetching,
        areModulesInstalled,
        token,
        debouncedUsdAmount,
        payingTokens.length > 0 ? payingTokens[0] : undefined
      )}
    </button>
  );
}
