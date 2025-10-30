/* eslint-disable react/jsx-props-no-spreading */
import { fireEvent, render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { vi } from 'vitest';

// components
import EIP7702UpgradeAction from '../EIP7702UpgradeAction';

// Mock dependencies
vi.mock('../../utils/number', () => ({
  limitDigitsNumber: vi.fn((num: number) => num),
}));

vi.mock('react-loader-spinner', () => ({
  TailSpin: () => <div data-testid="tail-spin">Loading</div>,
}));

vi.mock('../../assets/images/logo-ethereum.png', () => ({
  default: 'logo-ethereum.png',
}));

vi.mock('../../assets/images/upgrade-green-logo.svg', () => ({
  default: 'upgrade-green-logo.svg',
}));

const baseProps = {
  onClose: vi.fn(),
  handleUpgrade: vi.fn(),
  gasFeeEstimates: '0.001',
  isCheckingGas: false,
  hasEnoughGas: true,
};

describe('<EIP7702UpgradeAction />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders correctly and matches snapshot', () => {
      const tree = renderer
        .create(<EIP7702UpgradeAction {...baseProps} />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('displays main elements correctly', () => {
      render(<EIP7702UpgradeAction {...baseProps} />);

      expect(screen.getByText('Upgrade your account')).toBeInTheDocument();
      expect(screen.getByText('Network:')).toBeInTheDocument();
      expect(screen.getByText('Ethereum')).toBeInTheDocument();
      expect(screen.getByText('Faster Transactions.')).toBeInTheDocument();
      expect(screen.getByText('Lower fees.')).toBeInTheDocument();
      expect(screen.getByText('Pay with any token.')).toBeInTheDocument();
      expect(screen.getByText('Any time.')).toBeInTheDocument();
      expect(screen.getByText('Same account.')).toBeInTheDocument();
      expect(screen.getByText('Smart Features.')).toBeInTheDocument();
      expect(screen.getByText('Upgrade now')).toBeInTheDocument();
      expect(screen.getByText('Upgrade later')).toBeInTheDocument();
    });

    it('displays gas fee when provided', () => {
      render(<EIP7702UpgradeAction {...baseProps} gasFeeEstimates="0.001" />);

      expect(screen.getByText('Fees:')).toBeInTheDocument();
      expect(screen.getByText(/0\.001/)).toBeInTheDocument();
      expect(screen.getByText(/ETH/)).toBeInTheDocument();
    });

    it('shows loading spinner when checking gas', () => {
      render(<EIP7702UpgradeAction {...baseProps} isCheckingGas />);

      expect(screen.getByTestId('tail-spin')).toBeInTheDocument();
      expect(screen.queryByText('ETH')).not.toBeInTheDocument();
    });
  });

  describe('Benefits display', () => {
    it('displays all three benefits with checkmarks', () => {
      const { container } = render(<EIP7702UpgradeAction {...baseProps} />);

      // Check icons should be present
      const checkIcons = container.querySelectorAll('[class*="bg-"]');
      expect(checkIcons.length).toBeGreaterThanOrEqual(3);

      // All benefit text should be visible
      expect(screen.getByText('Faster Transactions.')).toBeInTheDocument();
      expect(screen.getByText('Lower fees.')).toBeInTheDocument();
      expect(screen.getByText('Pay with any token.')).toBeInTheDocument();
      expect(screen.getByText('Any time.')).toBeInTheDocument();
      expect(screen.getByText('Same account.')).toBeInTheDocument();
      expect(screen.getByText('Smart Features.')).toBeInTheDocument();
    });
  });

  describe('Button states', () => {
    it('shows "Upgrade now" when has enough gas', () => {
      render(<EIP7702UpgradeAction {...baseProps} hasEnoughGas />);

      const button = screen.getByText('Upgrade now');
      expect(button).toBeInTheDocument();
      expect(button.closest('button')).not.toBeDisabled();
    });

    it('shows "Not enough gas" when has insufficient gas', () => {
      render(<EIP7702UpgradeAction {...baseProps} hasEnoughGas={false} />);

      const button = screen.getByText('Not enough gas');
      expect(button).toBeInTheDocument();
      expect(button.closest('button')).toBeDisabled();
    });

    it('disables button when checking gas', () => {
      render(<EIP7702UpgradeAction {...baseProps} isCheckingGas />);

      const button = screen.getByText('Upgrade now');
      expect(button.closest('button')).toBeDisabled();
    });

    it('disables button when not enough gas', () => {
      render(<EIP7702UpgradeAction {...baseProps} hasEnoughGas={false} />);

      const button = screen.getByText('Not enough gas');
      expect(button.closest('button')).toBeDisabled();
    });
  });

  describe('User interactions', () => {
    it('calls handleUpgrade when upgrade button is clicked', () => {
      render(<EIP7702UpgradeAction {...baseProps} />);

      const button = screen.getByText('Upgrade now');
      fireEvent.click(button);

      expect(baseProps.handleUpgrade).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when "Upgrade later" is clicked', () => {
      render(<EIP7702UpgradeAction {...baseProps} />);

      const laterButton = screen.getByText('Upgrade later');
      fireEvent.click(laterButton);

      expect(baseProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call handleUpgrade when button is disabled', () => {
      render(<EIP7702UpgradeAction {...baseProps} hasEnoughGas={false} />);

      const button = screen.getByText('Not enough gas');
      fireEvent.click(button);

      expect(baseProps.handleUpgrade).not.toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('handles missing gas fee estimates', () => {
      render(
        <EIP7702UpgradeAction {...baseProps} gasFeeEstimates={undefined} />
      );

      expect(screen.getByText('Fees:')).toBeInTheDocument();
      expect(
        screen.getByText((content) => content.includes('-'))
      ).toBeInTheDocument();
    });

    it('handles invalid gas fee estimates', () => {
      render(<EIP7702UpgradeAction {...baseProps} gasFeeEstimates="invalid" />);

      expect(screen.getByText('Fees:')).toBeInTheDocument();
      expect(
        screen.getByText((content) => content.includes('-'))
      ).toBeInTheDocument();
    });

    it('handles empty gas fee estimates', () => {
      render(<EIP7702UpgradeAction {...baseProps} gasFeeEstimates="" />);

      expect(screen.getByText('Fees:')).toBeInTheDocument();
      expect(
        screen.getByText((content) => content.includes('-'))
      ).toBeInTheDocument();
    });
  });

  describe('Default props', () => {
    it('uses default values for optional props', () => {
      const minimalProps = {
        onClose: vi.fn(),
        handleUpgrade: vi.fn(),
      };

      render(<EIP7702UpgradeAction {...minimalProps} />);

      // Should render without errors
      expect(screen.getByText('Upgrade your account')).toBeInTheDocument();
      expect(screen.getByText('Upgrade later')).toBeInTheDocument();
    });
  });

  describe('Button styling', () => {
    it('applies active button styles when enabled', () => {
      const { container } = render(<EIP7702UpgradeAction {...baseProps} />);

      const button = container.querySelector('.bg-\\[\\#8A77FF\\]');
      expect(button).toBeInTheDocument();
    });

    it('applies disabled button styles when disabled', () => {
      const { container } = render(
        <EIP7702UpgradeAction {...baseProps} hasEnoughGas={false} />
      );

      const button = container.querySelector('.bg-\\[\\#3D3A44\\]');
      expect(button).toBeInTheDocument();
    });
  });
});
