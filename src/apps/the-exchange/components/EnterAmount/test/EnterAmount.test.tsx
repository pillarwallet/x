import { fireEvent, render, waitFor } from '@testing-library/react';
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
  setUsdPriceSwapToken,
} from '../../../reducer/theExchangeSlice';

// types
import { Token } from '../../../../../services/tokensData';
import { CardPosition } from '../../../utils/types';

// components
import EnterAmount from '../EnterAmount';

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

// Mock transaction-kit hooks being used
jest.mock('@etherspot/transaction-kit', () => ({
  __esModule: true,
  useEtherspotSwaps: jest.fn().mockReturnValue({
    getOffers: jest.fn().mockResolvedValue([]),
    prepareCrossChainOfferTransactions: jest.fn().mockResolvedValue({}),
    getQuotes: jest.fn().mockResolvedValue({}),
  }),
  useWalletAddress: jest.fn().mockReturnValue({
    walletAddress: jest.fn(),
  }),
  useEtherspotUtils: jest.fn().mockReturnValue({
    isZeroAddress: jest.fn(),
    addressesEqual: jest.fn(),
  }),
}));

jest.mock('@lifi/sdk', () => ({
  LiFi: jest.fn().mockImplementation(() => ({
    getRoutes: jest.fn().mockResolvedValue({ routes: [] }),
    getStepTransaction: jest.fn().mockResolvedValue({}),
  })),
}));

describe('<EnterAmount />', () => {
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
      store.dispatch(setIsOfferLoading(false));
    });
  });

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <EnterAmount
            type={CardPosition.SWAP}
            tokenSymbol={store.getState().swap.swapToken.symbol}
          />
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('handles token amount change in Swap card', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <EnterAmount
          type={CardPosition.SWAP}
          tokenSymbol={store.getState().swap.swapToken.symboll}
        />
      </Provider>
    );

    act(() => {
      store.dispatch(setAmountSwap(0));
      store.dispatch(setUsdPriceSwapToken(0));
    });

    const inputElement = getByTestId('enter-amount-input');
    fireEvent.change(inputElement, { target: { value: '50' } });

    await waitFor(() => {
      expect(store.getState().swap.amountSwap).toEqual(50);
      expect(store.getState().swap.usdPriceSwapToken).toEqual(0.1);
    });
  });
});
