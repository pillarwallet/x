import { useLocation, useNavigate } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';

// hooks
import { useAppDispatch, useAppSelector } from '../../hooks/useReducerHooks';

// reducer
import {
  setIsSearchTokenModalOpen,
  setSearchTokenResult,
  setSelectedChain,
  setSelectedToken,
} from '../../reducer/tokenAtlasSlice';

// services
import {
  Token,
  chainNameToChainIdTokensData,
} from '../../../../services/tokensData';

// types
import { ChainType } from '../../types/types';

// components
import Body from '../Typography/Body';
import TokenRow from './TokenRow';

const TokensSearchResult = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const searchTokenResult = useAppSelector(
    (state) => state.tokenAtlas.searchTokenResult as Token[]
  );
  const selectedChain = useAppSelector(
    (state) => state.tokenAtlas.selectedChain as ChainType
  );
  const tokenListData = useAppSelector(
    (state) => state.tokenAtlas.tokenListData as Token[]
  );

  // if there are no tokens being typed searched, we show the token list of tokens
  // which will filter if a chain has been chosen
  let tokenList: Token[];

  if (searchTokenResult.length) {
    tokenList = searchTokenResult;
  } else if (selectedChain.chainId !== 0) {
    tokenList = tokenListData.filter(
      (token) =>
        chainNameToChainIdTokensData(token.blockchain) === selectedChain.chainId
    );
  } else {
    tokenList = tokenListData;
  }

  const handleChooseToken = (token: Token) => {
    dispatch(
      setSelectedToken({
        id: token.id,
        symbol: token.symbol,
        address: token.contract,
        decimals: token.decimals,
        chainId: chainNameToChainIdTokensData(token.blockchain),
        name: token.name,
        icon: token.logo,
      })
    );
    dispatch(setIsSearchTokenModalOpen(false));
    dispatch(setSelectedChain({ chainId: 0, chainName: 'all' }));
    dispatch(setSearchTokenResult([]));
    if (location.search !== '') {
      navigate('/token-atlas');
    }
  };

  return (
    <div id="token-atlas-token-search-result" className="flex flex-col w-full">
      <Body className="text-white_light_grey mb-4">Search tokens</Body>
      {tokenList.length === 0 ? (
        <Body className="text-base">No tokens found.</Body>
      ) : (
        <List
          height={250}
          itemCount={tokenList.length}
          itemSize={60}
          width="100%"
          itemData={{ tokenList, handleChooseToken }}
        >
          {TokenRow}
        </List>
      )}
    </div>
  );
};
export default TokensSearchResult;
