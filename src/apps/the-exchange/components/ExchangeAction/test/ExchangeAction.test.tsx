import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import renderer, { act } from 'react-test-renderer';
import { vi } from 'vitest';

// provider
import { Provider } from 'react-redux';
import { store } from '../../../../../store';

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
import ExchangeAction from '../ExchangeAction';

// types
import { Token } from '../../../../../services/tokensData';
import * as useOffer from '../../../hooks/useOffer';
import { SwapOffer } from '../../../utils/types';

const mockTokenAssets: Token[] = [
  {
    id: 1,
    contract: '0x01',
    name: 'Ether',
    symbol: 'ETH',
    blockchain: 'Ethereum',
    decimals: 18,
    logo: 'iconEth.png',
  },
  {
    id: 2,
    contract: '0x02',
    name: 'POL',
    symbol: 'POL',
    blockchain: 'Polygon',
    decimals: 18,
    logo: 'iconMatic.png',
  },
];

export const mockBestOffer: SwapOffer = {
  tokenAmountToReceive: 10,
  offer: {
    id: 'mock-offer-1',
    fromChainId: 1,
    fromAmountUSD: '12',
    fromAmount: '100000000000000000', // 0.1 ETH
    fromToken: {
      chainId: 1,
      address: '0x01',
      symbol: 'ETH',
      decimals: 18,
      name: 'Ether',
      priceUSD: '1200',
    },
    toChainId: 137,
    toAmountUSD: '4',
    toAmount: '10000000000000000000', // 10 POL
    toAmountMin: '9900000000000000000',
    toToken: {
      chainId: 137,
      address: '0x02',
      symbol: 'POL',
      decimals: 18,
      name: 'POL',
      priceUSD: '0.4',
    },
    insurance: {
      state: 'INSURED',
      feeAmountUsd: '0.1',
    },
    steps: [],
  },
};

const FEE_RECEIVER = '0xfee0000000000000000000000000000000000000';

// Mock hooks and utils
vi.mock('../../../../../hooks/useGlobalTransactionsBatch', () => ({
  _esModule: true,
  default: vi.fn(() => ({
    addToBatch: vi.fn(),
  })),
}));
vi.mock('../../../../../hooks/useBottomMenuModal', () => {
  return {
    _esModule: true,
    default: vi.fn(() => ({
      open: vi.fn(),
      close: vi.fn(),
      isOpen: false, // Default value for isOpen
    })),
  };
});

vi.mock('../../../utils/converters', () => ({
  hasThreeZerosAfterDecimal: vi.fn((num) => num % 1 === 0),
  formatTokenAmount: vi.fn((amount) => {
    if (amount === undefined) return '0.00000000';
    return Number(amount).toFixed(8);
  }),
}));

vi.mock('@lifi/sdk', () => ({
  LiFi: vi.fn().mockImplementation(() => ({
    getRoutes: vi.fn().mockResolvedValue({ routes: [] }),
    getStepTransaction: vi.fn().mockResolvedValue({}),
  })),
}));

describe('<ExchangeAction />', () => {
  beforeEach(() => {
    import.meta.env.VITE_SWAP_FEE_RECEIVER = FEE_RECEIVER;
    vi.clearAllMocks();
    act(() => {
      store.dispatch(setIsSwapOpen(false));
      store.dispatch(setIsReceiveOpen(false));
      store.dispatch(setSwapChain({ chainId: 1, chainName: 'Ethereum' }));
      store.dispatch(setReceiveChain({ chainId: 137, chainName: 'Polygon' }));
      store.dispatch(setSwapToken(mockTokenAssets[0]));
      store.dispatch(setReceiveToken(mockTokenAssets[1]));
      store.dispatch(setAmountSwap(0.1));
      store.dispatch(setAmountReceive(10));
      store.dispatch(setBestOffer(undefined));
      store.dispatch(setSearchTokenResult(undefined));
      store.dispatch(setUsdPriceSwapToken(1200));
      store.dispatch(setUsdPriceReceiveToken(0.4));
      store.dispatch(setIsOfferLoading(false));
    });
  });

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <ExchangeAction />
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders "You receive" and token information correctly', () => {
    render(
      <Provider store={store}>
        <ExchangeAction />
      </Provider>
    );

    act(() => {
      store.dispatch(setBestOffer(mockBestOffer));
    });

    expect(screen.getByText('You receive')).toBeInTheDocument();
    expect(screen.getByText('10.00000000')).toBeInTheDocument();
    expect(screen.getByText('POL')).toBeInTheDocument();
  });

  it('shows error message if no best offer available', async () => {
    render(
      <Provider store={store}>
        <ExchangeAction />
      </Provider>
    );

    const exchangeButton = screen
      .getByText('Exchange')
      .closest('div') as HTMLDivElement;
    fireEvent.click(exchangeButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          'No offer was found! Please try changing the amounts to try again.'
        )
      ).toBeInTheDocument();
    });
  });

  it('handles transactions addition and shows success', async () => {
    render(
      <Provider store={store}>
        <ExchangeAction />
      </Provider>
    );

    const exchangeButton = screen
      .getByText('Exchange')
      .closest('div') as HTMLDivElement;
    fireEvent.click(exchangeButton);

    await waitFor(() => {
      expect(screen.queryByTestId('loading-circular')).not.toBeInTheDocument();
      expect(screen.getByText('Exchange')).toBeInTheDocument();
    });
  });

  it('shows an error if getStepTransactions fails', async () => {
    vi.spyOn(useOffer, 'default').mockReturnValue({
      getStepTransactions: vi.fn().mockRejectedValue(new Error('Test error')),
      getBestOffer: vi.fn(), // Provide a default mock for getBestOffer
    });
    render(
      <Provider store={store}>
        <ExchangeAction />
      </Provider>
    );
    act(() => {
      store.dispatch(setBestOffer(mockBestOffer));
    });
    const exchangeButton = screen
      .getByText('Exchange')
      .closest('div') as HTMLDivElement;
    fireEvent.click(exchangeButton);
    screen.debug();
    await waitFor(() =>
      expect(
        screen.getByText((content) =>
          content.includes('We were not able to add this to the queue')
        )
      ).toBeInTheDocument()
    );
  });
});
