import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { isAddress } from 'viem';
import Search from '../Search/Search';
import HomeScreen from './HomeScreen';
import { SelectedToken } from '../../types/tokens';
import { MobulaChainNames } from '../../utils/constants';
import { useGetWalletPortfolioQuery } from '../../../../services/pillarXApiWalletPortfolio';
import useTransactionKit from '../../../../hooks/useTransactionKit';

export default function AppWrapper() {
  const [searching, setSearching] = useState(false);
  const [isBuy, setIsBuy] = useState(true);
  const [chains, setChains] = useState<MobulaChainNames>(MobulaChainNames.All);
  const [buyToken, setBuyToken] = useState<SelectedToken | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sellToken, setSellToken] = useState<SelectedToken | null>(null);

  const { walletAddress: accountAddress } = useTransactionKit();

  const {
    data: walletPortfolioData,
    isLoading: walletPortfolioLoading,
    error: walletPortfolioError,
  } = useGetWalletPortfolioQuery(
    { wallet: accountAddress || '', isPnl: false },
    { skip: !accountAddress }
  );

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
      chains={chains}
      setChains={setChains}
      walletPortfolioData={walletPortfolioData?.result?.data}
      walletPortfolioLoading={walletPortfolioLoading}
      walletPortfolioError={!!walletPortfolioError}
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
