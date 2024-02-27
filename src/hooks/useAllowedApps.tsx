import { useContext } from 'react';

// providers
import { AllowedAppsContext } from '../providers/AllowedAppsProvider';

const useAllowedApps = () => {
  const context = useContext(AllowedAppsContext);

  if (context === null) {
    throw new Error('No parent <AllowedAppsProvider />');
  }

  return context.data;
};

export default useAllowedApps;
