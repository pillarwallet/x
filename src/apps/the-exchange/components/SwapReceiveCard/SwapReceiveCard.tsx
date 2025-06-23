// services
import { useWalletAddress } from '@etherspot/transaction-kit';
import { useEffect, useMemo, useState } from 'react';

// services
import { useGetSearchTokensQuery } from '../../../../services/pillarXApiSearchTokens';
import {
  Token,
  chainIdToChainNameTokensData,
  chainNameDataCompatibility,
  chainNameToChainIdTokensData,
  convertAPIResponseToTokens,
} from '../../../../services/tokensData';

// utils
import { isNativeToken } from '../../utils/wrappedTokens';

// reducer
import { setReceiveToken } from '../../reducer/theExchangeSlice';

// hooks
import useDeployWallet from '../../../../hooks/useDeployWallet';
import { useAppDispatch, useAppSelector } from '../../hooks/useReducerHooks';

// types
import { CardPosition } from '../../utils/types';

// components
import { TokenAssetResponse } from '../../../../types/api';
import { SelectedTokenType } from '../../../token-atlas/types/types';
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
  const accountAddress = useWalletAddress();
  const { getWalletDeploymentCost } = useDeployWallet();
  const swapToken = useAppSelector((state) => state.swap.swapToken as Token);
  const receiveToken = useAppSelector(
    (state) => state.swap.receiveToken as Token
  );
  const selectedToken = useAppSelector(
    (state) => state.tokenAtlas.selectedToken as SelectedTokenType | undefined
  );
  const [deploymentCost, setDeploymentCost] = useState(0);
  const [isDeploymentCostLoading, setIsDeploymentCostLoading] = useState(false);

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
      filterBlockchains: `${chain || ''}`,
    },
    { skip: !asset && !chain }
  );

  useEffect(() => {
    if (asset && chain && selectedToken) {
      dispatch(
        setReceiveToken({
          id: selectedToken?.id || 0,
          name: selectedToken?.name || '',
          symbol: selectedToken?.symbol || '',
          logo: selectedToken?.icon || '',
          blockchain:
            chainIdToChainNameTokensData(selectedToken?.chainId) || '',
          contract: selectedToken?.address || '',
          decimals: selectedToken?.decimals || 18,
          price: selectedToken?.price || 0,
        })
      );

      // clean the URL after the token has been set
      const url = new URL(window.location.href);
      url.searchParams.delete('asset');
      url.searchParams.delete('blockchain');
      window.history.replaceState({}, '', url.toString());
    } else {
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset, searchData]);

  useEffect(() => {
    const getDeploymentCost = async () => {
      if (!accountAddress || !swapToken?.blockchain) return;

      setIsDeploymentCostLoading(true);
      const cost = await getWalletDeploymentCost({
        accountAddress,
        chainId: chainNameToChainIdTokensData(swapToken.blockchain),
      });
      setDeploymentCost(cost);
      setIsDeploymentCostLoading(false);
    };

    getDeploymentCost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountAddress, swapToken]);

  const swapTokenBalance = useMemo(() => {
    if (!swapToken || !swapToken.balance) return 0;

    const adjustedBalance = isNativeToken(swapToken.contract)
      ? swapToken.balance - deploymentCost
      : swapToken.balance;

    return adjustedBalance;
  }, [swapToken, deploymentCost]);

  return (
    <div
      id="swap-receive-card-exchange"
      onClick={isClickable ? onClick : undefined}
      className={`flex flex-col w-full cursor-pointer min-h-[200px] h-full justify-between rounded-lg p-4 desktop:h-[230px] desktop:max-w-[306px] ${initialPosition === CardPosition.SWAP ? 'bg-light_green' : 'bg-purple'}`}
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
        tokenBalance={
          position === CardPosition.SWAP ? swapToken?.balance : undefined
        }
        tokenPrice={
          position === CardPosition.SWAP ? swapToken?.price : undefined
        }
      />
      <EnterAmount
        type={position}
        tokenSymbol={
          position === CardPosition.SWAP
            ? swapToken?.symbol
            : receiveToken?.symbol
        }
        tokenBalance={
          position === CardPosition.SWAP ? swapTokenBalance : undefined
        }
        tokenChain={
          position === CardPosition.SWAP
            ? chainNameDataCompatibility(swapToken?.blockchain)
            : undefined
        }
        isDeploymentCostLoading={isDeploymentCostLoading}
        deploymentCost={deploymentCost}
      />
    </div>
  );
};

export default SwapReceiveCard;
