import { configureStore } from '@reduxjs/toolkit';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

// store
import { store } from '../store';

// theme
import { defaultTheme } from '../theme';

// reducers
import depositSlice from '../apps/deposit/reducer/depositSlice';
import leaderboardSlice from '../apps/leaderboard/reducer/LeaderboardSlice';
import walletPortfolioSlice from '../apps/pillarx-app/reducer/WalletPortfolioSlice';
import swapSlice from '../apps/the-exchange/reducer/theExchangeSlice';
import tokenAtlasSlice from '../apps/token-atlas/reducer/tokenAtlasSlice';

// types
import { PeriodFilter } from '../apps/token-atlas/types/types';

// providers
import AccountTransactionHistoryProvider from '../providers/AccountTransactionHistoryProvider';
import BottomMenuModalProvider from '../providers/BottomMenuModalProvider';
import GlobalTransactionsBatchProvider from '../providers/GlobalTransactionsBatchProvider';
import LanguageProvider from '../providers/LanguageProvider';
import { PrivateKeyLoginProvider } from '../providers/PrivateKeyLoginProvider';
import SelectedChainsHistoryProvider from '../providers/SelectedChainsHistoryProvider';

// Create a test store with all reducers
const testStore = configureStore({
  reducer: {
    deposit: depositSlice.reducer,
    leaderboard: leaderboardSlice.reducer,
    walletPortfolio: walletPortfolioSlice.reducer,
    swap: swapSlice.reducer,
    tokenAtlas: tokenAtlasSlice.reducer,
  },
  preloadedState: {
    deposit: depositSlice.getInitialState(),
    leaderboard: leaderboardSlice.getInitialState(),
    walletPortfolio: walletPortfolioSlice.getInitialState(),
    swap: swapSlice.getInitialState(),
    tokenAtlas: {
      ...tokenAtlasSlice.getInitialState(),
      tokenDataGraph: {
        result: {
          data: [
            {
              volume: 1050.25,
              open: 45000.5,
              high: 45500.0,
              low: 44800.25,
              close: 45250.75,
              time: 1712457600,
            },
            {
              volume: 980.1,
              open: 45250.75,
              high: 46000.0,
              low: 45000.0,
              close: 45900.0,
              time: 1712544000,
            },
            {
              volume: 1125.8,
              open: 45900.0,
              high: 46250.5,
              low: 45700.0,
              close: 46050.5,
              time: 1712630400,
            },
          ],
        },
      },
      tokenDataInfo: {
        id: 1,
        market_cap: 100,
        market_cap_diluted: 100,
        liquidity: 150,
        price: 105,
        off_chain_volume: 150,
        volume: 150,
        volume_change_24h: 1.54,
        volume_7d: 2.3,
        is_listed: true,
        price_change_24h: 0.44,
        price_change_1h: 0.1,
        price_change_7d: 1.8,
        price_change_1m: 3.4,
        price_change_1y: 6.7,
        ath: 146,
        atl: 96,
        name: 'TOKEN',
        symbol: 'TKN',
        logo: 'tokenLogo.png',
        rank: 1047,
        contracts: [],
        total_supply: '300',
        circulating_supply: '170',
      },
      periodFilter: PeriodFilter.DAY,
      isGraphLoading: false,
      isGraphErroring: false,
    },
  },
});

// Test wrapper with all necessary providers
export const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={testStore}>
    <BrowserRouter>
      <ThemeProvider theme={defaultTheme}>
        <LanguageProvider>
          <AccountTransactionHistoryProvider>
            <BottomMenuModalProvider>
              <GlobalTransactionsBatchProvider>
                <SelectedChainsHistoryProvider>
                  <PrivateKeyLoginProvider>{children}</PrivateKeyLoginProvider>
                </SelectedChainsHistoryProvider>
              </GlobalTransactionsBatchProvider>
            </BottomMenuModalProvider>
          </AccountTransactionHistoryProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </Provider>
);

// Test wrapper with only Redux and Router (for simpler components)
export const SimpleTestWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Provider store={store}>
    <BrowserRouter>{children}</BrowserRouter>
  </Provider>
);

// Test wrapper with Redux, Router, and basic providers
export const BasicTestWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider theme={defaultTheme}>
        <LanguageProvider>{children}</LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </Provider>
);

// Test wrapper for exchange components
export const ExchangeTestWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider theme={defaultTheme}>
        <LanguageProvider>
          <GlobalTransactionsBatchProvider>
            {children}
          </GlobalTransactionsBatchProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </Provider>
);

// Test wrapper for token atlas components
export const TokenAtlasTestWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider theme={defaultTheme}>
        <LanguageProvider>
          <GlobalTransactionsBatchProvider>
            {children}
          </GlobalTransactionsBatchProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </Provider>
);

// Test wrapper for leaderboard components
export const LeaderboardTestWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider theme={defaultTheme}>
        <LanguageProvider>
          <GlobalTransactionsBatchProvider>
            {children}
          </GlobalTransactionsBatchProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </Provider>
);

// Test wrapper for deposit components
export const DepositTestWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider theme={defaultTheme}>
        <LanguageProvider>
          <GlobalTransactionsBatchProvider>
            {children}
          </GlobalTransactionsBatchProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </Provider>
);
