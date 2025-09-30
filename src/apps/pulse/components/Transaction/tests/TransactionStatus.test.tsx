/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-props-no-spreading */
import { act, fireEvent, render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { vi } from 'vitest';

// hooks
import { useClickOutside } from '../../../hooks/useClickOutside';
import { useKeyboardNavigation } from '../../../hooks/useKeyboardNavigation';

// types
import { TransactionStatusState } from '../../../types/types';

// components
import TransactionStatus from '../TransactionStatus';

// Mock all dependencies
vi.mock('../../../../hooks/useTransactionKit', () => ({
  default: () => ({
    walletAddress: '0x1234567890123456789012345678901234567890',
  }),
}));

// Mock the TransactionDetails component
vi.mock('../TransactionDetails', () => ({
  default: ({ status, onDone }: { status: string; onDone: () => void }) => (
    <div data-testid="transaction-details">
      <div data-testid="details-status">{status}</div>
      <button type="button" onClick={onDone} data-testid="details-done-button">
        Done
      </button>
    </div>
  ),
}));

// Mock the TransactionStatusContainer component
vi.mock('../TransactionStatusContainer', () => ({
  default: ({
    status,
    onViewDetails,
  }: {
    status: string;
    onViewDetails: () => void;
  }) => (
    <div data-testid="transaction-status-container">
      <div data-testid="container-status">{status}</div>
      <button
        type="button"
        onClick={onViewDetails}
        data-testid="view-details-button"
      >
        View Details
      </button>
    </div>
  ),
}));

// Mock the custom hooks
vi.mock('../../../hooks/useClickOutside', () => ({
  useClickOutside: vi.fn(),
}));

vi.mock('../../../hooks/useKeyboardNavigation', () => ({
  useKeyboardNavigation: vi.fn(),
}));

const baseProps = {
  currentStatus: 'Starting Transaction' as TransactionStatusState,
  closeTransactionStatus: vi.fn(),
  userOpHash:
    '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  chainId: 1,
  isBuy: false,
  sellToken: {
    name: 'Test Token',
    symbol: 'TEST',
    logo: 'test-logo.png',
    usdValue: '100.00',
    dailyPriceChange: 0.05,
    chainId: 1,
    decimals: 18,
    address: '0x1234567890123456789012345678901234567890',
  },
  buyToken: null,
  tokenAmount: '100',
  sellOffer: {
    tokenAmountToReceive: 50.0,
    minimumReceive: 45.0,
    slippageTolerance: 0.01,
    offer: {} as any,
  },
  payingTokens: undefined,
  usdAmount: undefined,
  submittedAt: new Date('2023-01-01T00:00:00Z'),
  pendingCompletedAt: undefined,
  resourceLockCompletedAt: undefined,
  txHash: undefined,
  gasFee: '0.001',
  errorDetails: '',
  resourceLockTxHash: undefined,
  completedTxHash: undefined,
  resourceLockChainId: undefined,
  completedChainId: undefined,
  isResourceLockFailed: false,
};

describe('<TransactionStatus />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock implementations
    vi.mocked(useClickOutside).mockImplementation(() => {});
    vi.mocked(useKeyboardNavigation).mockImplementation(() => {});
  });

  describe('Rendering', () => {
    it('renders correctly and matches snapshot', () => {
      const tree = renderer
        .create(<TransactionStatus {...baseProps} />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('renders with starting transaction status', () => {
      render(
        <TransactionStatus
          {...baseProps}
          currentStatus="Starting Transaction"
        />
      );

      expect(
        screen.getByTestId('transaction-status-container')
      ).toBeInTheDocument();
      expect(screen.getByTestId('container-status')).toHaveTextContent(
        'Starting Transaction'
      );
    });

    it('renders with pending transaction status', () => {
      render(
        <TransactionStatus {...baseProps} currentStatus="Transaction Pending" />
      );

      expect(
        screen.getByTestId('transaction-status-container')
      ).toBeInTheDocument();
      expect(screen.getByTestId('container-status')).toHaveTextContent(
        'Transaction Pending'
      );
    });

    it('renders with completed transaction status', () => {
      render(
        <TransactionStatus
          {...baseProps}
          currentStatus="Transaction Complete"
        />
      );

      expect(
        screen.getByTestId('transaction-status-container')
      ).toBeInTheDocument();
      expect(screen.getByTestId('container-status')).toHaveTextContent(
        'Transaction Complete'
      );
    });

    it('renders with failed transaction status', () => {
      render(
        <TransactionStatus {...baseProps} currentStatus="Transaction Failed" />
      );

      expect(
        screen.getByTestId('transaction-status-container')
      ).toBeInTheDocument();
      expect(screen.getByTestId('container-status')).toHaveTextContent(
        'Transaction Failed'
      );
    });
  });

  describe('Auto-show details behavior', () => {
    it('automatically shows details for completed transactions after 1 second', async () => {
      vi.useFakeTimers();

      render(
        <TransactionStatus
          {...baseProps}
          currentStatus="Transaction Complete"
        />
      );

      // Initially should show container
      expect(
        screen.getByTestId('transaction-status-container')
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('transaction-details')
      ).not.toBeInTheDocument();

      // Fast-forward time by 1 second
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      // Should now show details
      expect(screen.getByTestId('transaction-details')).toBeInTheDocument();
      expect(
        screen.queryByTestId('transaction-status-container')
      ).not.toBeInTheDocument();

      vi.useRealTimers();
    });

    it('automatically shows details for failed transactions after 1 second', async () => {
      vi.useFakeTimers();

      render(
        <TransactionStatus {...baseProps} currentStatus="Transaction Failed" />
      );

      // Initially should show container
      expect(
        screen.getByTestId('transaction-status-container')
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('transaction-details')
      ).not.toBeInTheDocument();

      // Fast-forward time by 1 second
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      // Should now show details
      expect(screen.getByTestId('transaction-details')).toBeInTheDocument();
      expect(
        screen.queryByTestId('transaction-status-container')
      ).not.toBeInTheDocument();

      vi.useRealTimers();
    });

    it('does not auto-show details for pending transactions', () => {
      vi.useFakeTimers();

      render(
        <TransactionStatus {...baseProps} currentStatus="Transaction Pending" />
      );

      // Fast-forward time by 1 second
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      // Should still show container, not details
      expect(
        screen.getByTestId('transaction-status-container')
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('transaction-details')
      ).not.toBeInTheDocument();

      vi.useRealTimers();
    });
  });

  describe('User interactions', () => {
    it('shows details when view details button is clicked', () => {
      render(
        <TransactionStatus
          {...baseProps}
          currentStatus="Starting Transaction"
        />
      );

      // Initially showing container
      expect(
        screen.getByTestId('transaction-status-container')
      ).toBeInTheDocument();

      // Click view details
      fireEvent.click(screen.getByTestId('view-details-button'));

      // Should now show details
      expect(screen.getByTestId('transaction-details')).toBeInTheDocument();
      expect(
        screen.queryByTestId('transaction-status-container')
      ).not.toBeInTheDocument();
    });

    it('closes transaction when done button is clicked in details', () => {
      render(
        <TransactionStatus
          {...baseProps}
          currentStatus="Transaction Complete"
        />
      );

      // Click view details first
      fireEvent.click(screen.getByTestId('view-details-button'));

      // Click done button
      fireEvent.click(screen.getByTestId('details-done-button'));

      expect(baseProps.closeTransactionStatus).toHaveBeenCalled();
    });

    it('handles ESC key press for completed transactions', () => {
      let onEscapeCallback: (() => void) | undefined;

      vi.mocked(useKeyboardNavigation).mockImplementation(
        ({ onEscape }: { onEscape: () => void }) => {
          onEscapeCallback = onEscape;
        }
      );

      render(
        <TransactionStatus
          {...baseProps}
          currentStatus="Transaction Complete"
        />
      );

      // Simulate ESC key press
      if (onEscapeCallback) {
        act(() => {
          onEscapeCallback!();
        });
      }

      expect(baseProps.closeTransactionStatus).toHaveBeenCalled();
    });

    it('handles ESC key press for failed transactions', () => {
      let onEscapeCallback: (() => void) | undefined;

      vi.mocked(useKeyboardNavigation).mockImplementation(
        ({ onEscape }: { onEscape: () => void }) => {
          onEscapeCallback = onEscape;
        }
      );

      render(
        <TransactionStatus {...baseProps} currentStatus="Transaction Failed" />
      );

      // Simulate ESC key press
      if (onEscapeCallback) {
        act(() => {
          onEscapeCallback!();
        });
      }

      expect(baseProps.closeTransactionStatus).toHaveBeenCalled();
    });

    it('handles ESC key press for pending transactions (returns to main view)', () => {
      let onEscapeCallback: (() => void) | undefined;

      vi.mocked(useKeyboardNavigation).mockImplementation(
        ({ onEscape }: { onEscape: () => void }) => {
          onEscapeCallback = onEscape;
        }
      );

      render(
        <TransactionStatus {...baseProps} currentStatus="Transaction Pending" />
      );

      // First show details
      fireEvent.click(screen.getByTestId('view-details-button'));
      expect(screen.getByTestId('transaction-details')).toBeInTheDocument();

      // Simulate ESC key press
      if (onEscapeCallback) {
        act(() => {
          onEscapeCallback!();
        });
      }

      // Should return to main view, not close entirely
      expect(
        screen.getByTestId('transaction-status-container')
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('transaction-details')
      ).not.toBeInTheDocument();
      expect(baseProps.closeTransactionStatus).not.toHaveBeenCalled();
    });

    it('handles click outside for completed transactions', () => {
      let callback: (() => void) | undefined;

      vi.mocked(useClickOutside).mockImplementation(
        ({ callback: cb }: { callback: () => void }) => {
          callback = cb;
        }
      );

      render(
        <TransactionStatus
          {...baseProps}
          currentStatus="Transaction Complete"
        />
      );

      // Simulate click outside
      if (callback) {
        act(() => {
          callback!();
        });
      }

      expect(baseProps.closeTransactionStatus).toHaveBeenCalled();
    });

    it('handles click outside for failed transactions', () => {
      let callback: (() => void) | undefined;

      vi.mocked(useClickOutside).mockImplementation(
        ({ callback: cb }: { callback: () => void }) => {
          callback = cb;
        }
      );

      render(
        <TransactionStatus {...baseProps} currentStatus="Transaction Failed" />
      );

      // Simulate click outside
      if (callback) {
        act(() => {
          callback!();
        });
      }

      expect(baseProps.closeTransactionStatus).toHaveBeenCalled();
    });
  });

  describe('Hook integration', () => {
    it('calls useClickOutside with correct parameters for completed transactions', () => {
      render(
        <TransactionStatus
          {...baseProps}
          currentStatus="Transaction Complete"
        />
      );

      expect(useClickOutside).toHaveBeenCalledWith({
        ref: expect.any(Object),
        callback: expect.any(Function),
        condition: true,
      });
    });

    it('calls useClickOutside with correct parameters for failed transactions', () => {
      render(
        <TransactionStatus {...baseProps} currentStatus="Transaction Failed" />
      );

      expect(useClickOutside).toHaveBeenCalledWith({
        ref: expect.any(Object),
        callback: expect.any(Function),
        condition: true,
      });
    });

    it('calls useKeyboardNavigation with correct parameters', () => {
      render(
        <TransactionStatus
          {...baseProps}
          currentStatus="Transaction Complete"
        />
      );

      expect(useKeyboardNavigation).toHaveBeenCalledWith({
        onEscape: expect.any(Function),
      });
    });
  });

  describe('Props passing', () => {
    it('passes correct props to TransactionDetails', () => {
      render(
        <TransactionStatus
          {...baseProps}
          currentStatus="Transaction Complete"
        />
      );

      // Click view details to show TransactionDetails
      fireEvent.click(screen.getByTestId('view-details-button'));

      expect(screen.getByTestId('transaction-details')).toBeInTheDocument();
      expect(screen.getByTestId('details-status')).toHaveTextContent(
        'Transaction Complete'
      );
    });
  });
});
