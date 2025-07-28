/* eslint-disable @typescript-eslint/no-use-before-define */
import { EtherspotTransactionKit } from '@etherspot/transaction-kit';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { WalletClient } from 'viem';

// components
import BottomMenu from '../components/BottomMenu';
import Loading from '../pages/Loading';

// providers
import AccountNftsProvider from '../providers/AccountNftsProvider';
import AccountTransactionHistoryProvider from '../providers/AccountTransactionHistoryProvider';
import BottomMenuModalProvider from '../providers/BottomMenuModalProvider';
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
}: {
  provider: WalletClient;
  chainId: number;
}) {
  const [showAnimation, setShowAnimation] = useState(true);

  // Debug: Log which provider is being used for transactions
  console.log('Authorized - Provider setup for Action Bar:', {
    providerType: provider.constructor?.name,
    providerAccount: provider.account,
    providerChain: provider.chain?.id,
    transportType: provider.transport?.constructor?.name,
    chainId
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showAnimation) {
    return <Loading type="enter" />;
  }

  return (
    <EtherspotTransactionKit
      provider={provider}
      chainId={chainId}
      bundlerApiKey={
        import.meta.env.VITE_ETHERSPOT_BUNDLER_API_KEY || undefined
      }
      dataApiKey={import.meta.env.VITE_ETHERSPOT_DATA_API_KEY || undefined}
    >
      <AccountTransactionHistoryProvider>
        <AccountNftsProvider>
          <GlobalTransactionBatchesProvider>
            <BottomMenuModalProvider>
              <SelectedChainsHistoryProvider>
                <WalletConnectToastProvider>
                  <WalletConnectModalProvider>
                    <AuthContentWrapper>
                      <Outlet />
                    </AuthContentWrapper>
                    <BottomMenu />
                  </WalletConnectModalProvider>
                </WalletConnectToastProvider>
              </SelectedChainsHistoryProvider>
            </BottomMenuModalProvider>
          </GlobalTransactionBatchesProvider>
        </AccountNftsProvider>
      </AccountTransactionHistoryProvider>
    </EtherspotTransactionKit>
  );
}

const AuthContentWrapper = styled.div`
  margin: 0 auto;
`;
