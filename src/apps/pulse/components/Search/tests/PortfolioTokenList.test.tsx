/* eslint-disable quotes */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { vi } from 'vitest';

// types
import { PortfolioData } from '../../../../../types/api';

// components
import PortfolioTokenList from '../PortfolioTokenList';

const mockHandleTokenSelect = vi.fn();

const mockPortfolioData: PortfolioData = {
  assets: [
    {
      asset: {
        id: 1,
        name: 'Test Token',
        symbol: 'TEST',
        logo: 'https://example.com/logo.png',
        decimals: ['18'],
        contracts: ['0x1234567890123456789012345678901234567890'],
        blockchains: ['ethereum'],
      },
      contracts_balances: [
        {
          address: '0x1234567890123456789012345678901234567890',
          balance: 1.0,
          balanceRaw: '1000000000000000000',
          chainId: 'eip155:1',
          decimals: 18,
        },
      ],
      cross_chain_balances: {},
      price_change_24h: 0.05,
      estimated_balance: 1.5,
      price: 1.5,
      token_balance: 1.0,
      allocation: 0.3,
      wallets: ['0x1234567890123456789012345678901234567890'],
    },
    {
      asset: {
        id: 2,
        name: 'Another Token',
        symbol: 'ANOTHER',
        logo: '',
        decimals: ['18'],
        contracts: ['0x0987654321098765432109876543210987654321'],
        blockchains: ['ethereum'],
      },
      contracts_balances: [
        {
          address: '0x0987654321098765432109876543210987654321',
          balance: 2.0,
          balanceRaw: '2000000000000000000',
          chainId: 'eip155:1',
          decimals: 18,
        },
      ],
      cross_chain_balances: {},
      price_change_24h: -0.02,
      estimated_balance: 4.0,
      price: 2.0,
      token_balance: 2.0,
      allocation: 0.7,
      wallets: ['0x1234567890123456789012345678901234567890'],
    },
  ],
  total_wallet_balance: 5.5,
  wallets: ['0x1234567890123456789012345678901234567890'],
  balances_length: 2,
};

const defaultProps = {
  walletPortfolioData: mockPortfolioData,
  handleTokenSelect: mockHandleTokenSelect,
  isLoading: false,
  isError: false,
  searchText: '',
};

