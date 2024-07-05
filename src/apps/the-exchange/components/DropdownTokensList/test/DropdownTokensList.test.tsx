import renderer from 'react-test-renderer';
import { render, fireEvent, waitFor } from '@testing-library/react';

// types
import { CardPosition } from '../../../utils/types';

// components
import DropdownTokenList from '../DropdownTokenList';

// context
import { SwapDataContext } from '../../../context/SwapDataProvider';

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

describe('<DropdownTokenList />', () => {  
    it('renders correctly and matches snapshot', () => {
        const tree = renderer
            .create(<DropdownTokenList type={CardPosition.SWAP} initialCardPosition={CardPosition.SWAP} />)
            .toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('renders with initial props', () => {
        const { getByTestId } = render(
            <SwapDataContext.Provider value={{...mockContextValue, isSwapOpen: true}}>
                <DropdownTokenList type={CardPosition.SWAP} initialCardPosition={CardPosition.SWAP} />
            </SwapDataContext.Provider>
        );

        const dropdownList = getByTestId('dropdown-token-list');
        expect(dropdownList).toBeInTheDocument();
    });

    it('allows selecting tokens in Swap card', async () => {
        const { getByPlaceholderText, getAllByTestId } = render(
            <SwapDataContext.Provider value={{...mockContextValue, isSwapOpen: true}}>
                <DropdownTokenList type={CardPosition.SWAP} initialCardPosition={CardPosition.SWAP} />
            </SwapDataContext.Provider>
        );

        const searchInput = getByPlaceholderText('Search tokens');
        fireEvent.focus(searchInput);

        fireEvent.change(searchInput, { target: { value: 'matic' } });
        await waitFor(() => {
            const tokenItems = getAllByTestId('token-list-item');
            expect(tokenItems.length).toBe(1);
        });

        const firstTokenItem = getAllByTestId('token-list-item');
        fireEvent.click(firstTokenItem[0]);

        expect(mockContextValue.setSwapToken).toHaveBeenCalledWith(mockTokenAssets[0]);
        expect(mockContextValue.setSwapChain).toHaveBeenCalled();
        expect(mockContextValue.setSearchTokenResult).toHaveBeenCalledWith([]);
        expect(mockContextValue.setIsSwapOpen).toHaveBeenCalledWith(false);
    });

    it('allows selecting tokens in Receive card', async () => {
        const { getByPlaceholderText, getAllByTestId } = render(
            <SwapDataContext.Provider value={{...mockContextValue, isReceiveOpen: true}}>
                <DropdownTokenList type={CardPosition.RECEIVE} initialCardPosition={CardPosition.RECEIVE} />
            </SwapDataContext.Provider>
        );

        const searchInput = getByPlaceholderText('Search tokens');
        fireEvent.focus(searchInput);

        fireEvent.change(searchInput, { target: { value: 'ether' } });
        await waitFor(() => {
            const tokenItems = getAllByTestId('token-list-item');
            expect(tokenItems.length).toBe(1);
        });

        const firstTokenItem = getAllByTestId('token-list-item');
        fireEvent.click(firstTokenItem[0]);

        expect(mockContextValue.setReceiveToken).toHaveBeenCalledWith(mockTokenAssets[1]);
        expect(mockContextValue.setReceiveChain).toHaveBeenCalled();
        expect(mockContextValue.setSearchTokenResult).toHaveBeenCalledWith([]);
        expect(mockContextValue.setIsReceiveOpen).toHaveBeenCalledWith(false);
    });

    it('closes the dropdown when close button is clicked', async () => {
        const { getByTestId } = render(
            <SwapDataContext.Provider value={{...mockContextValue, isSwapOpen: true}}>
                <DropdownTokenList type={CardPosition.SWAP} initialCardPosition={CardPosition.SWAP} />
            </SwapDataContext.Provider>
        );

        const closeButton = getByTestId('close-card-button');
        fireEvent.click(closeButton);

        expect(mockContextValue.setIsSwapOpen).toHaveBeenCalled();
        expect(mockContextValue.setSearchTokenResult).toHaveBeenCalledWith([]);
    });
});
