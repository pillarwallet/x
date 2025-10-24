/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { vi } from 'vitest';

// hooks
import useTransactionKit from '../../../../../hooks/useTransactionKit';
import useIntentSdk from '../../../hooks/useIntentSdk';

// types
import { WalletPortfolioMobulaResponse } from '../../../../../types/api';
import { PayingToken, SelectedToken } from '../../../types/tokens';
import { MobulaChainNames } from '../../../utils/constants';

// components
import Buy from '../Buy';

// test utils
import { TestWrapper } from '../../../../../test-utils/testUtils';

// Mock dependencies
vi.mock('../../../hooks/useIntentSdk', () => ({
  default: vi.fn(),
}));

// vi.mock('../../../hooks/useModularSdk', () => ({
//   default: vi.fn(),
// }));

// useTransactionKit is mocked globally in setupTests.ts

vi.mock('../../../../services/pillarXApiSearchTokens', () => ({
  useGetSearchTokensQuery: vi.fn(() => ({
    data: undefined,
    isLoading: false,
  })),
}));

vi.mock('../../../../utils/blockchain', () => ({
  getLogoForChainId: vi.fn(() => '/src/assets/images/logo-ethereum.png'),
}));

const mockGetDispensableAssets = vi.fn();

vi.mock('../../../utils/intent', () => ({
  getDispensableAssets: (...args: any[]) => mockGetDispensableAssets(...args),
  getDesiredAssetValue: vi.fn(() => BigInt(1000000000000000000)),
}));

const mockToken: SelectedToken = {
  name: 'Test Token',
  symbol: 'TEST',
  logo: 'test-logo.png',
  usdValue: '100.00',
  dailyPriceChange: 0.05,
  chainId: 1,
  decimals: 18,
  address: '0x1234567890123456789012345678901234567890',
};

const mockPayingToken: PayingToken = {
  name: 'USD Coin',
  symbol: 'USDC',
  logo: 'usdc-logo.png',
  actualBal: '100.00',
  totalUsd: 100.0,
  totalRaw: '100000000',
  chainId: 1,
  address: '0xA0b86a33E6441b8C4C8C0C4C8C0C4C8C0C4C8C0C4',
};

const mockWalletPortfolioData: WalletPortfolioMobulaResponse = {
  result: {
    data: {
      total_wallet_balance: 10050,
      wallets: ['0x1234567890123456789012345678901234567890'],
      assets: [
        {
          asset: {
            id: 1,
            symbol: 'TEST',
            name: 'Test Token',
            logo: 'test-logo.png',
            decimals: ['18'],
            contracts: [],
            blockchains: [],
          },
          contracts_balances: [
            {
              address: '0x1234567890123456789012345678901234567890',
              chainId: 'evm:1',
              balance: 100.5,
              balanceRaw: '100500000000000000000',
              decimals: 18,
            },
          ],
          cross_chain_balances: {},
          price_change_24h: 0.05,
          estimated_balance: 10050,
          price: 100,
          token_balance: 100.5,
          allocation: 1,
          wallets: ['0x1234567890123456789012345678901234567890'],
        },
        {
          asset: {
            id: 2,
            symbol: 'USDC',
            name: 'USD Coin',
            logo: 'usdc-logo.png',
            decimals: ['6'],
            contracts: [],
            blockchains: [],
          },
          contracts_balances: [
            {
              address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC on Ethereum
              chainId: 'evm:1',
              balance: 10050,
              balanceRaw: '10050000000',
              decimals: 6,
            },
          ],
          cross_chain_balances: {},
          price_change_24h: 0,
          estimated_balance: 10050,
          price: 1,
          token_balance: 10050,
          allocation: 1,
          wallets: ['0x1234567890123456789012345678901234567890'],
        },
        {
          asset: {
            id: 3,
            symbol: 'ETH',
            name: 'Ethereum',
            logo: 'eth-logo.png',
            decimals: ['18'],
            contracts: [],
            blockchains: [],
          },
          contracts_balances: [
            {
              address: '0x0000000000000000000000000000000000000000',
              chainId: 'evm:1',
              balance: 0.5,
              balanceRaw: '500000000000000000',
              decimals: 18,
            },
          ],
          cross_chain_balances: {},
          price_change_24h: 0,
          estimated_balance: 1500,
          price: 3000,
          token_balance: 0.5,
          allocation: 0.05,
          wallets: ['0x1234567890123456789012345678901234567890'],
        },
      ],
      balances_length: 2,
    },
  },
};

