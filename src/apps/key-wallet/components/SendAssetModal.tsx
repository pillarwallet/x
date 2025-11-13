// Core
import { useState, useEffect, useMemo } from 'react';

// Viem
import { encodeFunctionData, erc20Abi, parseUnits } from 'viem';

// Types
import { Asset } from '../types';

// Utils
import {
  formatBalance,
  formatUsdValue,
  sendTransaction,
  switchChain,
  getCurrentChainId,
  getChainById,
  isNativeAsset,
} from '../utils/blockchain';

// Hooks
import useTransactionKit from '../../../hooks/useTransactionKit';

// Services
import { getEIP7702AuthorizationIfNeeded } from '../../../utils/eip7702Authorization';

// Assets
import defaultLogo from '../images/logo-unknown.png';
import type { WalletProviderLike } from '../../../types/walletProvider';

interface SendAssetModalProps {
  asset: Asset | null;
  walletProvider: WalletProviderLike | null;
  onClose: () => void;
  onSuccess: (txHash: string, chainId: number) => void;
}

const clampDecimals = (decimals: number | undefined, max: number) => {
  if (typeof decimals !== 'number' || Number.isNaN(decimals)) {
    return max;
  }
  return Math.max(0, Math.min(decimals, max));
};

const formatMaxBalance = (balance: number, decimals: number | undefined) => {
  const decimalsToUse = clampDecimals(decimals, 18);
  if (decimalsToUse === 0) {
    return balance.toString();
  }

  const fixed = balance.toFixed(decimalsToUse);
  const trimmed = fixed.replace(/(?:\.|,)?0+$/, '');
  if (trimmed === '' || trimmed === '.') {
    return '0';
  }
  return trimmed;
};

const SendAssetModal = ({
  asset,
  walletProvider,
  onClose,
  onSuccess,
}: SendAssetModalProps) => {
  const transactionKit = useTransactionKit();
  const kit = transactionKit?.kit;
  const contextProvider = transactionKit?.walletProvider as WalletProviderLike | undefined;

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentChainId, setCurrentChainId] = useState<number | null>(null);
  const [resolvedProvider, setResolvedProvider] = useState<WalletProviderLike | null>(
    walletProvider ?? contextProvider ?? null
  );

  const isDelegatedEoa = useMemo(() => {
    try {
      return (
        kit?.getEtherspotProvider?.().getWalletMode?.() === 'delegatedEoa'
      );
    } catch (delegatedCheckError) {
      console.warn('Failed to determine wallet mode:', delegatedCheckError);
      return false;
    }
  }, [kit]);

  useEffect(() => {
    setResolvedProvider(walletProvider ?? contextProvider ?? null);
  }, [walletProvider, contextProvider]);

  // Get current chain when modal opens
  useEffect(() => {
    const checkChain = async () => {
      if (resolvedProvider) {
        const chainId = await getCurrentChainId(resolvedProvider);
        setCurrentChainId(chainId);
        return;
      }

      if (isDelegatedEoa && kit && asset) {
        const delegatedChainId =
          kit.getEtherspotProvider?.().getChainId?.() ?? asset.chainId ?? null;
        setCurrentChainId(delegatedChainId ?? null);
        return;
      }

      setCurrentChainId(null);
    };
    checkChain();
  }, [resolvedProvider, isDelegatedEoa, kit, asset]);

  // Reset form when asset changes
  useEffect(() => {
    setRecipient('');
    setAmount('');
    setError('');
  }, [asset]);

  if (!asset) return null;

  const isWrongChain =
    !!resolvedProvider &&
    currentChainId !== null &&
    currentChainId !== asset.chainId;
  const targetChain = getChainById(asset.chainId);

  const handleMaxClick = () => {
    setAmount(formatMaxBalance(asset.balance, asset.decimals));
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

  const sendWithTransactionKit = async (): Promise<string> => {
    if (!kit) {
      throw new Error('Sorry, PillarX is not connected to a wallet - please try reloading the site or logging out and back in.');
    }

    kit.reset();

    const amountInWei = parseUnits(amount, asset.decimals);
    const nativeAsset = isNativeAsset(asset.contract);
    const txTo = nativeAsset
      ? (recipient as `0x${string}`)
      : (asset.contract as `0x${string}`);
    const txValue = nativeAsset ? amountInWei.toString() : '0';
    const txData = nativeAsset
      ? ('0x' as `0x${string}`)
      : (encodeFunctionData({
          abi: erc20Abi,
          functionName: 'transfer',
          args: [recipient as `0x${string}`, amountInWei],
        }) as `0x${string}`);

    const transactionName = `key-wallet-send-${Date.now()}`;

    kit
      .transaction({
        chainId: asset.chainId,
        to: txTo,
        value: txValue,
        data: txData,
      })
      .name({ transactionName });

    const authorization =
      (await getEIP7702AuthorizationIfNeeded(kit, asset.chainId)) || undefined;

    const estimated = await kit.estimate({ authorization });
    if (estimated.errorMessage) {
      throw new Error(estimated.errorMessage);
    }

    const sent = await kit.send({ authorization });
    if (sent.errorMessage) {
      throw new Error(sent.errorMessage);
    }

    const userOpHash = sent.userOpHash;
    if (!userOpHash) {
      throw new Error(
        'Transaction submitted but awaiting confirmation. Please check your history shortly.'
      );
    }

    const txHash =
      (await kit.getTransactionHash(
        userOpHash,
        asset.chainId,
        120000,
        3000
      )) || undefined;

    if (!txHash) {
      throw new Error(
        'Transaction submitted but unable to fetch hash yet. Please check your history shortly.'
      );
    }

    return txHash;
  };

  const handleSend = async () => {
    if (!validateForm()) return;

    if (!resolvedProvider && !isDelegatedEoa) {
      setError('Wallet provider not ready. Please try again.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      let txHash: string | undefined;

      if (!isDelegatedEoa) {
        if (!resolvedProvider) {
          throw new Error('Wallet provider not ready. Please try again.');
        }
        // Check current chain
        const currentChainId = await getCurrentChainId(resolvedProvider);

        if (currentChainId !== asset.chainId) {
          setError(
            `Switching to ${targetChain.name}... Please approve in your wallet.`
          );

          try {
            await switchChain(asset.chainId, resolvedProvider);
            setError(''); // Clear the switching message
          } catch (switchError) {
            console.error('Chain switch error:', switchError);
            setError(
              switchError instanceof Error
                ? switchError.message
                : `Please switch to ${targetChain.name} in your wallet and try again.`
            );
            return;
          }
        }

        txHash = await sendTransaction(
          asset,
          recipient,
          amount,
          resolvedProvider
        );
      } else {
        txHash = await sendWithTransactionKit();
      }

      if (!txHash) {
        throw new Error('Failed to send transaction. Please try again.');
      }

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
                alt={asset.symbol || 'token-symbol'}
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
                    You'll be prompted to switch to {targetChain.name} when
                    sending.
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
                className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-purple_medium hover:bg-purple_medium/50 rounded-lg text-xs font-medium transition-colors"
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
              className="flex-1 px-4 py-3 bg-purple_medium hover:bg-purple_medium/50 rounded-xl text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:opacity-90"
              type="button"
              disabled={isLoading || (!resolvedProvider && !isDelegatedEoa)}
            >
              {isLoading
                ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </span>
                  )
                : !resolvedProvider && !isDelegatedEoa
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
