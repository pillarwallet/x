import {
  createWalletClient,
  createPublicClient,
  custom,
  encodeFunctionData,
  parseUnits,
  http,
  isAddress,
} from 'viem';
import type { WalletClient } from 'viem';
import { erc20Abi } from 'viem';
import {
  arbitrum,
  base,
  bsc,
  gnosis,
  mainnet,
  optimism,
  polygon,
} from 'viem/chains';

// types
import { Asset } from '../types';
import { getBlockScan } from '../../../utils/blockchain';
import type {
  WalletProviderLike,
  Eip1193LikeProvider,
} from '../../../types/walletProvider';

const isGnosisEnabled = import.meta.env.VITE_FEATURE_FLAG_GNOSIS === 'true';

const allChains = [mainnet, polygon, gnosis, base, bsc, optimism, arbitrum];

export const chains = allChains.filter(
  (chain) => isGnosisEnabled || chain.id !== 100
);

const isViemWalletClient = (provider: unknown): provider is WalletClient => {
  return Boolean(
    provider &&
      typeof provider === 'object' &&
      'sendTransaction' in provider &&
      'transport' in provider
  );
};

export const getChainById = (chainId: number) => {
  const chain = chains.find((chain) => chain.id === chainId);

  if (!chain) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }

  return chain;
};

export const isNativeAsset = (contractAddress: string): boolean => {
  return (
    contractAddress === '0x0000000000000000000000000000000000000000' ||
    contractAddress.toLowerCase() === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
  );
};

/**
 * Switch the wallet to a specific chain
 * If the chain is not added to the wallet, it will be added automatically
 */
export const switchChain = async (
  chainId: number,
  walletProvider: WalletProviderLike
): Promise<void> => {
  const targetChain = getChainById(chainId);

  if (isViemWalletClient(walletProvider)) {
    if (walletProvider.chain?.id === chainId) {
      return;
    }
    throw new Error(
      `Please switch to ${targetChain.name} in your wallet to continue.`
    );
  }

  const eip1193Provider = walletProvider as Eip1193LikeProvider;

  // Check if provider has request method (EIP-1193)
  if (typeof eip1193Provider.request !== 'function') {
    throw new Error('Wallet provider does not support chain switching');
  }

  const chainIdHex = `0x${chainId.toString(16)}`;

  try {
    // Attempt to switch to the target chain
    await eip1193Provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIdHex }],
    });
  } catch (switchError: any) {
    // Error code 4902 means the chain hasn't been added to the wallet yet
    if (switchError.code === 4902) {
      try {
        // Add the chain to the wallet
        await eip1193Provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: chainIdHex,
              chainName: targetChain.name,
              nativeCurrency: targetChain.nativeCurrency,
              rpcUrls: targetChain.rpcUrls.default.http,
              blockExplorerUrls: targetChain.blockExplorers?.default?.url
                ? [targetChain.blockExplorers.default.url]
                : undefined,
            },
          ],
        });
      } catch (addError) {
        console.error('Failed to add chain to wallet:', addError);
        throw new Error(`Failed to add ${targetChain.name} to your wallet`);
      }
    } else {
      console.error('Failed to switch chain:', switchError);
      throw new Error(
        `Failed to switch to ${targetChain.name}. Please switch manually in your wallet.`
      );
    }
  }
};

/**
 * Get the current chain ID from the wallet provider
 */
export const getCurrentChainId = async (
  walletProvider: WalletProviderLike | null | undefined
): Promise<number | null> => {
  try {
    if (isViemWalletClient(walletProvider) && walletProvider.chain?.id) {
      return walletProvider.chain.id;
    }

    const eip1193Provider = walletProvider as Eip1193LikeProvider | null | undefined;

    if (!eip1193Provider || typeof eip1193Provider.request !== 'function') {
      return null;
    }
    const chainIdHex = await eip1193Provider.request<string>({
      method: 'eth_chainId',
    });
    return parseInt(chainIdHex, 16);
  } catch (error) {
    console.error('Failed to get current chain ID:', error);
    return null;
  }
};

