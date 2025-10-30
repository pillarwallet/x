/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { vi } from 'vitest';

// components
import EIP7702UpgradeDetails from '../EIP7702UpgradeDetails';

// Mock dependencies
vi.mock('../../utils/upgrade', () => ({
  formatStepTimestamp: vi.fn((date: Date, step: string) => {
    if (step === 'submitted') {
      return (
        <>
          <span>Jan 1, 2023</span>
          <span> • </span>
          <span>12:00</span>
        </>
      );
    }
    return <span>12:00</span>;
  }),
}));

vi.mock('../EIP7702UpgradeProgressStep', () => ({
  default: ({ status, label, timestamp }: any) => {
    // Determine the actual displayed label based on status when label is 'Completed'
    const displayLabel =
      label === 'Completed' && status === 'failed' ? 'Failed' : label;
    // Use the original label for test ID to maintain consistency
    const testIdLabel = label;

    return (
      <div data-testid={`progress-step-${testIdLabel}`}>
        <span data-testid={`step-${testIdLabel}-status`}>{status}</span>
        <span data-testid={`step-${testIdLabel}-label`}>{displayLabel}</span>
        {timestamp && (
          <div data-testid={`step-${testIdLabel}-timestamp`}>
            {displayLabel}
          </div>
        )}
      </div>
    );
  },
}));

const baseProps = {
  onClose: vi.fn(),
  onCloseModal: vi.fn(),
  status: 'upgrading' as const,
  submittedAt: new Date('2023-01-01T00:00:00Z'),
  pendingCompletedAt: new Date('2023-01-01T00:01:00Z'),
};

