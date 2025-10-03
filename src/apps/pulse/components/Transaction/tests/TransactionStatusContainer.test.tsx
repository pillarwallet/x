import { fireEvent, render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { vi } from 'vitest';

// components
import TransactionStatusContainer from '../TransactionStatusContainer';

// Mock the subcomponents first
vi.mock('../TransactionStatusIcon', () => ({
  default: ({ status }: { status: string }) => (
    <div data-testid="transaction-status-icon">
      <span data-testid="icon-status">{status}</span>
    </div>
  ),
}));

vi.mock('../TransactionStatusButton', () => ({
  default: ({ status, onClick }: { status: string; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      data-testid="transaction-status-button"
    >
      <span data-testid="button-status">{status}</span>
      <span data-testid="button-label">View Details</span>
    </button>
  ),
}));

describe('<TransactionStatusContainer />', () => {
  const mockOnViewDetails = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders correctly and matches snapshot', () => {
      const tree = renderer
        .create(
          <TransactionStatusContainer
            status="Starting Transaction"
            onViewDetails={mockOnViewDetails}
          />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('renders with starting transaction status', () => {
      render(
        <TransactionStatusContainer
          status="Starting Transaction"
          onViewDetails={mockOnViewDetails}
        />
      );

      expect(screen.getByTestId('transaction-status-icon')).toBeInTheDocument();
      expect(screen.getByTestId('icon-status')).toHaveTextContent(
        'Starting Transaction'
      );
      expect(
        screen.getByTestId('transaction-status-button')
      ).toBeInTheDocument();
      expect(screen.getByTestId('button-status')).toHaveTextContent(
        'Starting Transaction'
      );
    });

    it('renders with pending transaction status', () => {
      render(
        <TransactionStatusContainer
          status="Transaction Pending"
          onViewDetails={mockOnViewDetails}
        />
      );

      expect(screen.getByTestId('transaction-status-icon')).toBeInTheDocument();
      expect(screen.getByTestId('icon-status')).toHaveTextContent(
        'Transaction Pending'
      );
      expect(
        screen.getByTestId('transaction-status-button')
      ).toBeInTheDocument();
      expect(screen.getByTestId('button-status')).toHaveTextContent(
        'Transaction Pending'
      );
    });

    it('renders with completed transaction status', () => {
      render(
        <TransactionStatusContainer
          status="Transaction Complete"
          onViewDetails={mockOnViewDetails}
        />
      );

      expect(screen.getByTestId('transaction-status-icon')).toBeInTheDocument();
      expect(screen.getByTestId('icon-status')).toHaveTextContent(
        'Transaction Complete'
      );
      expect(
        screen.getByTestId('transaction-status-button')
      ).toBeInTheDocument();
      expect(screen.getByTestId('button-status')).toHaveTextContent(
        'Transaction Complete'
      );
    });

    it('renders with failed transaction status', () => {
      render(
        <TransactionStatusContainer
          status="Transaction Failed"
          onViewDetails={mockOnViewDetails}
        />
      );

      expect(screen.getByTestId('transaction-status-icon')).toBeInTheDocument();
      expect(screen.getByTestId('icon-status')).toHaveTextContent(
        'Transaction Failed'
      );
      expect(
        screen.getByTestId('transaction-status-button')
      ).toBeInTheDocument();
      expect(screen.getByTestId('button-status')).toHaveTextContent(
        'Transaction Failed'
      );
    });
  });

  describe('User interactions', () => {
    it('calls onViewDetails when button is clicked', () => {
      render(
        <TransactionStatusContainer
          status="Starting Transaction"
          onViewDetails={mockOnViewDetails}
        />
      );

      fireEvent.click(screen.getByTestId('transaction-status-button'));

      expect(mockOnViewDetails).toHaveBeenCalledTimes(1);
    });

    it('passes correct status to both icon and button components', () => {
      render(
        <TransactionStatusContainer
          status="Transaction Pending"
          onViewDetails={mockOnViewDetails}
        />
      );

      expect(screen.getByTestId('icon-status')).toHaveTextContent(
        'Transaction Pending'
      );
      expect(screen.getByTestId('button-status')).toHaveTextContent(
        'Transaction Pending'
      );
    });
  });

  describe('Layout', () => {
    it('has correct CSS classes for layout', () => {
      render(
        <TransactionStatusContainer
          status="Starting Transaction"
          onViewDetails={mockOnViewDetails}
        />
      );

      const container = screen.getByTestId(
        'transaction-status-icon'
      ).parentElement;
      expect(container).toHaveClass(
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'h-full'
      );
    });
  });
});
