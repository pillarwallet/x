/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExpressIntentResponse } from '@etherspot/intent-sdk/dist/cjs/sdk/types/user-intent-types';
import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { vi } from 'vitest';

// types
import { PayingToken, SelectedToken } from '../../../types/tokens';

// components
import BuyButton from '../BuyButton';

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

const mockPayingToken: PayingToken = {
  name: 'USD Coin',
  symbol: 'USDC',
  logo: 'usdc-logo.png',
  actualBal: '100.00',
  totalUsd: 100.0,
  totalRaw: '100000000',
  chainId: 1,
  address: '0xA0b86a33E6441b8C4C8C0C4C8C0C4C8C0C4C8C0C4',
};

const mockExpressIntentResponse: ExpressIntentResponse = {
  intentHash: '0xIntentHash123456789',
  bids: [{ bidHash: '0xBidHash123456789' }],
} as any;

const mockProps = {
  isLoading: false,
  isInstalling: false,
  isFetching: false,
  areModulesInstalled: true,
  token: mockToken,
  debouncedUsdAmount: '100.00',
  payingTokens: [mockPayingToken],
  handleBuySubmit: vi.fn(),
  expressIntentResponse: mockExpressIntentResponse,
  usdAmount: '100.00',
  notEnoughLiquidity: false,
};

describe('<BuyButton />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly and matches snapshot', () => {
    const tree = renderer.create(<BuyButton {...mockProps} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe('renders correct text', () => {
    it('with token and valid amount', () => {
      render(<BuyButton {...mockProps} />);

      expect(screen.getByText('Buy')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('TEST')).toBeInTheDocument();
      expect(screen.getByText('for')).toBeInTheDocument();
      expect(screen.getByText('$100')).toBeInTheDocument();
    });

    it('shows "Buy" when no token selected', () => {
      render(
        <BuyButton {...mockProps} token={null} debouncedUsdAmount="100.00" />
      );

      expect(screen.getByRole('button')).toHaveTextContent('Buy');
    });

    it('shows "Buy" when no amount entered', () => {
      render(<BuyButton {...mockProps} debouncedUsdAmount="0" usdAmount="0" />);

      expect(screen.getByRole('button')).toHaveTextContent('Buy');
    });

    it('shows loading spinner when loading', () => {
      render(<BuyButton {...mockProps} isLoading />);

      expect(screen.getByRole('button')).toHaveTextContent('');
    });

    it('shows loading spinner when installing', () => {
      render(<BuyButton {...mockProps} isInstalling />);

      expect(screen.getByRole('button')).toHaveTextContent('');
    });

    it('shows loading spinner when fetching', () => {
      render(<BuyButton {...mockProps} isFetching />);

      expect(screen.getByRole('button')).toHaveTextContent('');
    });

    it('shows enable trading text when modules not installed', () => {
      render(
        <BuyButton
          {...mockProps}
          areModulesInstalled={false}
          payingTokens={[mockPayingToken]}
        />
      );

      expect(
        screen.getByText('Enable Trading on Ethereum')
      ).toBeInTheDocument();
    });
  });

  describe('button states', () => {
    it('is enabled when all conditions are met', () => {
      render(<BuyButton {...mockProps} />);

      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
      expect(button).toHaveStyle({
        backgroundColor: '#8A77FF',
        color: '#FFFFFF',
      });
    });

    it('is disabled when loading', () => {
      render(<BuyButton {...mockProps} isLoading />);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveStyle({
        backgroundColor: '#29292F',
        color: 'grey',
      });
    });

    it('is disabled when installing', () => {
      render(<BuyButton {...mockProps} isInstalling />);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('is disabled when fetching', () => {
      render(<BuyButton {...mockProps} isFetching />);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('is disabled when no token selected', () => {
      render(<BuyButton {...mockProps} token={null} />);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('is disabled when no amount entered', () => {
      render(<BuyButton {...mockProps} usdAmount="0" debouncedUsdAmount="0" />);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('is disabled when no express intent response', () => {
      render(<BuyButton {...mockProps} expressIntentResponse={null} />);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('is disabled when express intent has error', () => {
      render(
        <BuyButton
          {...mockProps}
          expressIntentResponse={{ error: 'Intent failed' } as any}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('is disabled when no bids available', () => {
      render(
        <BuyButton
          {...mockProps}
          expressIntentResponse={{
            ...mockExpressIntentResponse,
            bids: [],
          }}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('is disabled when not enough liquidity', () => {
      render(<BuyButton {...mockProps} notEnoughLiquidity />);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('is enabled when modules not installed but paying tokens available', () => {
      render(
        <BuyButton
          {...mockProps}
          areModulesInstalled={false}
          payingTokens={[mockPayingToken]}
        />
      );

      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });
  });

  it('calls handleBuySubmit when clicked', () => {
    render(<BuyButton {...mockProps} />);

    screen.getByRole('button').click();

    expect(mockProps.handleBuySubmit).toHaveBeenCalled();
  });

  describe('handles edge cases', () => {
    it('handles zero token USD value', () => {
      const tokenWithZeroValue = { ...mockToken, usdValue: '0' };
      render(<BuyButton {...mockProps} token={tokenWithZeroValue} />);

      expect(screen.getByText('Buy TEST')).toBeInTheDocument();
    });

    it('handles invalid USD amount', () => {
      render(
        <BuyButton
          {...mockProps}
          debouncedUsdAmount="invalid"
          usdAmount="invalid"
        />
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('handles empty paying tokens array', () => {
      render(
        <BuyButton
          {...mockProps}
          payingTokens={[]}
          areModulesInstalled={false}
        />
      );

      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });
  });
});
