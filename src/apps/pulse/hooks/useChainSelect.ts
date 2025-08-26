import { useState } from 'react';
import { MobulaChainNames } from '../utils/constants';

export default function useChainSelect() {
  const [chains, setChains] = useState<MobulaChainNames>(MobulaChainNames.All);

  return {
    chains,
    setChains,
  };
}
