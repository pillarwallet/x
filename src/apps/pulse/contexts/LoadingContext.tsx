/* eslint-disable react/jsx-no-constructed-context-values */
import { ReactNode, createContext, useContext, useState } from 'react';

interface LoadingContextType {
  isQuoteLoading: boolean;
  setQuoteLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);

  const setQuoteLoading = (loading: boolean) => {
    setIsQuoteLoading(loading);
  };

  return (
    <LoadingContext.Provider
      value={{
        isQuoteLoading,
        setQuoteLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
