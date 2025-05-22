import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// services
import * as portfolioService from '../../../../../services/pillarXApiWalletPortfolio';

// reducer
import * as reducerHooks from '../../../hooks/useReducerHooks';

// components
import TopTokens from '../TopTokens';

jest.mock('../../../hooks/useReducerHooks');
jest.mock('../../../../../services/pillarXApiWalletPortfolio');

const useAppSelectorMock = reducerHooks.useAppSelector as unknown as jest.Mock;

describe('TopTokens component', () => {
  const mockWalletPortfolio = {
    accounts: [],
    assets: [
      {
        asset: {
          symbol: 'USDC',
          name: 'USD Coin',
          logo: 'usdc-logo.png',
        },
        contract: {
          chainId: 'eip155:1',
        },
        price: 1,
        usdBalance: 200,
        tokenBalance: 200,
        unrealizedPnLUsd: 50,
        unrealizedPnLPercentage: 10,
      },
      {
        asset: {
          symbol: 'ETH',
          name: 'Ethereum',
          logo: 'eth-logo.png',
        },
        contract: {
          chainId: 'eip155:1',
        },
        price: 2000,
        usdBalance: 1000,
        tokenBalance: 0.5,
        unrealizedPnLUsd: -100,
        unrealizedPnLPercentage: -9.5,
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and matches snapshot', () => {
    const tree = render(
      <MemoryRouter>
        <TopTokens />
      </MemoryRouter>
    );
    expect(tree).toMatchSnapshot();
  });

  it('renders nothing if loading', () => {
    useAppSelectorMock.mockImplementation((selector) =>
      selector({
        walletPortfolio: {
          walletPortfolio: undefined,
          isWalletPortfolioLoading: true,
          isWalletPortfolioErroring: false,
          isTopTokenUnrealizedPnLLoading: true,
          isTopTokenUnrealizedPnLErroring: false,
        },
      })
    );

    render(
      <MemoryRouter>
        <TopTokens />
      </MemoryRouter>
    );
    expect(screen.queryByText(/Unrealized PnL/i)).not.toBeInTheDocument();
  });

  it('renders error messages if both data sources error', () => {
    useAppSelectorMock.mockImplementation((selector) =>
      selector({
        walletPortfolio: {
          walletPortfolio: undefined,
          isWalletPortfolioLoading: false,
          isWalletPortfolioErroring: true,
          isTopTokenUnrealizedPnLLoading: false,
          isTopTokenUnrealizedPnLErroring: true,
        },
      })
    );

    render(
      <MemoryRouter>
        <TopTokens />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/Failed to load wallet portfolio/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Failed to load unrealized PnL/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Please check your internet connection/i)
    ).toBeInTheDocument();
  });

  it('renders "No tokens yet" when empty', () => {
    useAppSelectorMock.mockImplementation((selector) =>
      selector({
        walletPortfolio: {
          walletPortfolio: {
            accounts: [],
            assets: [],
          },
          isWalletPortfolioLoading: false,
          isWalletPortfolioErroring: false,
          isTopTokenUnrealizedPnLLoading: false,
          isTopTokenUnrealizedPnLErroring: false,
        },
      })
    );

    (
      portfolioService.getTopNonPrimeAssetsAcrossChains as jest.Mock
    ).mockReturnValue([]);

    render(
      <MemoryRouter>
        <TopTokens />
      </MemoryRouter>
    );
    expect(screen.getByText(/No tokens yet/i)).toBeInTheDocument();
  });

  it('renders top token data correctly', () => {
    useAppSelectorMock.mockImplementation((selector) =>
      selector({
        walletPortfolio: {
          walletPortfolio: mockWalletPortfolio,
          isWalletPortfolioLoading: false,
          isWalletPortfolioErroring: false,
          isTopTokenUnrealizedPnLLoading: false,
          isTopTokenUnrealizedPnLErroring: false,
        },
      })
    );

    (
      portfolioService.getTopNonPrimeAssetsAcrossChains as jest.Mock
    ).mockReturnValue(mockWalletPortfolio.assets);

    render(
      <MemoryRouter>
        <TopTokens />
      </MemoryRouter>
    );

    // Token info (without some of them because repeated in the DOM but hidden from user)
    expect(screen.getByText('USDC')).toBeInTheDocument();
    expect(screen.getByText('USD Coin')).toBeInTheDocument();
    expect(screen.getByText('10.00%')).toBeInTheDocument();

    expect(screen.getByText('ETH')).toBeInTheDocument();
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
    expect(screen.getByText('9.50%')).toBeInTheDocument(); // negative shown as absolute
  });
});
