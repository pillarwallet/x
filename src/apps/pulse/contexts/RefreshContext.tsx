/* eslint-disable react/jsx-no-constructed-context-values */
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

interface RefreshContextType {
  isRefreshing: boolean;
  refreshSell: () => void;
  refreshPreviewSell: () => void;
  setRefreshSellCallback: (callback: () => void) => void;
  setRefreshPreviewSellCallback: (callback: () => void) => void;
}

const RefreshContext = createContext<RefreshContextType | undefined>(undefined);

interface RefreshProviderProps {
  children: ReactNode;
}

export function RefreshProvider({ children }: RefreshProviderProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshSellCallback, setRefreshSellCallback] = useState<
    (() => void) | null
  >(null);
  const [refreshPreviewSellCallback, setRefreshPreviewSellCallback] = useState<
    (() => void) | null
  >(null);

  const executeRefresh = useCallback(async (callback: (() => void) | null) => {
    if (!callback) return;

    setIsRefreshing(true);
    try {
      await callback();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const refreshSell = useCallback(() => {
    executeRefresh(refreshSellCallback);
  }, [executeRefresh, refreshSellCallback]);

  const refreshPreviewSell = useCallback(() => {
    executeRefresh(refreshPreviewSellCallback);
  }, [executeRefresh, refreshPreviewSellCallback]);

  return (
    <RefreshContext.Provider
      value={{
        isRefreshing,
        refreshSell,
        refreshPreviewSell,
        setRefreshSellCallback,
        setRefreshPreviewSellCallback,
      }}
    >
      {children}
    </RefreshContext.Provider>
  );
}

export function useRefresh() {
  const context = useContext(RefreshContext);
  if (context === undefined) {
    throw new Error('useRefresh must be used within a RefreshProvider');
  }
  return context;
}
