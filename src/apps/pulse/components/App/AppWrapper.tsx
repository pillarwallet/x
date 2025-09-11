import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { isAddress } from 'viem';
import useTransactionKit from '../../../../hooks/useTransactionKit';
import { useGetWalletPortfolioQuery } from '../../../../services/pillarXApiWalletPortfolio';
import { SelectedToken } from '../../types/tokens';
import { MobulaChainNames } from '../../utils/constants';
import Search from '../Search/Search';
import HomeScreen from './HomeScreen';

export default function AppWrapper() {
  const [searching, setSearching] = useState(false);
  const [isBuy, setIsBuy] = useState(true);
  const [chains, setChains] = useState<MobulaChainNames>(MobulaChainNames.All);
  const [buyToken, setBuyToken] = useState<SelectedToken | null>(null);
  const [sellToken, setSellToken] = useState<SelectedToken | null>(null);

  const { walletAddress: accountAddress } = useTransactionKit();

  const {
    data: walletPortfolioData,
    isLoading: walletPortfolioLoading,
    error: walletPortfolioError,
    refetch: refetchWalletPortfolio,
  } = useGetWalletPortfolioQuery(
    { wallet: accountAddress || '', isPnl: false },
    {
      skip: !accountAddress,
      refetchOnFocus: false,
    }
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
      sellToken={sellToken}
      isBuy={isBuy}
      setIsBuy={setIsBuy}
      refetchWalletPortfolio={refetchWalletPortfolio}
    />
  );
}
