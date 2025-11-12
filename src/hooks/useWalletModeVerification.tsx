import { EtherspotTransactionKit } from '@etherspot/transaction-kit';
import { useEffect, useState } from 'react';
import { createPublicClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

// utils
import { visibleChains } from '../utils/blockchain';
import { sanitizeError } from '../utils/common';
import { OUR_EIP7702_IMPLEMENTATION_ADDRESS } from '../utils/eip7702Authorization';

type WalletMode = 'modular' | 'delegatedEoa';

export interface EIP7702Info {
  [chainId: number]: {
    hasImplementation: boolean;
    isOurImplementation: boolean;
    isOtherImplementation: boolean;
    delegateAddress: string | null;
  };
}

interface WalletModeVerificationResult {
  walletMode: WalletMode;
  isLoading: boolean;
  error: string | null;
  eip7702Info: EIP7702Info;
}

interface UseWalletModeVerificationProps {
  privateKey?: string;
  eoaAddress?: string;
  kit: EtherspotTransactionKit | null;
}

export const useWalletModeVerification = ({
  privateKey,
  eoaAddress,
  kit,
}: UseWalletModeVerificationProps): WalletModeVerificationResult => {
  const [walletMode, setWalletMode] = useState<WalletMode>('modular');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eip7702Info, setEip7702Info] = useState<EIP7702Info>({});

  useEffect(() => {
    let cancelled = false;

    const verifyWalletMode = async () => {
      // Need either privateKey or eoaAddress, and kit
      if ((!privateKey && !eoaAddress) || !kit) {
        if (cancelled) return;
        setWalletMode('modular');
        setEip7702Info({});
        return;
      }

      if (cancelled) return;
      setIsLoading(true);
      setError(null);

      try {
        // Get EOA address from privateKey
        let resolvedEoaAddress: string;
        if (privateKey) {
          const eoaAccount = privateKeyToAccount(privateKey as `0x${string}`);
          resolvedEoaAddress = eoaAccount.address;
        }

        // Get counterfactual address from kit (in modular mode)
        const counterfactualAddress = await kit.getWalletAddress();

        if (eoaAddress) {
          resolvedEoaAddress = eoaAddress;
        }

        if (cancelled) return;

        // Check all supported chains
        let shouldRemainModular = false;

        // Check deployment and asset status across all chains
        const deploymentChecks = await Promise.all(
          visibleChains.map(async (chain) => {
            const publicClient = createPublicClient({
              chain,
              transport: http(),
            });

            // Check if smart account is deployed
            const code = await publicClient.getCode({
              address: counterfactualAddress as `0x${string}`,
            });

            const isDeployed = code && code !== '0x';

            if (isDeployed) {
              return { shouldRemainModular: true, chainId: chain.id };
            }

            // Smart account not deployed, check if it has assets
            const balance = await publicClient.getBalance({
              address: counterfactualAddress as `0x${string}`,
            });

            if (balance > BigInt(0)) {
              return { shouldRemainModular: true, chainId: chain.id };
            }

            return { shouldRemainModular: false, chainId: chain.id };
          })
        );
        if (cancelled) return;

        // Check if any chain indicates we should remain modular
        shouldRemainModular = deploymentChecks.some(
          (result) => result.shouldRemainModular
        );

        if (shouldRemainModular) {
          if (cancelled) return;
          setEip7702Info({});
          setWalletMode('modular');
          return;
        }

        // If we reach here, smart account is not deployed and has no assets
        // Check for EIP-7702 implementation on EOA
        const eip7702Checks = await Promise.all(
          visibleChains.map(async (chain) => {
            const publicClient = createPublicClient({
              chain,
              transport: http(),
            });

            const senderCode = await publicClient.getCode({
              address: resolvedEoaAddress as `0x${string}`,
            });

            const hasEIP7702Designation =
              senderCode !== undefined &&
              senderCode !== '0x' &&
              senderCode.startsWith('0xef0100');

            // Extract delegate address from EIP-7702 code if present
            let delegateAddress: string | null = null;
            let isOurImplementation = false;

            if (hasEIP7702Designation) {
              // EIP-7702 format: 0xef0100 + XX-byte delegate address
              // Extract delegate address using regex
              const match = senderCode.match(/^0xef0100(.{40})$/);
              delegateAddress = match ? `0x${match[1]}` : null;

              // Check if it's our implementation (Kernel V3)
              isOurImplementation =
                delegateAddress?.toLowerCase() ===
                OUR_EIP7702_IMPLEMENTATION_ADDRESS.toLowerCase();
            }

            return {
              hasEIP7702: hasEIP7702Designation,
              chainId: chain.id,
              delegateAddress,
              isOurImplementation,
            };
          })
        );
        if (cancelled) return;

        // Build per-chain implementation details
        const perChainData: EIP7702Info = {};
        eip7702Checks.forEach((result) => {
          perChainData[result.chainId] = {
            hasImplementation: result.hasEIP7702,
            isOurImplementation:
              result.hasEIP7702 && result.isOurImplementation,
            isOtherImplementation:
              result.hasEIP7702 && !result.isOurImplementation,
            delegateAddress: result.delegateAddress,
          };
        });

        // Update EIP-7702 info state
        if (cancelled) return;
        setEip7702Info(perChainData);

        // Since we reached this point, smart account is not deployed and has no assets
        // Therefore, we always use delegatedEoa mode regardless of EIP-7702 status
        setWalletMode('delegatedEoa');
      } catch (err) {
        if (cancelled) return;
        const sanitizedError = sanitizeError(err, privateKey);
        console.error('Wallet mode verification failed:', sanitizedError);
        setEip7702Info({});
        setError(sanitizedError);
        setWalletMode('modular'); // Default to modular on error
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    verifyWalletMode();

    return () => {
      cancelled = true;
    };
  }, [privateKey, eoaAddress, kit]);

  return {
    walletMode,
    isLoading,
    error,
    eip7702Info,
  };
};
