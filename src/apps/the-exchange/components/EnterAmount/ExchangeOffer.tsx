import { CircularProgress } from '@mui/material';

// types
import { SwapOffer } from '../../utils/types';

// components
import Body from '../Typography/Body';
import NumberText from '../Typography/NumberText';

// utils
import { formatTokenAmount } from '../../utils/converters';

type ExchangeOfferProps = {
  isOfferLoading: boolean;
  isNoOffer: boolean;
  bestOffer: SwapOffer | undefined;
};

// Function to render offer based on loading and offer state
const ExchangeOffer = ({
  isOfferLoading,
  isNoOffer,
  bestOffer,
}: ExchangeOfferProps) => {
  if (isOfferLoading) {
    return <CircularProgress size={36} sx={{ color: '#343434' }} />;
  }

  if (isNoOffer) {
    return (
      <Body id="no-offer-exchange" className="mobile:text-xs">
        Sorry, no offers were found! Please check or change the amounts and try
        again.
      </Body>
    );
  }

  if (bestOffer) {
    return (
      <NumberText
        id="offer-amount-exchange"
        className="text-black_grey font-normal text-3xl break-words mobile:max-w-[180px] tablet:max-w-[260px] desktop:max-w-[260px] xs:max-w-[110px]"
      >
        {formatTokenAmount(bestOffer?.tokenAmountToReceive)}
      </NumberText>
    );
  }

  return null;
};

export default ExchangeOffer;
