import { useWalletAddress } from '@etherspot/transaction-kit';
import { useEffect, useState } from 'react';

// api
import { useRecordPresenceMutation } from '../../../../services/pillarXApiPresence';

// hooks
import { useAppDispatch, useAppSelector } from '../../hooks/useReducerHooks';

// reducer
import {
  setIsTokenSearchErroring,
  setIsTokenSearchLoading,
  setSearchToken,
  setSearchTokenResult,
} from '../../reducer/tokenAtlasSlice';

// services
import { useGetSearchTokensQuery } from '../../../../services/pillarXApiSearchTokens';
import {
  chainIdToChainNameTokensData,
  chainNameToChainIdTokensData,
  convertAPIResponseToTokens,
} from '../../../../services/tokensData';

// types
import { TokenAssetResponse } from '../../../../types/api';
import { ChainType } from '../../types/types';

type TokensSearchInputProps = {
  onClick: () => void;
  className?: string;
};

const TokensSearchInput = ({ className, onClick }: TokensSearchInputProps) => {
  /**
   * Import the recordPresence mutation from the
   * pillarXApiPresence service. We use this to
   * collect data on what asset is being searched for
   */
  const [recordPresence] = useRecordPresenceMutation();

  const accountAddress = useWalletAddress();

  const dispatch = useAppDispatch();

  const [searchText, setSearchText] = useState<string>('');
  const [debouncedSearchText, setDebouncedSearchText] = useState<string>('');

  const selectedChain = useAppSelector(
    (state) => state.tokenAtlas.selectedChain as ChainType
  );

  // Debounce searchText every 1-sec
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 1000);

    return () => clearTimeout(handler);
  }, [searchText]);

  // API call to search tokens and assets
  const {
    data: searchData,
    isLoading,
    isFetching,
    error,
  } = useGetSearchTokensQuery(
    {
      searchInput: debouncedSearchText,
      filterBlockchains: chainIdToChainNameTokensData(selectedChain.chainId),
    },
    { skip: !debouncedSearchText }
  );

  useEffect(() => {
    dispatch(setIsTokenSearchLoading(isLoading || isFetching));
    dispatch(setIsTokenSearchErroring(Boolean(error)));

    if (!searchData) return;

    const result = convertAPIResponseToTokens(
      searchData?.result?.data as TokenAssetResponse[],
      debouncedSearchText
    );

    // This is to check what has been the searched token, for other components to action
    dispatch(setSearchToken(debouncedSearchText));

    // This sets the token results list that will be displayed in the UI
    dispatch(
      setSearchTokenResult(
        selectedChain.chainId === 0
          ? result
          : result.filter(
              (token) =>
                chainNameToChainIdTokensData(token.blockchain) ===
                selectedChain.chainId
            )
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchData, debouncedSearchText, selectedChain.chainName]);

  // Record presence of the debouncedSearchText when it changes
  useEffect(() => {
    if (debouncedSearchText !== '') {
      recordPresence({
        address: accountAddress,
        action: 'app:tokenAtlas:search',
        value: { debouncedSearchText },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchText, accountAddress]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  return (
    <input
      id="token-atlas-search-input"
      onClick={onClick}
      onChange={handleSearch}
      className={`w-full h-full p-4 bg-medium_grey rounded text-[17px] mobile:text-[15px] focus:outline-none focus:ring-0 placeholder-white ${className}`}
      placeholder="Search tokens"
    />
  );
};

export default TokensSearchInput;
