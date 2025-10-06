import { useEffect, useState } from 'react';
import { useGetSearchTokensQuery } from '../../../services/pillarXApiSearchTokens';
import { MobulaChainNames, getChainId } from '../utils/constants';

export function useTokenSearch(props: {
  isBuy: boolean;
  chains: MobulaChainNames;
}) {
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');

  const {
    data: searchData,
    isLoading: isSearchLoading,
    isFetching,
  } = useGetSearchTokensQuery(
    {
      searchInput: debouncedSearchText,
      filterBlockchains: getChainId(props.chains),
    },
    {
      skip: !debouncedSearchText,
      refetchOnFocus: false,
    }
  );

  return {
    searchText,
    setSearchText,
    searchData,
    isSearchLoading,
    isFetching,
  };
}