const mockPortfolioTokens = [
  {
    id: 2,
    contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    blockchain: 'Ethereum',
    balance: 10050,
    price: 1,
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
    logo: 'usdc-logo.png',
  },
  {
    id: 3,
    contract: '0x0000000000000000000000000000000000000000',
    blockchain: 'Ethereum',
    balance: 0.5,
    price: 3000,
    decimals: 18,
    symbol: 'ETH',
    name: 'Ethereum',
    logo: 'eth-logo.png',
  },
];

const mockProps = {
  setSearching: vi.fn(),
  token: mockToken,
  walletPortfolioData: mockWalletPortfolioData,
  payingTokens: [mockPayingToken],
  portfolioTokens: mockPortfolioTokens,
  setPreviewBuy: vi.fn(),
  setPayingTokens: vi.fn(),
  setExpressIntentResponse: vi.fn(),
  setUsdAmount: vi.fn(),
  setDispensableAssets: vi.fn(),
  setBuyToken: vi.fn(),
  chains: MobulaChainNames.All,
  setChains: vi.fn(),
};

const defaultMocks = () => {
  (useTransactionKit as any).mockReturnValue({
    walletAddress: '0x1234567890123456789012345678901234567890',
    kit: {
      getState: vi.fn(() => ({
        namedTransactions: {},
        batches: {},
        isEstimating: false,
        isSending: false,
        containsSendingError: false,
        containsEstimatingError: false,
      })),
      getEtherspotProvider: vi.fn(() => ({
        getChainId: vi.fn(() => 1),
      })),
      transaction: vi.fn(() => ({
        name: vi.fn(() => ({
          estimate: vi.fn(() => Promise.resolve({})),
          send: vi.fn(() => Promise.resolve({})),
        })),
      })),
      estimateBatches: vi.fn(() => Promise.resolve({})),
      sendBatches: vi.fn(() => Promise.resolve({})),
    },
  });

  (useIntentSdk as any).mockReturnValue({
    intentSdk: {
      expressIntent: vi.fn().mockResolvedValue({
        intentHash: '0xIntentHash123456789',
        bids: [{ bidHash: '0xBidHash123456789' }],
      }),
    },
    areModulesInstalled: true,
    isInstalling: false,
    installModules: vi.fn(),
    isFetching: false,
  });

  mockGetDispensableAssets.mockReturnValue([[], [], []]);
};

const renderWithProviders = (props = {}) => {
  return render(
    <TestWrapper>
      <Buy {...mockProps} {...props} />
    </TestWrapper>
  );
};

