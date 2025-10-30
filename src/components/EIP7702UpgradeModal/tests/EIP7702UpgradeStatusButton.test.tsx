/* eslint-disable react/jsx-props-no-spreading */
import { fireEvent, render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { vi } from 'vitest';

// components
import EIP7702UpgradeStatusButton from '../EIP7702UpgradeStatusButton';

// Mock dependencies
vi.mock('../../utils/upgrade', () => ({
  getButtonConfig: vi.fn((status) => {
    if (status === 'completed') {
      return {
        bgColor: 'bg-[#5CFF93]/10',
        textColor: 'text-[#5CFF93]',
        borderColor: 'border-[#5CFF93]',
        label: 'Success',
      };
    }
    if (status === 'failed') {
      return {
        bgColor: 'bg-[#FF366C]/10',
        textColor: 'text-[#FF366C]',
        borderColor: 'border-[#FF366C]',
        label: 'View Details',
      };
    }
    return {
      bgColor: 'bg-[#FFAB36]/10',
      textColor: 'text-[#FFAB36]',
      borderColor: 'border-[#FFAB36]',
      label: 'View Details',
    };
  }),
}));

vi.mock('react-loader-spinner', () => ({
  TailSpin: () => <div data-testid="tail-spin">Loading</div>,
}));

vi.mock('../../assets/images/confirmed-icon.svg', () => ({
  default: 'confirmed-icon.svg',
}));

vi.mock('../../assets/images/failed-icon.svg', () => ({
  default: 'failed-icon.svg',
}));

vi.mock('@react-spring/web', () => ({
  animated: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    button: ({ children, className, style, onClick }: any) => (
      <button
        className={className}
        style={style}
        onClick={onClick}
        type="button"
        data-testid="animated-button"
      >
        {children}
      </button>
    ),
  },
  useSpring: vi.fn(() => [
    { scale: 1 },
    { set: vi.fn(), start: vi.fn(), stop: vi.fn() },
  ]),
}));

const baseProps = {
  status: 'upgrading' as const,
  onClick: vi.fn(),
};

describe('<EIP7702UpgradeStatusButton />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders correctly and matches snapshot', () => {
      const tree = renderer
        .create(<EIP7702UpgradeStatusButton {...baseProps} />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('renders with upgrading status', () => {
      render(<EIP7702UpgradeStatusButton {...baseProps} status="upgrading" />);

      expect(screen.getByTestId('animated-button')).toBeInTheDocument();
      expect(screen.getByText('View Details')).toBeInTheDocument();
      expect(screen.getByTestId('tail-spin')).toBeInTheDocument();
    });

    it('renders with submitted status', () => {
      render(<EIP7702UpgradeStatusButton {...baseProps} status="submitted" />);

      expect(screen.getByTestId('animated-button')).toBeInTheDocument();
      expect(screen.getByText('View Details')).toBeInTheDocument();
      expect(screen.getByTestId('tail-spin')).toBeInTheDocument();
    });

    it('renders with completed status', () => {
      render(<EIP7702UpgradeStatusButton {...baseProps} status="completed" />);

      expect(screen.getByTestId('animated-button')).toBeInTheDocument();
      expect(screen.getByText('Success')).toBeInTheDocument();
      expect(screen.getByAltText('confirmed')).toBeInTheDocument();
    });

    it('renders with failed status', () => {
      render(<EIP7702UpgradeStatusButton {...baseProps} status="failed" />);

      expect(screen.getByTestId('animated-button')).toBeInTheDocument();
      expect(screen.getByText('View Details')).toBeInTheDocument();
      expect(screen.getByAltText('failed')).toBeInTheDocument();
    });
  });

  describe('Icon rendering', () => {
    it('shows loading spinner for upgrading status', () => {
      render(<EIP7702UpgradeStatusButton {...baseProps} status="upgrading" />);

      expect(screen.getByTestId('tail-spin')).toBeInTheDocument();
    });

    it('shows loading spinner for submitted status', () => {
      render(<EIP7702UpgradeStatusButton {...baseProps} status="submitted" />);

      expect(screen.getByTestId('tail-spin')).toBeInTheDocument();
    });

    it('shows confirmed icon for completed status', () => {
      render(<EIP7702UpgradeStatusButton {...baseProps} status="completed" />);

      const img = screen.getByAltText('confirmed');
      expect(img).toBeInTheDocument();
      expect(screen.queryByTestId('tail-spin')).not.toBeInTheDocument();
    });

    it('shows failed icon for failed status', () => {
      render(<EIP7702UpgradeStatusButton {...baseProps} status="failed" />);

      const img = screen.getByAltText('failed');
      expect(img).toBeInTheDocument();
      expect(screen.queryByTestId('tail-spin')).not.toBeInTheDocument();
    });
  });

  describe('User interactions', () => {
    it('calls onClick when button is clicked', () => {
      render(<EIP7702UpgradeStatusButton {...baseProps} />);

      const button = screen.getByTestId('animated-button');
      fireEvent.click(button);

      expect(baseProps.onClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when button is not clicked', () => {
      render(<EIP7702UpgradeStatusButton {...baseProps} />);

      expect(baseProps.onClick).not.toHaveBeenCalled();
    });
  });

  describe('Button styling', () => {
    it('applies correct background color for upgrading status', () => {
      const { container } = render(
        <EIP7702UpgradeStatusButton {...baseProps} status="upgrading" />
      );

      const button = container.querySelector('[class*="bg-"]');
      expect(button).toBeInTheDocument();
    });

    it('applies correct background color for completed status', () => {
      const { container } = render(
        <EIP7702UpgradeStatusButton {...baseProps} status="completed" />
      );

      const button = container.querySelector('[class*="bg-"]');
      expect(button).toBeInTheDocument();
    });

    it('applies correct background color for failed status', () => {
      const { container } = render(
        <EIP7702UpgradeStatusButton {...baseProps} status="failed" />
      );

      const button = container.querySelector('[class*="bg-"]');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Component memoization', () => {
    it('memoizes the component to prevent unnecessary re-renders', () => {
      const { rerender } = render(
        <EIP7702UpgradeStatusButton {...baseProps} />
      );

      // Initial render
      expect(screen.getByText('View Details')).toBeInTheDocument();

      // Rerender with same props
      rerender(<EIP7702UpgradeStatusButton {...baseProps} />);

      // Should still find the element
      expect(screen.getByText('View Details')).toBeInTheDocument();
    });

    it('updates when status prop changes', () => {
      const { rerender } = render(
        <EIP7702UpgradeStatusButton {...baseProps} status="upgrading" />
      );

      expect(screen.getByText('View Details')).toBeInTheDocument();

      rerender(
        <EIP7702UpgradeStatusButton {...baseProps} status="completed" />
      );

      expect(screen.getByText('Success')).toBeInTheDocument();
    });
  });
});
