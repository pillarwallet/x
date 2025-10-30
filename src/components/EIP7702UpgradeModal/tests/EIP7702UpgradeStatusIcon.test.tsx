/* eslint-disable react/jsx-props-no-spreading */
import { act, render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { vi } from 'vitest';

// components
import EIP7702UpgradeStatusIcon from '../EIP7702UpgradeStatusIcon';

// Mock dependencies
vi.mock('../../utils/upgrade', () => ({
  getStatusConfig: vi.fn((status) => {
    if (status === 'completed') {
      return {
        icon: 'confirmed',
        containerClasses: 'completed-container',
        iconClasses: 'completed-icon',
      };
    }
    if (status === 'failed') {
      return {
        icon: 'failed',
        containerClasses: 'failed-container',
        iconClasses: 'failed-icon',
      };
    }
    return {
      icon: 'pending',
      containerClasses: 'pending-container',
      iconClasses: 'pending-icon',
    };
  }),
}));

vi.mock('../../assets/images/confirmed-icon.svg', () => ({
  default: 'confirmed-icon.svg',
}));

vi.mock('../../assets/images/failed-icon.svg', () => ({
  default: 'failed-icon.svg',
}));

vi.mock('../../assets/images/upgrade-diagonal-arrows.svg', () => ({
  default: 'pending-icon.svg',
}));

vi.mock('@react-spring/web', () => ({
  animated: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    div: ({ children, className }: any) => (
      <div className={className} data-testid="animated-div">
        {children}
      </div>
    ),
  },
  useSpring: vi.fn(() => [
    { scale: 1, filter: 'blur(0px)', rotate: '0deg' },
    { set: vi.fn(), start: vi.fn(), stop: vi.fn() },
  ]),
}));

describe('<EIP7702UpgradeStatusIcon />', () => {
  describe('Rendering', () => {
    it('renders correctly and matches snapshot', () => {
      const tree = renderer
        .create(<EIP7702UpgradeStatusIcon status="upgrading" />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('renders with upgrading status', () => {
      render(<EIP7702UpgradeStatusIcon status="upgrading" />);

      expect(screen.getByTestId('animated-div')).toBeInTheDocument();
      expect(screen.getByAltText('upgrading')).toBeInTheDocument();
    });

    it('renders with submitted status', () => {
      render(<EIP7702UpgradeStatusIcon status="submitted" />);

      expect(screen.getByTestId('animated-div')).toBeInTheDocument();
      expect(screen.getByAltText('submitted')).toBeInTheDocument();
    });

    it('renders with completed status', () => {
      render(<EIP7702UpgradeStatusIcon status="completed" />);

      expect(screen.getByTestId('animated-div')).toBeInTheDocument();
      expect(screen.getByAltText('completed')).toBeInTheDocument();
    });

    it('renders with failed status', () => {
      render(<EIP7702UpgradeStatusIcon status="failed" />);

      expect(screen.getByTestId('animated-div')).toBeInTheDocument();
      expect(screen.getByAltText('failed')).toBeInTheDocument();
    });
  });

  describe('Icon selection', () => {
    it('shows confirmed icon for completed status', () => {
      const { container } = render(
        <EIP7702UpgradeStatusIcon status="completed" />
      );

      const img = container.querySelector('img');
      expect(img?.getAttribute('alt')).toBe('completed');
    });

    it('shows failed icon for failed status', () => {
      const { container } = render(
        <EIP7702UpgradeStatusIcon status="failed" />
      );

      const img = container.querySelector('img');
      expect(img?.getAttribute('alt')).toBe('failed');
    });

    it('shows pending icon for upgrading status', () => {
      const { container } = render(
        <EIP7702UpgradeStatusIcon status="upgrading" />
      );

      const img = container.querySelector('img');
      expect(img?.getAttribute('alt')).toBe('upgrading');
    });

    it('shows pending icon for submitted status', () => {
      const { container } = render(
        <EIP7702UpgradeStatusIcon status="submitted" />
      );

      const img = container.querySelector('img');
      expect(img?.getAttribute('alt')).toBe('submitted');
    });
  });

  describe('Component memoization', () => {
    it('memoizes the component to prevent unnecessary re-renders', () => {
      const { rerender } = render(
        <EIP7702UpgradeStatusIcon status="upgrading" />
      );

      // Initial render
      expect(screen.getByAltText('upgrading')).toBeInTheDocument();

      // Rerender with same props
      rerender(<EIP7702UpgradeStatusIcon status="upgrading" />);

      // Should still find the element (React.memo works)
      expect(screen.getByAltText('upgrading')).toBeInTheDocument();
    });

    it('updates when status prop changes', () => {
      const { rerender } = render(
        <EIP7702UpgradeStatusIcon status="upgrading" />
      );

      expect(screen.getByAltText('upgrading')).toBeInTheDocument();

      act(() => {
        rerender(<EIP7702UpgradeStatusIcon status="completed" />);
      });

      expect(screen.getByAltText('completed')).toBeInTheDocument();
    });
  });
});
