/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { vi } from 'vitest';

// components
import TransactionInfo from '../TransactionInfo';

// Mock dependencies
vi.mock('react-copy-to-clipboard', () => ({
  default: ({ children, onCopy, text }: any) => (
    <button
      type="button"
      onClick={() => onCopy(text)}
      data-testid="copy-button"
    >
      {children}
    </button>
  ),
}));

vi.mock('../../../../utils/blockchain', () => ({
  getBlockScan: vi.fn((chainId: number) => {
    const blockScans: Record<number, string> = {
      1: 'https://etherscan.io/tx/',
      137: 'https://polygonscan.com/tx/',
      8453: 'https://basescan.org/tx/',
    };
    return blockScans[chainId] || 'https://etherscan.io/tx/';
  }),
}));

vi.mock('../../../token-atlas/images/external-link-audit.svg', () => ({
  default: 'external-link-audit.svg',
}));

vi.mock('../../assets/confirmed-icon.svg', () => ({
  default: 'confirmed-icon.svg',
}));

vi.mock('../../assets/copy-icon.svg', () => ({
  default: 'copy-icon.svg',
}));

vi.mock('../Misc/Tooltip', () => ({
  default: ({
    children,
    content,
  }: {
    children: React.ReactNode;
    content: string;
  }) => (
    <div data-testid="tooltip" title={content}>
      {children}
    </div>
  ),
}));

// Mock window.open
const mockOpen = vi.fn();
Object.defineProperty(window, 'open', {
  value: mockOpen,
  writable: true,
});

const baseProps = {
  status: 'Starting Transaction' as const,
  userOpHash:
    '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  chainId: 1,
  gasFee: '0.001',
  completedAt: new Date('2023-01-01T12:00:00Z'),
  isBuy: false,
  resourceLockTxHash: undefined,
  resourceLockChainId: undefined,
  completedTxHash: undefined,
  completedChainId: undefined,
};

