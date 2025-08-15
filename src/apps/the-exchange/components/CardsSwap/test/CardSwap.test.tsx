import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { vi } from 'vitest';

// test utils
import { ExchangeTestWrapper } from '../../../../../test-utils/testUtils';

// reducer
import {
  setAmountReceive,
  setAmountSwap,
  setBestOffer,
  setIsOfferLoading,
  setIsReceiveOpen,
  setIsSwapOpen,
  setReceiveChain,
  setReceiveToken,
  setSearchTokenResult,
  setSwapChain,
  setSwapToken,
  setUsdPriceReceiveToken,
  setUsdPriceSwapToken,
} from '../../../reducer/theExchangeSlice';

// components
import CardsSwap from '../CardsSwap';

// types
import { Token } from '../../../../../services/tokensData';

// Mock Sentry
vi.mock('@sentry/react', () => ({
  setContext: vi.fn(),
  addBreadcrumb: vi.fn(),
  startTransaction: vi.fn(() => ({
    finish: vi.fn(),
    setStatus: vi.fn(),
    setTag: vi.fn(),
    setData: vi.fn(),
  })),
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  withScope: vi.fn((callback) =>
    callback({
      setLevel: vi.fn(),
      setTag: vi.fn(),
      setExtra: vi.fn(),
    })
  ),
}));

// Mock Sentry utility functions
vi.mock('../../../utils/sentry', () => ({
  logUserInteraction: vi.fn(),
  addExchangeBreadcrumb: vi.fn(),
}));

const mockTokenAssets: Token[] = [
  {
    id: 1,
    contract: '0x01',
    name: 'Ether',
    symbol: 'ETH',
    blockchain: 'Ethereum',
    decimals: 18,
    logo: 'iconEth.png',
    balance: 4,
    price: 0.1,
  },
  {
    id: 2,
    contract: '0x02',
    name: 'POL',
    symbol: 'POL',
    blockchain: 'Polygon',
    decimals: 18,
    logo: 'iconMatic.png',
    balance: 12,
    price: 100,
  },
];

const mockChains = {
  ethereum: { chainId: 1, chainName: 'Ethereum' },
  polygon: { chainId: 137, chainName: 'Polygon' },
  arbitrum: { chainId: 42161, chainName: 'Arbitrum' },
};

vi.mock('../../../../../services/pillarXApiSearchTokens', () => ({
  __esModule: true,
  useGetSearchTokensQuery: vi.fn().mockReturnValue({
    data: undefined,
    isLoading: false,
    isFetching: false,
  }),
}));

vi.mock('../../../../../services/tokensData', () => ({
  __esModule: true,
  chainNameToChainIdTokensData: vi
    .fn()
    .mockImplementation((chainName: string) => {
      const mockChainIdMap = {
        Ethereum: 1,
        Polygon: 137,
        Arbitrum: 42161,
      } as const;

      return mockChainIdMap[chainName as keyof typeof mockChainIdMap] || 1;
    }),
  chainIdToChainNameTokensData: vi
    .fn()
    .mockImplementation((chainId: number) => {
      const mockChainIdMap = {
        1: 'Ethereum',
        137: 'Polygon',
        42161: 'Arbitrum',
      } as const;

      return (
        mockChainIdMap[chainId as keyof typeof mockChainIdMap] || 'Ethereum'
      );
    }),
  chainNameDataCompatibility: vi.fn((chainName: string) => chainName),
}));

// Mock useTransactionKit hook
vi.mock('../../../../hooks/useTransactionKit', () => ({
  default: vi.fn(() => ({
    walletAddress: '0x1234567890123456789012345678901234567890',
  })),
}));

