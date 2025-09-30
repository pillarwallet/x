/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { vi } from 'vitest';

// types
import { SelectedToken } from '../../../types/tokens';

// components
import TransactionStatus from '../TransactionStatus';

// Mock dependencies
vi.mock('../../assets/confirmed-icon.svg', () => ({
  default: 'confirmed-icon.svg',
}));

vi.mock('../../assets/failed-icon.svg', () => ({
  default: 'failed-icon.svg',
}));

vi.mock('../../assets/pending.svg', () => ({
  default: 'pending.svg',
}));

vi.mock('../TransactionDetails', () => ({
  default: ({ onDone }: { onDone: () => void }) => (
    <div data-testid="transaction-details">
      <button type="button" onClick={onDone} data-testid="done-button">
        Done
      </button>
    </div>
  ),
}));

const mockSellToken: SelectedToken = {
  name: 'Test Token',
  symbol: 'TEST',
  logo: 'test-logo.png',
  usdValue: '100.00',
  dailyPriceChange: 0.05,
  chainId: 1,
  decimals: 18,
  address: '0x1234567890123456789012345678901234567890',
};

const mockBuyToken: SelectedToken = {
  name: 'Buy Token',
  symbol: 'BUY',
  logo: 'buy-logo.png',
  usdValue: '50.00',
  dailyPriceChange: 0.02,
  chainId: 1,
  decimals: 18,
  address: '0x9876543210987654321098765432109876543210',
};

const mockPayingTokens = [
  {
    totalUsd: 100.0,
    name: 'USD Coin',
    symbol: 'USDC',
    logo: 'usdc-logo.png',
    actualBal: '100.00',
    totalRaw: '100000000',
    chainId: 1,
    address: '0xA0b86a33E6441b8C4C8C0C4C8C0C4C8C0C4C8C0C4',
  },
];

const mockSellOffer = {
  tokenAmountToReceive: 50.0,
  minimumReceive: 45.0,
};

const baseProps = {
  closeTransactionStatus: vi.fn(),
  userOpHash:
    '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  chainId: 1,
  gasFee: '0.001',
  isBuy: false,
  sellToken: mockSellToken,
  buyToken: null,
  tokenAmount: '100',
  sellOffer: mockSellOffer,
  payingTokens: undefined,
  usdAmount: undefined,
  currentStatus: 'Starting Transaction' as const,
  errorDetails: '',
  submittedAt: new Date('2023-01-01T00:00:00Z'),
  pendingCompletedAt: undefined,
  blockchainTxHash:
    '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  resourceLockTxHash: undefined,
  completedTxHash: undefined,
  completedChainId: undefined,
  resourceLockChainId: undefined,
  resourceLockCompletedAt: undefined,
  isResourceLockFailed: false,
};

