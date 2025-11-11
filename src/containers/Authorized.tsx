/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  EtherspotTransactionKit,
  EtherspotTransactionKitConfig,
} from '@etherspot/transaction-kit';
import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { Account, WalletClient } from 'viem';
import { useAccount, useConnect } from 'wagmi';

// components
import BottomMenu from '../components/BottomMenu';
import ConnectionDebug, { DebugInfo } from '../components/ConnectionDebug';
import DebugPanel from '../components/DebugPanel';
import Loading from '../pages/Loading';

// hooks
import { useWalletModeVerification } from '../hooks/useWalletModeVerification';

// providers
import AccountTransactionHistoryProvider from '../providers/AccountTransactionHistoryProvider';
import BottomMenuModalProvider from '../providers/BottomMenuModalProvider';
import { EIP7702Provider } from '../providers/EIP7702Provider';
import { EtherspotTransactionKitProvider } from '../providers/EtherspotTransactionKitProvider';
import GlobalTransactionBatchesProvider from '../providers/GlobalTransactionsBatchProvider';
import SelectedChainsHistoryProvider from '../providers/SelectedChainsHistoryProvider';
import { WalletConnectModalProvider } from '../providers/WalletConnectModalProvider';
import { WalletConnectToastProvider } from '../providers/WalletConnectToastProvider';

/**
 * @name Authorized
 * @description This component is the main entry point for the users
 * that are considered authenticated. It wraps the entire <Outlet />
 * with the providers needed for the application to function.
 */
export default function Authorized({
  provider,
  chainId,
  privateKey,
  eoaAddress,
  customAccount,
}: {
  provider: WalletClient;
  chainId: number;
  privateKey?: string;
  eoaAddress?: string;
  customAccount?: Account;
}) {
  const [showAnimation, setShowAnimation] = useState(true);
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({});
  const [tempKit, setTempKit] = useState<EtherspotTransactionKit | null>(null);

  // Get hooks for debug info
  const { authenticated, ready, user } = usePrivy();
  const { connectors, isPending, error } = useConnect();
  const { address, isConnected, isConnecting } = useAccount();

  // Get WalletConnect connector
  const walletConnectConnector = connectors.find(
    ({ id }) => id === 'walletConnect'
  );

  // Create temporary kit for wallet mode verification
  // Only recreate when provider or privateKey changes
  useEffect(() => {
    if (provider && chainId) {
      const tempKitConfig = {
        provider,
        chainId,
        privateKey,
        bundlerApiKey: import.meta.env.VITE_ETHERSPOT_BUNDLER_API_KEY,
        walletMode: 'modular' as const, // Always start with modular for verification
      } as unknown as EtherspotTransactionKitConfig;

      const kit = new EtherspotTransactionKit(tempKitConfig);
      setTempKit(kit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, privateKey]);

  // Use wallet mode verification hook
  const {
    walletMode,
    isLoading: isVerifyingWalletMode,
    error: walletModeError,
    eip7702Info,
  } = useWalletModeVerification({
    privateKey,
    eoaAddress,
    kit: tempKit,
  });

  useEffect(() => {
    // Check if we're coming from token-atlas
    const urlParams = new URLSearchParams(window.location.search);
    const fromTokenAtlas = urlParams.get('from') === 'token-atlas';

    if (fromTokenAtlas) {
      // Skip animation when coming from token-atlas
      setShowAnimation(false);
      return undefined;
    }

    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Update debug info
  useEffect(() => {
    setDebugInfo({
      privy: {
        authenticated,
        ready,
        user: user
          ? {
              id: user.id,
              email: user.email?.address,
              wallet: user.wallet?.address,
            }
          : null,
      },
      wagmi: {
        address,
        isConnected,
        isConnecting,
        isPending,
        error: error?.message,
        connectorsCount: connectors.length,
        connectorIds: connectors.map((c) => c.id),
        walletConnectConnector: walletConnectConnector
          ? {
              id: walletConnectConnector.id,
              name: walletConnectConnector.name,
              ready: Boolean(walletConnectConnector.ready),
            }
          : null,
      },
    });
  }, [
    authenticated,
    ready,
    user,
    address,
    isConnected,
    isConnecting,
    isPending,
    error,
    connectors,
    walletConnectConnector,
  ]);

  // Memoize the config to prevent unnecessary kit recreation
  const kitConfig = useMemo(
    () =>
      ({
        provider,
        chainId,
        privateKey,
        viemLocalAccount: customAccount,
        bundlerApiKey: import.meta.env.VITE_ETHERSPOT_BUNDLER_API_KEY,
        walletMode,
      }) as EtherspotTransactionKitConfig,
    [provider, chainId, privateKey, customAccount, walletMode]
  );

  if (showAnimation || isVerifyingWalletMode) {
    return <Loading type="enter" />;
  }

  // Show error if wallet mode verification failed
  if (walletModeError) {
    console.error('Wallet mode verification error:', walletModeError);
  }

  return (
    <EtherspotTransactionKitProvider config={kitConfig}>
      <EIP7702Provider eip7702Info={eip7702Info}>
        <AccountTransactionHistoryProvider>
          <GlobalTransactionBatchesProvider>
            <BottomMenuModalProvider>
              <SelectedChainsHistoryProvider>
                <WalletConnectToastProvider>
                  <WalletConnectModalProvider>
                    <AuthContentWrapper>
                      <Outlet />
                    </AuthContentWrapper>
                    <BottomMenu />

                    {/* Debug Panel - shown when debug_connections is enabled */}
                    {localStorage.getItem('debug_connections') === 'true' && (
                      <DebugPanel title="Connection Debug">
                        <ConnectionDebug
                          debugInfo={debugInfo}
                          onDisconnect={() => {
                            // This will be handled by the comprehensive logout utility
                            // when the user logs out through the normal flow
                          }}
                        />
                      </DebugPanel>
                    )}
                  </WalletConnectModalProvider>
                </WalletConnectToastProvider>
              </SelectedChainsHistoryProvider>
            </BottomMenuModalProvider>
          </GlobalTransactionBatchesProvider>
        </AccountTransactionHistoryProvider>
      </EIP7702Provider>
    </EtherspotTransactionKitProvider>
  );
}

const AuthContentWrapper = styled.div`
  margin: 0 auto;
`;