describe('<CardsSwap />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store state to initial values
    setAmountSwap(0);
    setAmountReceive(0);
    setBestOffer(undefined);
    setIsOfferLoading(false);
    setIsSwapOpen(false);
    setIsReceiveOpen(false);
    setSwapChain(mockChains.ethereum);
    setReceiveChain(mockChains.polygon);
    setSwapToken(mockTokenAssets[0]);
    setReceiveToken(mockTokenAssets[1]);
    setSearchTokenResult([]);
    setUsdPriceSwapToken(0.1);
    setUsdPriceReceiveToken(100);
  });

  describe('Rendering and Snapshot', () => {
    it('renders correctly and matches snapshot', () => {
      const tree = renderer
        .create(
          <ExchangeTestWrapper>
            <CardsSwap />
          </ExchangeTestWrapper>
        )
        .toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('Default State Rendering', () => {
    it('renders the component container', () => {
      render(
        <ExchangeTestWrapper>
          <CardsSwap />
        </ExchangeTestWrapper>
      );

      // The component should always render its main container
      const mainContainer = screen.getByTestId('swap-receive-cards');
      expect(mainContainer).toBeInTheDocument();
    });

    it('shows cards when both dropdowns are closed', () => {
      render(
        <ExchangeTestWrapper>
          <CardsSwap />
        </ExchangeTestWrapper>
      );

      // When both dropdowns are closed, should show cards
      expect(screen.getByTestId('swap-receive-cards')).toBeInTheDocument();
      expect(
        screen.queryByTestId('dropdown-token-list')
      ).not.toBeInTheDocument();
    });

    it('shows swap and receive cards with correct text', () => {
      render(
        <ExchangeTestWrapper>
          <CardsSwap />
        </ExchangeTestWrapper>
      );

      // Should show both SWAP and RECEIVE cards
      expect(screen.getByText('SWAP')).toBeInTheDocument();
      expect(screen.getByText('RECEIVE')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('renders individual token cards', () => {
      render(
        <ExchangeTestWrapper>
          <CardsSwap />
        </ExchangeTestWrapper>
      );

      // Should render individual token cards
      const tokenCards = screen.getAllByTestId('select-token-card');
      expect(tokenCards).toHaveLength(2);
    });

    it('renders with correct main container structure', () => {
      render(
        <ExchangeTestWrapper>
          <CardsSwap />
        </ExchangeTestWrapper>
      );

      // Main container should exist
      const mainContainer = screen
        .getByTestId('swap-receive-cards')
        .closest('div.flex.w-full.justify-center');
      expect(mainContainer).toBeInTheDocument();
    });

    it('renders input fields for amount entry', () => {
      render(
        <ExchangeTestWrapper>
          <CardsSwap />
        </ExchangeTestWrapper>
      );

      // Should render input field for amount entry
      const amountInput = screen.getByTestId('enter-amount-input');
      expect(amountInput).toBeInTheDocument();
      expect(amountInput).toHaveAttribute('placeholder', '0');
      expect(amountInput).toHaveAttribute('type', 'number');
    });
  });

  describe('Card Content and Display', () => {
    it('displays correct blockchain information', () => {
      render(
        <ExchangeTestWrapper>
          <CardsSwap />
        </ExchangeTestWrapper>
      );

      // Should show blockchain info
      const blockchainInfo = screen.getAllByText(/On Ethereum/);
      expect(blockchainInfo.length).toBeGreaterThan(0);
    });

    it('displays USD price information', () => {
      render(
        <ExchangeTestWrapper>
          <CardsSwap />
        </ExchangeTestWrapper>
      );

      // Should show USD price info
      const usdPriceInfo = screen.getAllByText(/\$0\.00/);
      expect(usdPriceInfo.length).toBeGreaterThan(0);
    });

    it('renders directional arrows for swap and receive', () => {
      render(
        <ExchangeTestWrapper>
          <CardsSwap />
        </ExchangeTestWrapper>
      );

      // Should show directional arrows
      const sendArrow = screen.getByAltText('Send');
      const receiveArrow = screen.getByAltText('Receive');
      expect(sendArrow).toBeInTheDocument();
      expect(receiveArrow).toBeInTheDocument();
    });
  });

  describe('Component Behavior', () => {
    it('maintains consistent rendering across different states', () => {
      // Test with different token combinations
      const testCases = [
        { swapToken: mockTokenAssets[0], receiveToken: mockTokenAssets[1] },
        { swapToken: undefined, receiveToken: mockTokenAssets[1] },
        { swapToken: mockTokenAssets[0], receiveToken: undefined },
        { swapToken: undefined, receiveToken: undefined },
      ];

      testCases.forEach(({ swapToken, receiveToken }) => {
        setSwapToken(swapToken);
        setReceiveToken(receiveToken);

        const { unmount } = render(
          <ExchangeTestWrapper>
            <CardsSwap />
          </ExchangeTestWrapper>
        );

        // Component should always render cards in default state
        expect(screen.getByTestId('swap-receive-cards')).toBeInTheDocument();
        unmount();
      });
    });

    it('handles component rendering consistently', () => {
      const { rerender } = render(
        <ExchangeTestWrapper>
          <CardsSwap />
        </ExchangeTestWrapper>
      );

      // Initial render
      expect(screen.getByTestId('swap-receive-cards')).toBeInTheDocument();

      // Re-render with same props
      rerender(
        <ExchangeTestWrapper>
          <CardsSwap />
        </ExchangeTestWrapper>
      );

      // Should render correctly after re-rendering
      expect(screen.getByTestId('swap-receive-cards')).toBeInTheDocument();
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});
