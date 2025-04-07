/* eslint-disable react/jsx-no-constructed-context-values */
import axios from 'axios';
import React, { createContext, useEffect, useMemo } from 'react';

// utils
import { CompatibleChains, isTestnet } from '../utils/blockchain';

export interface AllowedAppsContextProps {
  data: {
    isLoading: boolean;
    allowed: string[];
    isAnimated: boolean;
    setIsAnimated: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

export const AllowedAppsContext = createContext<AllowedAppsContextProps | null>(
  null
);

interface ApiAllowedApp {
  appId: string;
}

const AllowedAppsProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isAnimated, setIsAnimated] = React.useState<boolean>(false);
  const [allowed, setAllowed] = React.useState<string[]>([]);

  useEffect(() => {
    let expired = false;

    (async () => {
      try {
        const chainIds = isTestnet
          ? [11155111]
          : CompatibleChains.map((chain) => chain.chainId);
        const chainIdsQuery = chainIds.map((id) => `chainIds=${id}`).join('&');

        const { data } = await axios.get(
          isTestnet
            ? 'https://apps-nubpgwxpiq-uc.a.run.app'
            : 'https://apps-7eu4izffpa-uc.a.run.app',
          {
            params: {
              testnets: String(isTestnet),
            },
            paramsSerializer: () =>
              `${chainIdsQuery}&testnets=${String(isTestnet)}`,
          }
        );
        if (expired || !data?.length) {
          setIsLoading(false);
          return;
        }
        setAllowed(data?.map((app: ApiAllowedApp) => app.appId));
      } catch (e) {
        console.warn('Error calling PillarX apps API', e);
      }
      setIsLoading(false);
    })();

    return () => {
      expired = true;
    };
  }, []);

  const contextData = useMemo(
    () => ({
      isLoading,
      allowed,
      isAnimated,
      setIsAnimated,
    }),
    [isLoading, allowed, isAnimated]
  );

  return (
    <AllowedAppsContext.Provider value={{ data: contextData }}>
      {children}
    </AllowedAppsContext.Provider>
  );
};

export default AllowedAppsProvider;
