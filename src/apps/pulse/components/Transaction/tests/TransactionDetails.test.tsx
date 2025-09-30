/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { vi } from 'vitest';

// types
import { SelectedToken } from '../../../types/tokens';

// components
import TransactionDetails from '../TransactionDetails';

// Mock dependencies
vi.mock('../../../../hooks/useTransactionKit', () => ({
  default: () => ({
    walletAddress: '0x1234567890123456789012345678901234567890',
  }),
}));

vi.mock('../../../../utils/number', () => ({
  formatExponentialSmallNumber: (num: number) => num.toFixed(2),
  limitDigitsNumber: (num: number) => num,
}));

vi.mock('../ProgressStep', () => ({
  default: ({ step, status, label, timestamp }: any) => (
    <div data-testid={`progress-step-${step}`}>
      <span data-testid={`step-${step}-status`}>{status}</span>
      <span data-testid={`step-${step}-label`}>{label}</span>
      {timestamp && (
        <div data-testid={`step-${step}-timestamp`}>{timestamp}</div>
      )}
    </div>
  ),
}));

vi.mock('../TransactionErrorBox', () => ({
  default: ({ technicalDetails }: { technicalDetails: string }) => (
    <div data-testid="transaction-error-box">
      <div data-testid="technical-details">{technicalDetails}</div>
    </div>
  ),
}));

vi.mock('../TransactionInfo', () => ({
  default: ({ status, userOpHash, txHash, chainId, gasFee }: any) => (
    <div data-testid="transaction-info">
      <span data-testid="info-status">{status}</span>
      <span data-testid="info-userOpHash">{userOpHash}</span>
      <span data-testid="info-txHash">{txHash}</span>
      <span data-testid="info-chainId">{chainId}</span>
      <span data-testid="info-gasFee">{gasFee}</span>
    </div>
  ),
}));

vi.mock('../Misc/CloseButton', () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <button type="button" onClick={onClose} data-testid="close-button">
      Close
    </button>
  ),
}));

