import { useWalletAddress } from '@etherspot/transaction-kit';
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
import {
  chainIdToChainNameTokensData,
  chainNameToChainIdTokensData,
  convertAPIResponseToTokens,
} from '../../../../services/tokensData';

// hooks
import { useAppDispatch, useAppSelector } from '../../hooks/useReducerHooks';

// types
import { TokenAssetResponse } from '../../../../types/api';
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
  const swapChain = useAppSelector(
    (state) => state.swap.swapChain as ChainType
  );
  const receiveChain = useAppSelector(
    (state) => state.swap.receiveChain as ChainType
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
    error,
  } = useGetSearchTokensQuery(
    {
      searchInput: debouncedSearchText,
      filterBlockchains: chainIdToChainNameTokensData(
        isSwapOpen ? swapChain.chainId : receiveChain.chainId
      ),
    },
    { skip: !debouncedSearchText }
  );

  useEffect(() => {
    dispatch(setIsTokenSearchLoading(isLoading));
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
        (isSwapOpen && swapChain.chainId === 0) ||
          (!isSwapOpen && receiveChain.chainId === 0)
          ? result
          : result
              .filter(
                (tokens) =>
                  chainNameToChainIdTokensData(tokens.blockchain) ===
                  (isSwapOpen ? swapChain.chainId : receiveChain.chainId)
              )
              .map((tokens) => tokens)
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchData,
    debouncedSearchText,
    isSwapOpen,
    swapChain.chainId,
    receiveChain.chainId,
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
