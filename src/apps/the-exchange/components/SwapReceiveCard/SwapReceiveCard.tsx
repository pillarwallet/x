// services
import { useEffect } from 'react';

// services
import { useGetSearchTokensQuery } from '../../../../services/pillarXApiSearchTokens';
import {
  Token,
  chainNameToChainIdTokensData,
  convertAPIResponseToTokens,
} from '../../../../services/tokensData';

// reducer
import { setReceiveToken } from '../../reducer/theExchangeSlice';

// hooks
import { useAppDispatch, useAppSelector } from '../../hooks/useReducerHooks';

// types
import { TokenAssetResponse } from '../../../../types/api';
import { CardPosition } from '../../utils/types';

// components
import EnterAmount from '../EnterAmount/EnterAmount';
import SelectToken from '../SelectToken/SelectToken';

type SwapReceiveCardProps = {
  position: CardPosition;
  initialPosition: CardPosition;
  onClick: () => void;
};

const SwapReceiveCard = ({
  position,
  initialPosition,
  onClick,
}: SwapReceiveCardProps) => {
  const dispatch = useAppDispatch();
  const swapToken = useAppSelector((state) => state.swap.swapToken as Token);
  const receiveToken = useAppSelector(
    (state) => state.swap.receiveToken as Token
  );

  const isClickable =
    (position === CardPosition.SWAP && !swapToken) ||
    (position === CardPosition.RECEIVE && !receiveToken);

  // This is to query the API when tokens are being clicked from the Token Atlas app
  const query = new URLSearchParams(window.location.search);

  const asset = query.get('asset');
  const chain = query.get('blockchain');

  // API call to search tokens and assets
  const { data: searchData } = useGetSearchTokensQuery(
    {
      searchInput: asset || '',
      filterBlockchains: chain || undefined,
    },
    { skip: !asset && !chain }
  );

  useEffect(() => {
    if (!searchData) return;

    const result = convertAPIResponseToTokens(
      searchData?.result?.data as TokenAssetResponse[],
      asset || ''
    );

    // if it is considered a native token, Token Atlas would have handled the request
    // with showing the asset as a symbol rather than an contract address
    const nativeToken = result.filter(
      (token) => token.blockchain === chain && token.symbol === asset
    );

    if (nativeToken.length > 0) {
      dispatch(setReceiveToken(nativeToken[0]));
    } else {
      dispatch(setReceiveToken(result[0]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset, searchData]);

  return (
    <div
      id="swap-receive-card-exchange"
      onClick={isClickable ? onClick : undefined}
      className={`flex flex-col w-full cursor-pointer h-[200px] justify-between rounded-lg p-4 desktop:h-[230px] desktop:max-w-[306px] ${initialPosition === CardPosition.SWAP ? 'bg-light_green' : 'bg-purple'}`}
      data-testid="select-token-card"
    >
      <SelectToken
        onClick={!isClickable ? onClick : undefined}
        type={position}
        tokenName={
          position === CardPosition.SWAP ? swapToken?.name : receiveToken?.name
        }
        tokenChain={
          position === CardPosition.SWAP
            ? chainNameToChainIdTokensData(swapToken?.blockchain)
            : chainNameToChainIdTokensData(receiveToken?.blockchain)
        }
        tokenLogo={
          position === CardPosition.SWAP ? swapToken?.logo : receiveToken?.logo
        }
      />
      <EnterAmount
        type={position}
        tokenSymbol={
          position === CardPosition.SWAP
            ? swapToken?.symbol
            : receiveToken?.symbol
        }
      />
    </div>
  );
};

export default SwapReceiveCard;
