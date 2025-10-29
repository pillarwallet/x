/* eslint-disable react/jsx-no-constructed-context-values */
import axios from 'axios';
import React, { createContext, useEffect, useMemo } from 'react';
import { usePrivy } from '@privy-io/react-auth';

// utils
import { CompatibleChains, isTestnet } from '../utils/blockchain';

export interface AllowedAppsContextProps {
  data: {
    isLoading: boolean;
    allowed: ApiAllowedApp[];
    isAnimated: boolean;
    setIsAnimated: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

export const AllowedAppsContext = createContext<AllowedAppsContextProps | null>(
  null
);

export interface ApiAllowedApp {
  id: string;
  type?: string; // e.g. "app" | "app-external"
  appId: string;
  title?: string;
  name?: string;
  shortDescription?: string | null;
  longDescription?: string | null;
  tags?: string;
  logo?: string;
  banner?: string;
  supportEmail?: string;
  launchUrl?: string;
  socialTelegram?: string;
  socialX?: string;
  socialFacebook?: string;
  socialTiktok?: string;
  ownerEoaAddress?: string;
  createdAt?: number;
  updatedAt?: number;
}

const AllowedAppsProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isAnimated, setIsAnimated] = React.useState<boolean>(false);
  const [allowed, setAllowed] = React.useState<ApiAllowedApp[]>([]);
  const { user } = usePrivy();

  useEffect(() => {
    let expired = false;

    (async () => {
      try {
        const chainIds = isTestnet
          ? [11155111]
          : CompatibleChains.map((chain) => chain.chainId);
        const chainIdsQuery = chainIds.map((id) => `chainIds=${id}`).join('&');

        // Get EOA address from user
        const eoaAddress = user?.wallet?.address;

        // Build query parameters
        const queryParams = new URLSearchParams();
        queryParams.append('testnets', String(isTestnet));
        if (eoaAddress) {
          queryParams.append('eoaAddress', eoaAddress);
        }

        const finalQueryString = `${chainIdsQuery}&${queryParams.toString()}`;

        const { data } = await axios.get(
          isTestnet
            ? 'http://localhost:5000/pillarx-staging/us-central1/apps'
            : 'https://apps-7eu4izffpa-uc.a.run.app',
          {
            params: {
              testnets: String(isTestnet),
              ...(eoaAddress && { eoaAddress }),
            },
            paramsSerializer: () => finalQueryString,
          }
        );
        if (expired || !data?.length) {
          setIsLoading(false);
          return;
        }
        setAllowed(data?.map((app: ApiAllowedApp) => app));
      } catch (e) {
        console.warn('Error calling PillarX apps API', e);
      }
      setIsLoading(false);
    })();

    return () => {
      expired = true;
    };
  }, [user?.wallet?.address]);

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
