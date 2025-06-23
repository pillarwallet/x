/* eslint-disable no-restricted-syntax */
/* eslint-disable react/jsx-no-constructed-context-values */
import { Nft } from '@etherspot/data-utils/dist/cjs/sdk/data/classes/nft';
import { NftCollection } from '@etherspot/data-utils/dist/cjs/sdk/data/classes/nft-collection';
import { useEtherspotNfts, useWalletAddress } from '@etherspot/transaction-kit';
import differenceWith from 'lodash/differenceWith';
import isEqual from 'lodash/isEqual';
import React, {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

// utils
import { visibleChains } from '../utils/blockchain';

// services
import {
  getJsonItem,
  setJsonItem,
  storageKey,
} from '../services/dappLocalStorage';

export interface INfts {
  [chainId: number]: {
    [walletAddress: string]: NftCollection[];
  };
}

export interface AccountNftsContextProps {
  listenerRef: React.MutableRefObject<AccountNftsListenerRef>;
  data: {
    nfts: INfts;
    updateData: boolean;
    setUpdateData: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

export interface AccountNftsListenerRef {
  onNftReceived?: (chainId: number, walletAddress: string, nft: Nft) => void;
  onNftSent?: (chainId: number, walletAddress: string, nft: Nft) => void;
  prevNfts?: INfts;
}

export const AccountNftsContext = createContext<AccountNftsContextProps | null>(
  null
);

const AccountNftsProvider = ({ children }: React.PropsWithChildren) => {
  const { getAccountNfts } = useEtherspotNfts();
  const walletAddress = useWalletAddress();
  const [nfts, setNfts] = React.useState<INfts>(
    getJsonItem(storageKey.nfts) ?? {}
  );
  const listenerRef = useRef<AccountNftsListenerRef>({});
  const [updateData, setUpdateData] = useState<boolean>(false);

  useEffect(() => {
    let expired = false;
    let timeout: NodeJS.Timeout;

    const refresh = async () => {
      if (!walletAddress || !updateData) return;

      const chainIds = visibleChains.map((chain) => chain.id);

      // sequential to avoid throttling
      for (const chainId of chainIds) {
        if (expired) return;

        // eslint-disable-next-line no-await-in-loop
        const accountNfts = await getAccountNfts(walletAddress, chainId);
        if (expired) return;

        // update each chain ID separately for faster updates
        setNfts((current) => {
          // deep compare per chainId and walletAddress
          return !accountNfts?.length ||
            isEqual(current?.[chainId]?.[walletAddress], accountNfts)
            ? current
            : {
                ...current,
                [chainId]: {
                  ...(current[chainId] ?? {}),
                  [walletAddress]: accountNfts,
                },
              };
        });
      }

      if (expired) return;

      timeout = setTimeout(refresh, 60000); // ~60s
    };

    refresh();

    return () => {
      expired = true;
      if (timeout) clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress, updateData]);

  useEffect(() => {
    setJsonItem(storageKey.nfts, nfts);
  }, [nfts]);

  useEffect(() => {
    if (!Object.keys(nfts).length) return; // nothing added yet

    // only store for the initial run
    if (!Object.keys(listenerRef.current?.prevNfts ?? {}).length) {
      listenerRef.current.prevNfts = nfts;
      return;
    }

    if (listenerRef.current?.onNftReceived || listenerRef.current?.onNftSent) {
      Object.keys(nfts).forEach((chainId) => {
        Object.keys(nfts[+chainId] ?? {}).forEach((address) => {
          const collections = (nfts[+chainId][address] ??
            []) as NftCollection[];
          collections.forEach((collection) => {
            const prevCollection = listenerRef.current.prevNfts?.[+chainId]?.[
              address
            ]?.find(
              (prevCol) =>
                prevCol.contractAddress === collection.contractAddress
            );

            const receivedNfts = differenceWith(
              collection?.items ?? [],
              prevCollection?.items ?? [],
              isEqual
            );

            receivedNfts.forEach((nft) => {
              if (!listenerRef.current.onNftReceived) return;
              listenerRef.current.onNftReceived(+chainId, address, nft);
            });

            const sentNfts = differenceWith(
              prevCollection?.items ?? [],
              collection?.items ?? [],
              isEqual
            );

            sentNfts.forEach((nft) => {
              if (!listenerRef.current.onNftSent) return;
              listenerRef.current.onNftSent(+chainId, address, nft);
            });
          });
        });
      });
    }

    listenerRef.current.prevNfts = nfts;
  }, [nfts, listenerRef]);

  const contextData = useMemo(
    () => ({
      nfts,
      updateData,
      setUpdateData,
    }),
    [nfts, updateData]
  );

  return (
    <AccountNftsContext.Provider value={{ listenerRef, data: contextData }}>
      {children}
    </AccountNftsContext.Provider>
  );
};

export default AccountNftsProvider;
