import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { isAddress } from 'viem';
import Search from './Search';
import HomeScreen from './HomeScreen';
import { SelectedToken } from '../types/tokens';

export default function AppWrapper() {
  const [searching, setSearching] = useState(false);
  const [isBuy, setIsBuy] = useState(true);
  const [buyToken, setBuyToken] = useState<SelectedToken | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sellToken, setSellToken] = useState<SelectedToken | null>(null);

  const useQuery = () => {
    const { search } = useLocation();
    return new URLSearchParams(search);
  };

  const query = useQuery();

  useEffect(() => {
    const tokenAddress = query.get('asset');

    if (isAddress(tokenAddress || '')) {
      setSearching(true);
    }
  }, [setSearching, query]);

  return searching ? (
    <Search
      setSearching={setSearching}
      isBuy={isBuy}
      setBuyToken={setBuyToken}
      setSellToken={setSellToken}
    />
  ) : (
    <HomeScreen
      setSearching={setSearching}
      buyToken={buyToken}
      isBuy={isBuy}
      setIsBuy={setIsBuy}
    />
  );
}
