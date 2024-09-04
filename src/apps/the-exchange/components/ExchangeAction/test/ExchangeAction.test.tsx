import { ExchangeProviders } from '@etherspot/prime-sdk/dist/sdk/data';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BigNumber } from 'ethers';
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
  setReceiveTokenData,
  setSearchTokenResult,
  setSwapChain,
  setSwapToken,
  setSwapTokenData,
  setUsdPriceReceiveToken,
  setUsdPriceSwapToken,
} from '../../../reducer/theExchangeSlice';

// components
import ExchangeAction from '../ExchangeAction';

// types
import { SwapOffer } from '../../../utils/types';

const mockTokenAssets = [
  {
    address: '0x01',
    name: 'Ether',
    symbol: 'ETH',
    chainId: 1,
    decimals: 18,
    icon: 'iconEth.png',
  },
  {
    address: '0x02',
    name: 'Matic',
    symbol: 'MATIC',
    chainId: 137,
    decimals: 18,
    icon: 'iconMatic.png',
  },
];

const mockBestOffer: SwapOffer = {
  tokenAmountToReceive: 10,
  offer: {
    provider: ExchangeProviders.Uniswap,
    receiveAmount: BigNumber.from(10),
    exchangeRate: 1.2,
    transactions: [
      {
        to: 'y',
        data: '0x000000001',
        value: BigNumber.from(30),
      },
    ],
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
}));
jest.mock('../../../utils/converters', () => ({
  hasThreeZerosAfterDecimal: jest.fn((num) => num % 1 === 0),
  formatTokenAmount: jest.fn((amount) => {
    if (amount === undefined) return '0.00000000';
    return Number(amount).toFixed(8);
  }),
}));

describe('<ExchangeAction />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    act(() => {
      store.dispatch(setSwapTokenData(mockTokenAssets));
      store.dispatch(setReceiveTokenData(mockTokenAssets));
      store.dispatch(setIsSwapOpen(false));
      store.dispatch(setIsReceiveOpen(false));
      store.dispatch(setSwapChain({ chainId: 1, chainName: 'Ethereum' }));
      store.dispatch(setReceiveChain({ chainId: 137, chainName: 'Polygon' }));
      store.dispatch(setSwapToken(mockTokenAssets[0]));
      store.dispatch(setReceiveToken(mockTokenAssets[1]));
      store.dispatch(setAmountSwap(0.1));
      store.dispatch(setAmountReceive(10));
      store.dispatch(setBestOffer(undefined));
      store.dispatch(setSearchTokenResult([]));
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
    expect(screen.getByText('MATIC')).toBeInTheDocument();
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
