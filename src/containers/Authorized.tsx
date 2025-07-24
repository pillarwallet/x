/* eslint-disable @typescript-eslint/no-use-before-define */
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { WalletClient } from 'viem';

// components
import BottomMenu from '../components/BottomMenu';
import Loading from '../pages/Loading';

// providers
import AccountTransactionHistoryProvider from '../providers/AccountTransactionHistoryProvider';
import BottomMenuModalProvider from '../providers/BottomMenuModalProvider';
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
}: {
  provider: WalletClient;
  chainId: number;
}) {
  const [showAnimation, setShowAnimation] = useState(true);

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
    <EtherspotTransactionKitProvider
      config={{
        provider,
        chainId,
        bundlerApiKey:
          import.meta.env.VITE_ETHERSPOT_BUNDLER_API_KEY || undefined,
      }}
    >
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
                </WalletConnectModalProvider>
              </WalletConnectToastProvider>
            </SelectedChainsHistoryProvider>
          </BottomMenuModalProvider>
        </GlobalTransactionBatchesProvider>
      </AccountTransactionHistoryProvider>
    </EtherspotTransactionKitProvider>
  );
}

const AuthContentWrapper = styled.div`
  margin: 0 auto;
`;
