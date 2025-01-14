import { useContext } from 'react';
import { SelectedChainsHistoryContext } from '../providers/SelectedChainsHistoryProvider';

export const useSelectedChains = () => {
  const context = useContext(SelectedChainsHistoryContext);

  if (context === null) {
    throw new Error('No parent <SelectedChainsProvider />');
  }
  return context.data;
};
