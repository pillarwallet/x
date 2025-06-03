import { useWalletAddress } from '@etherspot/transaction-kit';
import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { FixedSizeList as List } from 'react-window';

// api
import { useRecordPresenceMutation } from '../../../../services/pillarXApiPresence';

// reducer
import {
  setIsReceiveOpen,
  setIsSwapOpen,
  setReceiveChain,
  setReceiveToken,
  setSearchToken,
  setSearchTokenResult,
  setSwapChain,
  setSwapToken,
  setWalletPortfolio,
} from '../../reducer/theExchangeSlice';

// services
import {
  convertPortfolioAPIResponseToToken,
  useGetWalletPortfolioQuery,
} from '../../../../services/pillarXApiWalletPortfolio';
import {
  Token,
  chainNameToChainIdTokensData,
} from '../../../../services/tokensData';

// utils
import { CompatibleChains } from '../../../../utils/blockchain';

// hooks
import { useAppDispatch, useAppSelector } from '../../hooks/useReducerHooks';

// types
import { PortfolioData } from '../../../../types/api';
import { CardPosition, ChainType } from '../../utils/types';

// components
import SelectDropdown from '../SelectDropdown/SelectDropdown';
import TokenSearchInput from '../TokenSearchInput/TokenSearchInput';
import TokenRow from './TokenRow';

// images
import CloseIcon from '../../images/add.png';
import Body from '../Typography/Body';

type DropdownTokenListProps = {
  type: CardPosition;
  initialCardPosition: CardPosition;
};

