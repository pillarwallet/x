import { useState, useMemo, useEffect } from 'react';
import { useWallets } from '@privy-io/react-auth';

// Styles
import './styles/tailwindKeyWallet.css';

// Hooks
import useTransactionKit from '../../hooks/useTransactionKit';

// Services
import { pillarXApiWalletPortfolio } from '../../services/pillarXApiWalletPortfolio';

// Components
import WalletAddress from './components/WalletAddress';
import AssetsList from './components/AssetsList';
import SendAssetModal from './components/SendAssetModal';
import TransactionStatus from './components/TransactionStatus';

// Utils
import { transformPortfolioToAssets, getTotalPortfolioValue } from './utils/portfolio';

// Types
import { Asset, TransactionStatus as TxStatus } from './types';

const { useGetWalletPortfolioQuery } = pillarXApiWalletPortfolio;

const App = () => {
  const { walletAddress } = useTransactionKit();
  const { wallets } = useWallets();

  // Get the EOA address (Privy wallet)
  const eoaAddress = wallets?.[0]?.address || '';
  
  // State
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [transactions, setTransactions] = useState<TxStatus[]>([]);
  const [walletProvider, setWalletProvider] = useState<any>(null);

  // Get Ethereum provider from Privy wallet
  useEffect(() => {
    const getProvider = async () => {
      if (wallets?.[0]) {
        try {
          const provider = await wallets[0].getEthereumProvider();
          setWalletProvider(provider);
        } catch (error) {
          console.error('Failed to get Ethereum provider:', error);
        }
      }
    };
    getProvider();
  }, [wallets]);

  // Fetch portfolio data for the EOA address
  const {
    data: portfolioResponse,
    isLoading: isPortfolioLoading,
    isFetching: isPortfolioFetching,
    refetch: refetchPortfolio,
  } = useGetWalletPortfolioQuery(
    { wallet: eoaAddress, isPnl: false },
    { skip: !eoaAddress }
  );

  const portfolioData = portfolioResponse?.result?.data;

  // Transform portfolio data to assets
  const assets = useMemo(
    () => transformPortfolioToAssets(portfolioData),
    [portfolioData]
  );

  const totalValue = useMemo(() => getTotalPortfolioValue(assets), [assets]);

  const isLoading = isPortfolioLoading || isPortfolioFetching;

  // Handle asset click - open send modal
  const handleAssetClick = (asset: Asset) => {
    setSelectedAsset(asset);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setSelectedAsset(null);
  };

  // Handle successful transaction
  const handleTransactionSuccess = (txHash: string, chainId: number) => {
    const newTransaction: TxStatus = {
      hash: txHash,
      chainId,
      status: 'pending',
      timestamp: Date.now(),
    };

    setTransactions((prev) => [newTransaction, ...prev]);

    // Refetch portfolio after a delay to show updated balance
    setTimeout(() => {
      refetchPortfolio();
    }, 3000);

    // Update transaction status after some time (simulated)
    setTimeout(() => {
      setTransactions((prev) =>
        prev.map((tx) =>
          tx.hash === txHash ? { ...tx, status: 'success' as const } : tx
        )
      );
    }, 10000);
  };

  // Handle clear transaction
  const handleClearTransaction = (hash: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.hash !== hash));
  };

  // Show loading state if no EOA address
  if (!eoaAddress) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <div className="w-16 h-16 border-4 border-purple_medium border-t-transparent rounded-full animate-spin mb-6" />
        <div className="text-4xl mb-4">🔑</div>
        <h2 className="text-2xl font-bold text-white mb-2">Key Wallet</h2>
        <p className="text-white/60 text-center">
          Connecting to your wallet...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 min-h-screen mb-[100px]">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-white">Key Wallet</h1>
          <span className="text-2xl">🔑</span>
          {isPortfolioFetching && !isPortfolioLoading && (
            <div className="w-5 h-5 border-2 border-purple_medium border-t-transparent rounded-full animate-spin" />
          )}
        </div>
        <p className="text-white/60">
          Manage and send assets from your Key Wallet (EOA)
        </p>
      </div>

      {/* Wallet Address */}
      <WalletAddress address={eoaAddress} />

      {/* Transaction Status */}
      <TransactionStatus
        transactions={transactions}
        onClear={handleClearTransaction}
      />

      {/* Assets List */}
      <AssetsList
        assets={assets}
        totalValue={totalValue}
        isLoading={isLoading}
        onAssetClick={handleAssetClick}
      />

      {/* Send Asset Modal */}
      {selectedAsset && (
        <SendAssetModal
          asset={selectedAsset}
          walletProvider={walletProvider}
          onClose={handleCloseModal}
          onSuccess={handleTransactionSuccess}
        />
      )}

      {/* Refresh Button */}
      {!isLoading && assets.length > 0 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => refetchPortfolio()}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white font-medium transition-colors flex items-center gap-2"
            type="button"
          >
            <span>↻</span>
            <span>Refresh Balances</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;

