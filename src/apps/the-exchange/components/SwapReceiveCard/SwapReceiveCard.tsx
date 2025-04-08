// services
import { useEffect } from 'react';

// services
import { useGetSearchTokensQuery } from '../../../../services/pillarXApiSearchTokens';
import {
  Token,
  chainIdToChainNameTokensData,
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

  // This is to query the API when tokens are being clicked from the home feed
  const query = new URLSearchParams(window.location.search);

  const asset = query.get('asset');
  const contractAddress = query.get('address');
  const chainId = query.get('blockchain');

  // API call to search tokens and assets
  const { data: searchData } = useGetSearchTokensQuery(
    {
      searchInput: contractAddress || asset || '',
      filterBlockchains: chainIdToChainNameTokensData(Number(chainId)),
    },
    { skip: (!contractAddress || !asset) && !chainId }
  );

  useEffect(() => {
    if (!searchData) return;

    const result = convertAPIResponseToTokens(
      searchData?.result?.data as TokenAssetResponse[],
      contractAddress || asset || ''
    );

    // This sets the token results list that will be displayed in the UI
    dispatch(setReceiveToken(result[0]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset, contractAddress, searchData]);

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
