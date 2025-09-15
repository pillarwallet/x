/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { vi } from 'vitest';

// hooks
import { useTransactionDebugLogger } from '../../../../../hooks/useTransactionDebugLogger';
import useRelaySell from '../../../hooks/useRelaySell';

// components
import PreviewSell from '../PreviewSell';

// Mock dependencies
vi.mock('../../../hooks/useRelaySell', () => ({
  default: vi.fn(),
}));

vi.mock('../../../../../hooks/useTransactionDebugLogger', () => ({
  useTransactionDebugLogger: vi.fn(),
}));

vi.mock('react-copy-to-clipboard', () => ({
  CopyToClipboard: ({ children, onCopy }: any) => (
    <div data-testid="copy-to-clipboard" onClick={onCopy}>
      {children}
    </div>
  ),
}));

vi.mock('../../../../utils/blockchain', () => ({
  getLogoForChainId: vi.fn(() => '/src/assets/images/logo-ethereum.png'),
}));

vi.mock('../../../../utils/number', () => ({
  limitDigitsNumber: vi.fn((num: number) => num.toString()),
}));

const mockToken = {
  name: 'Test Token',
  symbol: 'TEST',
  logo: 'test-logo.png',
  usdValue: '100.000',
  dailyPriceChange: 0.05,
  chainId: 1,
  decimals: 18,
  address: '0x1234567890123456789012345678901234567890',
};

const mockSellOffer = {
  tokenAmountToReceive: 50.0,
  minimumReceive: 49.5,
  priceImpact: 0.0,
  slippageTolerance: 3.0,
  offer: {
    steps: [],
    minimumReceived: 49.5,
    priceImpact: 0.0,
    slippage: 3.0,
    gasFee: 0.0,
  } as any,
};

const mockWalletPortfolioData = {
  result: {
    data: {
      assets: [
        {
          asset: { symbol: 'TEST' },
          contracts_balances: [
            {
              address: '0x1234567890123456789012345678901234567890',
              chainId: 'evm:1',
              balance: 100.5,
            },
          ],
        },
      ],
      total_wallet_balance: 100.5,
      wallets: [],
      balances_length: 1,
    },
  },
} as any;

const mockProps = {
  closePreview: vi.fn(),
  sellToken: mockToken,
  sellOffer: mockSellOffer,
  tokenAmount: '10.5',
  walletPortfolioData: mockWalletPortfolioData,
  onRefresh: vi.fn(),
};

const renderWithProviders = (props = {}) => {
  return render(<PreviewSell {...mockProps} {...props} />);
};

