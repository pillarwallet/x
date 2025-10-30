/* eslint-disable react/jsx-no-constructed-context-values */
import React, { createContext } from 'react';

// types
import { EIP7702Info } from '../hooks/useWalletModeVerification';

interface EIP7702ContextType {
  eip7702Info: EIP7702Info;
}

export const EIP7702Context = createContext<EIP7702ContextType | null>(null);

interface EIP7702ProviderProps {
  eip7702Info: EIP7702Info;
  children: React.ReactNode;
}

export const EIP7702Provider: React.FC<EIP7702ProviderProps> = ({
  eip7702Info,
  children,
}) => {
  return (
    <EIP7702Context.Provider value={{ eip7702Info }}>
      {children}
    </EIP7702Context.Provider>
  );
};
