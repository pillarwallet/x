import { useState, useEffect } from 'react';
import { Asset } from '../types';
import {
  formatBalance,
  formatUsdValue,
  sendTransaction,
  switchChain,
  getCurrentChainId,
  getChainById,
} from '../utils/blockchain';
import defaultLogo from '../images/logo-unknown.png';

interface SendAssetModalProps {
  asset: Asset | null;
  walletProvider: any;
  onClose: () => void;
  onSuccess: (txHash: string, chainId: number) => void;
}

const SendAssetModal = ({
  asset,
  walletProvider,
  onClose,
  onSuccess,
}: SendAssetModalProps) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentChainId, setCurrentChainId] = useState<number | null>(null);

  // Get current chain when modal opens
  useEffect(() => {
    const checkChain = async () => {
      if (walletProvider) {
        const chainId = await getCurrentChainId(walletProvider);
        setCurrentChainId(chainId);
      }
    };
    checkChain();
  }, [walletProvider]);

  // Reset form when asset changes
  useEffect(() => {
    setRecipient('');
    setAmount('');
    setError('');
  }, [asset]);

  if (!asset) return null;

  const isWrongChain = currentChainId !== null && currentChainId !== asset.chainId;
  const targetChain = getChainById(asset.chainId);

  const handleMaxClick = () => {
    setAmount(asset.balance.toString());
  };

  const validateForm = (): boolean => {
    setError('');

    if (!recipient || recipient.trim() === '') {
      setError('Please enter a recipient address');
      return false;
    }

    if (!recipient.match(/^0x[a-fA-F0-9]{40}$/)) {
      setError('Invalid Ethereum address');
      return false;
    }

    if (!amount || amount.trim() === '' || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      return false;
    }

    if (Number(amount) > asset.balance) {
      setError('Insufficient balance');
      return false;
    }

    return true;
  };

  const handleSend = async () => {
    if (!validateForm()) return;

    if (!walletProvider) {
      setError('Wallet provider not ready. Please try again.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Check current chain
      const currentChainId = await getCurrentChainId(walletProvider);
      const targetChain = getChainById(asset.chainId);

      // If on wrong chain, request to switch
      if (currentChainId !== asset.chainId) {
        setError(
          `Switching to ${targetChain.name}... Please approve in your wallet.`
        );
        
        try {
          await switchChain(asset.chainId, walletProvider);
          setError(''); // Clear the switching message
        } catch (switchError) {
          console.error('Chain switch error:', switchError);
          setError(
            switchError instanceof Error
              ? switchError.message
              : `Please switch to ${targetChain.name} in your wallet and try again.`
          );
          setIsLoading(false);
          return;
        }
      }

      // Send transaction
      const txHash = await sendTransaction(
        asset,
        recipient,
        amount,
        walletProvider
      );

      onSuccess(txHash, asset.chainId);
      onClose();
    } catch (err) {
      console.error('Transaction error:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to send transaction'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const estimatedValue = Number(amount) * asset.price;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-gradient-to-b from-[#1a1a2e] to-[#16213e] rounded-2xl shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">Send Asset</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors text-2xl"
            type="button"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Asset Info */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-4">
              <img
                src={asset.logo || defaultLogo}
                alt={asset.symbol || 'token'}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = defaultLogo;
                }}
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">
                  {asset.symbol || '(no symbol)'}
                </h3>
                <p className="text-sm text-white/60">{asset.chainName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/60">Balance</p>
                <p className="text-base font-semibold text-white">
                  {formatBalance(asset.balance)}
                </p>
              </div>
            </div>
          </div>

          {/* Chain Warning */}
          {isWrongChain && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
              <div className="flex items-start gap-2">
                <span className="text-yellow-400 text-lg">⚠️</span>
                <div className="flex-1">
                  <p className="text-sm text-yellow-400 font-medium">
                    Wrong Network
                  </p>
                  <p className="text-xs text-yellow-400/80 mt-1">
                    You'll be prompted to switch to {targetChain.name} when sending.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Recipient Input */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Recipient Address
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple_medium transition-colors"
              disabled={isLoading}
            />
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Amount
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                step="any"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple_medium transition-colors pr-20"
                disabled={isLoading}
              />
              <button
                onClick={handleMaxClick}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-purple_medium hover:bg-purple_light rounded-lg text-xs font-medium transition-colors"
                type="button"
                disabled={isLoading}
              >
                MAX
              </button>
            </div>
            {amount && Number(amount) > 0 && (
              <p className="text-xs text-white/60 mt-2">
                ≈ {formatUsdValue(estimatedValue)}
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white font-medium transition-colors"
              type="button"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              className="flex-1 px-4 py-3 bg-purple_medium hover:bg-purple_light rounded-xl text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
              disabled={isLoading || !walletProvider}
            >
              {isLoading
                ? 'Sending...'
                : !walletProvider
                  ? 'Connecting...'
                  : isWrongChain
                    ? `Switch & Send`
                    : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendAssetModal;

