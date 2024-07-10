import renderer, { act } from 'react-test-renderer';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BigNumber } from 'ethers';
import { ExchangeProviders } from '@etherspot/prime-sdk/dist/sdk/data';

// provider
import { Provider } from 'react-redux';
import { store } from '../../../../../store';

// reducer
import { 
  setAmountReceive,
  setAmountSwap,
  setBestOffer,
  setIsReceiveOpen,
  setIsSwapOpen,
  setReceiveChain,
  setReceiveToken,
  setReceiveTokenData,
  setSearchTokenResult,
  setSwapChain,
  setSwapToken,
  setSwapTokenData } from '../../../reducer/theExchangeSlice';

// components
import ExchangeAction from '../ExchangeAction';

// types
import { SwapOffer } from '../../../utils/types';


const mockTokenAssets = [
  { address: '0x01', name: 'Ether', symbol: 'ETH', chainId: 1, decimals: 18, icon: 'iconEth.png' },
  { address: '0x02', name: 'Matic', symbol: 'MATIC', chainId: 137, decimals: 18, icon: 'iconMatic.png' },
];

const mockBestOffer: SwapOffer = {
    tokenAmountToReceive: 10,
    offer: {
        provider: ExchangeProviders.Uniswap,
        receiveAmount: BigNumber.from(10),
        exchangeRate: 1.2,
        transactions: [{
            to: 'y',
            data: '0x000000001',
            value: BigNumber.from(30),
        },
        ]
    }
}
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
  }));


describe('<CardsSwap />', () => {
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
      store.dispatch(setAmountSwap({ tokenAmount: 0.1, usdAmount: 3000 }));
      store.dispatch(setAmountReceive({ tokenAmount: 10, usdAmount: 3000 }));
      store.dispatch(setBestOffer(undefined));
      store.dispatch(setSearchTokenResult([]));
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

    const exchangeButton = screen.getByText('Exchange').closest('div') as HTMLDivElement;
    fireEvent.click(exchangeButton);

    await waitFor(() => {
      expect(screen.getByText('No offer was found! Please try changing the amounts to try again.')).toBeInTheDocument();
    });
  });

  it('handles transactions addition and shows success', async () => {
    render(
        <Provider store={store}>
          <ExchangeAction />
        </Provider>
      );


    const exchangeButton = screen.getByText('Exchange').closest('div') as HTMLDivElement;
    fireEvent.click(exchangeButton);

    await waitFor(() => {
      expect(screen.queryByTestId('loading-circular')).not.toBeInTheDocument();
      expect(screen.getByText('Exchange')).toBeInTheDocument();
    });
  });

});
