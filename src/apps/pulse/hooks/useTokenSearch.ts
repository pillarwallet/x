import { useEffect, useState } from 'react';
import { useGetSearchTokensQuery } from '../../../services/pillarXApiSearchTokens';
import { MobulaChainNames, getChainId } from '../utils/constants';

export function useTokenSearch(props: {
  isBuy: boolean;
  chains: MobulaChainNames;
}) {
  const { isBuy } = props;
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');

  useEffect((): (() => void) | undefined => {
    if (isBuy) {
      const handler = setTimeout(() => {
        setDebouncedSearchText(searchText);
      }, 1000);
      return () => clearTimeout(handler);
    }
    return undefined;
  }, [searchText, isBuy]);

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
      skip: !debouncedSearchText || !isBuy,
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
