import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import renderer, { act } from 'react-test-renderer';

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

// Mock hooks and utils
jest.mock('../../../../../hooks/useGlobalTransactionsBatch', () => () => ({
  addToBatch: jest.fn(),
}));
jest.mock('../../../../../hooks/useBottomMenuModal', () => () => ({
  showSend: jest.fn(),
}));
jest.mock('@etherspot/transaction-kit', () => ({
  useEtherspotSwaps: () => ({
    prepareCrossChainOfferTransactions: jest.fn().mockResolvedValue([]),
  }),
  useEtherspotUtils: jest.fn().mockReturnValue({
    isZeroAddress: jest.fn(),
  }),
  useWalletAddress: jest.fn().mockReturnValue({
    walletAddress: jest.fn(),
  }),
}));
jest.mock('../../../utils/converters', () => ({
  hasThreeZerosAfterDecimal: jest.fn((num) => num % 1 === 0),
  formatTokenAmount: jest.fn((amount) => {
    if (amount === undefined) return '0.00000000';
    return Number(amount).toFixed(8);
  }),
}));

jest.mock('@lifi/sdk', () => ({
  LiFi: jest.fn().mockImplementation(() => ({
    getRoutes: jest.fn().mockResolvedValue({ routes: [] }),
    getStepTransaction: jest.fn().mockResolvedValue({}),
  })),
}));

describe('<ExchangeAction />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
});