describe('<EIP7702UpgradeDetails />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders correctly and matches snapshot', () => {
      const tree = renderer
        .create(<EIP7702UpgradeDetails {...baseProps} />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('renders with upgrading status', () => {
      render(<EIP7702UpgradeDetails {...baseProps} status="upgrading" />);

      expect(screen.getByText('Upgrade Details')).toBeInTheDocument();
      expect(screen.getByTestId('progress-step-Submitted')).toBeInTheDocument();
      expect(screen.getByTestId('progress-step-Upgrading')).toBeInTheDocument();
      expect(screen.getByTestId('progress-step-Completed')).toBeInTheDocument();
    });

    it('renders with completed status', () => {
      render(<EIP7702UpgradeDetails {...baseProps} status="completed" />);

      expect(screen.getByText('Upgrade Details')).toBeInTheDocument();
      expect(screen.getByTestId('progress-step-Submitted')).toBeInTheDocument();
    });

    it('renders with failed status', () => {
      render(
        <EIP7702UpgradeDetails
          {...baseProps}
          status="failed"
          errorDetails="Test error"
        />
      );

      expect(screen.getByText('Upgrade Details')).toBeInTheDocument();
      expect(screen.getByText('Test error')).toBeInTheDocument();
    });

    it('displays error box when errorDetails is provided', () => {
      render(
        <EIP7702UpgradeDetails
          {...baseProps}
          errorDetails="Something went wrong"
        />
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      const errorBox = screen.getByText('Something went wrong').closest('div');
      expect(errorBox).toHaveClass('bg-[#FF366C]/30');
    });
  });

  describe('Step statuses', () => {
    it('shows correct step statuses for submitted status', () => {
      render(<EIP7702UpgradeDetails {...baseProps} status="submitted" />);

      expect(screen.getByTestId('step-Submitted-status')).toHaveTextContent(
        'upgrading'
      );
      expect(screen.getByTestId('step-Upgrading-status')).toHaveTextContent(
        'submitted'
      );
      expect(screen.getByTestId('step-Completed-status')).toHaveTextContent(
        'submitted'
      );
    });

    it('shows correct step statuses for upgrading status', () => {
      render(<EIP7702UpgradeDetails {...baseProps} status="upgrading" />);

      expect(screen.getByTestId('step-Submitted-status')).toHaveTextContent(
        'completed'
      );
      expect(screen.getByTestId('step-Upgrading-status')).toHaveTextContent(
        'upgrading'
      );
      expect(screen.getByTestId('step-Completed-status')).toHaveTextContent(
        'submitted'
      );
    });

    it('shows correct step statuses for completed status', () => {
      render(<EIP7702UpgradeDetails {...baseProps} status="completed" />);

      expect(screen.getByTestId('step-Submitted-status')).toHaveTextContent(
        'completed'
      );
      expect(screen.getByTestId('step-Upgrading-status')).toHaveTextContent(
        'completed'
      );
      expect(screen.getByTestId('step-Completed-status')).toHaveTextContent(
        'completed'
      );
    });

    it('shows failed label for completed step when status is failed', () => {
      render(<EIP7702UpgradeDetails {...baseProps} status="failed" />);

      // Should render all progress steps
      expect(screen.getByTestId('progress-step-Submitted')).toBeInTheDocument();
      expect(screen.getByTestId('progress-step-Upgrading')).toBeInTheDocument();
      expect(screen.getByTestId('progress-step-Failed')).toBeInTheDocument();

      // The Failed step should have failed status
      expect(screen.getByTestId('step-Failed-status')).toHaveTextContent(
        'failed'
      );
      expect(screen.getByTestId('step-Failed-label')).toHaveTextContent(
        'Failed'
      );
    });
  });

  describe('Timestamps', () => {
    it('displays submitted timestamp when available', () => {
      render(<EIP7702UpgradeDetails {...baseProps} status="upgrading" />);

      // Should show timestamp for submitted step
      expect(
        screen.getByTestId('step-Submitted-timestamp')
      ).toBeInTheDocument();
    });

    it('displays pending completed timestamp when available', () => {
      render(<EIP7702UpgradeDetails {...baseProps} status="completed" />);

      // Should show timestamp for upgrading step
      expect(
        screen.getByTestId('step-Upgrading-timestamp')
      ).toBeInTheDocument();
    });

    it('does not display timestamp for final Completed step', () => {
      render(<EIP7702UpgradeDetails {...baseProps} status="completed" />);

      // Should NOT show timestamp for Completed step
      expect(
        screen.queryByTestId('step-Completed-timestamp')
      ).not.toBeInTheDocument();
    });
  });

  describe('User interactions', () => {
    it('calls onClose when done button is clicked for non-final status', () => {
      render(<EIP7702UpgradeDetails {...baseProps} status="upgrading" />);

      const doneButton = screen.getByText('Done');
      fireEvent.click(doneButton);

      expect(baseProps.onClose).toHaveBeenCalled();
      expect(baseProps.onCloseModal).not.toHaveBeenCalled();
    });

    it('calls onCloseModal when done button is clicked for completed status', () => {
      render(<EIP7702UpgradeDetails {...baseProps} status="completed" />);

      const doneButton = screen.getByText('Done');
      fireEvent.click(doneButton);

      expect(baseProps.onCloseModal).toHaveBeenCalled();
      expect(baseProps.onClose).not.toHaveBeenCalled();
    });

    it('calls onCloseModal when done button is clicked for failed status', () => {
      render(<EIP7702UpgradeDetails {...baseProps} status="failed" />);

      const doneButton = screen.getByText('Done');
      fireEvent.click(doneButton);

      expect(baseProps.onCloseModal).toHaveBeenCalled();
      expect(baseProps.onClose).not.toHaveBeenCalled();
    });

    it('handles missing onCloseModal gracefully', () => {
      const propsWithoutModalClose = {
        onClose: vi.fn(),
        status: 'completed' as const,
      };

      render(<EIP7702UpgradeDetails {...propsWithoutModalClose} />);

      const doneButton = screen.getByText('Done');
      fireEvent.click(doneButton);

      expect(propsWithoutModalClose.onClose).not.toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('handles missing timestamps gracefully', () => {
      const propsWithoutTimestamps = {
        onClose: vi.fn(),
        onCloseModal: vi.fn(),
        status: 'upgrading' as const,
      };

      render(<EIP7702UpgradeDetails {...propsWithoutTimestamps} />);

      expect(screen.getByText('Upgrade Details')).toBeInTheDocument();
      expect(screen.getByTestId('progress-step-Submitted')).toBeInTheDocument();
    });

    it('handles missing error details', () => {
      render(<EIP7702UpgradeDetails {...baseProps} />);

      // Should not display error box
      expect(
        screen.queryByText((content, element) => {
          return element?.className?.includes('bg-[#FF366C]/30') || false;
        })
      ).not.toBeInTheDocument();
    });
  });
});
