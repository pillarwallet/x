import { useEffect, useState } from "react";
import { useGetSearchTokensQuery } from "../../../services/pillarXApiSearchTokens";

export function useTokenSearch(props: { isBuy: boolean }) {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");

  useEffect(() => {
    if(props.isBuy) {
      const handler = setTimeout(() => {
        setDebouncedSearchText(searchText);
      }, 1000);
      return () => clearTimeout(handler);
    }
  }, [searchText]);

  const {
    data: searchData,
    isLoading: isSearchLoading,
    isFetching,
    error,
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
  }
}