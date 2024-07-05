import renderer from 'react-test-renderer';
import { render, fireEvent, waitFor } from '@testing-library/react';

// context
import { SwapDataContext } from '../../../context/SwapDataProvider';

// types
import { CardPosition } from '../../../utils/types';
import { AccountBalancesListenerRef } from '../../../../../providers/AccountBalancesProvider';

// components
import EnterAmount from '../EnterAmount';

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
    swapTokenData: mockTokenAssets,
    setSwapTokenData: mockSetSwapTokenData,
    receiveTokenData: mockTokenAssets,
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
    it('renders correctly and matches snapshot', () => {
        const tree = renderer
            .create(<EnterAmount type={CardPosition.SWAP} tokenSymbol={mockContextValue.swapToken.symbol} />)
            .toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('handles token amount change in Swap card', async () => {
        const { getByTestId } = render(
            <SwapDataContext.Provider value={{ ...mockContextValue, amountSwap: {tokenAmount: 0, usdAmount: 0} } }>
                <EnterAmount type={CardPosition.SWAP} tokenSymbol={mockContextValue.swapToken.symbol} />
            </SwapDataContext.Provider>
        );

        const inputElement = getByTestId('enter-amount-input');
        fireEvent.change(inputElement, { target: { value: '50' } });

        await waitFor(() => {
            expect(mockContextValue.setAmountSwap).toHaveBeenCalledWith({ tokenAmount: 50, usdAmount: 0 });
          });
    });

    it('handles mouse hover behavior', () => {
        const { getByText } = render(
            <SwapDataContext.Provider value={mockContextValue}>
                <EnterAmount type={CardPosition.SWAP} tokenSymbol={mockContextValue.swapToken.symbol} />
            </SwapDataContext.Provider>
        );

        const tokenSymbolElement = getByText(mockContextValue.swapToken.symbol);

        fireEvent.mouseEnter(tokenSymbolElement);
        expect(tokenSymbolElement).toHaveClass('text-black_grey/[.4]');

        fireEvent.mouseLeave(tokenSymbolElement);
        expect(tokenSymbolElement).not.toHaveClass('text-black_grey/[.4]');
    });

});
