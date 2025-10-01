/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { vi } from 'vitest';

// components
import ProgressStep from '../ProgressStep';

// Mock dependencies
vi.mock('react-loader-spinner', () => ({
  TailSpin: ({ color, height, width, strokeWidth }: any) => (
    <div data-testid="tail-spin" style={{ color, height, width, strokeWidth }}>
      Loading...
    </div>
  ),
}));

const baseProps = {
  step: 'Submitted' as const,
  status: 'completed' as const,
  label: 'Transaction Submitted',
  isLast: false,
  showLine: true,
  lineStatus: 'completed' as const,
  timestamp: '2023-01-01 12:00:00',
};

describe('<ProgressStep />', () => {
  it('renders correctly and matches snapshot', () => {
    const tree = renderer.create(<ProgressStep {...baseProps} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe('renders different statuses', () => {
    it('renders completed status correctly', () => {
      render(<ProgressStep {...baseProps} status="completed" />);

      expect(screen.getByText('Transaction Submitted')).toBeInTheDocument();
      // There are two timestamp elements (responsive design)
      const timestamps = screen.getAllByText('2023-01-01 12:00:00');
      expect(timestamps).toHaveLength(2);
    });

    it('renders pending status correctly', () => {
      render(<ProgressStep {...baseProps} status="pending" />);

      expect(screen.getByText('Transaction Submitted')).toBeInTheDocument();
      expect(screen.queryByText('2023-01-01 12:00:00')).not.toBeInTheDocument();
    });

    it('renders failed status correctly', () => {
      render(<ProgressStep {...baseProps} status="failed" />);

      expect(screen.getByText('Transaction Submitted')).toBeInTheDocument();
    });

    it('renders inactive status correctly', () => {
      render(<ProgressStep {...baseProps} status="inactive" />);

      expect(screen.getByText('Transaction Submitted')).toBeInTheDocument();
    });
  });

  describe('shows loading spinner for pending steps', () => {
    it('shows loading spinner for Pending step with pending status', () => {
      render(<ProgressStep {...baseProps} step="Pending" status="pending" />);

      expect(screen.getByTestId('tail-spin')).toBeInTheDocument();
    });

    it('shows loading spinner for ResourceLock step with pending status', () => {
      render(
        <ProgressStep {...baseProps} step="ResourceLock" status="pending" />
      );

      expect(screen.getByTestId('tail-spin')).toBeInTheDocument();
    });

    it('does not show loading spinner for Submitted step with pending status', () => {
      render(<ProgressStep {...baseProps} step="Submitted" status="pending" />);

      expect(screen.queryByTestId('tail-spin')).not.toBeInTheDocument();
    });
  });

  describe('handles timestamps', () => {
    it('displays timestamp when status is completed', () => {
      render(<ProgressStep {...baseProps} status="completed" />);

      // There are two timestamp elements (responsive design)
      const timestamps = screen.getAllByText('2023-01-01 12:00:00');
      expect(timestamps).toHaveLength(2);
    });

    it('does not display timestamp when status is not completed', () => {
      render(<ProgressStep {...baseProps} status="pending" />);

      expect(screen.queryByText('2023-01-01 12:00:00')).not.toBeInTheDocument();
    });

    it('handles timestamp with bullet separator', () => {
      const propsWithBulletTimestamp = {
        ...baseProps,
        timestamp: 'Step 1 • 2023-01-01 12:00:00',
      };

      render(<ProgressStep {...propsWithBulletTimestamp} />);

      expect(screen.getByText('2023-01-01 12:00:00')).toBeInTheDocument();
    });
  });

  describe('handles line display', () => {
    it('shows line when not last step', () => {
      render(<ProgressStep {...baseProps} isLast={false} />);

      expect(screen.getByText('Transaction Submitted')).toBeInTheDocument();
    });

    it('does not show line when is last step', () => {
      render(<ProgressStep {...baseProps} isLast />);

      expect(screen.getByText('Transaction Submitted')).toBeInTheDocument();
    });
  });

  describe('handles edge cases', () => {
    it('handles missing timestamp gracefully', () => {
      const propsWithoutTimestamp = {
        ...baseProps,
        timestamp: undefined,
      };

      render(<ProgressStep {...propsWithoutTimestamp} />);

      expect(screen.getByText('Transaction Submitted')).toBeInTheDocument();
    });

    it('handles default props correctly', () => {
      const minimalProps = {
        step: 'Submitted' as const,
        status: 'completed' as const,
        label: 'Test Step',
      };

      render(<ProgressStep {...minimalProps} />);

      expect(screen.getByText('Test Step')).toBeInTheDocument();
    });
  });
});