describe('<TransactionInfo />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOpen.mockClear();
  });

  it('renders correctly and matches snapshot', () => {
    const tree = renderer.create(<TransactionInfo {...baseProps} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe('renders different transaction statuses', () => {
    it('displays starting transaction status correctly', () => {
      render(<TransactionInfo {...baseProps} status="Starting Transaction" />);

      expect(screen.getByText('Starting...')).toBeInTheDocument();
      expect(screen.getByText('Starting...')).toHaveClass('text-white/50');
    });

    it('displays transaction pending status correctly', () => {
      render(<TransactionInfo {...baseProps} status="Transaction Pending" />);

      expect(screen.getByText('Pending')).toBeInTheDocument();
      expect(screen.getByText('Pending')).toHaveClass('text-[#FFAB36]');
    });

    it('displays transaction complete status correctly', () => {
      render(<TransactionInfo {...baseProps} status="Transaction Complete" />);

      expect(screen.getByText('Success')).toBeInTheDocument();
      expect(screen.getByText('Success')).toHaveClass('text-[#5CFF93]');

      const successText = screen.getByText('Success');
      const confirmedIcon = successText
        .closest('div')
        ?.querySelector('img[alt="confirmed"]');
      expect(confirmedIcon).toBeInTheDocument();
    });

    it('displays transaction failed status correctly', () => {
      render(<TransactionInfo {...baseProps} status="Transaction Failed" />);

      expect(screen.getByText('Failed')).toBeInTheDocument();
      expect(screen.getByText('Failed')).toHaveClass('text-[#FF366C]');
    });
  });

  describe('handles sell mode', () => {
    it('displays sell mode information correctly', () => {
      render(<TransactionInfo {...baseProps} />);

      expect(screen.getByText('Tx Hash')).toBeInTheDocument();
      expect(screen.getByText('Gas Fee')).toBeInTheDocument();
      expect(screen.getByText('0.001')).toBeInTheDocument();
    });

    it('displays truncated transaction hash for sell mode', () => {
      render(<TransactionInfo {...baseProps} />);

      expect(screen.getByText('0xabcd...7890')).toBeInTheDocument();
    });

    it('shows external link and copy buttons for valid transaction hash', () => {
      render(<TransactionInfo {...baseProps} />);

      expect(screen.getByAltText('external-link')).toBeInTheDocument();
      expect(screen.getByTestId('copy-button')).toBeInTheDocument();
    });

    it('handles missing transaction hash in sell mode', () => {
      const propsWithoutTxHash = {
        ...baseProps,
        txHash: undefined,
      };

      render(<TransactionInfo {...propsWithoutTxHash} />);

      expect(screen.getByText('-')).toBeInTheDocument();
      expect(screen.queryByAltText('external-link')).not.toBeInTheDocument();
      expect(screen.queryByTestId('copy-button')).not.toBeInTheDocument();
    });
  });

  describe('handles buy mode', () => {
    it('displays buy mode information correctly', () => {
      const buyProps = {
        ...baseProps,
        isBuy: true,
        resourceLockTxHash:
          '0xresource1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        completedTxHash:
          '0xcompleted1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        resourceLockChainId: 1,
        completedChainId: 1,
      };

      render(<TransactionInfo {...buyProps} />);

      expect(screen.getByText('Resource Lock')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('Gas Fee')).toBeInTheDocument();
    });

    it('displays truncated hashes for buy mode', () => {
      const buyProps = {
        ...baseProps,
        isBuy: true,
        resourceLockTxHash:
          '0xresource1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        completedTxHash:
          '0xcompleted1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      };

      render(<TransactionInfo {...buyProps} />);

      expect(screen.getByText('0xreso...7890')).toBeInTheDocument();
      expect(screen.getByText('0xcomp...7890')).toBeInTheDocument();
    });

    it('shows external link and copy buttons for valid hashes in buy mode', () => {
      const buyProps = {
        ...baseProps,
        isBuy: true,
        resourceLockTxHash:
          '0xresource1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        completedTxHash:
          '0xcompleted1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        resourceLockChainId: 1,
        completedChainId: 1,
      };

      render(<TransactionInfo {...buyProps} />);

      const externalLinks = screen.getAllByAltText('external-link');
      const copyButtons = screen.getAllByTestId('copy-button');

      expect(externalLinks).toHaveLength(2);
      expect(copyButtons).toHaveLength(2);
    });

    it('handles missing hashes in buy mode', () => {
      const buyProps = {
        ...baseProps,
        isBuy: true,
        resourceLockTxHash: undefined,
        completedTxHash: undefined,
      };

      render(<TransactionInfo {...buyProps} />);

      expect(screen.getAllByText('-')).toHaveLength(2);
      expect(screen.queryByAltText('external-link')).not.toBeInTheDocument();
      expect(screen.queryByTestId('copy-button')).not.toBeInTheDocument();
    });
  });

  describe('handles user interactions', () => {
    it('opens external link when clicked', () => {
      render(<TransactionInfo {...baseProps} />);

      const externalLinkButton = screen
        .getByAltText('external-link')
        .closest('button');
      fireEvent.click(externalLinkButton!);

      expect(mockOpen).toHaveBeenCalledWith(
        'https://etherscan.io/tx/0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        '_blank',
        'noopener,noreferrer'
      );
    });
  });

  describe('handles different chain IDs', () => {
    it('uses correct block explorer for different chains', () => {
      const polygonProps = {
        ...baseProps,
        chainId: 137, // Polygon
      };

      render(<TransactionInfo {...polygonProps} />);

      const externalLinkButton = screen
        .getByAltText('external-link')
        .closest('button');
      fireEvent.click(externalLinkButton!);

      expect(mockOpen).toHaveBeenCalledWith(
        'https://polygonscan.com/tx/0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        '_blank',
        'noopener,noreferrer'
      );
    });

    it('uses correct chain ID for buy mode resource lock', () => {
      const buyProps = {
        ...baseProps,
        isBuy: true,
        resourceLockTxHash:
          '0xresource1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        resourceLockChainId: 137, // Polygon
      };

      render(<TransactionInfo {...buyProps} />);

      const externalLinkButtons = screen.getAllByAltText('external-link');
      fireEvent.click(externalLinkButtons[0].closest('button')!);

      expect(mockOpen).toHaveBeenCalledWith(
        'https://polygonscan.com/tx/0xresource1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        '_blank',
        'noopener,noreferrer'
      );
    });
  });

  describe('handles completion time', () => {
    it('displays completion time when transaction is complete', () => {
      render(<TransactionInfo {...baseProps} status="Transaction Complete" />);

      expect(screen.getByText('Time')).toBeInTheDocument();
      expect(screen.getByText('Jan 1, 2023 12:00')).toBeInTheDocument();
    });

    it('does not display completion time when transaction is not complete', () => {
      render(<TransactionInfo {...baseProps} status="Transaction Pending" />);

      expect(screen.queryByText('Time')).not.toBeInTheDocument();
    });

    it('does not display completion time when completedAt is not provided', () => {
      const propsWithoutCompletedAt = {
        ...baseProps,
        status: 'Transaction Complete' as const,
        completedAt: undefined,
      };

      render(<TransactionInfo {...propsWithoutCompletedAt} />);

      expect(screen.queryByText('Time')).not.toBeInTheDocument();
    });
  });

  describe('handles gas fee', () => {
    it('handles missing gas fee', () => {
      const propsWithoutGasFee = {
        ...baseProps,
        gasFee: undefined,
      };

      render(<TransactionInfo {...propsWithoutGasFee} />);

      expect(screen.getByText('-')).toBeInTheDocument();
    });
  });

  describe('handles edge cases', () => {
    it('handles empty transaction hash', () => {
      const propsWithEmptyHash = {
        ...baseProps,
        txHash: '',
      };

      render(<TransactionInfo {...propsWithEmptyHash} />);

      expect(screen.getByText('-')).toBeInTheDocument();
    });

    it('handles short transaction hash', () => {
      const propsWithShortHash = {
        ...baseProps,
        txHash: '0x123',
      };

      render(<TransactionInfo {...propsWithShortHash} />);

      // Short hashes are still truncated, so we expect the truncated version
      expect(screen.getByText('0x123...x123')).toBeInTheDocument();
    });

    it('handles missing optional props', () => {
      const minimalProps = {
        status: 'Starting Transaction' as const,
        userOpHash: '0x1234567890abcdef',
        chainId: 1,
      };

      render(<TransactionInfo {...minimalProps} />);

      expect(screen.getByText('Starting...')).toBeInTheDocument();
      expect(screen.getByText('Gas Fee')).toBeInTheDocument();

      const dashElements = screen.getAllByText('-');
      expect(dashElements).toHaveLength(2); // Tx Hash and Gas Fee
    });
  });

  describe('handles different chain IDs for buy mode', () => {
    it('uses different chain IDs for resource lock and completed transactions', () => {
      const buyProps = {
        ...baseProps,
        isBuy: true,
        resourceLockTxHash:
          '0xresource1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        completedTxHash:
          '0xcompleted1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        resourceLockChainId: 137, // Polygon
        completedChainId: 8453, // Base
      };

      render(<TransactionInfo {...buyProps} />);

      const externalLinkButtons = screen.getAllByAltText('external-link');

      // Click resource lock link
      fireEvent.click(externalLinkButtons[0].closest('button')!);
      expect(mockOpen).toHaveBeenCalledWith(
        'https://polygonscan.com/tx/0xresource1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        '_blank',
        'noopener,noreferrer'
      );

      // Click completed link
      fireEvent.click(externalLinkButtons[1].closest('button')!);
      expect(mockOpen).toHaveBeenCalledWith(
        'https://basescan.org/tx/0xcompleted1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        '_blank',
        'noopener,noreferrer'
      );
    });
  });
});