vi.mock('../Misc/Esc', () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <button type="button" onClick={onClose} data-testid="esc-button">
      ESC
    </button>
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
  onDone: vi.fn(),
  userOpHash:
    '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  chainId: 1,
  status: 'Starting Transaction' as const,
  isBuy: false,
  sellToken: mockSellToken,
  buyToken: null,
  tokenAmount: '100',
  sellOffer: mockSellOffer,
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

describe('<TransactionDetails />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(<TransactionDetails {...baseProps} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe('renders different transaction statuses', () => {
    it('displays starting transaction status correctly', () => {
      render(
        <TransactionDetails {...baseProps} status="Starting Transaction" />
      );

      expect(screen.getByText('Transaction Details')).toBeInTheDocument();
      expect(screen.getByText('Done')).toBeInTheDocument();
    });

    it('displays transaction pending status correctly', () => {
      render(
        <TransactionDetails {...baseProps} status="Transaction Pending" />
      );

      expect(screen.getByText('Transaction Details')).toBeInTheDocument();
      expect(screen.getByTestId('esc-button')).toBeInTheDocument();
    });

    it('displays transaction complete status correctly', () => {
      render(
        <TransactionDetails {...baseProps} status="Transaction Complete" />
      );

      expect(screen.getByText('Transaction Details')).toBeInTheDocument();
      expect(screen.getByTestId('close-button')).toBeInTheDocument();
    });

    it('displays transaction failed status correctly', () => {
      render(<TransactionDetails {...baseProps} status="Transaction Failed" />);

      expect(screen.getByText('Transaction Details')).toBeInTheDocument();
      expect(screen.getByTestId('transaction-error-box')).toBeInTheDocument();
    });
  });

  describe('handles user interactions', () => {
    it('calls onDone when done button is clicked', () => {
      render(<TransactionDetails {...baseProps} />);

      const doneButton = screen.getByText('Done');
      fireEvent.click(doneButton);

      expect(baseProps.onDone).toHaveBeenCalled();
    });

    it('calls onDone when close button is clicked', () => {
      render(
        <TransactionDetails {...baseProps} status="Transaction Complete" />
      );

      const closeButton = screen.getByTestId('close-button');
      fireEvent.click(closeButton);

      expect(baseProps.onDone).toHaveBeenCalled();
    });

    it('calls onDone when ESC button is clicked', () => {
      render(
        <TransactionDetails {...baseProps} status="Transaction Pending" />
      );

      const escButton = screen.getByTestId('esc-button');
      fireEvent.click(escButton);

      expect(baseProps.onDone).toHaveBeenCalled();
    });

    it('calls onDone when ESC key is pressed', () => {
      render(<TransactionDetails {...baseProps} />);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(baseProps.onDone).toHaveBeenCalled();
    });

    it('calls onDone when clicking outside the modal for completed status', () => {
      render(
        <TransactionDetails {...baseProps} status="Transaction Complete" />
      );

      // Click outside the modal
      fireEvent.mouseDown(document.body);

      expect(baseProps.onDone).toHaveBeenCalled();
    });

    it('does not call onDone when clicking outside the modal for pending status', () => {
      render(
        <TransactionDetails {...baseProps} status="Transaction Pending" />
      );

      // Click outside the modal
      fireEvent.mouseDown(document.body);

      expect(baseProps.onDone).not.toHaveBeenCalled();
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

      render(<TransactionDetails {...buyProps} />);

      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('BUY')).toBeInTheDocument();
    });

    it('shows correct progress steps for buy mode', () => {
      const buyProps = {
        ...baseProps,
        isBuy: true,
        buyToken: mockBuyToken,
        sellToken: null,
        usdAmount: '50.00',
        payingTokens: mockPayingTokens,
      };

      render(<TransactionDetails {...buyProps} />);

      expect(screen.getByTestId('progress-step-Submitted')).toBeInTheDocument();
      expect(
        screen.getByTestId('progress-step-ResourceLock')
      ).toBeInTheDocument();
      expect(screen.getByTestId('progress-step-Completed')).toBeInTheDocument();
    });

    it('passes correct props to TransactionInfo for buy mode', () => {
      const buyProps = {
        ...baseProps,
        isBuy: true,
        buyToken: mockBuyToken,
        sellToken: null,
        usdAmount: '50.00',
        payingTokens: mockPayingTokens,
        resourceLockTxHash: '0xresource123',
        completedTxHash: '0xcompleted123',
        resourceLockChainId: 1,
        completedChainId: 1,
      };

      render(<TransactionDetails {...buyProps} />);

      expect(screen.getByTestId('transaction-info')).toBeInTheDocument();
    });
  });

  describe('handles sell mode', () => {
    it('renders sell mode correctly', () => {
      render(<TransactionDetails {...baseProps} />);

      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('TEST')).toBeInTheDocument();
    });

    it('shows correct progress steps for sell mode', () => {
      render(<TransactionDetails {...baseProps} />);

      expect(screen.getByTestId('progress-step-Submitted')).toBeInTheDocument();
      expect(screen.getByTestId('progress-step-Pending')).toBeInTheDocument();
      expect(screen.getByTestId('progress-step-Completed')).toBeInTheDocument();
    });

    it('passes correct props to TransactionInfo for sell mode', () => {
      render(<TransactionDetails {...baseProps} />);

      expect(screen.getByTestId('transaction-info')).toBeInTheDocument();
    });
  });

  describe('handles different step statuses', () => {
    it('shows correct step statuses for starting transaction', () => {
      render(
        <TransactionDetails {...baseProps} status="Starting Transaction" />
      );

      expect(screen.getByTestId('step-Submitted-status')).toHaveTextContent(
        'pending'
      );
      expect(screen.getByTestId('step-Pending-status')).toHaveTextContent(
        'pending'
      );
    });

    it('shows correct step statuses for transaction pending', () => {
      render(
        <TransactionDetails {...baseProps} status="Transaction Pending" />
      );

      expect(screen.getByTestId('step-Submitted-status')).toHaveTextContent(
        'completed'
      );
      expect(screen.getByTestId('step-Pending-status')).toHaveTextContent(
        'pending'
      );
    });

    it('shows correct step statuses for transaction complete', () => {
      render(
        <TransactionDetails {...baseProps} status="Transaction Complete" />
      );

      // Progress steps are hidden when transaction is complete
      expect(
        screen.queryByTestId('step-Submitted-status')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('step-Pending-status')
      ).not.toBeInTheDocument();
    });

    it('shows correct step statuses for transaction failed', () => {
      render(<TransactionDetails {...baseProps} status="Transaction Failed" />);

      expect(screen.getByTestId('step-Submitted-status')).toHaveTextContent(
        'completed'
      );
      expect(screen.getByTestId('step-Pending-status')).toHaveTextContent(
        'completed'
      );
    });
  });

  describe('handles buy mode step statuses', () => {
    it('shows correct step statuses for buy mode starting transaction', () => {
      const buyProps = {
        ...baseProps,
        isBuy: true,
        buyToken: mockBuyToken,
        sellToken: null,
        usdAmount: '50.00',
        payingTokens: mockPayingTokens,
      };

      render(
        <TransactionDetails {...buyProps} status="Starting Transaction" />
      );

      expect(screen.getByTestId('step-Submitted-status')).toHaveTextContent(
        'pending'
      );
      expect(screen.getByTestId('step-ResourceLock-status')).toHaveTextContent(
        'pending'
      );
      expect(screen.getByTestId('step-Completed-status')).toHaveTextContent(
        'pending'
      );
    });

    it('shows correct step statuses for buy mode transaction pending', () => {
      const buyProps = {
        ...baseProps,
        isBuy: true,
        buyToken: mockBuyToken,
        sellToken: null,
        usdAmount: '50.00',
        payingTokens: mockPayingTokens,
      };

      render(<TransactionDetails {...buyProps} status="Transaction Pending" />);

      expect(screen.getByTestId('step-Submitted-status')).toHaveTextContent(
        'completed'
      );
      expect(screen.getByTestId('step-ResourceLock-status')).toHaveTextContent(
        'pending'
      );
      expect(screen.getByTestId('step-Completed-status')).toHaveTextContent(
        'inactive'
      );
    });

    it('shows correct step statuses for buy mode with resource lock hash', () => {
      const buyProps = {
        ...baseProps,
        isBuy: true,
        buyToken: mockBuyToken,
        sellToken: null,
        usdAmount: '50.00',
        payingTokens: mockPayingTokens,
        resourceLockTxHash: '0xresource123',
      };

      render(<TransactionDetails {...buyProps} status="Transaction Pending" />);

      expect(screen.getByTestId('step-Submitted-status')).toHaveTextContent(
        'completed'
      );
      expect(screen.getByTestId('step-ResourceLock-status')).toHaveTextContent(
        'completed'
      );
      expect(screen.getByTestId('step-Completed-status')).toHaveTextContent(
        'pending'
      );
    });
  });

  describe('handles timestamps', () => {
    it('displays submitted timestamp correctly', () => {
      const propsWithSubmitted = {
        ...baseProps,
        status: 'Transaction Pending' as const,
      };

      render(<TransactionDetails {...propsWithSubmitted} />);

      expect(
        screen.getByTestId('step-Submitted-timestamp')
      ).toBeInTheDocument();
    });

    it('displays pending completed timestamp correctly', () => {
      const propsWithPendingCompleted = {
        ...baseProps,
        status: 'Transaction Complete' as const,
        pendingCompletedAt: new Date('2023-01-01T01:00:00Z'),
      };

      render(<TransactionDetails {...propsWithPendingCompleted} />);

      // Progress steps are hidden when transaction is complete
      expect(
        screen.queryByTestId('step-Pending-timestamp')
      ).not.toBeInTheDocument();
    });

    it('displays resource lock completed timestamp correctly for buy mode', () => {
      const buyProps = {
        ...baseProps,
        isBuy: true,
        buyToken: mockBuyToken,
        sellToken: null,
        usdAmount: '50.00',
        payingTokens: mockPayingTokens,
        status: 'Transaction Complete' as const,
        resourceLockCompletedAt: new Date('2023-01-01T02:00:00Z'),
      };

      render(<TransactionDetails {...buyProps} />);

      // Progress steps are hidden when transaction is complete
      expect(
        screen.queryByTestId('step-ResourceLock-timestamp')
      ).not.toBeInTheDocument();
    });
  });

  describe('handles error states', () => {
    it('displays error box when transaction failed', () => {
      const propsWithError = {
        ...baseProps,
        status: 'Transaction Failed' as const,
        errorDetails: 'Transaction failed due to insufficient gas',
      };

      render(<TransactionDetails {...propsWithError} />);

      expect(screen.getByTestId('transaction-error-box')).toBeInTheDocument();
      expect(screen.getByTestId('technical-details')).toBeInTheDocument();
    });

    it('handles resource lock failure for buy mode', () => {
      const buyPropsWithFailure = {
        ...baseProps,
        isBuy: true,
        buyToken: mockBuyToken,
        sellToken: null,
        usdAmount: '50.00',
        payingTokens: mockPayingTokens,
        isResourceLockFailed: true,
        status: 'Transaction Failed' as const,
      };

      render(<TransactionDetails {...buyPropsWithFailure} />);

      expect(screen.getByTestId('step-ResourceLock-status')).toHaveTextContent(
        'failed'
      );
      expect(screen.getByTestId('step-Completed-status')).toHaveTextContent(
        'inactive'
      );
    });
  });

  describe('handles edge cases', () => {
    it('handles missing optional props gracefully', () => {
      const minimalProps = {
        onDone: vi.fn(),
        userOpHash: '0x1234567890abcdef',
        chainId: 1,
        status: 'Starting Transaction' as const,
      };

      render(<TransactionDetails {...minimalProps} />);

      expect(screen.getByText('Transaction Details')).toBeInTheDocument();
    });

    it('handles null token values', () => {
      const propsWithNullTokens = {
        ...baseProps,
        sellToken: null,
        buyToken: null,
      };

      render(<TransactionDetails {...propsWithNullTokens} />);

      expect(screen.getByText('Transaction Details')).toBeInTheDocument();
    });

    it('handles missing sell offer', () => {
      const propsWithoutSellOffer = {
        ...baseProps,
        sellOffer: null,
      };

      render(<TransactionDetails {...propsWithoutSellOffer} />);

      expect(screen.getByText('Transaction Details')).toBeInTheDocument();
    });

    it('handles missing token amount', () => {
      const propsWithoutTokenAmount = {
        ...baseProps,
        tokenAmount: undefined,
      };

      render(<TransactionDetails {...propsWithoutTokenAmount} />);

      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  describe('handles different chain IDs', () => {
    it('renders with different chain ID', () => {
      const propsWithDifferentChain = {
        ...baseProps,
        chainId: 137, // Polygon
      };

      render(<TransactionDetails {...propsWithDifferentChain} />);

      expect(screen.getByText('Transaction Details')).toBeInTheDocument();
    });
  });

  describe('handles technical details generation', () => {
    it('generates technical details for sell mode', () => {
      const propsWithError = {
        ...baseProps,
        status: 'Transaction Failed' as const,
        errorDetails: 'Test error message',
      };

      render(<TransactionDetails {...propsWithError} />);

      const technicalDetails = screen.getByTestId('technical-details');
      expect(technicalDetails).toBeInTheDocument();

      const detailsText = technicalDetails.textContent;
      expect(detailsText).toContain('"transactionType": "SELL"');
      expect(detailsText).toContain('"hashType": "userOpHash"');
      expect(detailsText).toContain('"status": "Transaction Failed"');
    });

    it('generates technical details for buy mode', () => {
      const buyPropsWithError = {
        ...baseProps,
        isBuy: true,
        buyToken: mockBuyToken,
        sellToken: null,
        usdAmount: '50.00',
        payingTokens: mockPayingTokens,
        status: 'Transaction Failed' as const,
        errorDetails: 'Test error message',
      };

      render(<TransactionDetails {...buyPropsWithError} />);

      const technicalDetails = screen.getByTestId('technical-details');
      expect(technicalDetails).toBeInTheDocument();

      const detailsText = technicalDetails.textContent;
      expect(detailsText).toContain('"transactionType": "BUY"');
      expect(detailsText).toContain('"hashType": "bidHash"');
      expect(detailsText).toContain('"status": "Transaction Failed"');
    });

    it('sanitizes API keys in error details', () => {
      const propsWithApiKey = {
        ...baseProps,
        status: 'Transaction Failed' as const,
        errorDetails:
          'error inside sendUserOpToBundler: {"details":"Unexpected behaviour","metaMessages":["Status: 500","URL: https://rpc.etherspot.io/v2/8453?api-key=test-api-key-123","Request body: {...}"]}',
      };

      render(<TransactionDetails {...propsWithApiKey} />);

      const technicalDetails = screen.getByTestId('technical-details');
      const detailsText = technicalDetails.textContent;
      expect(detailsText).toContain('api-key=***REDACTED***');
      expect(detailsText).not.toContain('test-api-key-123');
    });
  });

  describe('handles progress step visibility', () => {
    it('hides progress steps when transaction is complete', () => {
      render(
        <TransactionDetails {...baseProps} status="Transaction Complete" />
      );

      expect(
        screen.queryByTestId('progress-step-Submitted')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('progress-step-Pending')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('progress-step-Completed')
      ).not.toBeInTheDocument();
    });

    it('shows progress steps when transaction is not complete', () => {
      render(
        <TransactionDetails {...baseProps} status="Transaction Pending" />
      );

      expect(screen.getByTestId('progress-step-Submitted')).toBeInTheDocument();
      expect(screen.getByTestId('progress-step-Pending')).toBeInTheDocument();
      expect(screen.getByTestId('progress-step-Completed')).toBeInTheDocument();
    });
  });
});
