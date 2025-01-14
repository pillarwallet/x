/* eslint-disable react/jsx-no-constructed-context-values */
import axios from 'axios';
import React, { createContext, useEffect, useMemo } from 'react';

// utils
import { CompatibleChains } from '../utils/blockchain';

export interface AllowedAppsContextProps {
  data: {
    isLoading: boolean;
    allowed: string[];
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
  const [allowed, setAllowed] = React.useState<string[]>([]);

  useEffect(() => {
    let expired = false;

    (async () => {
      try {
        const chainIds =
          process.env.REACT_APP_USE_TESTNETS === 'true'
            ? [11155111]
            : CompatibleChains.map((chain) => chain.chainId);
        const chainIdsQuery = chainIds.map((id) => `chainIds=${id}`).join('&');

        const { data } = await axios.get(
          process.env.REACT_APP_USE_TESTNETS === 'true'
            ? 'https://apps-nubpgwxpiq-uc.a.run.app'
            : 'https://apps-7eu4izffpa-uc.a.run.app',
          {
            params: {
              testnets: process.env.REACT_APP_USE_TESTNETS || 'true',
            },
            paramsSerializer: () => `${chainIdsQuery}`,
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
    }),
    [isLoading, allowed]
  );

  return (
    <AllowedAppsContext.Provider value={{ data: contextData }}>
      {children}
    </AllowedAppsContext.Provider>
  );
};

export default AllowedAppsProvider;