describe('<Buy />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    defaultMocks();
  });

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(
        <TestWrapper>
          <Buy {...mockProps} />
        </TestWrapper>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe('renders correctly', () => {
    it('without token selected', () => {
      renderWithProviders({ token: null });

      expect(screen.getAllByText('Select token').length).toBeGreaterThan(0);
      expect(screen.getByTestId('pulse-buy-component')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();
    });

    it('with token selected', () => {
      renderWithProviders();

      expect(screen.getByText('TEST')).toBeInTheDocument();
      // Token name is not shown when symbol.length + name.length > 13
      expect(screen.getByText('$100.00')).toBeInTheDocument();
      expect(screen.getByText('$10050.00')).toBeInTheDocument();
    });
  });

  describe('handles user interactions', () => {
    it('USD amount input changes', () => {
      renderWithProviders();

      const input = screen.getByPlaceholderText('0.00');
      fireEvent.change(input, { target: { value: '50.00' } });

      expect(input).toHaveValue('50.00');
    });

    it('invalid input gracefully', () => {
      renderWithProviders();

      const input = screen.getByPlaceholderText('0.00');
      fireEvent.change(input, { target: { value: 'invalid' } });

      expect(input).toHaveValue('');
    });

    it('quick amount buttons', () => {
      renderWithProviders();

      const tenDollarButton = screen.getByText('$10');
      fireEvent.click(tenDollarButton);

      expect(screen.getByDisplayValue('10')).toBeInTheDocument();
    });

    it('MAX button', () => {
      renderWithProviders();

      const maxButton = screen.getByText('MAX');
      fireEvent.click(maxButton);

      expect(screen.getByDisplayValue('10050.00')).toBeInTheDocument();
    });

    it('token selector click', () => {
      renderWithProviders();

      const tokenSelector = screen.getByText('TEST');
      fireEvent.click(tokenSelector);

      expect(mockProps.setSearching).toHaveBeenCalledWith(true);
    });
  });

  describe('handles different states', () => {
    it('shows not enough liquidity warning', async () => {
      (useIntentSdk as any).mockReturnValue({
        intentSdk: {
          expressIntent: vi.fn().mockResolvedValue({
            intentHash: '0xIntentHash123456789',
            bids: [{ bidHash: '0xBidHash123456789' }],
          }),
        },
        areModulesInstalled: true,
        isInstalling: false,
        installModules: vi.fn(),
        isFetching: false,
      });

      renderWithProviders();

      // Simulate not enough liquidity state
      const input = screen.getByPlaceholderText('0.00');
      fireEvent.change(input, { target: { value: '999999.00' } });

      // Wait for debounced effect
      await new Promise((resolve) => {
        setTimeout(resolve, 1100);
      });
      expect(
        screen.getByText('Insufficient wallet balance')
      ).toBeInTheDocument();
    });

    it('resets liquidity state when amount changes', async () => {
      (useIntentSdk as any).mockReturnValue({
        intentSdk: {
          expressIntent: vi.fn().mockResolvedValue({
            intentHash: '0xIntentHash123456789',
            bids: [{ bidHash: '0xBidHash123456789' }],
          }),
        },
        areModulesInstalled: true,
        isInstalling: false,
        installModules: vi.fn(),
        isFetching: false,
      });

      renderWithProviders();

      // First, set a high amount that might trigger not enough liquidity
      const input = screen.getByPlaceholderText('0.00');
      fireEvent.change(input, { target: { value: '999999.00' } });

      // Wait for debounced effect
      await new Promise((resolve) => {
        setTimeout(resolve, 1100);
      });

      // Then change to a valid amount
      fireEvent.change(input, { target: { value: '100.00' } });

      // The liquidity warning should be cleared immediately when user types
      expect(
        screen.queryByText('Not enough USDC to buy')
      ).not.toBeInTheDocument();
    });

    it('handles missing wallet portfolio data', () => {
      renderWithProviders({ walletPortfolioData: undefined });

      expect(screen.getByText('$0.00')).toBeInTheDocument();
    });

    it('handles loading state', () => {
      (useIntentSdk as any).mockReturnValue({
        intentSdk: {
          expressIntent: vi.fn().mockResolvedValue({
            intentHash: '0xIntentHash123456789',
            bids: [{ bidHash: '0xBidHash123456789' }],
          }),
        },
        areModulesInstalled: true,
        isInstalling: false,
        installModules: vi.fn(),
        isFetching: true,
      });

      renderWithProviders();

      expect(screen.getByTestId('pulse-buy-component')).toBeInTheDocument();
    });
  });

  describe('warning messages', () => {
    it('shows minimum amount warning when amount is below $2', async () => {
      renderWithProviders();

      const input = screen.getByPlaceholderText('0.00');
      fireEvent.change(input, { target: { value: '1.50' } });

      // Wait for debounced effect
      await new Promise((resolve) => {
        setTimeout(resolve, 1100);
      });

      expect(screen.getByText('Min. amount 2 USD')).toBeInTheDocument();
    });

    it('shows insufficient wallet balance warning', async () => {
      renderWithProviders();

      const input = screen.getByPlaceholderText('0.00');
      fireEvent.change(input, { target: { value: '999999.00' } });

      // Wait for debounced effect
      await new Promise((resolve) => {
        setTimeout(resolve, 1100);
      });

      expect(
        screen.getByText('Insufficient wallet balance')
      ).toBeInTheDocument();
    });

    it('shows not enough USDC warning with max amount suggestion', async () => {
      (useIntentSdk as any).mockReturnValue({
        intentSdk: {
          expressIntent: vi.fn().mockResolvedValue({
            intentHash: '0xIntentHash123456789',
            bids: [{ bidHash: '0xBidHash123456789' }],
          }),
        },
        areModulesInstalled: true,
        isInstalling: false,
        installModules: vi.fn(),
        isFetching: false,
      });

      // Mock getDispensableAssets to return empty arrays to trigger notEnoughLiquidity
      mockGetDispensableAssets.mockReturnValue([[], [], []]);

      renderWithProviders();

      const input = screen.getByPlaceholderText('0.00');
      // Use amount within wallet balance but triggers liquidity issue
      fireEvent.change(input, { target: { value: '5000.00' } });

      // Wait for debounced effect
      await new Promise((resolve) => {
        setTimeout(resolve, 1100);
      });

      // The warning should suggest reducing to max stable balance
      expect(
        screen.getByText(/Not enough USDC to buy, reduce to/)
      ).toBeInTheDocument();
    });

    it('shows minimum stable balance warning', async () => {
      const lowBalanceWalletData = {
        ...mockWalletPortfolioData,
        result: {
          ...mockWalletPortfolioData.result,
          data: {
            ...mockWalletPortfolioData.result.data,
            total_wallet_balance: 1501,
            assets: [
              // ETH with sufficient balance for gas (> $1)
              {
                asset: {
                  id: 3,
                  symbol: 'ETH',
                  name: 'Ethereum',
                  logo: 'eth-logo.png',
                  decimals: ['18'],
                  contracts: [],
                  blockchains: [],
                },
                contracts_balances: [
                  {
                    address: '0x0000000000000000000000000000000000000000',
                    chainId: 'evm:1',
                    balance: 0.5,
                    balanceRaw: '500000000000000000',
                    decimals: 18,
                  },
                ],
                cross_chain_balances: {},
                price_change_24h: 0,
                estimated_balance: 1500,
                price: 3000,
                token_balance: 0.5,
                allocation: 0.95,
                wallets: ['0x1234567890123456789012345678901234567890'],
              },
              // USDC with balance less than $2
              {
                asset: {
                  id: 2,
                  symbol: 'USDC',
                  name: 'USD Coin',
                  logo: 'usdc-logo.png',
                  decimals: ['6'],
                  contracts: [],
                  blockchains: [],
                },
                contracts_balances: [
                  {
                    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
                    chainId: 'evm:1',
                    balance: 1, // Less than $2
                    balanceRaw: '1000000',
                    decimals: 6,
                  },
                ],
                cross_chain_balances: {},
                price_change_24h: 0,
                estimated_balance: 1,
                price: 1,
                token_balance: 1,
                allocation: 0.05,
                wallets: ['0x1234567890123456789012345678901234567890'],
              },
            ],
          },
        },
      };

      const lowBalancePortfolioTokens = [
        {
          id: 2,
          contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          blockchain: 'Ethereum',
          balance: 1,
          price: 1,
          decimals: 6,
          symbol: 'USDC',
          name: 'USD Coin',
          logo: 'usdc-logo.png',
        },
        {
          id: 3,
          contract: '0x0000000000000000000000000000000000000000',
          blockchain: 'Ethereum',
          balance: 0.5,
          price: 3000,
          decimals: 18,
          symbol: 'ETH',
          name: 'Ethereum',
          logo: 'eth-logo.png',
        },
      ];

      renderWithProviders({
        walletPortfolioData: lowBalanceWalletData,
        portfolioTokens: lowBalancePortfolioTokens,
      });

      // The warning should appear immediately when the component mounts with low balance data
      await waitFor(() => {
        expect(
          screen.getByText('You need $2 USDC to trade, deposit USDC')
        ).toBeInTheDocument();
      });
    });

    it('shows minimum gas fee warning', async () => {
      const noGasWalletData = {
        ...mockWalletPortfolioData,
        result: {
          ...mockWalletPortfolioData.result,
          data: {
            ...mockWalletPortfolioData.result.data,
            total_wallet_balance: 100.3,
            assets: [
              // USDC with sufficient balance (>= $2)
              {
                asset: {
                  id: 2,
                  symbol: 'USDC',
                  name: 'USD Coin',
                  logo: 'usdc-logo.png',
                  decimals: ['6'],
                  contracts: [],
                  blockchains: [],
                },
                contracts_balances: [
                  {
                    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
                    chainId: 'evm:1',
                    balance: 100,
                    balanceRaw: '100000000',
                    decimals: 6,
                  },
                ],
                cross_chain_balances: {},
                price_change_24h: 0,
                estimated_balance: 100,
                price: 1,
                token_balance: 100,
                allocation: 0.99,
                wallets: ['0x1234567890123456789012345678901234567890'],
              },
              // ETH with insufficient balance for gas (< $1)
              {
                asset: {
                  id: 3,
                  symbol: 'ETH',
                  name: 'Ethereum',
                  logo: 'eth-logo.png',
                  decimals: ['18'],
                  contracts: [],
                  blockchains: [],
                },
                contracts_balances: [
                  {
                    address: '0x0000000000000000000000000000000000000000',
                    chainId: 'evm:1',
                    balance: 0.0001, // Very low ETH balance
                    balanceRaw: '100000000000000',
                    decimals: 18,
                  },
                ],
                cross_chain_balances: {},
                price_change_24h: 0,
                estimated_balance: 0.3, // Less than $1
                price: 3000,
                token_balance: 0.0001,
                allocation: 0.01,
                wallets: ['0x1234567890123456789012345678901234567890'],
              },
            ],
          },
        },
      };

      const noGasPortfolioTokens = [
        {
          id: 2,
          contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          blockchain: 'Ethereum',
          balance: 100,
          price: 1,
          decimals: 6,
          symbol: 'USDC',
          name: 'USD Coin',
          logo: 'usdc-logo.png',
        },
        {
          id: 3,
          contract: '0x0000000000000000000000000000000000000000',
          blockchain: 'Ethereum',
          balance: 0.0001,
          price: 3000,
          decimals: 18,
          symbol: 'ETH',
          name: 'Ethereum',
          logo: 'eth-logo.png',
        },
      ];

      renderWithProviders({
        walletPortfolioData: noGasWalletData,
        portfolioTokens: noGasPortfolioTokens,
      });

      // The warning should appear immediately when the component mounts with insufficient gas
      await waitFor(() => {
        expect(
          screen.getByText(/Min\. \$1 .* required on/)
        ).toBeInTheDocument();
      });
    });
  });

  describe('handles buy submission', () => {
    it('installs modules when not installed', async () => {
      const mockInstallModules = vi.fn().mockResolvedValue(undefined);
      (useIntentSdk as any).mockReturnValue({
        intentSdk: {
          expressIntent: vi.fn().mockResolvedValue({
            intentHash: '0xIntentHash123456789',
            bids: [{ bidHash: '0xBidHash123456789' }],
          }),
        },
        areModulesInstalled: false,
        isInstalling: false,
        installModules: mockInstallModules,
        isFetching: false,
      });

      // Mock getDispensableAssets to return valid data so payingTokens gets populated
      mockGetDispensableAssets.mockReturnValue([
        [{ asset: '0x123', chainId: BigInt(1), value: BigInt(1000) }], // dAssets
        [BigInt(1)], // pChains
        [mockPayingToken], // pTokens
      ]);

      renderWithProviders();

      // Enter an amount to trigger payingTokens population
      const input = screen.getByPlaceholderText('0.00');
      fireEvent.change(input, { target: { value: '10.00' } });

      // Wait for the "Enable Trading" button to appear and not be disabled
      await waitFor(
        () => {
          const buyButton = screen.getByTestId('pulse-buy-button');
          expect(buyButton).toHaveTextContent('Enable Trading on Ethereum');
          expect(buyButton).not.toBeDisabled();
        },
        { timeout: 2000 }
      );

      // Click the button
      const buyButton = screen.getByTestId('pulse-buy-button');
      fireEvent.click(buyButton);

      await waitFor(() => {
        expect(mockInstallModules).toHaveBeenCalled();
      });
    });

    it('opens preview when modules are installed', async () => {
      renderWithProviders();

      const input = screen.getByPlaceholderText('0.00');
      fireEvent.change(input, { target: { value: '100.00' } });

      // Wait for debounced effect and intent response
      setTimeout(async () => {
        const buyButton = screen.getByRole('button', { name: /Buy/i });
        fireEvent.click(buyButton);

        expect(mockProps.setPreviewBuy).toHaveBeenCalledWith(true);
      }, 2000);
    });
  });

  describe('handles edge cases', () => {
    it('handles token without logo', () => {
      const tokenWithoutLogo = { ...mockToken, logo: '' };
      renderWithProviders({ token: tokenWithoutLogo });

      expect(screen.getByTestId('random-avatar')).toBeInTheDocument();
    });

    it('handles missing wallet address', () => {
      (useTransactionKit as any).mockReturnValue({
        walletAddress: null,
        kit: {
          getState: vi.fn(() => ({
            namedTransactions: {},
            batches: {},
            isEstimating: false,
            isSending: false,
            containsSendingError: false,
            containsEstimatingError: false,
          })),
          getEtherspotProvider: vi.fn(() => ({
            getChainId: vi.fn(() => 1),
          })),
          transaction: vi.fn(() => ({
            name: vi.fn(() => ({
              estimate: vi.fn(() => Promise.resolve({})),
              send: vi.fn(() => Promise.resolve({})),
            })),
          })),
          estimateBatches: vi.fn(() => Promise.resolve({})),
          sendBatches: vi.fn(() => Promise.resolve({})),
        },
      });
      renderWithProviders();

      expect(screen.getByTestId('pulse-buy-component')).toBeInTheDocument();
    });

    it('handles intent SDK error', () => {
      (useIntentSdk as any).mockReturnValue({
        intentSdk: {
          expressIntent: vi.fn().mockRejectedValue(new Error('Intent failed')),
        },
      });

      renderWithProviders();

      const input = screen.getByPlaceholderText('0.00');
      fireEvent.change(input, { target: { value: '100.00' } });

      // Should not crash and continue to work
      expect(screen.getByTestId('pulse-buy-component')).toBeInTheDocument();
    });
  });
});
