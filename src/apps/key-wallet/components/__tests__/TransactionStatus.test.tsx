import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import renderer from 'react-test-renderer';
import TransactionStatus from '../TransactionStatus';
import { TransactionStatus as TxStatus } from '../../types';

// Fixed timestamp for consistent test results
const FIXED_TIMESTAMP = new Date('2023-01-01T12:00:00Z').getTime();
// Fixed date string to match what toLocaleString() will return (mocked to this value)
// Using a standard format that matches most locales: "1/1/2023, 12:00:00 PM"
const FIXED_DATE_STRING = '1/1/2023, 12:00:00 PM';

describe('<TransactionStatus />', () => {
  const mockOnClear = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock Date.now() to return fixed timestamp
    vi.spyOn(Date, 'now').mockReturnValue(FIXED_TIMESTAMP);
    // Mock toLocaleString to return fixed string for consistency across locales
    vi.spyOn(Date.prototype, 'toLocaleString').mockReturnValue(FIXED_DATE_STRING);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns null when no transactions', () => {
    const { container } = render(
      <TransactionStatus transactions={[]} onClear={mockOnClear} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders correctly and matches snapshot', () => {
    const transactions: TxStatus[] = [
      {
        hash: '0x1234567890123456789012345678901234567890123456789012345678901234',
        chainId: 1,
        status: 'pending',
        timestamp: FIXED_TIMESTAMP,
      },
    ];
    const tree = renderer
      .create(<TransactionStatus transactions={transactions} onClear={mockOnClear} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('displays pending transaction', () => {
    const transactions: TxStatus[] = [
      {
        hash: '0x1234567890123456789012345678901234567890123456789012345678901234',
        chainId: 1,
        status: 'pending',
        timestamp: FIXED_TIMESTAMP,
      },
    ];

    render(<TransactionStatus transactions={transactions} onClear={mockOnClear} />);

    expect(screen.getByText(/Transaction Pending/i)).toBeInTheDocument();
    expect(screen.getByText(/⏳/)).toBeInTheDocument();
  });

  it('displays success transaction', () => {
    const transactions: TxStatus[] = [
      {
        hash: '0x1234567890123456789012345678901234567890123456789012345678901234',
        chainId: 1,
        status: 'success',
        timestamp: FIXED_TIMESTAMP,
      },
    ];

    render(<TransactionStatus transactions={transactions} onClear={mockOnClear} />);

    expect(screen.getByText(/Transaction Confirmed/i)).toBeInTheDocument();
    expect(screen.getByText(/✓/)).toBeInTheDocument();
  });

  it('displays failed transaction', () => {
    const transactions: TxStatus[] = [
      {
        hash: '0x1234567890123456789012345678901234567890123456789012345678901234',
        chainId: 1,
        status: 'failed',
        timestamp: FIXED_TIMESTAMP,
      },
    ];

    render(<TransactionStatus transactions={transactions} onClear={mockOnClear} />);

    expect(screen.getByText(/Transaction Failed/i)).toBeInTheDocument();
    expect(screen.getByText(/✗/)).toBeInTheDocument();
  });

  it('displays shortened transaction hash', () => {
    const transactions: TxStatus[] = [
      {
        hash: '0x1234567890123456789012345678901234567890123456789012345678901234',
        chainId: 1,
        status: 'pending',
        timestamp: FIXED_TIMESTAMP,
      },
    ];

    render(<TransactionStatus transactions={transactions} onClear={mockOnClear} />);

    // Should show shortened hash (0x12345678...56789012)
    expect(screen.getByText(/0x12345678/)).toBeInTheDocument();
  });

  it('displays timestamp', () => {
    const transactions: TxStatus[] = [
      {
        hash: '0x1234567890123456789012345678901234567890123456789012345678901234',
        chainId: 1,
        status: 'pending',
        timestamp: FIXED_TIMESTAMP,
      },
    ];

    render(<TransactionStatus transactions={transactions} onClear={mockOnClear} />);

    expect(screen.getByText(FIXED_DATE_STRING)).toBeInTheDocument();
  });

  it('displays block explorer link for Ethereum', () => {
    const transactions: TxStatus[] = [
      {
        hash: '0x1234567890123456789012345678901234567890123456789012345678901234',
        chainId: 1,
        status: 'success',
        timestamp: FIXED_TIMESTAMP,
      },
    ];

    render(<TransactionStatus transactions={transactions} onClear={mockOnClear} />);

    const viewLink = screen.getByRole('link', { name: /view/i });
    expect(viewLink).toHaveAttribute(
      'href',
      expect.stringContaining('etherscan.io')
    );
  });

  it('displays block explorer link for Polygon', () => {
    const transactions: TxStatus[] = [
      {
        hash: '0x1234567890123456789012345678901234567890123456789012345678901234',
        chainId: 137,
        status: 'success',
        timestamp: FIXED_TIMESTAMP,
      },
    ];

    render(<TransactionStatus transactions={transactions} onClear={mockOnClear} />);

    const viewLink = screen.getByRole('link', { name: /view/i });
    expect(viewLink).toHaveAttribute(
      'href',
      expect.stringContaining('polygonscan.com')
    );
  });

  it('calls onClear when clear button is clicked', () => {
    const transactions: TxStatus[] = [
      {
        hash: '0xtxhash',
        chainId: 1,
        status: 'pending',
        timestamp: FIXED_TIMESTAMP,
      },
    ];

    render(<TransactionStatus transactions={transactions} onClear={mockOnClear} />);

    const clearButton = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearButton);

    expect(mockOnClear).toHaveBeenCalledTimes(1);
    expect(mockOnClear).toHaveBeenCalledWith('0xtxhash');
  });

  it('displays multiple transactions', () => {
    const transactions: TxStatus[] = [
      {
        hash: '0xhash1',
        chainId: 1,
        status: 'success',
        timestamp: FIXED_TIMESTAMP,
      },
      {
        hash: '0xhash2',
        chainId: 137,
        status: 'pending',
        timestamp: FIXED_TIMESTAMP,
      },
    ];

    render(<TransactionStatus transactions={transactions} onClear={mockOnClear} />);

    expect(screen.getByText(/Transaction Confirmed/i)).toBeInTheDocument();
    expect(screen.getByText(/Transaction Pending/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /clear/i })).toHaveLength(2);
  });
});
