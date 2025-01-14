/* eslint-disable no-restricted-syntax */
/* eslint-disable react/jsx-no-constructed-context-values */
import { AccountBalance } from '@etherspot/prime-sdk/dist/sdk/data';
import {
  useEtherspotBalances,
  useWalletAddress,
} from '@etherspot/transaction-kit';
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

export interface IBalances {
  [chainId: number]: {
    [walletAddress: string]: AccountBalance[];
  };
}

export interface AccountBalancesContextProps {
  listenerRef: React.MutableRefObject<AccountBalancesListenerRef>;
  data: {
    balances: IBalances;
    updateData: boolean;
    setUpdateData: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

export interface AccountBalancesListenerRef {
  onBalanceUpdated?: (newBalances: IBalances, prevBalances: IBalances) => void;
  prevBalances?: IBalances;
}

export const AccountBalancesContext =
  createContext<AccountBalancesContextProps | null>(null);

const AccountBalancesProvider = ({ children }: React.PropsWithChildren) => {
  const { getAccountBalances } = useEtherspotBalances();
  const walletAddress = useWalletAddress();
  const [balances, setBalances] = React.useState<IBalances>(
    getJsonItem(storageKey.balances) ?? {}
  );
  const listenerRef = useRef<AccountBalancesListenerRef>({});
  const [updateData, setUpdateData] = useState<boolean>(false);

  useEffect(() => {
    let expired = false;
    let timeout: NodeJS.Timeout;

    const refresh = async () => {
      if (!walletAddress || !updateData) return;

      const chainIds = visibleChains.map((chain) => chain.id);

      // sequential to avoid throttling
      for (const chainId of chainIds) {
        // eslint-disable-next-line no-await-in-loop
        const accountBalances = await getAccountBalances(
          walletAddress,
          chainId
        );

        // update each chain ID separately for faster updates
        setBalances((current) => {
          // deep compare per chainId and walletAddress
          return !accountBalances?.length ||
            isEqual(current?.[chainId]?.[walletAddress], accountBalances)
            ? current
            : {
                ...current,
                [chainId]: {
                  ...(current[chainId] ?? {}),
                  [walletAddress]: accountBalances,
                },
              };
        });
      }

      if (expired) return;

      timeout = setTimeout(refresh, 30000); // ~30s
    };

    refresh();

    return () => {
      expired = true;
      if (timeout) clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress, updateData]);

  useEffect(() => {
    setJsonItem(storageKey.balances, balances);
  }, [balances]);

  useEffect(() => {
    if (!Object.keys(balances).length) return; // nothing added yet

    if (listenerRef.current?.onBalanceUpdated) {
      listenerRef.current.onBalanceUpdated(
        balances,
        listenerRef.current.prevBalances ?? {}
      );
    }

    listenerRef.current.prevBalances = balances;
  }, [balances, listenerRef]);

  const contextData = useMemo(
    () => ({
      balances,
      updateData,
      setUpdateData,
    }),
    [balances, updateData]
  );

  return (
    <AccountBalancesContext.Provider value={{ listenerRef, data: contextData }}>
      {children}
    </AccountBalancesContext.Provider>
  );
};

export default AccountBalancesProvider;