describe('<PortfolioTokenList />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(<PortfolioTokenList {...defaultProps} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders loading state', () => {
    render(<PortfolioTokenList {...defaultProps} isLoading />);

    expect(screen.getByText('Loading your portfolio...')).toBeInTheDocument();
    expect(screen.queryByText('Token/Price')).not.toBeInTheDocument();
  });

  it('renders error state', () => {
    render(<PortfolioTokenList {...defaultProps} isError />);

    expect(screen.getByText('⚠️ Failed to load portfolio')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Unable to fetch your wallet data. Please try again later.'
      )
    ).toBeInTheDocument();
  });

  it('renders no data state when walletPortfolioData is null', () => {
    render(
      <PortfolioTokenList {...defaultProps} walletPortfolioData={undefined} />
    );

    expect(screen.getByText('🔍 No portfolio data')).toBeInTheDocument();
    expect(
      screen.getByText('Connect your wallet to see your holdings')
    ).toBeInTheDocument();
  });

  it('renders empty portfolio state', () => {
    const emptyPortfolioData: PortfolioData = {
      assets: [],
      total_wallet_balance: 0,
      wallets: [],
      balances_length: 0,
    };

    render(
      <PortfolioTokenList
        {...defaultProps}
        walletPortfolioData={emptyPortfolioData}
      />
    );

    expect(screen.getByText('💰 Portfolio is empty')).toBeInTheDocument();
    expect(
      screen.getByText("You don't have any tokens in your portfolio yet")
    ).toBeInTheDocument();
  });

  it('renders no matching tokens when search has no results', () => {
    render(<PortfolioTokenList {...defaultProps} searchText="nonexistent" />);

    expect(screen.getByText('🔍 No matching tokens found')).toBeInTheDocument();
    expect(
      screen.getByText("No tokens match 'nonexistent' in your portfolio")
    ).toBeInTheDocument();
  });

  it('renders portfolio tokens with correct data', () => {
    render(<PortfolioTokenList {...defaultProps} />);

    expect(screen.getByText('Token/Price')).toBeInTheDocument();
    expect(screen.getByText('Balance')).toBeInTheDocument();
    expect(screen.getByText('TEST')).toBeInTheDocument();
    expect(screen.getByText('Test Token')).toBeInTheDocument();
    expect(screen.getAllByText('$1.5')).toHaveLength(2); // Price and balance
    expect(screen.getByText('ANOTHER')).toBeInTheDocument();
    expect(screen.getByText('Another Token')).toBeInTheDocument();
    expect(screen.getAllByText('$2')).toHaveLength(1); // Only price for ANOTHER
    expect(screen.getByText('$4')).toBeInTheDocument(); // Balance for ANOTHER
  });

  it('filters tokens by search text', () => {
    render(<PortfolioTokenList {...defaultProps} searchText="test" />);

    expect(screen.getByText('TEST')).toBeInTheDocument();
    expect(screen.getByText('Test Token')).toBeInTheDocument();
    expect(screen.queryByText('ANOTHER')).not.toBeInTheDocument();
    expect(screen.queryByText('Another Token')).not.toBeInTheDocument();
  });

  it('filters tokens by symbol case insensitively', () => {
    render(<PortfolioTokenList {...defaultProps} searchText="another" />);

    expect(screen.getByText('ANOTHER')).toBeInTheDocument();
    expect(screen.getByText('Another Token')).toBeInTheDocument();
    expect(screen.queryByText('TEST')).not.toBeInTheDocument();
    expect(screen.queryByText('Test Token')).not.toBeInTheDocument();
  });

  it('filters tokens by contract address', () => {
    render(<PortfolioTokenList {...defaultProps} searchText="0x1234" />);

    expect(screen.getByText('TEST')).toBeInTheDocument();
    expect(screen.getByText('Test Token')).toBeInTheDocument();
    expect(screen.queryByText('ANOTHER')).not.toBeInTheDocument();
  });

  it('calls handleTokenSelect when token is clicked', () => {
    render(<PortfolioTokenList {...defaultProps} />);

    const tokenButton = screen.getByText('TEST').closest('button');
    tokenButton?.click();

    expect(mockHandleTokenSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        symbol: 'TEST',
        name: 'Test Token',
        contract: '0x1234567890123456789012345678901234567890',
      })
    );
  });

  it('sorts tokens by USD value in descending order', () => {
    render(<PortfolioTokenList {...defaultProps} />);

    const tokenButtons = screen.getAllByRole('button');
    const firstToken = tokenButtons[0];
    const secondToken = tokenButtons[1];

    expect(firstToken).toHaveTextContent('ANOTHER'); // Higher USD value (4.0)
    expect(secondToken).toHaveTextContent('TEST'); // Lower USD value (1.5)
  });

  it('displays token logos when available', () => {
    render(<PortfolioTokenList {...defaultProps} />);

    const testTokenImage = screen.getByAltText('token logo');
    expect(testTokenImage).toHaveAttribute(
      'src',
      'https://example.com/logo.png'
    );
  });

  it('displays random avatar when logo is not available', () => {
    render(<PortfolioTokenList {...defaultProps} />);

    const anotherTokenContainer = screen.getByText('ANOTHER').closest('button');
    const avatarContainer = anotherTokenContainer?.querySelector(
      '.w-8.h-8.rounded-full.overflow-hidden'
    );
    expect(avatarContainer).toBeInTheDocument();
  });

  it('displays chain logos for each token', () => {
    render(<PortfolioTokenList {...defaultProps} />);

    const chainLogos = screen.getAllByAltText('chain logo');
    expect(chainLogos).toHaveLength(2);
  });

  it('handles tokens with zero balance by showing empty portfolio', () => {
    const portfolioWithZeroBalance: PortfolioData = {
      assets: [
        {
          asset: {
            id: 3,
            name: 'Zero Token',
            symbol: 'ZERO',
            logo: '',
            decimals: ['18'],
            contracts: ['0x1234567890123456789012345678901234567890'],
            blockchains: ['ethereum'],
          },
          contracts_balances: [
            {
              address: '0x1234567890123456789012345678901234567890',
              balance: 0,
              balanceRaw: '0',
              chainId: 'eip155:1',
              decimals: 18,
            },
          ],
          cross_chain_balances: {},
          price_change_24h: 0,
          estimated_balance: 0,
          price: 1.0,
          token_balance: 0,
          allocation: 0,
          wallets: ['0x1234567890123456789012345678901234567890'],
        },
      ],
      total_wallet_balance: 0,
      wallets: ['0x1234567890123456789012345678901234567890'],
      balances_length: 1,
    };

    render(
      <PortfolioTokenList
        {...defaultProps}
        walletPortfolioData={portfolioWithZeroBalance}
      />
    );

    // Zero balance tokens are filtered out, so we should see empty portfolio message
    expect(screen.getByText('💰 Portfolio is empty')).toBeInTheDocument();
    expect(
      screen.getByText("You don't have any tokens in your portfolio yet")
    ).toBeInTheDocument();
  });

  it('handles tokens with null price', () => {
    const portfolioWithNullPrice: PortfolioData = {
      assets: [
        {
          asset: {
            id: 4,
            name: 'No Price Token',
            symbol: 'NOPRICE',
            logo: '',
            decimals: ['18'],
            contracts: ['0x1234567890123456789012345678901234567890'],
            blockchains: ['ethereum'],
          },
          contracts_balances: [
            {
              address: '0x1234567890123456789012345678901234567890',
              balance: 1.0,
              balanceRaw: '1000000000000000000',
              chainId: 'eip155:1',
              decimals: 18,
            },
          ],
          cross_chain_balances: {},
          price_change_24h: 0,
          estimated_balance: 0,
          price: 0,
          token_balance: 1.0,
          allocation: 0,
          wallets: ['0x1234567890123456789012345678901234567890'],
        },
      ],
      total_wallet_balance: 0,
      wallets: ['0x1234567890123456789012345678901234567890'],
      balances_length: 1,
    };

    render(
      <PortfolioTokenList
        {...defaultProps}
        walletPortfolioData={portfolioWithNullPrice}
      />
    );

    expect(screen.getByText('NOPRICE')).toBeInTheDocument();
    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });
});