const DropdownTokenList = ({
  type,
  initialCardPosition,
}: DropdownTokenListProps) => {
  /**
   * Import the recordPresence mutation from the
   * pillarXApiPresence service. We use this to
   * collect data on what asset is being selected
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
  const searchTokenResult = useAppSelector(
    (state) => state.swap.searchTokenResult as Token[] | undefined
  );
  const swapToken = useAppSelector((state) => state.swap.swapToken as Token);
  const receiveToken = useAppSelector(
    (state) => state.swap.receiveToken as Token
  );
  const searchToken = useAppSelector(
    (state) => state.swap.searchToken as string
  );
  const isTokenSearchLoading = useAppSelector(
    (state) => state.swap.isTokenSearchLoading as boolean
  );
  const isTokenSearchErroring = useAppSelector(
    (state) => state.swap.isTokenSearchErroring as boolean
  );
  const swapChain = useAppSelector(
    (state) => state.swap.swapChain as ChainType
  );
  const walletPortfolio = useAppSelector(
    (state) => state.swap.walletPortfolio as PortfolioData | undefined
  );

  const [isChainSelectionOpen, setIsChainSelectionOpen] =
    useState<boolean>(false);

  const {
    data: walletPortfolioData,
    isLoading: isWalletPortfolioDataLoading,
    isFetching: isWalletPortfolioDataFetching,
    isSuccess: isWalletPortfolioDataSuccess,
    error: walletPortfolioDataError,
  } = useGetWalletPortfolioQuery(
    { wallet: accountAddress || '', isPnl: false },
    { skip: !accountAddress }
  );

  // This useEffect is to update the wallet portfolio data when the dropdown is opened
  useEffect(() => {
    if (walletPortfolioData && isWalletPortfolioDataSuccess) {
      dispatch(setWalletPortfolio(walletPortfolioData?.result?.data));
    }
    if (!isWalletPortfolioDataSuccess || walletPortfolioDataError) {
      dispatch(setWalletPortfolio(undefined));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    walletPortfolioData,
    isWalletPortfolioDataSuccess,
    walletPortfolioDataError,
  ]);

  // select all chainsId of tokens available in the list for swap token
  const uniqueChains = CompatibleChains.map((chain) => chain.chainId);

  const handleClick = (token: Token) => {
    if (isSwapOpen) {
      dispatch(setSwapToken(token));
      dispatch(
        setSwapChain({
          chainId: chainNameToChainIdTokensData(token.blockchain),
          chainName: token.blockchain,
        })
      );
      recordPresence({
        address: accountAddress,
        action: 'app:theExchange:sourceTokenSelect',
        value: {
          chainId: chainNameToChainIdTokensData(token.blockchain),
          address: token.contract,
          symbol: token.symbol,
          name: token.name,
        },
      });
      dispatch(setSearchTokenResult(undefined));
      dispatch(setIsSwapOpen(false));
    } else {
      dispatch(setReceiveToken(token));
      dispatch(
        setReceiveChain({
          chainId: chainNameToChainIdTokensData(token.blockchain),
          chainName: token.blockchain,
        })
      );
      recordPresence({
        address: accountAddress,
        action: 'app:theExchange:destinationTokenSelect',
        value: {
          chainId: chainNameToChainIdTokensData(token.blockchain),
          address: token.contract,
          symbol: token.symbol,
          name: token.name,
        },
      });
      dispatch(setSearchTokenResult(undefined));
      dispatch(setIsReceiveOpen(false));
    }
  };

  // Automatically select a token if there is only one available
  useEffect(() => {
    if (
      isSwapOpen &&
      searchTokenResult &&
      searchTokenResult.length === 1 &&
      searchTokenResult[0].contract.toLocaleLowerCase() ===
        searchToken.toLocaleLowerCase() &&
      receiveToken &&
      searchTokenResult[0].contract.toLocaleLowerCase() !==
        receiveToken.contract.toLocaleLowerCase()
    ) {
      handleClick(searchTokenResult[0]);
    } else if (
      !isSwapOpen &&
      searchTokenResult &&
      searchTokenResult.length === 1 &&
      searchTokenResult[0].contract.toLocaleLowerCase() ===
        searchToken.toLocaleLowerCase() &&
      swapToken &&
      searchTokenResult[0].contract.toLocaleLowerCase() !==
        swapToken.contract.toLocaleLowerCase()
    ) {
      handleClick(searchTokenResult[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTokenResult, isSwapOpen]);

  const itemsListNumber = () => {
    if (isSwapOpen && !searchToken && walletPortfolio) {
      return convertPortfolioAPIResponseToToken(walletPortfolio).length;
    }
    return searchTokenResult?.length || 0;
  };

  const itemsList = () => {
    if (isSwapOpen && !searchToken && walletPortfolio) {
      const tokensWithBalances =
        convertPortfolioAPIResponseToToken(walletPortfolio);
      return swapChain.chainId === 0
        ? tokensWithBalances
        : tokensWithBalances
            .filter(
              (tokens) =>
                chainNameToChainIdTokensData(tokens.blockchain) ===
                swapChain.chainId
            )
            .map((tokens) => tokens);
    }
    return searchTokenResult || [];
  };

  return (
    <>
      <div
        id="dropdown-token-list-exchange"
        className="fixed inset-0 bg-black_grey/[.9] -z-10"
        data-testid="dropdown-token-list"
      >
        <button
          type="button"
          onClick={() => {
            if (type === CardPosition.SWAP) {
              dispatch(setIsSwapOpen(false));
              dispatch(setSwapChain({ chainId: 0, chainName: 'all' }));
            } else {
              dispatch(setIsReceiveOpen(false));
              dispatch(setReceiveChain({ chainId: 0, chainName: 'all' }));
            }
            dispatch(setSearchTokenResult(undefined));
            dispatch(setSearchToken(undefined));
          }}
          className="fixed top-0 right-0 w-[50px] h-[50px] mt-6 mr-4 mb-20 desktop:mr-14 desktop:mb-28 bg-black"
          data-testid="close-card-button"
        >
          <img
            src={CloseIcon}
            alt="close-modal-button"
            className="w-full h-auto"
          />
        </button>
      </div>
      <div className="flex flex-col w-full max-w-[420px]">
        <div
          className={`flex flex-row gap-[10px] p-4 w-full rounded-t-[3px] border-b border-b-black_grey ${initialCardPosition === CardPosition.SWAP ? 'bg-light_green' : 'bg-purple'}`}
        >
          <SelectDropdown
            options={uniqueChains}
            isOpen={isChainSelectionOpen}
            onClick={() => setIsChainSelectionOpen(!isChainSelectionOpen)}
            className={`${isChainSelectionOpen && 'w-full'}`}
            onSelect={() => setIsChainSelectionOpen(false)}
          />
          <TokenSearchInput
            placeholder="Search name / contract"
            isShrinked={isChainSelectionOpen}
          />
        </div>
        <div
          id="token-list-exchange"
          className={`flex flex-col p-4 w-full rounded-b-[3px] max-h-[272px] mr-4 overflow-y-auto ${initialCardPosition === CardPosition.SWAP ? 'bg-light_green' : 'bg-purple'}`}
        >
          {(isTokenSearchErroring || walletPortfolioDataError) && (
            <Body className="text-base">
              Oops something went wrong! Please try searching for tokens again.
            </Body>
          )}
          {walletPortfolioData &&
            convertPortfolioAPIResponseToToken(walletPortfolioData.result.data)
              .length === 0 &&
            !isTokenSearchLoading &&
            isWalletPortfolioDataSuccess && (
              <Body className="text-base">No tokens found in your wallet.</Body>
            )}
          {!searchTokenResult && !isTokenSearchLoading && isReceiveOpen && (
            <Body className="text-base">Start searching for tokens.</Body>
          )}
          {(isTokenSearchLoading ||
            ((isWalletPortfolioDataLoading || isWalletPortfolioDataFetching) &&
              isSwapOpen)) && (
            <CircularProgress size={24} sx={{ color: '#312F3A' }} />
          )}
          <List
            height={272}
            itemCount={itemsListNumber()}
            itemSize={73}
            width="100%"
            itemData={{
              tokenList: isSwapOpen
                ? itemsList()?.filter(
                    (token) =>
                      token.blockchain !== receiveToken?.blockchain ||
                      token.contract !== receiveToken?.contract
                  )
                : itemsList()?.filter(
                    (token) =>
                      token.blockchain !== swapToken?.blockchain ||
                      token.contract !== swapToken?.contract
                  ),
              handleClick,
            }}
          >
            {TokenRow}
          </List>
        </div>
      </div>
    </>
  );
};

export default DropdownTokenList;
