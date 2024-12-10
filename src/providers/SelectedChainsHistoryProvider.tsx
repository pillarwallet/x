/* eslint-disable react/jsx-no-constructed-context-values */
import { ReactNode, createContext, useMemo, useState } from 'react';

type SelectedChainsHistoryContextType = {
  data: {
    selectedChains: number[];
    setSelectedChains: React.Dispatch<React.SetStateAction<number[]>>;
  };
};

export const SelectedChainsHistoryContext =
  createContext<SelectedChainsHistoryContextType | null>(null);

const SelectedChainsHistoryProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [selectedChains, setSelectedChains] = useState<number[]>([]);

  const contextData = useMemo(
    () => ({
      selectedChains,
      setSelectedChains,
    }),
    [selectedChains]
  );

  return (
    <SelectedChainsHistoryContext.Provider value={{ data: contextData }}>
      {children}
    </SelectedChainsHistoryContext.Provider>
  );
};

export default SelectedChainsHistoryProvider;
