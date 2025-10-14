import { ExpressIntentResponse } from '@etherspot/intent-sdk/dist/cjs/sdk/types/user-intent-types';
import { TailSpin } from 'react-loader-spinner';
import { PayingToken, SelectedToken } from '../../types/tokens';
import { getChainName } from '../../utils/constants';

// components
import HighDecimalsFormatted from '../../../pillarx-app/components/HighDecimalsFormatted/HighDecimalsFormatted';

// utils
import { limitDigitsNumber } from '../../../../utils/number';

function getButtonText(
  isLoading: boolean,
  isInstalling: boolean,
  isFetching: boolean,
  areModulesInstalled: boolean | undefined,
  selectedToken: SelectedToken | null,
  debouncedUsdAmount: string,
  payingToken?: PayingToken,
  isDisabled?: boolean
) {
  if (areModulesInstalled === false && payingToken && !isInstalling) {
    return (
      <div className="flex text-sm items-center justify-center">{`Enable Trading on ${getChainName(payingToken.chainId)}`}</div>
    );
  }

  if (isLoading || isInstalling || isFetching) {
    return (
      <div className="flex items-center justify-center">
        <TailSpin color="#FFFFFF" height={15} width={15} />
      </div>
    );
  }

  const usdAmount = parseFloat(debouncedUsdAmount);
  const tokenUsdValue = selectedToken?.usdValue
    ? Number(selectedToken.usdValue)
    : 0;

  if (
    !isDisabled &&
    !Number.isNaN(usdAmount) &&
    usdAmount > 0 &&
    tokenUsdValue > 0
  ) {
    const tokenAmount = usdAmount / tokenUsdValue;
    const limitedUsdAmount = limitDigitsNumber(usdAmount);
    const limitedTokenAmount = limitDigitsNumber(tokenAmount);

    return (
      <div className="flex items-center justify-center gap-1 text-base">
        <span>{selectedToken ? 'Buy' : 'Select token'}</span>
        <HighDecimalsFormatted
          value={limitedTokenAmount}
          styleNumber="text-white text-base"
          styleZeros="text-white/70 text-sm"
        />
        <span>{selectedToken?.symbol}</span>
        <span>for</span>
        <HighDecimalsFormatted
          value={limitedUsdAmount}
          moneySymbol="$"
          styleNumber="text-white text-base"
          styleZeros="text-white/70 text-sm"
        />
      </div>
    );
  }

  // eslint-disable-next-line no-nested-ternary
  return selectedToken?.symbol
    ? `Buy ${selectedToken.symbol}`
    : selectedToken === null
      ? 'Select token'
      : 'Buy';
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
  expressIntentResponse: ExpressIntentResponse | null | { error: string };
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
    if (notEnoughLiquidity) {
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
      !!(expressIntentResponse as { error: string }).error ||
      (expressIntentResponse as ExpressIntentResponse)?.bids?.length === 0
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
      data-testid="pulse-buy-button"
    >
      <span className="text-base font-medium tracking-tight leading-none text-center">
        {getButtonText(
          isLoading,
          isInstalling,
          isFetching,
          areModulesInstalled,
          token,
          debouncedUsdAmount,
          payingTokens.length > 0 ? payingTokens[0] : undefined,
          isDisabled()
        )}
      </span>
    </button>
  );
}
