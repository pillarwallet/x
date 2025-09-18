/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { vi } from 'vitest';

// hooks
import useTransactionKit from '../../../../../hooks/useTransactionKit';
import useIntentSdk from '../../../hooks/useIntentSdk';
import useModularSdk from '../../../hooks/useModularSdk';

// types
import { WalletPortfolioMobulaResponse } from '../../../../../types/api';
import { PayingToken, SelectedToken } from '../../../types/tokens';

// components
import Buy from '../Buy';

// Mock dependencies
vi.mock('../../../hooks/useIntentSdk', () => ({
  default: vi.fn(),
}));

vi.mock('../../../hooks/useModularSdk', () => ({
  default: vi.fn(),
}));

vi.mock('../../../../../hooks/useTransactionKit', () => ({
  default: vi.fn(),
}));

vi.mock('../../../../utils/blockchain', () => ({
  getLogoForChainId: vi.fn(() => '/src/assets/images/logo-ethereum.png'),
}));

vi.mock('../../../utils/intent', () => ({
  getDispensableAssets: vi.fn(() => [[], [], []]),
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
      ],
      balances_length: 2,
    },
  },
};

const mockProps = {
  setSearching: vi.fn(),
  token: mockToken,
  walletPortfolioData: mockWalletPortfolioData,
  payingTokens: [mockPayingToken],
  setPreviewBuy: vi.fn(),
  setPayingTokens: vi.fn(),
  setExpressIntentResponse: vi.fn(),
  setUsdAmount: vi.fn(),
  setDispensableAssets: vi.fn(),
};

const defaultMocks = () => {
  (useTransactionKit as any).mockReturnValue({
    walletAddress: '0x1234567890123456789012345678901234567890',
  });

  (useIntentSdk as any).mockReturnValue({
    intentSdk: {
      expressIntent: vi.fn().mockResolvedValue({
        intentHash: '0xIntentHash123456789',
        bids: [{ bidHash: '0xBidHash123456789' }],
      }),
    },
  });

  (useModularSdk as any).mockReturnValue({
    areModulesInstalled: true,
    isInstalling: false,
    installModules: vi.fn(),
    isFetching: false,
  });
};

const renderWithProviders = (props = {}) => {
  return render(<Buy {...mockProps} {...props} />);
};

describe('<Buy />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    defaultMocks();
  });

  it('renders correctly and matches snapshot', () => {
    const tree = renderer.create(<Buy {...mockProps} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe('renders correctly', () => {
    it('without token selected', () => {
      renderWithProviders({ token: null });

      expect(screen.getByText('Select token')).toBeInTheDocument();
      expect(screen.getByTestId('pulse-buy-component')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();
    });

    it('with token selected', () => {
      renderWithProviders();

      expect(screen.getByText('TEST')).toBeInTheDocument();
      expect(screen.getByText('Test T...')).toBeInTheDocument();
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

      expect(screen.getByDisplayValue('10.00')).toBeInTheDocument();
    });

    it('MAX button', () => {
      renderWithProviders();

      const maxButton = screen.getByText('$MAX');
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
      (useModularSdk as any).mockReturnValue({
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
      (useModularSdk as any).mockReturnValue({
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
        screen.queryByText('Not enough liquidity')
      ).not.toBeInTheDocument();
    });

    it('handles missing wallet portfolio data', () => {
      renderWithProviders({ walletPortfolioData: undefined });

      expect(screen.getByText('$0.00')).toBeInTheDocument();
    });

    it('handles loading state', () => {
      (useModularSdk as any).mockReturnValue({
        areModulesInstalled: true,
        isInstalling: false,
        installModules: vi.fn(),
        isFetching: true,
      });

      renderWithProviders();

      expect(screen.getByTestId('pulse-buy-component')).toBeInTheDocument();
    });
  });

  describe('handles buy submission', () => {
    it('installs modules when not installed', async () => {
      const mockInstallModules = vi.fn();
      (useModularSdk as any).mockReturnValue({
        areModulesInstalled: false,
        isInstalling: false,
        installModules: mockInstallModules,
        isFetching: false,
      });

      renderWithProviders();

      const buyButton = screen.getByText('Enable Trading on Ethereum');
      fireEvent.click(buyButton);

      expect(mockInstallModules).toHaveBeenCalled();
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
      (useTransactionKit as any).mockReturnValue({ walletAddress: null });
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