export const sendTransaction = async (
  asset: Asset,
  recipient: string,
  amount: string,
  walletProvider: WalletProviderLike
): Promise<string> => {
  // Validate recipient address
  if (!isAddress(recipient)) {
    throw new Error('Invalid recipient address');
  }

  // Validate and parse amount
  let amountInWei: bigint;
  try {
    amountInWei = parseUnits(amount, asset.decimals);
  } catch (error) {
    throw new Error('Amount must be a positive number');
  }

  // Ensure amount is positive
  if (amountInWei <= BigInt(0)) {
    throw new Error('Amount must be a positive number');
  }

  // Convert asset balance to wei for comparison
  const balanceInWei = parseUnits(asset.balance.toString(), asset.decimals);
  
  // Ensure amount doesn't exceed balance
  if (amountInWei > balanceInWei) {
    throw new Error('Insufficient balance');
  }

  const chain = getChainById(asset.chainId);

  if (!walletProvider) {
    throw new Error('Wallet provider not available');
  }

  const isWalletClient = isViemWalletClient(walletProvider);

  if (
    isWalletClient &&
    walletProvider.chain?.id &&
    walletProvider.chain.id !== chain.id
  ) {
    throw new Error(
      `Connected wallet is on a different network. Please switch to ${chain.name} in your wallet and try again.`
    );
  }

  const walletClient: WalletClient = isWalletClient
    ? walletProvider
    : (createWalletClient({
        chain,
        transport: custom(walletProvider),
      }) as WalletClient);

  const addresses = walletClient.account
    ? [walletClient.account.address]
    : await walletClient.getAddresses();
  const account = addresses[0];

  if (!account) {
    throw new Error('No account found');
  }

  // Create public client for gas estimation
  const publicClient = createPublicClient({
    chain,
    transport: http(),
  });

  // Check if native asset
  if (isNativeAsset(asset.contract)) {
    // Send native token
    const baseTransactionRequest = {
      account,
      to: recipient as `0x${string}`,
      value: amountInWei,
      data: '0x' as `0x${string}`,
    };

    // Estimate gas before sending
    let gasEstimate: bigint;
    try {
      gasEstimate = await publicClient.estimateGas(baseTransactionRequest);
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error';
      console.error('Gas estimation failed:', error);
      throw new Error(`Gas estimation failed: ${errorMessage}`);
    }

    const txHash = await walletClient.sendTransaction({
      ...baseTransactionRequest,
      gas: gasEstimate,
      chain: walletClient.chain ?? chain,
    });
    return txHash;
  } else {
    // Send ERC-20 token
    const calldata = encodeFunctionData({
      abi: erc20Abi,
      functionName: 'transfer',
      args: [recipient as `0x${string}`, amountInWei],
    });

    const baseTransactionRequest = {
      account,
      to: asset.contract as `0x${string}`,
      value: BigInt(0),
      data: calldata,
    };

    // Estimate gas before sending
    let gasEstimate: bigint;
    try {
      gasEstimate = await publicClient.estimateGas(baseTransactionRequest);
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error';
      console.error('Gas estimation failed:', error);
      throw new Error(`Gas estimation failed: ${errorMessage}`);
    }

    const txHash = await walletClient.sendTransaction({
      ...baseTransactionRequest,
      gas: gasEstimate,
      chain: walletClient.chain ?? chain,
    });
    return txHash;
  }
};

// After: reuse shared utility
export const getBlockExplorerUrl = (chainId: number, txHash: string): string => {
  const baseUrl = getBlockScan(chainId, false);
  return baseUrl ? `${baseUrl}${txHash}` : '';
};

export const formatBalance = (balance: number, decimals: number = 4): string => {
  if (balance === 0) return '0';
  if (balance < 0.0001) return '<0.0001';
  return balance.toFixed(decimals);
};

export const formatUsdValue = (value: number): string => {
  if (value === 0) return '$0.00';
  if (value < 0.01) return '<$0.01';
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const shortenAddress = (address: string, chars: number = 4): string => {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

