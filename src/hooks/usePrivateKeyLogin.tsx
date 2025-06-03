import { useContext } from 'react';

// providers
import { PrivateKeyLoginContext } from '../providers/PrivateKeyLoginProvider';

const usePrivateKeyLogin = () => {
  const context = useContext(PrivateKeyLoginContext);

  if (context === null) {
    throw new Error('No parent <PrivateKeyLoginProvider />');
  }

  return context.data;
};

export default usePrivateKeyLogin;
