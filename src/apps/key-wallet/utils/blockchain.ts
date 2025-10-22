import { createWalletClient, custom, encodeFunctionData, parseUnits } from 'viem';
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

const isGnosisEnabled = import.meta.env.VITE_FEATURE_FLAG_GNOSIS === 'true';

const allChains = [mainnet, polygon, gnosis, base, bsc, optimism, arbitrum];

export const chains = allChains.filter(
  (chain) => isGnosisEnabled || chain.id !== 100
);

export const getChainById = (chainId: number) => {
  return chains.find((chain) => chain.id === chainId) || mainnet;
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
  walletProvider: any
): Promise<void> => {
  // Check if provider has request method (EIP-1193)
  if (!walletProvider?.request) {
    throw new Error('Wallet provider does not support chain switching');
  }

  const targetChain = getChainById(chainId);
  const chainIdHex = `0x${chainId.toString(16)}`;

  try {
    // Attempt to switch to the target chain
    await walletProvider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIdHex }],
    });
  } catch (switchError: any) {
    // Error code 4902 means the chain hasn't been added to the wallet yet
    if (switchError.code === 4902) {
      try {
        // Add the chain to the wallet
        await walletProvider.request({
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
  walletProvider: any
): Promise<number | null> => {
  try {
    if (!walletProvider?.request) {
      return null;
    }
    const chainIdHex = await walletProvider.request({
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
  walletProvider: any
): Promise<string> => {
  const chain = getChainById(asset.chainId);

  const walletClient = createWalletClient({
    chain,
    transport: custom(walletProvider),
  });

  const accounts = await walletClient.getAddresses();
  const account = accounts[0];

  if (!account) {
    throw new Error('No account found');
  }

  // Check if native asset
  if (isNativeAsset(asset.contract)) {
    // Send native token
    const value = parseUnits(amount, asset.decimals);
    const txHash = await walletClient.sendTransaction({
      account,
      to: recipient as `0x${string}`,
      value,
      data: '0x',
    });
    return txHash;
  } else {
    // Send ERC-20 token
    const amountInWei = parseUnits(amount, asset.decimals);
    const calldata = encodeFunctionData({
      abi: erc20Abi,
      functionName: 'transfer',
      args: [recipient as `0x${string}`, amountInWei],
    });

    const txHash = await walletClient.sendTransaction({
      account,
      to: asset.contract as `0x${string}`,
      value: BigInt(0),
      data: calldata,
    });
    return txHash;
  }
};

export const getBlockExplorerUrl = (chainId: number, txHash: string): string => {
  switch (chainId) {
    case 1:
      return `https://etherscan.io/tx/${txHash}`;
    case 137:
      return `https://polygonscan.com/tx/${txHash}`;
    case 8453:
      return `https://basescan.org/tx/${txHash}`;
    case 100:
      return isGnosisEnabled ? `https://gnosisscan.io/tx/${txHash}` : '';
    case 56:
      return `https://bscscan.com/tx/${txHash}`;
    case 10:
      return `https://optimistic.etherscan.io/tx/${txHash}`;
    case 42161:
      return `https://arbiscan.io/tx/${txHash}`;
    default:
      return '';
  }
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

