import { Token } from '@etherspot/data-utils/dist/cjs/sdk/data/classes/token';
import { useWalletAddress } from '@etherspot/transaction-kit';
import { useState } from 'react';

// api
import { useRecordPresenceMutation } from '../../../../services/pillarXApiPresence';

// reducer
import {
  setIsReceiveOpen,
  setIsSwapOpen,
  setReceiveChain,
  setReceiveToken,
  setSearchTokenResult,
  setSwapChain,
  setSwapToken,
} from '../../reducer/theExchangeSlice';

// hooks
import { useAppDispatch, useAppSelector } from '../../hooks/useReducerHooks';

// types
import { CardPosition, ChainType } from '../../utils/types';

// utils
import { convertChainIdtoName } from '../../../../utils/blockchain';

// components
import SelectDropdown from '../SelectDropdown/SelectDropdown';
import TokenListItem from '../TokenListItem/TokenListItem';
import TokenSearchInput from '../TokenSearchInput/TokenSearchInput';

// images
import CloseIcon from '../../images/add.png';

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
  const swapTokenData = useAppSelector(
    (state) => state.swap.swapTokenData as Token[]
  );
  const receiveTokenData = useAppSelector(
    (state) => state.swap.receiveTokenData as Token[]
  );
  const searchTokenResult = useAppSelector(
    (state) => state.swap.searchTokenResult as Token[]
  );
  const swapChain = useAppSelector(
    (state) => state.swap.swapChain as ChainType
  );
  const receiveChain = useAppSelector(
    (state) => state.swap.receiveChain as ChainType
  );
  const swapToken = useAppSelector((state) => state.swap.swapToken as Token);
  const receiveToken = useAppSelector(
    (state) => state.swap.receiveToken as Token
  );

  const [isChainSelectionOpen, setIsChainSelectionOpen] =
    useState<boolean>(false);

  // select all chainsId of tokens available in the list for swap token
  const allChainsSwap = swapTokenData?.map((chain) => chain.chainId);
  const uniqueChainsSwap = allChainsSwap.filter((chain, index) => {
    return allChainsSwap.indexOf(chain) === index;
  });

  // select all chainsId of tokens available in the list for receive token
  const allChainsReceive = receiveTokenData?.map((chain) => chain.chainId);
  const uniqueChainsReceive = allChainsReceive.filter((chain, index) => {
    return allChainsReceive.indexOf(chain) === index;
  });

  // if there are no tokens being typed searched, we show the swapTokenData list of tokens
  // which will filter if a chain has been chosen
  let swapTokenList;

  if (searchTokenResult?.length) {
    swapTokenList = searchTokenResult;
  } else if (swapChain?.chainId) {
    swapTokenList = swapTokenData.filter(
      (token) => token.chainId === swapChain.chainId
    );
  } else {
    swapTokenList = swapTokenData;
  }

  // if there are no tokens being typed searched, we show the receiveTokenData list of tokens
  // which will filter if a chain has been chosen
  let receiveTokenList;

  if (searchTokenResult?.length) {
    receiveTokenList = searchTokenResult;
  } else if (receiveChain?.chainId) {
    receiveTokenList = receiveTokenData.filter(
      (token) => token.chainId === receiveChain.chainId
    );
  } else {
    receiveTokenList = receiveTokenData;
  }

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
            } else {
              dispatch(setIsReceiveOpen(false));
            }
            dispatch(setSearchTokenResult([]));
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
            options={isSwapOpen ? uniqueChainsSwap : uniqueChainsReceive}
            isOpen={isChainSelectionOpen}
            onClick={() => setIsChainSelectionOpen(!isChainSelectionOpen)}
            className={`${isChainSelectionOpen && 'w-full'}`}
            onSelect={() => setIsChainSelectionOpen(false)}
          />
          <TokenSearchInput
            placeholder="Search tokens"
            isShrinked={isChainSelectionOpen}
          />
        </div>
        <div
          id="token-list-exchange"
          className={`flex flex-col p-4 w-full rounded-b-[3px] max-h-[272px] mr-4 overflow-y-auto ${initialCardPosition === CardPosition.SWAP ? 'bg-light_green' : 'bg-purple'}`}
        >
          {isSwapOpen
            ? swapTokenList
                .filter(
                  (token) =>
                    token.chainId !== receiveToken?.chainId ||
                    token.address !== receiveToken?.address
                )
                .map((token, index) => (
                  <TokenListItem
                    key={index}
                    testId={`token-list-item-exchange-send-${token.chainId}-${token.name}`}
                    onClick={() => {
                      dispatch(setSwapToken(token));
                      dispatch(
                        setSwapChain({
                          chainId: token.chainId,
                          chainName: convertChainIdtoName(token.chainId),
                        })
                      );
                      recordPresence({
                        address: accountAddress,
                        action: 'app:theExchange:sourceTokenSelect',
                        value: {
                          chainId: token.chainId,
                          address: token.address,
                          symbol: token.symbol,
                          name: token.name,
                        },
                      });
                      dispatch(setSearchTokenResult([]));
                      dispatch(setIsSwapOpen(false));
                    }}
                    tokenName={token.name}
                    tokenSymbol={token.symbol}
                    chainName={convertChainIdtoName(token.chainId)}
                    tokenLogo={token.icon}
                  />
                ))
            : receiveTokenList
                .filter(
                  (token) =>
                    token.chainId !== swapToken?.chainId ||
                    token.address !== swapToken?.address
                )
                .map((token, index) => (
                  <TokenListItem
                    key={index}
                    testId={`token-list-item-exchange-receive-${token.chainId}-${token.name}`}
                    onClick={() => {
                      dispatch(setReceiveToken(token));
                      dispatch(
                        setReceiveChain({
                          chainId: token.chainId,
                          chainName: convertChainIdtoName(token.chainId),
                        })
                      );
                      recordPresence({
                        address: accountAddress,
                        action: 'app:theExchange:destinationTokenSelect',
                        value: {
                          chainId: token.chainId,
                          address: token.address,
                          symbol: token.symbol,
                          name: token.name,
                        },
                      });
                      dispatch(setSearchTokenResult([]));
                      dispatch(setIsReceiveOpen(false));
                    }}
                    tokenName={token.name}
                    tokenSymbol={token.symbol}
                    chainName={convertChainIdtoName(token.chainId)}
                    tokenLogo={token.icon}
                  />
                ))}
        </div>
      </div>
    </>
  );
};

export default DropdownTokenList;