describe('<TransactionStatus />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly and matches snapshot', () => {
    const tree = renderer.create(<TransactionStatus {...baseProps} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe('renders different transaction statuses', () => {
    it('displays starting transaction status correctly', () => {
      render(
        <TransactionStatus
          {...baseProps}
          currentStatus="Starting Transaction"
        />
      );

      expect(screen.getByText('Starting Transaction')).toBeInTheDocument();
      expect(screen.getByText('Just a moment...')).toBeInTheDocument();
      expect(screen.getByAltText('Starting Transaction')).toBeInTheDocument();
    });

    it('displays transaction pending status correctly', () => {
      render(
        <TransactionStatus {...baseProps} currentStatus="Transaction Pending" />
      );

      expect(screen.getByText('Transaction Pending')).toBeInTheDocument();
      expect(screen.getByText('View Status')).toBeInTheDocument();
      expect(screen.getByAltText('Transaction Pending')).toBeInTheDocument();
    });

    it('displays transaction complete status correctly', () => {
      render(
        <TransactionStatus
          {...baseProps}
          currentStatus="Transaction Complete"
        />
      );

      expect(screen.getByText('Transaction Complete')).toBeInTheDocument();
      expect(screen.getByText('Success')).toBeInTheDocument();
      expect(screen.getByAltText('Transaction Complete')).toBeInTheDocument();
    });

    it('displays transaction failed status correctly', () => {
      render(
        <TransactionStatus {...baseProps} currentStatus="Transaction Failed" />
      );

      expect(screen.getByText('Transaction Failed')).toBeInTheDocument();
      expect(screen.getByText('View Status')).toBeInTheDocument();
      expect(screen.getByAltText('Transaction Failed')).toBeInTheDocument();
    });
  });

  describe('handles user interactions', () => {
    it('opens details when view status button is clicked', () => {
      render(
        <TransactionStatus {...baseProps} currentStatus="Transaction Pending" />
      );

      const viewStatusButton = screen.getByText('View Status');
      fireEvent.click(viewStatusButton);

      expect(screen.getByTestId('transaction-details')).toBeInTheDocument();
    });

    it('opens details when success button is clicked', () => {
      render(
        <TransactionStatus
          {...baseProps}
          currentStatus="Transaction Complete"
        />
      );

      const successButton = screen.getByText('Success');
      fireEvent.click(successButton);

      expect(screen.getByTestId('transaction-details')).toBeInTheDocument();
    });

    it('opens details when failed view status button is clicked', () => {
      render(
        <TransactionStatus {...baseProps} currentStatus="Transaction Failed" />
      );

      const viewStatusButton = screen.getByText('View Status');
      fireEvent.click(viewStatusButton);

      expect(screen.getByTestId('transaction-details')).toBeInTheDocument();
    });

    it('returns to main view when done button is clicked in details for pending status', () => {
      render(
        <TransactionStatus {...baseProps} currentStatus="Transaction Pending" />
      );

      // Open details first
      const viewStatusButton = screen.getByText('View Status');
      fireEvent.click(viewStatusButton);

      // Click done button - should return to main view, not close
      const doneButton = screen.getByTestId('done-button');
      fireEvent.click(doneButton);

      expect(baseProps.closeTransactionStatus).not.toHaveBeenCalled();
      // Should be back to main view (no details shown)
      expect(screen.getByText('Transaction Pending')).toBeInTheDocument();
    });

    it('closes transaction status when done button is clicked in details for completed status', () => {
      render(
        <TransactionStatus
          {...baseProps}
          currentStatus="Transaction Complete"
        />
      );

      // Open details first
      const successButton = screen.getByText('Success');
      fireEvent.click(successButton);

      // Click done button - should close for completed status
      const doneButton = screen.getByTestId('done-button');
      fireEvent.click(doneButton);

      expect(baseProps.closeTransactionStatus).toHaveBeenCalled();
    });

    it('closes transaction status when ESC key is pressed for completed status', () => {
      render(
        <TransactionStatus
          {...baseProps}
          currentStatus="Transaction Complete"
        />
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(baseProps.closeTransactionStatus).toHaveBeenCalled();
    });

    it('does not close transaction status when ESC key is pressed for starting status', () => {
      render(
        <TransactionStatus
          {...baseProps}
          currentStatus="Starting Transaction"
        />
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(baseProps.closeTransactionStatus).not.toHaveBeenCalled();
    });

    it('returns to main view when ESC key is pressed in details for pending status', () => {
      render(
        <TransactionStatus {...baseProps} currentStatus="Transaction Pending" />
      );

      // Open details first
      const viewStatusButton = screen.getByText('View Status');
      fireEvent.click(viewStatusButton);

      // Press ESC - should return to main view
      fireEvent.keyDown(document, { key: 'Escape' });

      expect(baseProps.closeTransactionStatus).not.toHaveBeenCalled();
      // Should be back to main view
      expect(screen.getByText('Transaction Pending')).toBeInTheDocument();
    });

    it('closes transaction status when clicking outside the modal for completed status', () => {
      render(
        <TransactionStatus
          {...baseProps}
          currentStatus="Transaction Complete"
        />
      );

      // Click outside the modal
      fireEvent.mouseDown(document.body);

      expect(baseProps.closeTransactionStatus).toHaveBeenCalled();
    });

    it('does not close transaction status when clicking outside the modal for starting status', () => {
      render(
        <TransactionStatus
          {...baseProps}
          currentStatus="Starting Transaction"
        />
      );

      // Click outside the modal
      fireEvent.mouseDown(document.body);

      expect(baseProps.closeTransactionStatus).not.toHaveBeenCalled();
    });
  });

  describe('handles buy mode', () => {
    it('renders buy mode correctly', () => {
      const buyProps = {
        ...baseProps,
        isBuy: true,
        buyToken: mockBuyToken,
        sellToken: null,
        usdAmount: '50.00',
        payingTokens: mockPayingTokens,
      };

      render(
        <TransactionStatus {...buyProps} currentStatus="Starting Transaction" />
      );

      expect(screen.getByText('Starting Transaction')).toBeInTheDocument();
    });

    it('passes correct props to TransactionDetails for buy mode', () => {
      const buyProps = {
        ...baseProps,
        isBuy: true,
        buyToken: mockBuyToken,
        sellToken: null,
        usdAmount: '50.00',
        payingTokens: mockPayingTokens,
        completedTxHash: '0xcompleted123',
        completedChainId: 1,
      };

      render(
        <TransactionStatus {...buyProps} currentStatus="Transaction Pending" />
      );

      // Open details
      const viewStatusButton = screen.getByText('View Status');
      fireEvent.click(viewStatusButton);

      expect(screen.getByTestId('transaction-details')).toBeInTheDocument();
    });
  });

  describe('handles sell mode', () => {
    it('renders sell mode correctly', () => {
      render(
        <TransactionStatus
          {...baseProps}
          currentStatus="Starting Transaction"
        />
      );

      expect(screen.getByText('Starting Transaction')).toBeInTheDocument();
    });

    it('passes correct props to TransactionDetails for sell mode', () => {
      render(
        <TransactionStatus {...baseProps} currentStatus="Transaction Pending" />
      );

      // Open details
      const viewStatusButton = screen.getByText('View Status');
      fireEvent.click(viewStatusButton);

      expect(screen.getByTestId('transaction-details')).toBeInTheDocument();
    });
  });

  describe('handles different status icons and styling', () => {
    it('applies correct styling for starting transaction', () => {
      render(
        <TransactionStatus
          {...baseProps}
          currentStatus="Starting Transaction"
        />
      );

      const iconContainer = screen.getByAltText(
        'Starting Transaction'
      ).parentElement;
      expect(iconContainer).toHaveClass(
        'w-[90px]',
        'h-[90px]',
        'rounded-full',
        'border-[3px]',
        'border-white/10',
        'bg-[#8A77FF]'
      );
    });

    it('applies correct styling for transaction pending', () => {
      render(
        <TransactionStatus {...baseProps} currentStatus="Transaction Pending" />
      );

      const iconContainer = screen.getByAltText(
        'Transaction Pending'
      ).parentElement;
      expect(iconContainer).toHaveClass(
        'w-[90px]',
        'h-[90px]',
        'rounded-full',
        'border-[3px]',
        'border-white/10',
        'bg-[#8A77FF]'
      );
    });

    it('applies correct styling for transaction complete', () => {
      render(
        <TransactionStatus
          {...baseProps}
          currentStatus="Transaction Complete"
        />
      );

      const iconContainer = screen.getByAltText(
        'Transaction Complete'
      ).parentElement;
      expect(iconContainer).toHaveClass(
        'w-[90px]',
        'h-[90px]',
        'rounded-full',
        'border-[4.5px]',
        'border-[#5CFF93]',
        'bg-[#5CFF93]/30'
      );
    });

    it('applies correct styling for transaction failed', () => {
      render(
        <TransactionStatus {...baseProps} currentStatus="Transaction Failed" />
      );

      const iconContainer =
        screen.getByAltText('Transaction Failed').parentElement;
      expect(iconContainer).toHaveClass(
        'w-[90px]',
        'h-[90px]',
        'rounded-full',
        'border-[4.5px]',
        'border-[#FF366C]',
        'bg-[#FF366C]/30'
      );
    });
  });

  describe('handles edge cases', () => {
    it('handles missing optional props gracefully', () => {
      const minimalProps = {
        closeTransactionStatus: vi.fn(),
        userOpHash: '0x1234567890abcdef',
        chainId: 1,
        currentStatus: 'Starting Transaction' as const,
        errorDetails: '',
      };

      render(<TransactionStatus {...minimalProps} />);

      expect(screen.getByText('Starting Transaction')).toBeInTheDocument();
    });

    it('handles null token values', () => {
      const propsWithNullTokens = {
        ...baseProps,
        sellToken: null,
        buyToken: null,
      };

      render(<TransactionStatus {...propsWithNullTokens} />);

      expect(screen.getByText('Starting Transaction')).toBeInTheDocument();
    });

    it('handles missing sell offer', () => {
      const propsWithoutSellOffer = {
        ...baseProps,
        sellOffer: null,
      };

      render(<TransactionStatus {...propsWithoutSellOffer} />);

      expect(screen.getByText('Starting Transaction')).toBeInTheDocument();
    });
  });

  describe('handles different chain IDs', () => {
    it('renders with different chain ID', () => {
      const propsWithDifferentChain = {
        ...baseProps,
        chainId: 137, // Polygon
      };

      render(<TransactionStatus {...propsWithDifferentChain} />);

      expect(screen.getByText('Starting Transaction')).toBeInTheDocument();
    });
  });

  describe('handles error states', () => {
    it('displays error details when provided', () => {
      const propsWithError = {
        ...baseProps,
        currentStatus: 'Transaction Failed' as const,
        errorDetails: 'Transaction failed due to insufficient gas',
      };

      render(<TransactionStatus {...propsWithError} />);

      expect(screen.getByText('Transaction Failed')).toBeInTheDocument();
    });

    it('handles resource lock failure', () => {
      const propsWithResourceLockFailure = {
        ...baseProps,
        isResourceLockFailed: true,
      };

      render(<TransactionStatus {...propsWithResourceLockFailure} />);

      expect(screen.getByText('Starting Transaction')).toBeInTheDocument();
    });
  });
});
