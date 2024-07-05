import renderer from 'react-test-renderer';
import { render, screen, fireEvent } from '@testing-library/react';

// context
import { SwapDataContext } from '../../../context/SwapDataProvider';

// components
import SelectDropdown from '../SelectDropdown';

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

describe('<SelectDropdown />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const options = [1, 137];
  const onClickMock = jest.fn();
  const onSelectMock = jest.fn();

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(
        <SwapDataContext.Provider value={mockContextValue}>
          <SelectDropdown options={options} onClick={onClickMock} onSelect={onSelectMock} isOpen={true} />
        </SwapDataContext.Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders closed dropdown with correct initial state', () => {
    render(
        <SwapDataContext.Provider value={{ ...mockContextValue, isSwapOpen: true }}>
          <SelectDropdown options={options} onClick={onClickMock} onSelect={onSelectMock} isOpen={false} />
        </SwapDataContext.Provider>
      );

    expect(screen.getByText('Ethereum')).toBeInTheDocument();
    expect(screen.queryByText('Select a chain')).not.toBeInTheDocument();
  });

  it('renders open dropdown with options when clicked', () => {
    render(
        <SwapDataContext.Provider value={{ ...mockContextValue, isSwapOpen: true }}>
          <SelectDropdown options={options} onClick={onClickMock} onSelect={onSelectMock} isOpen={true} />
        </SwapDataContext.Provider>
      );

    expect(screen.getByText('Select a chain')).toBeInTheDocument();
    options.forEach((option) => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  it('calls onClick when button is clicked', () => {
    render(
        <SwapDataContext.Provider value={{ ...mockContextValue, isSwapOpen: true }}>
          <SelectDropdown options={options} onClick={onClickMock} onSelect={onSelectMock} isOpen={false} />
        </SwapDataContext.Provider>
      );

    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(onClickMock).toHaveBeenCalled();
  });

  it('calls onSelect and updates context when an option is selected', () => {
    render(
        <SwapDataContext.Provider value={{ ...mockContextValue, isSwapOpen: true }}>
          <SelectDropdown options={options} onClick={onClickMock} onSelect={onSelectMock} isOpen={true} />
        </SwapDataContext.Provider>
      );

    const optionElement = screen.getByText('1');
    fireEvent.click(optionElement);

    expect(onSelectMock).toHaveBeenCalled();
    expect(mockContextValue.setSwapChain).toHaveBeenCalledWith({ chainId: 1, chainName: '1' });
  });

  it('handles receive chain selection correctly when isReceiveOpen is true', () => {
    render(
        <SwapDataContext.Provider value={{ ...mockContextValue, isReceiveOpen: true }}>
          <SelectDropdown options={options} onClick={onClickMock} onSelect={onSelectMock} isOpen={true} />
        </SwapDataContext.Provider>
      );

    const optionElement = screen.getByText('137');
    fireEvent.click(optionElement);

    expect(onSelectMock).toHaveBeenCalled();
    expect(mockContextValue.setReceiveChain).toHaveBeenCalledWith({ chainId: 137, chainName: '137' });
  });

});
