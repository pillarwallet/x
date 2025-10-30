/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

// types
import { WalletPortfolioMobulaResponse } from '../../../../../types/api';
import { SelectedToken } from '../../../types/tokens';

// hooks
import useRelaySell from '../../../hooks/useRelaySell';

// components
import Sell from '../Sell';

// Mock dependencies
vi.mock('../../../hooks/useRelaySell', () => ({
  default: vi.fn(),
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
      ],
      balances_length: 1,
    },
  },
};

const mockProps = {
  setSearching: vi.fn(),
  token: mockToken,
  walletPortfolioData: mockWalletPortfolioData,
  setPreviewSell: vi.fn(),
  setSellOffer: vi.fn(),
  setTokenAmount: vi.fn(),
  portfolioTokens: [],
  maxStableCoinBalance: {
    chainId: 1,
    balance: 100,
  },
  customSellAmounts: ['10%', '25%', '50%', '75%'],
  selectedChainIdForSettlement: 10,
};

const defaultMocks = () => {
  const mockUseRelaySell = {
    getBestSellOffer: vi.fn(),
    isInitialized: true,
    error: null,
  };

  (useRelaySell as any).mockReturnValue(mockUseRelaySell);

  return { mockUseRelaySell };
};

const renderWithProviders = (props = {}) => {
  return render(<Sell {...mockProps} {...props} />);
};

describe('<Sell />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    defaultMocks();
  });

  it('renders correctly and matches snapshot', () => {
    const { container } = renderWithProviders();
    expect(container).toMatchSnapshot();
  });

  describe('renders correctly', () => {
    it('without token selected', () => {
      renderWithProviders({ token: null });

      expect(screen.getByText('Select token')).toBeInTheDocument();
      expect(
        screen.queryByTestId('pulse-sell-token-symbol')
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('pulse-sell-token-balance')).toHaveTextContent(
        '0.00($0.00)'
      );
    });

    it('with token selected', () => {
      renderWithProviders();

      expect(screen.getByTestId('pulse-sell-token-symbol')).toHaveTextContent(
        'TES'
      );
      expect(
        screen.getByTestId('pulse-sell-token-selector-symbol')
      ).toHaveTextContent('TEST');
      // Token USD value is displayed with formatting (multiple elements may show it)
      expect(screen.getAllByText(/\$100/).length).toBeGreaterThan(0);
      expect(screen.getByTestId('pulse-sell-token-balance')).toHaveTextContent(
        '100.5 TEST($10050.00)'
      );
    });
  });

  describe('handles user interactions', () => {
    it('token amount input changes', () => {
      renderWithProviders();

      const input = screen.getByTestId('pulse-sell-amount-input');
      fireEvent.change(input, { target: { value: '10.5' } });

      expect(input).toHaveValue('10.5');
      expect(mockProps.setTokenAmount).toHaveBeenCalledWith('10.5');
    });

    it('invalid input gracefully', () => {
      renderWithProviders();

      const input = screen.getByTestId('pulse-sell-amount-input');
      fireEvent.change(input, { target: { value: 'invalid' } });

      expect(input).toHaveValue('');
    });

    it('percentage buttons', () => {
      renderWithProviders();

      const tenPercentButton = screen.getByTestId(
        'pulse-sell-percentage-button-10%'
      );
      fireEvent.click(tenPercentButton);

      // Multiple elements show the value (desktop and mobile versions)
      expect(screen.getAllByText('10.05').length).toBeGreaterThan(0);
    });

    it('MAX button', () => {
      // Render with MAX button included in customSellAmounts
      renderWithProviders({
        customSellAmounts: ['10%', '25%', '50%', '75%', 'MAX'],
      });

      const maxButton = screen.getByTestId('pulse-sell-percentage-button-max');
      fireEvent.click(maxButton);

      // Multiple elements show the value (desktop and mobile versions)
      expect(screen.getAllByText('100.5').length).toBeGreaterThan(0);
    });

    it('token selector click', () => {
      renderWithProviders();

      const tokenSelector = screen.getByTestId('pulse-sell-token-selector');
      fireEvent.click(tokenSelector);

      expect(mockProps.setSearching).toHaveBeenCalledWith(true);
    });
  });

  describe('handles different states', () => {
    it('disables percentage buttons when no token selected', () => {
      renderWithProviders({ token: null });

      const buttons = [
        'pulse-sell-percentage-button-10%',
        'pulse-sell-percentage-button-25%',
        'pulse-sell-percentage-button-50%',
        'pulse-sell-percentage-button-75%',
      ];

      buttons.forEach((testId) => {
        expect(screen.getByTestId(testId)).toBeDisabled();
      });
    });

    it('shows error when relay has error', () => {
      (useRelaySell as any).mockReturnValue({
        getBestSellOffer: vi.fn(),
        isInitialized: true,
        error: 'Relay error occurred',
      });

      renderWithProviders();

      expect(screen.getByText('Relay error occurred')).toBeInTheDocument();
    });

    it('handles missing wallet portfolio data', () => {
      renderWithProviders({ walletPortfolioData: undefined });

      expect(screen.getByTestId('pulse-sell-token-balance')).toHaveTextContent(
        '0 TEST($0.00)'
      );
    });
  });
});
