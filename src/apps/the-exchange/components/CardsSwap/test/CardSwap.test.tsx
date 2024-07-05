import renderer from 'react-test-renderer';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// components
import CardsSwap from '../CardsSwap';

// context
import { SwapDataContext } from '../../../context/SwapDataProvider';

// types
import { AccountBalancesListenerRef } from '../../../../../providers/AccountBalancesProvider';

const mockTokenAssets = [
  { address: '0x01', name: 'Ether', symbol: 'ETH', chainId: 1, decimals: 18, icon: 'iconEth.png' },
  { address: '0x02', name: 'Matic', symbol: 'MATIC', chainId: 137, decimals: 18, icon: 'iconMatic.png' },
];

// Mock data and functions
const mockSetSwapTokenData = jest.fn();
const mockSetReceiveTokenData = jest.fn();
const mockSetIsSwapOpen = jest.fn();
const mockSetIsReceiveOpen = jest.fn();
const mockSetSwapChain = jest.fn();
const mockSetReceiveChain = jest.fn();
const mockSetSwapToken = jest.fn();
const mockSetReceiveToken = jest.fn();
const mockSetAmountSwap = jest.fn();
const mockSetAmountReceive = jest.fn();

// Mock context values
const mockContextValue = {
  swapTokenData: [],
  setSwapTokenData: mockSetSwapTokenData,
  receiveTokenData: [],
  setReceiveTokenData: mockSetReceiveTokenData,
  isSwapOpen: false,
  setIsSwapOpen: mockSetIsSwapOpen,
  isReceiveOpen: false,
  setIsReceiveOpen: mockSetIsReceiveOpen,
  swapChain: { chainId: 1, chainName: 'Ethereum' },
  receiveChain: { chainId: 137, chainName: 'Polygon' },
  swapToken: mockTokenAssets[0],
  receiveToken: mockTokenAssets[1],
  setSwapChain: mockSetSwapChain,
  setReceiveChain: mockSetReceiveChain,
  setSwapToken: mockSetSwapToken,
  setReceiveToken: mockSetReceiveToken,
  amountSwap: { tokenAmount: 0.1, usdAmount: 3000 },
  amountReceive: { tokenAmount: 10, usdAmount: 3000 },
  setAmountSwap: mockSetAmountSwap,
  setAmountReceive: mockSetAmountReceive,
  bestOffer: undefined,
  setBestOffer: jest.fn(),
  searchTokenResult: [],
  setSearchTokenResult: jest.fn(),
};

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
  useEtherspotAssets: jest.fn().mockReturnValue({
    getAssets: jest.fn(),
    getSupportedAssets: jest.fn(),
  }),
}));

// Mock useAssets hook
jest.mock('../../../../../hooks/useAssets', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    1: [
      { 
        address: '0x01',
        chainId: 1,
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
        logoURI: 'iconEth.png',
      },
    ],
    137: [
      { 
        address: '0x02',
        chainId: 137,
        name: 'Matic',
        symbol: 'MATIC',
        decimals: 18,
        logoURI: 'iconMatic.png',
      },
    ],
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

describe('<CardsSwap />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(
        <SwapDataContext.Provider value={mockContextValue}>
          <CardsSwap />
        </SwapDataContext.Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly the swap and receive cards with the swap button', () => {
    render(
      <SwapDataContext.Provider value={mockContextValue}>
        <CardsSwap />
      </SwapDataContext.Provider>
    );

    expect(screen.getByTestId('swap-receive-cards')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls swapCards when the swap button is clicked', () => {
    render(
      <SwapDataContext.Provider value={mockContextValue}>
        <CardsSwap />
      </SwapDataContext.Provider>
    );

    const swapButton = screen.getByRole('button');
    fireEvent.click(swapButton);

    expect(mockSetSwapChain).toHaveBeenCalledWith({ chainId: 137, chainName: 'Polygon' });
    expect(mockSetReceiveChain).toHaveBeenCalledWith({ chainId: 1, chainName: 'Ethereum' });
    expect(mockSetSwapToken).toHaveBeenCalledWith(mockTokenAssets[1]);
    expect(mockSetReceiveToken).toHaveBeenCalledWith(mockTokenAssets[0]);
    expect(mockSetAmountSwap).toHaveBeenCalledWith({ tokenAmount: 10, usdAmount: 3000 });
    expect(mockSetAmountReceive).toHaveBeenCalledWith({ tokenAmount: 0.1, usdAmount: 3000 });
  });

  it('opens token list when a card is clicked and no token on swap card', async () => {
    render(
      <SwapDataContext.Provider
        value={{
          ...mockContextValue,
          swapToken: undefined,
          amountSwap: undefined,
          amountReceive: undefined,
        }}
      >
        <CardsSwap />
      </SwapDataContext.Provider>
    );

    const swapCard = screen.getAllByTestId('select-token-card');
    fireEvent.click(swapCard[0]);

    await waitFor(() => {
      expect(mockSetSwapTokenData).toHaveBeenCalled();
      expect(mockSetReceiveTokenData).toHaveBeenCalled();
      expect(mockSetIsSwapOpen).toHaveBeenCalledWith(true);
    });
  });

  it('renders the dropdown when isSwapOpen is true', () => {
    render(
      <SwapDataContext.Provider value={{ ...mockContextValue, isSwapOpen: true }}>
        <CardsSwap />
      </SwapDataContext.Provider>
    );

    expect(screen.getByTestId('dropdown-token-list')).toBeInTheDocument();
    expect(screen.queryByTestId('select-token-car')).not.toBeInTheDocument();
  });

  it('renders the dropdown when isReceiveOpen is true', () => {
    render(
      <SwapDataContext.Provider value={{ ...mockContextValue, isReceiveOpen: true }}>
        <CardsSwap />
      </SwapDataContext.Provider>
    );

    expect(screen.getByTestId('dropdown-token-list')).toBeInTheDocument();
    expect(screen.queryByTestId('select-token-car')).not.toBeInTheDocument();
  });
});
