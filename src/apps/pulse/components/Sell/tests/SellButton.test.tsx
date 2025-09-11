/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { vi } from 'vitest';

// hooks
import { SellOffer } from '../../../hooks/useRelaySell';

// types
import { SelectedToken } from '../../../types/tokens';

// components
import SellButton from '../SellButton';

const mockToken: SelectedToken = {
  name: 'Test Token',
  symbol: 'TEST',
  logo: 'test-logo.png',
  usdValue: '100.00',
  dailyPriceChange: 0.05,
  chainId: 1,
  decimals: 18,
  address: '0x1234567890123456789012345678901234567890',
};

const mockSellOffer: SellOffer = {
  tokenAmountToReceive: 50.0,
  offer: {
    errors: undefined,
    fees: undefined,
    breakdown: undefined,
    details: undefined,
    error: undefined,
    refunded: undefined,
    steps: [],
    request: undefined,
  },
};

const mockProps = {
  setPreviewSell: vi.fn(),
  setSellOffer: vi.fn(),
  notEnoughLiquidity: false,
  isLoadingOffer: false,
  isInitialized: true,
};

describe('<SellButton />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(
        <SellButton
          {...mockProps}
          token={mockToken}
          tokenAmount="10"
          sellOffer={mockSellOffer}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe('renders correct text', () => {
    it('with token and offer available', () => {
      render(
        <SellButton
          {...mockProps}
          token={mockToken}
          tokenAmount="10"
          sellOffer={mockSellOffer}
        />
      );

      expect(screen.getByText('Sell')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('TEST')).toBeInTheDocument();
      expect(screen.getByText('for')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.getByText('USDC')).toBeInTheDocument();
    });

    it('with token only when no offer', () => {
      render(
        <SellButton
          {...mockProps}
          token={mockToken}
          tokenAmount="10"
          sellOffer={null}
        />
      );

      expect(screen.getByText('Sell TEST')).toBeInTheDocument();
    });

    it('shows "Sell" when no token selected', () => {
      render(
        <SellButton
          {...mockProps}
          token={null}
          tokenAmount="10"
          sellOffer={mockSellOffer}
        />
      );

      expect(screen.getByRole('button')).toHaveTextContent('Sell');
    });

    it('shows "Initializing..." when not initialized', () => {
      render(
        <SellButton
          {...mockProps}
          token={mockToken}
          tokenAmount="10"
          sellOffer={mockSellOffer}
          isInitialized={false}
        />
      );

      expect(screen.getByText('Initializing...')).toBeInTheDocument();
    });
  });

  describe('button states', () => {
    it('is enabled when all conditions are met', () => {
      render(
        <SellButton
          {...mockProps}
          token={mockToken}
          tokenAmount="10"
          sellOffer={mockSellOffer}
        />
      );

      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
      expect(button).toHaveStyle({
        backgroundColor: '#8A77FF',
        color: '#FFFFFF',
      });
    });

    it('is disabled when conditions not met', () => {
      const { rerender } = render(
        <SellButton
          {...mockProps}
          token={null}
          tokenAmount="10"
          sellOffer={mockSellOffer}
        />
      );

      let button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveStyle({
        backgroundColor: '#29292F',
        color: 'grey',
      });

      rerender(
        <SellButton
          {...mockProps}
          token={mockToken}
          tokenAmount="0"
          sellOffer={mockSellOffer}
        />
      );

      button = screen.getByRole('button');
      expect(button).toBeDisabled();

      rerender(
        <SellButton
          {...mockProps}
          token={mockToken}
          tokenAmount="10"
          sellOffer={null}
        />
      );

      button = screen.getByRole('button');
      expect(button).toBeDisabled();

      rerender(
        <SellButton
          {...mockProps}
          token={mockToken}
          tokenAmount="10"
          sellOffer={mockSellOffer}
          notEnoughLiquidity
        />
      );

      button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  it('calls handlers when clicked', () => {
    render(
      <SellButton
        {...mockProps}
        token={mockToken}
        tokenAmount="10"
        sellOffer={mockSellOffer}
      />
    );

    screen.getByRole('button').click();

    expect(mockProps.setPreviewSell).toHaveBeenCalledWith(true);
    expect(mockProps.setSellOffer).toHaveBeenCalledWith(mockSellOffer);
  });
});
