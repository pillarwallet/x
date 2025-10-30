/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { vi } from 'vitest';

// components
import EIP7702UpgradeProgressStep from '../EIP7702UpgradeProgressStep';

// Mock dependencies
vi.mock('react-loader-spinner', () => ({
  TailSpin: ({ color, height, width, strokeWidth }: any) => (
    <div data-testid="tail-spin" style={{ color, height, width, strokeWidth }}>
      Loading...
    </div>
  ),
}));

const baseProps = {
  status: 'completed' as const,
  label: 'Submitted',
  isLast: false,
  showLine: true,
  lineStatus: 'completed' as const,
};

describe('<EIP7702UpgradeProgressStep />', () => {
  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(<EIP7702UpgradeProgressStep {...baseProps} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe('renders different statuses', () => {
    it('renders completed status correctly', () => {
      render(<EIP7702UpgradeProgressStep {...baseProps} status="completed" />);

      expect(screen.getByText('Submitted')).toBeInTheDocument();
    });

    it('renders upgrading status correctly', () => {
      render(<EIP7702UpgradeProgressStep {...baseProps} status="upgrading" />);

      expect(screen.getByText('Submitted')).toBeInTheDocument();
    });

    it('renders failed status correctly', () => {
      render(<EIP7702UpgradeProgressStep {...baseProps} status="failed" />);

      expect(screen.getByText('Submitted')).toBeInTheDocument();
    });

    it('renders submitted status correctly', () => {
      render(<EIP7702UpgradeProgressStep {...baseProps} status="submitted" />);

      expect(screen.getByText('Submitted')).toBeInTheDocument();
    });
  });

  describe('shows loading spinner for upgrading steps', () => {
    it('shows loading spinner for upgrading status', () => {
      render(<EIP7702UpgradeProgressStep {...baseProps} status="upgrading" />);

      expect(screen.getByTestId('tail-spin')).toBeInTheDocument();
    });

    it('does not show loading spinner for completed status', () => {
      render(<EIP7702UpgradeProgressStep {...baseProps} status="completed" />);

      expect(screen.queryByTestId('tail-spin')).not.toBeInTheDocument();
    });

    it('does not show loading spinner for failed status', () => {
      render(<EIP7702UpgradeProgressStep {...baseProps} status="failed" />);

      expect(screen.queryByTestId('tail-spin')).not.toBeInTheDocument();
    });
  });

  describe('handles timestamps', () => {
    it('displays timestamp when provided', () => {
      render(
        <EIP7702UpgradeProgressStep
          {...baseProps}
          status="completed"
          timestamp="Jan 1, 2023 • 12:00"
        />
      );

      // Timestamp is shown in a container
      expect(screen.getByText('Jan 1, 2023 • 12:00')).toBeInTheDocument();
    });

    it('shows time only on small screens', () => {
      const { container } = render(
        <EIP7702UpgradeProgressStep
          {...baseProps}
          status="completed"
          timestamp="Jan 1, 2023 • 12:00"
        />
      );

      // Time only version (12:00) for small screens should have 'xs:inline' class
      const smallScreenSpan = container.querySelector('.xs\\:inline');
      expect(smallScreenSpan).toBeInTheDocument();
    });

    it('handles timestamp with bullet separator', () => {
      render(
        <EIP7702UpgradeProgressStep
          {...baseProps}
          status="completed"
          timestamp="Jan 1, 2023 • 12:00"
        />
      );

      expect(screen.getByText('12:00')).toBeInTheDocument();
    });
  });

  describe('handles line display', () => {
    it('shows line when not last step', () => {
      const { container } = render(
        <EIP7702UpgradeProgressStep {...baseProps} isLast={false} showLine />
      );

      // Line should be present in the rendered output
      expect(container.querySelector('[class*="w-0.5"]')).toBeInTheDocument();
    });

    it('does not show line when is last step', () => {
      const { container } = render(
        <EIP7702UpgradeProgressStep {...baseProps} isLast showLine={false} />
      );

      // No line should be present
      expect(
        container.querySelector('[class*="w-0.5"]')
      ).not.toBeInTheDocument();
    });

    it('does not show line when showLine is false', () => {
      const { container } = render(
        <EIP7702UpgradeProgressStep {...baseProps} showLine={false} />
      );

      // No line should be present
      expect(
        container.querySelector('[class*="w-0.5"]')
      ).not.toBeInTheDocument();
    });
  });

  describe('handles edge cases', () => {
    it('handles missing timestamp gracefully', () => {
      const { container } = render(
        <EIP7702UpgradeProgressStep {...baseProps} timestamp={undefined} />
      );

      expect(container.querySelector('.text-right')).not.toBeInTheDocument();
    });

    it('handles default props correctly', () => {
      const minimalProps = {
        status: 'completed' as const,
        label: 'Test Step',
      };

      render(<EIP7702UpgradeProgressStep {...minimalProps} />);

      expect(screen.getByText('Test Step')).toBeInTheDocument();
    });

    it('handles React.ReactNode timestamp', () => {
      const timestampNode = (
        <>
          <span>Jan 1, 2023</span>
          <span> • </span>
          <span>12:00</span>
        </>
      );

      render(
        <EIP7702UpgradeProgressStep {...baseProps} timestamp={timestampNode} />
      );

      expect(screen.getAllByText('Jan 1, 2023')).toHaveLength(2);
    });
  });

  describe('icon rendering', () => {
    it('shows check icon for completed status', () => {
      const { container } = render(
        <EIP7702UpgradeProgressStep {...baseProps} status="completed" />
      );

      const checkIcon = container.querySelector('svg');
      expect(checkIcon).toBeInTheDocument();
      expect(checkIcon?.getAttribute('viewBox')).toBe('0 0 20 20');
    });

    it('shows cross icon for failed status', () => {
      const { container } = render(
        <EIP7702UpgradeProgressStep {...baseProps} status="failed" />
      );

      const crossIcon = container.querySelector('svg');
      expect(crossIcon).toBeInTheDocument();
      expect(crossIcon?.getAttribute('viewBox')).toBe('0 0 20 20');
    });

    it('shows no icon for submitted/ready status', () => {
      const { container } = render(
        <EIP7702UpgradeProgressStep {...baseProps} status="submitted" />
      );

      const icons = container.querySelectorAll('svg');
      // No icon should be present for submitted status
      expect(icons.length).toBe(0);
    });
  });
});