describe('<PreviewSell />', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useRelaySell as any).mockReturnValue({
      getUSDCAddress: vi.fn(() => '0xUSDC1234567890'),
      executeSell: vi.fn(),
      error: null,
      clearError: vi.fn(),
    });

    (useTransactionDebugLogger as any).mockReturnValue({
      transactionDebugLog: vi.fn(),
    });
  });

  it('renders correctly and matches snapshot', () => {
    const tree = renderer.create(<PreviewSell {...mockProps} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe('renders preview interface', () => {
    it('displays main elements correctly', () => {
      renderWithProviders();

      expect(screen.getByText('Confirm Transaction')).toBeInTheDocument();
      expect(screen.getByText('Test Token')).toBeInTheDocument();
      expect(screen.getByText('USD Coin')).toBeInTheDocument();
      expect(screen.getByText('50.000000')).toBeInTheDocument();
      expect(screen.getByText('$50.00')).toBeInTheDocument();
      expect(screen.getByText('Details')).toBeInTheDocument();
      expect(screen.getByText('Rate')).toBeInTheDocument();
      expect(screen.getByText('Minimum receive')).toBeInTheDocument();
      expect(screen.getByText('Confirm')).toBeInTheDocument();
    });

    it('displays transaction details', () => {
      renderWithProviders();

      expect(screen.getByText('1 TEST ≈ 100.000')).toBeInTheDocument();
      expect(screen.getByText('50.000000')).toBeInTheDocument();
      expect(screen.getAllByText('USDC')).toHaveLength(2);
      expect(screen.getByText('Details')).toBeInTheDocument();
      expect(screen.getByText('Rate')).toBeInTheDocument();
      expect(screen.getByText('Minimum receive')).toBeInTheDocument();
    });

    it('shows copy functionality when USDC address is available', () => {
      renderWithProviders();

      expect(screen.getAllByTestId('copy-to-clipboard')).toHaveLength(2);
      expect(screen.getByText('0xUSDC...7890')).toBeInTheDocument();
    });
  });

  describe('handles user interactions', () => {
    it('executes copy functionality', async () => {
      renderWithProviders();

      const copyButtons = screen.getAllByTestId('copy-to-clipboard');
      const copyButton = copyButtons[0];
      fireEvent.click(copyButton);

      await waitFor(() => {
        const copyContainers = screen.getAllByTestId('copy-to-clipboard');
        const copyContainer = copyContainers[0];
        const checkmarkSvg = copyContainer.querySelector('svg');
        expect(checkmarkSvg).toBeInTheDocument();
      });
    });

    it('executes sell transaction', async () => {
      const mockExecuteSell = vi
        .fn()
        .mockResolvedValue('0xTransactionHash123456789');
      (useRelaySell as any).mockReturnValue({
        getUSDCAddress: vi.fn(() => '0xUSDC1234567890'),
        executeSell: mockExecuteSell,
        error: null,
        clearError: vi.fn(),
      });

      renderWithProviders();

      const confirmButton = screen.getByText('Confirm');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(
          screen.getByText(
            'Please open your wallet and confirm the transaction.'
          )
        ).toBeInTheDocument();
      });

      expect(mockExecuteSell).toHaveBeenCalledWith(mockToken, '10.5');
    });

    it('handles close functionality', () => {
      renderWithProviders();

      const closeButton = screen.getByLabelText('Close');
      fireEvent.click(closeButton);

      expect(mockProps.closePreview).toHaveBeenCalled();
    });
  });

  describe('handles error states', () => {
    it('displays relay error', () => {
      (useRelaySell as any).mockReturnValue({
        getUSDCAddress: vi.fn(() => '0xUSDC1234567890'),
        executeSell: vi.fn(),
        error: 'Relay error occurred',
        clearError: vi.fn(),
      });

      renderWithProviders();

      expect(screen.getByText('Relay error occurred')).toBeInTheDocument();
    });

    it('handles missing sell token', () => {
      renderWithProviders({ sellToken: null });

      expect(
        screen.getByText(
          'No offer was found. Please check the token and the input amount and try again.'
        )
      ).toBeInTheDocument();
    });

    it('handles missing sell offer', () => {
      renderWithProviders({ sellOffer: null });

      expect(
        screen.getByText(
          'No offer was found. Please check the token and the input amount and try again.'
        )
      ).toBeInTheDocument();
    });
  });

  describe('handles edge cases', () => {
    it('handles missing USDC address', () => {
      (useRelaySell as any).mockReturnValue({
        getUSDCAddress: vi.fn(() => null),
        executeSell: vi.fn(),
        error: null,
        clearError: vi.fn(),
      });

      renderWithProviders();

      expect(screen.getAllByTestId('copy-to-clipboard')).toHaveLength(1);
    });

    it('handles token without logo', () => {
      const tokenWithoutLogo = { ...mockToken, logo: '' };
      renderWithProviders({ sellToken: tokenWithoutLogo });

      expect(screen.getByTestId('random-avatar')).toBeInTheDocument();
    });

    it('handles missing wallet portfolio data', () => {
      renderWithProviders({ walletPortfolioData: undefined });

      expect(
        screen.getAllByText((content, element) => {
          return !!(
            element?.textContent?.includes('10.500000') &&
            element?.textContent?.includes('TEST')
          );
        })
      ).toHaveLength(5);
    });
  });
});
