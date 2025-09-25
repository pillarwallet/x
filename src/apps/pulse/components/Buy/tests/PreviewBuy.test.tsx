/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExpressIntentResponse } from '@etherspot/intent-sdk/dist/cjs/sdk/types/user-intent-types';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { vi } from 'vitest';

// hooks
import useIntentSdk from '../../../hooks/useIntentSdk';

// types
import { PayingToken, SelectedToken } from '../../../types/tokens';

// components
import PreviewBuy from '../PreviewBuy';

// Mock dependencies
vi.mock('../../../hooks/useIntentSdk', () => ({
  default: vi.fn(),
}));

vi.mock('../../../../utils/blockchain', () => ({
  getLogoForChainId: vi.fn(() => '/src/assets/images/logo-ethereum.png'),
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

const mockExpressIntentResponse: ExpressIntentResponse = {
  intentHash: '0xIntentHash123456789',
  bids: [{ bidHash: '0xBidHash123456789' }],
} as any;

const mockProps = {
  closePreview: vi.fn(),
  buyToken: mockToken,
  payingTokens: [mockPayingToken],
  expressIntentResponse: mockExpressIntentResponse,
  setExpressIntentResponse: vi.fn(),
  usdAmount: '100.00',
  dispensableAssets: [],
};

const defaultMocks = () => {
  (useIntentSdk as any).mockReturnValue({
    intentSdk: {
      shortlistBid: vi.fn().mockResolvedValue(undefined),
    },
  });
};

describe('<PreviewBuy />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    defaultMocks();
  });

  it('renders correctly and matches snapshot', () => {
    const tree = renderer.create(<PreviewBuy {...mockProps} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe('renders preview interface', () => {
    it('displays main elements correctly', () => {
      render(<PreviewBuy {...mockProps} />);

      expect(screen.getByText('Confirm Transaction')).toBeInTheDocument();
      expect(screen.getAllByText('USD Coin')).toHaveLength(1);
      expect(screen.getAllByText('TEST')).toHaveLength(2);
      // Check that the component renders the main interface elements
      expect(screen.getByText('Total: $100.00')).toBeInTheDocument();
      expect(screen.getByText('Details')).toBeInTheDocument();
      expect(screen.getByText('Confirm')).toBeInTheDocument();
    });

    it('displays transaction details', () => {
      render(<PreviewBuy {...mockProps} />);

      expect(screen.getByText('Rate')).toBeInTheDocument();
      expect(screen.getByText('Minimum receive')).toBeInTheDocument();
      expect(screen.getByText('Price impact')).toBeInTheDocument();
      expect(screen.getByText('Max slippage')).toBeInTheDocument();
      expect(screen.getByText('Gas fee')).toBeInTheDocument();
    });

    it('shows token address with copy functionality', () => {
      render(<PreviewBuy {...mockProps} />);

      expect(screen.getByText('0x1234...7890')).toBeInTheDocument();
      expect(screen.getAllByAltText('copy-address-icon')).toHaveLength(2);
    });

    it('calculates token amount correctly', () => {
      render(<PreviewBuy {...mockProps} />);

      // 100 USD / 100 USD per token = 1 token
      expect(screen.getByText('1.000000')).toBeInTheDocument();
    });
  });

  describe('handles user interactions', () => {
    it('executes copy functionality', async () => {
      render(<PreviewBuy {...mockProps} />);

      // Check that the copy buttons exist
      const copyButtons = screen.getAllByAltText('copy-address-icon');
      expect(copyButtons).toHaveLength(2);

      // Click the first copy button - this should not throw an error
      expect(() => fireEvent.click(copyButtons[0])).not.toThrow();
    });

    it('executes shortlist bid transaction', async () => {
      const mockShortlistBid = vi.fn().mockResolvedValue(undefined);
      (useIntentSdk as any).mockReturnValue({
        intentSdk: {
          shortlistBid: mockShortlistBid,
        },
      });

      render(<PreviewBuy {...mockProps} />);

      const confirmButton = screen.getByText('Confirm');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(
          screen.getByText(
            'Please open your wallet and confirm the transaction.'
          )
        ).toBeInTheDocument();
      });

      expect(mockShortlistBid).toHaveBeenCalledWith(
        mockExpressIntentResponse.intentHash,
        mockExpressIntentResponse.bids[0].bidHash
      );
    });

    it('handles close functionality', () => {
      render(<PreviewBuy {...mockProps} />);

      const closeButton = screen.getByLabelText('Close');
      fireEvent.click(closeButton);

      expect(mockProps.closePreview).toHaveBeenCalled();
    });

    it('shows intent tracker after successful shortlist', async () => {
      render(<PreviewBuy {...mockProps} />);

      const confirmButton = screen.getByText('Confirm');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(
          screen.getByText(
            'Please open your wallet and confirm the transaction.'
          )
        ).toBeInTheDocument();
      });

      // After shortlist completes, should show tracker
      await waitFor(() => {
        expect(screen.getByText('Resource Lock Creation')).toBeInTheDocument();
      });
    });
  });

  describe('handles error states', () => {
    it('handles shortlist bid failure', async () => {
      (useIntentSdk as any).mockReturnValue({
        intentSdk: {
          shortlistBid: vi
            .fn()
            .mockRejectedValue(new Error('Shortlist failed')),
        },
      });

      render(<PreviewBuy {...mockProps} />);

      const confirmButton = screen.getByText('Confirm');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(
          screen.getByText(
            'Please open your wallet and confirm the transaction.'
          )
        ).toBeInTheDocument();
      });

      // Should not show tracker on error
      expect(
        screen.queryByText(
          'Please open your wallet and confirm the transaction.'
        )
      ).not.toBeInTheDocument();
    });

    it('handles missing buy token', () => {
      render(<PreviewBuy {...mockProps} buyToken={null} />);

      expect(
        screen.getByText(
          'No buy offer was found. Please check the token and the input amount and try again.'
        )
      ).toBeInTheDocument();
      expect(screen.queryByText('Test Token')).not.toBeInTheDocument();
    });

    it('handles missing express intent response', () => {
      render(<PreviewBuy {...mockProps} expressIntentResponse={null} />);

      expect(
        screen.getByText(
          'No buy offer was found. Please check the token and the input amount and try again.'
        )
      ).toBeInTheDocument();
      expect(screen.getByText('Close')).toBeInTheDocument();
    });
  });

  describe('handles edge cases', () => {
    it('handles token without logo', () => {
      const tokenWithoutLogo = { ...mockToken, logo: '' };
      render(<PreviewBuy {...mockProps} buyToken={tokenWithoutLogo} />);

      expect(screen.getByTestId('random-avatar')).toBeInTheDocument();
    });

    it('handles multiple paying tokens', () => {
      const multiplePayingTokens = [
        { ...mockPayingToken, totalUsd: 50.0 },
        { ...mockPayingToken, name: 'Dai', symbol: 'DAI', totalUsd: 50.0 },
      ];

      render(<PreviewBuy {...mockProps} payingTokens={multiplePayingTokens} />);

      expect(screen.getByText('Total: $100.00')).toBeInTheDocument();
    });

    it('handles zero total payment', () => {
      const zeroPayingTokens = [{ ...mockPayingToken, totalUsd: 0 }];

      render(<PreviewBuy {...mockProps} payingTokens={zeroPayingTokens} />);

      expect(screen.getByText('Total: $0.00')).toBeInTheDocument();
    });

    it('handles token with zero USD value', () => {
      const tokenWithZeroValue = { ...mockToken, usdValue: '0' };

      render(<PreviewBuy {...mockProps} buyToken={tokenWithZeroValue} />);

      // Just check that the component renders without crashing
      expect(screen.getByText('Confirm Transaction')).toBeInTheDocument();
    });

    it('handles missing token address', () => {
      const tokenWithoutAddress = { ...mockToken, address: '' };

      render(<PreviewBuy {...mockProps} buyToken={tokenWithoutAddress} />);

      expect(screen.getByText('Address not available')).toBeInTheDocument();
    });
  });

  describe('displays correct calculations', () => {
    it('calculates rate correctly', () => {
      render(<PreviewBuy {...mockProps} />);

      // 1 USD ≈ 0.01 TEST (1 / 100)
      expect(screen.getByText('1 USD ≈ 0.010')).toBeInTheDocument();
    });

    it('displays minimum receive as total payment', () => {
      render(<PreviewBuy {...mockProps} />);

      expect(screen.getAllByText('$100.00')).toHaveLength(2);
    });

    it('shows correct token amount calculation', () => {
      const customPayingTokens = [{ ...mockPayingToken, totalUsd: 250.0 }];
      const customToken = { ...mockToken, usdValue: '50.00' };

      render(
        <PreviewBuy
          {...mockProps}
          buyToken={customToken}
          payingTokens={customPayingTokens}
        />
      );

      // 250 USD / 50 USD per token = 5 tokens
      expect(screen.getByText('5.000000')).toBeInTheDocument();
    });
  });
});
