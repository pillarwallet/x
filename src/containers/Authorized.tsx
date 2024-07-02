import { WalletProviderLike } from '@etherspot/prime-sdk';
import { EtherspotTransactionKit } from '@etherspot/transaction-kit';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import BottomMenu from '../components/BottomMenu';
import AccountBalancesProvider from '../providers/AccountBalancesProvider';
import AccountNftsProvider from '../providers/AccountNftsProvider';
import AccountTransactionHistoryProvider from '../providers/AccountTransactionHistoryProvider';
import AssetsProvider from '../providers/AssetsProvider';
import BottomMenuModalProvider from '../providers/BottomMenuModalProvider';
import GlobalTransactionBatchesProvider from '../providers/GlobalTransactionsBatchProvider';


export default function Authorized({provider, chainId}: {provider: WalletProviderLike, chainId: number}) {
  return (
    <EtherspotTransactionKit
      provider={provider}
      chainId={chainId}
      bundlerApiKey={process.env.REACT_APP_ETHERSPOT_BUNDLER_API_KEY || undefined}
      dataApiKey={process.env.REACT_APP_ETHERSPOT_DATA_API_KEY || undefined}
    >
      <AccountTransactionHistoryProvider>
        <AssetsProvider>
          <AccountBalancesProvider>
            <AccountNftsProvider>
              <GlobalTransactionBatchesProvider>
                <BottomMenuModalProvider>
                  <AuthContentWrapper>
                    <Outlet />
                  </AuthContentWrapper>
                  <BottomMenu />
                </BottomMenuModalProvider>
              </GlobalTransactionBatchesProvider>
            </AccountNftsProvider>
          </AccountBalancesProvider>
        </AssetsProvider>
      </AccountTransactionHistoryProvider>
    </EtherspotTransactionKit>
  )
}

const AuthContentWrapper = styled.div`
  margin: 0 auto;
`;