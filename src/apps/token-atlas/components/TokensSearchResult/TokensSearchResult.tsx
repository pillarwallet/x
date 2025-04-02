/* eslint-disable react-hooks/exhaustive-deps */
import { CircularProgress } from '@mui/material';
import { useEffect } from 'react';
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

// components
import Body from '../Typography/Body';
import TokenRow from './TokenRow';

const TokensSearchResult = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const searchTokenResult = useAppSelector(
    (state) => state.tokenAtlas.searchTokenResult as Token[] | undefined
  );
  const searchToken = useAppSelector(
    (state) => state.tokenAtlas.searchToken as string
  );
  const isTokenSearchLoading = useAppSelector(
    (state) => state.tokenAtlas.isTokenSearchLoading as boolean
  );
  const isTokenSearchErroring = useAppSelector(
    (state) => state.tokenAtlas.isTokenSearchErroring as boolean
  );

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
    dispatch(setSearchTokenResult(undefined));
    if (location.search !== '') {
      navigate('/token-atlas');
    }
  };

  // Auto-select token if there is exactly one token in the list
  // and the search was done with a contract address
  useEffect(() => {
    if (
      searchTokenResult &&
      searchTokenResult.length === 1 &&
      searchTokenResult[0].contract === searchToken
    ) {
      handleChooseToken(searchTokenResult[0]);
    }
  }, [searchTokenResult]);

  return (
    <div id="token-atlas-token-search-result" className="flex flex-col w-full">
      <Body className="text-white_light_grey mb-4">Search tokens</Body>
      {isTokenSearchErroring && (
        <Body className="text-base">
          Oops something went wrong! Please try searching for tokens again.
        </Body>
      )}
      {!searchTokenResult && !isTokenSearchLoading && (
        <Body className="text-base">Start searching for tokens.</Body>
      )}
      {isTokenSearchLoading && (
        <CircularProgress size={24} sx={{ color: '#979797' }} />
      )}
      {!isTokenSearchLoading &&
        searchTokenResult &&
        searchTokenResult.length === 0 && (
          <Body className="text-base">No tokens found.</Body>
        )}
      {!isTokenSearchLoading &&
        searchTokenResult &&
        searchTokenResult.length !== 0 && (
          <List
            height={250}
            itemCount={searchTokenResult.length}
            itemSize={60}
            width="100%"
            itemData={{ tokenList: searchTokenResult, handleChooseToken }}
          >
            {TokenRow}
          </List>
        )}
    </div>
  );
};
export default TokensSearchResult;
