import { useWalletAddress } from '@etherspot/transaction-kit';
import Fuse from 'fuse.js';
import { useEffect, useRef, useState } from 'react';

// api
import { useRecordPresenceMutation } from '../../../../services/pillarXApiPresence';

// reducer
import {
  setIsTokenSearchErroring,
  setIsTokenSearchLoading,
  setSearchToken,
  setSearchTokenResult,
} from '../../reducer/theExchangeSlice';

// services
import { useGetSearchTokensQuery } from '../../../../services/pillarXApiSearchTokens';
import { convertPortfolioAPIResponseToToken } from '../../../../services/pillarXApiWalletPortfolio';
import {
  chainIdToChainNameTokensData,
  chainNameToChainIdTokensData,
  convertAPIResponseToTokens,
} from '../../../../services/tokensData';

// hooks
import { useAppDispatch, useAppSelector } from '../../hooks/useReducerHooks';

// types
import { PortfolioData, TokenAssetResponse } from '../../../../types/api';
import { ChainType } from '../../utils/types';

// images
import SearchIcon from '../../images/search-icon.png';

interface TokenSearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isShrinked?: boolean;
}

const TokenSearchInput = ({
  isShrinked,
  className,
  ...props
}: TokenSearchInputProps) => {
  /**
   * Import the recordPresence mutation from the
   * pillarXApiPresence service. We use this to
   * collect data on what asset is being searched for
   */
  const [recordPresence] = useRecordPresenceMutation();

  const accountAddress = useWalletAddress();

  const dispatch = useAppDispatch();
  const isSwapOpen = useAppSelector(
    (state) => state.swap.isSwapOpen as boolean
  );
  const isReceiveOpen = useAppSelector(
    (state) => state.swap.isReceiveOpen as boolean
  );
  const swapChain = useAppSelector(
    (state) => state.swap.swapChain as ChainType
  );
  const receiveChain = useAppSelector(
    (state) => state.swap.receiveChain as ChainType
  );
  const walletPortfolio = useAppSelector(
    (state) => state.swap.walletPortfolio as PortfolioData | undefined
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [debouncedSearchText, setDebouncedSearchText] = useState<string>('');

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
      filterBlockchains: chainIdToChainNameTokensData(receiveChain.chainId),
    },
    { skip: !debouncedSearchText && isSwapOpen }
  );

  useEffect(() => {
    dispatch(setIsTokenSearchLoading(isLoading || isFetching));
    dispatch(setIsTokenSearchErroring(Boolean(error)));

    // This is to check what has been the searched token, for other components to action
    dispatch(setSearchToken(debouncedSearchText));

    if (isReceiveOpen) {
      if (!searchData) return;

      const result = convertAPIResponseToTokens(
        searchData?.result?.data as TokenAssetResponse[],
        debouncedSearchText
      );

      dispatch(
        setSearchTokenResult(
          receiveChain.chainId === 0
            ? result
            : result
                .filter(
                  (tokens) =>
                    chainNameToChainIdTokensData(tokens.blockchain) ===
                    receiveChain.chainId
                )
                .map((tokens) => tokens)
        )
      );
    }

    if (isSwapOpen && walletPortfolio) {
      // This sets the token results list that will be displayed in the UI
      const tokensWithBalances =
        convertPortfolioAPIResponseToToken(walletPortfolio);

      // Since the list of available tokens with balance is loaded, we just need
      // here a simpler search with Fuse.js with auto select when the contract
      // address is entered
      if (debouncedSearchText.length > 40) {
        const fuse = new Fuse(tokensWithBalances, {
          keys: ['name', 'symbol', 'contract'], // Fields to search in
          threshold: 0.2, // Allow some fuzziness for queries that are not contract like
          minMatchCharLength: 3,
          useExtendedSearch: true, // Enables exact match using '='
        });

        // Check if query length is above 40 characters have an exact match (likely a contract address)
        const searchQuery =
          debouncedSearchText.length > 40
            ? `="${debouncedSearchText}"`
            : debouncedSearchText;

        const results = fuse.search(searchQuery).map((r) => r.item);
        dispatch(setSearchTokenResult(results));
      }

      const fuse = new Fuse(tokensWithBalances, {
        keys: ['name', 'symbol', 'contract'], // Fields to search in
        threshold: 0.3, // Allow some fuzziness for queries that are not contract like
      });

      const results = fuse
        .search(debouncedSearchText)
        .map((token) => token.item);

      dispatch(
        setSearchTokenResult(
          swapChain.chainId === 0
            ? results
            : results
                .filter(
                  (tokens) =>
                    chainNameToChainIdTokensData(tokens.blockchain) ===
                    swapChain.chainId
                )
                .map((tokens) => tokens)
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchData,
    debouncedSearchText,
    isSwapOpen,
    swapChain.chainId,
    receiveChain.chainId,
    isReceiveOpen,
    walletPortfolio,
  ]);

  // Record presence of the debouncedSearchText when it changes
  useEffect(() => {
    if (debouncedSearchText !== '') {
      recordPresence({
        address: accountAddress,
        action: 'app:theExchange:search',
        value: { debouncedSearchText },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchText, accountAddress]);

  const handleClickIcon = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  return (
    <div
      id="token-search-input-exchange"
      className={`${className} ${!isShrinked && 'w-full'} relative h-[34px]`}
    >
      {!isShrinked ? (
        <>
          <input
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
            ref={inputRef}
            className={`w-full h-full rounded-[3px] p-2 pr-9 bg-white focus:outline-none focus:ring-0 font-normal text-black text-md placeholder-[#717171] ${className}`}
            onChange={handleSearch}
            value={searchText}
          />
          <span
            className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer"
            onClick={handleClickIcon}
          >
            <img src={SearchIcon} alt="search-icon" />
          </span>
        </>
      ) : (
        <div
          className="flex h-full w-9 rounded-[3px] p-2 bg-white items-center justify-center cursor-pointer"
          onClick={handleClickIcon}
        >
          <img src={SearchIcon} alt="search-icon" />
        </div>
      )}
    </div>
  );
};

export default TokenSearchInput;
