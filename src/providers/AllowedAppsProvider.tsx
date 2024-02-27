import React, { createContext, useEffect, useMemo } from 'react';
import axios from 'axios';

export interface AllowedAppsContext {
  data: {
    isLoading: boolean;
    allowed: string[];
  }
}

export const AllowedAppsContext = createContext<AllowedAppsContext | null>(null);

interface ApiAllowedApp {
  id: string;
}

const AllowedAppsProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [allowed, setAllowed] = React.useState<string[]>([]);

  useEffect(() => {
    let expired = false;

    (async () => {
      try {
        const { data } = await axios.get(process.env.REACT_APP_PILLARX_APPS_SERVICE_HOST as string);
        if (expired || !data?.apps?.length) return;
        setAllowed(data.apps.map((app: ApiAllowedApp) => app.id));
      } catch (e) {
        console.warn('Error calling PillarX apps API', e);
      }
      setIsLoading(false);
    })();

    return () => {
      expired = true;
    };
  }, []);

  const contextData = useMemo(() => ({
    isLoading,
    allowed,
  }), [
    isLoading,
    allowed,
  ]);

  return (
    <AllowedAppsContext.Provider value={{ data: contextData }}>
      {children}
    </AllowedAppsContext.Provider>
  );
}

export default AllowedAppsProvider;
