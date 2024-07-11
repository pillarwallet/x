import renderer, { act } from 'react-test-renderer';
import { render, fireEvent, waitFor } from '@testing-library/react';

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

// types
import { CardPosition } from '../../../utils/types';
import { AccountBalancesListenerRef } from '../../../../../providers/AccountBalancesProvider';

// components
import EnterAmount from '../EnterAmount';

const mockTokenAssets = [
    { address: '0x01', name: 'Ether', symbol: 'ETH', chainId: 1, decimals: 18, icon: 'iconEth.png' },
    { address: '0x02', name: 'Matic', symbol: 'MATIC', chainId: 137, decimals: 18, icon: 'iconMatic.png' },
  ];

  // Mock transaction-kit hooks being used
jest.mock('@etherspot/transaction-kit', () => ({
    __esModule: true,
    useEtherspotSwaps: jest.fn().mockReturnValue({
      getOffers: jest.fn().mockResolvedValue([]),
      prepareCrossChainOfferTransactions: jest.fn().mockResolvedValue({}),
      getQuotes: jest.fn().mockResolvedValue({}),
    }),
    useEtherspotPrices: jest.fn().mockReturnValue({
      getPrice: jest.fn(),
      getPrices: jest.fn(),
    }),
    useWalletAddress: jest.fn().mockReturnValue({
      walletAddress: jest.fn(),
    }),
    useEtherspotUtils: jest.fn().mockReturnValue({
      isZeroAddress: jest.fn(),
      addressesEqual: jest.fn(),
    }),
    useEtherspotBalances: jest.fn().mockReturnValue({
        getAccountBalances: jest.fn(),
      }),
  }));

    // Mock useAccountBalances hook
    jest.mock('../../../../../hooks/useAccountBalances', () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue({
      listenerRef: { current: {} as AccountBalancesListenerRef },
      data: {
        balances: {
          '0x01': { balance: '0.2', usdValue: '6000' },
          '0x02': { balance: '20', usdValue: '6000' },
        },
        updateData: false,
        setUpdateData: jest.fn(),
      },
    }),
  }));

describe('<DropdownTokenList />', () => {
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
                <EnterAmount type={CardPosition.SWAP} tokenSymbol={store.getState().swap.swapToken.symbol} />
              </Provider>)
            .toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('handles token amount change in Swap card', async () => {
        const { getByTestId } = render(
          <Provider store={store}>
            <EnterAmount type={CardPosition.SWAP} tokenSymbol={store.getState().swap.swapToken.symboll} />
          </Provider>
        );
        
        act(() => {
        store.dispatch(setAmountSwap({tokenAmount: 0, usdAmount: 0}));
        });

        const inputElement = getByTestId('enter-amount-input');
        fireEvent.change(inputElement, { target: { value: '50' } });

        await waitFor(() => {
            expect(store.getState().swap.amountSwap).toEqual({ tokenAmount: 50, usdAmount: 0 });
          });
    });
});
