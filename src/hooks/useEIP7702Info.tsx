import { useContext } from 'react';

// provider
import { EIP7702Context } from '../providers/EIP7702Provider';

export const useEIP7702Info = () => {
  const context = useContext(EIP7702Context);
  if (context === null) {
    throw new Error('No parent <EIP7702Provider />');
  }
  return context.eip7702Info;
};
