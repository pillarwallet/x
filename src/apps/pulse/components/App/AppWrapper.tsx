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
    isFetching: walletPortfolioFetching,
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
    const from = query.get('from');

    // If coming from token-atlas, don't show search modal - let Buy component handle everything
    if (from === 'token-atlas' && tokenAddress) {
      // Do nothing - Buy component will handle the search and chain filter
    } else if (tokenAddress) {
      // Only show search for valid addresses or symbols (not empty/invalid)
      const isValidAddress = isAddress(tokenAddress);
      const isValidSymbol =
        /^[A-Za-z0-9]+$/.test(tokenAddress) &&
        tokenAddress.length > 0 &&
        tokenAddress.length <= 10;

      if (isValidAddress || isValidSymbol) {
        setSearching(true);
      }
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
      walletPortfolioFetching={walletPortfolioFetching}
      walletPortfolioError={!!walletPortfolioError}
      refetchWalletPortfolio={refetchWalletPortfolio}
    />
  ) : (
    <HomeScreen
      setSearching={setSearching}
      buyToken={buyToken}
      sellToken={sellToken}
      isBuy={isBuy}
      setIsBuy={setIsBuy}
      refetchWalletPortfolio={refetchWalletPortfolio}
      setBuyToken={setBuyToken}
      setChains={setChains}
    />
  );
}
