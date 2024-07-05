import renderer from 'react-test-renderer';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BigNumber } from 'ethers';
import { ExchangeProviders } from '@etherspot/prime-sdk/dist/sdk/data';

// context
import { SwapDataContext } from '../../../context/SwapDataProvider';

// components
import ExchangeAction from '../ExchangeAction';

// types
import { SwapOffer } from '../../../utils/types';


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
  });

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(
        <SwapDataContext.Provider value={mockContextValue}>
          <ExchangeAction />
        </SwapDataContext.Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();  });


  it('renders "You receive" and token information correctly', () => {
    render(
      <SwapDataContext.Provider value={{...mockContextValue, bestOffer: mockBestOffer}}>
        <ExchangeAction />
      </SwapDataContext.Provider>
    );

    expect(screen.getByText('You receive')).toBeInTheDocument();
    expect(screen.getByText('10.00000000')).toBeInTheDocument();
    expect(screen.getByText('MATIC')).toBeInTheDocument();
  });

  it('shows error message if no best offer available', async () => {
    render(
        <SwapDataContext.Provider value={{ ...mockContextValue, bestOffer: undefined  }}>
          <ExchangeAction />
        </SwapDataContext.Provider>
      );

    const exchangeButton = screen.getByText('Exchange').closest('div') as HTMLDivElement;
    fireEvent.click(exchangeButton);

    await waitFor(() => {
      expect(screen.getByText('No offer available to exchange')).toBeInTheDocument();
    });
  });

  it('handles transactions addition and shows success', async () => {
    render(
        <SwapDataContext.Provider value={mockContextValue}>
          <ExchangeAction />
        </SwapDataContext.Provider>
      );


    const exchangeButton = screen.getByText('Exchange').closest('div') as HTMLDivElement;
    fireEvent.click(exchangeButton);

    await waitFor(() => {
      expect(screen.queryByTestId('loading-circular')).not.toBeInTheDocument();
      expect(screen.getByText('Exchange')).toBeInTheDocument();
    });
  });

});
