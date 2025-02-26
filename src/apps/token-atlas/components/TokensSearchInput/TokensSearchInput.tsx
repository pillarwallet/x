import { useWalletAddress } from '@etherspot/transaction-kit';
import _ from 'lodash';
import { useEffect, useState } from 'react';

// api
import { useRecordPresenceMutation } from '../../../../services/pillarXApiPresence';

// hooks
import { useAppDispatch, useAppSelector } from '../../hooks/useReducerHooks';

// reducer
import { setSearchTokenResult } from '../../reducer/tokenAtlasSlice';

// services
import {
  chainNameToChainIdTokensData,
  searchTokens,
} from '../../../../services/tokensData';

// types
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
  const [value, setValue] = useState<string>('');
  const selectedChain = useAppSelector(
    (state) => state.tokenAtlas.selectedChain as ChainType
  );

  // The searchTokens will look for tokens close to the name or chain id being typed on filtered or all supported chains
  const searchTokensData = (tokenSearch: string) => {
    const result = searchTokens(tokenSearch);

    if (selectedChain.chainId === 0) {
      dispatch(setSearchTokenResult(result.map((tokens) => tokens)));
    } else {
      dispatch(
        setSearchTokenResult(
          result
            .filter(
              (tokens) =>
                chainNameToChainIdTokensData(tokens.blockchain) ===
                selectedChain.chainId
            )
            .map((tokens) => tokens)
        )
      );
    }
  };

  // Debounced recordPresence function with 1-second delay
  const debouncedSearchToken = _.debounce((searchText: string) => {
    if (value !== '') {
      recordPresence({
        address: accountAddress,
        action: 'app:tokenAtlas:search',
        value: { searchText },
      });
    }
  }, 1000);

  useEffect(() => {
    searchTokensData(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChain]);

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
    searchTokensData(searchValue);
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
