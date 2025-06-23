import { useContext } from 'react';

// providers
import { AssetsContext } from '../providers/AssetsProvider';

const useAssets = () => {
  const context = useContext(AssetsContext);

  if (context === null) {
    throw new Error('No parent <AssetsProvider />');
  }

  return context.data.assets;
};

export default useAssets;
