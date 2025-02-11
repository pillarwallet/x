import { Token } from '@etherspot/data-utils/dist/cjs/sdk/data/classes/token';
import { useWalletAddress } from '@etherspot/transaction-kit';
import Fuse from 'fuse.js';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';

// api
import { useRecordPresenceMutation } from '../../../../services/pillarXApiPresence';

// reducer
import { setSearchTokenResult } from '../../reducer/theExchangeSlice';
// hooks
import { useAppDispatch, useAppSelector } from '../../hooks/useReducerHooks';

// types
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
  const swapTokenData = useAppSelector(
    (state) => state.swap.swapTokenData as Token[]
  );
  const receiveTokenData = useAppSelector(
    (state) => state.swap.receiveTokenData as Token[]
  );
  const swapChain = useAppSelector(
    (state) => state.swap.swapChain as ChainType
  );
  const receiveChain = useAppSelector(
    (state) => state.swap.receiveChain as ChainType
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<string>('');

  // The performSearch will look for tokens close to the name or chain id being typed on filtered or all supported chains
  const searchTokens = (tokenSearch: string) => {
    const options = {
      includeScore: true,
      // Search in `chainId` and in `name`
      keys: ['chainId', 'name'],
    };
    const fuse = new Fuse(
      isSwapOpen ? swapTokenData : receiveTokenData,
      options
    );
    const result = fuse.search(tokenSearch);

    if (
      (isSwapOpen && swapChain.chainId === 0) ||
      (!isSwapOpen && receiveChain.chainId === 0)
    ) {
      dispatch(setSearchTokenResult(result.map((tokens) => tokens.item)));
    } else {
      dispatch(
        setSearchTokenResult(
          result
            .filter(
              (tokens) =>
                tokens.item.chainId ===
                (isSwapOpen ? swapChain.chainId : receiveChain.chainId)
            )
            .map((tokens) => tokens.item)
        )
      );
    }
  };

  // Debounced recordPresence function with 1-second delay
  const debouncedSearchToken = _.debounce((searchText: string) => {
    if (value !== '') {
      recordPresence({
        address: accountAddress,
        action: 'app:theExchange:search',
        value: { searchText },
      });
    }
  }, 1000);

  const handleClickIcon = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    searchTokens(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapChain, receiveChain]);

  useEffect(() => {
    debouncedSearchToken(value);

    // Clean-up debounce on component unmount
    return () => {
      debouncedSearchToken.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    setValue(searchValue);
    searchTokens(searchValue);
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
            value={value}
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
