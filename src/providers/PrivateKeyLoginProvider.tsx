/* eslint-disable react/jsx-no-constructed-context-values */
import { ReactNode, createContext, useMemo, useState } from 'react';

interface PrivateKeyLoginContextData {
  data: {
    account: string | undefined;
    setAccount: React.Dispatch<React.SetStateAction<string | undefined>>;
  };
}

export const PrivateKeyLoginContext =
  createContext<PrivateKeyLoginContextData | null>(null);

export const PrivateKeyLoginProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [account, setAccount] = useState<string | undefined>(
    () => localStorage.getItem('ACCOUNT_VIA_PK') || undefined
  );

  const contextValue = useMemo(
    () => ({
      account,
      setAccount,
    }),
    [account]
  );

  return (
    <PrivateKeyLoginContext.Provider value={{ data: contextValue }}>
      {children}
    </PrivateKeyLoginContext.Provider>
  );
};
