import { useEffect, useState } from 'react';
import { useGetSearchTokensQuery } from '../../../services/pillarXApiSearchTokens';

export function useTokenSearch(props: { isBuy: boolean }) {
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
    },
    { skip: !debouncedSearchText }
  );

  return {
    searchText,
    setSearchText,
    searchData,
    isSearchLoading,
    isFetching,
  };
}
