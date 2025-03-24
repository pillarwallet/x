import { fireEvent, render, screen } from '@testing-library/react';
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

// types
import { Token } from '../../../../../services/tokensData';

// components
import { convertChainIdtoName } from '../../../../../utils/blockchain';
import SelectDropdown from '../SelectDropdown';

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

describe('<SelectDropdown />', () => {
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

  const options = [1, 137];
  const onClickMock = jest.fn();
  const onSelectMock = jest.fn();

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <SelectDropdown
            options={options}
            onClick={onClickMock}
            onSelect={onSelectMock}
            isOpen
          />
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders closed dropdown with correct initial state', () => {
    render(
      <Provider store={store}>
        <SelectDropdown
          options={options}
          onClick={onClickMock}
          onSelect={onSelectMock}
          isOpen={false}
        />
      </Provider>
    );

    act(() => {
      store.dispatch(setIsSwapOpen(true));
    });

    expect(screen.getByText('Ethereum')).toBeInTheDocument();
    expect(screen.queryByText('Select a chain')).not.toBeInTheDocument();
  });

  it('renders open dropdown with options when clicked', () => {
    render(
      <Provider store={store}>
        <SelectDropdown
          options={options}
          onClick={onClickMock}
          onSelect={onSelectMock}
          isOpen
        />
      </Provider>
    );

    act(() => {
      store.dispatch(setSwapChain(undefined));
      store.dispatch(setIsSwapOpen(true));
    });

    expect(screen.getByText('Select a chain')).toBeInTheDocument();
    options.forEach((option) => {
      expect(
        screen.getByText(convertChainIdtoName(option))
      ).toBeInTheDocument();
    });
  });

  it('calls onClick when button is clicked', () => {
    render(
      <Provider store={store}>
        <SelectDropdown
          options={options}
          onClick={onClickMock}
          onSelect={onSelectMock}
          isOpen={false}
        />
      </Provider>
    );

    act(() => {
      store.dispatch(setIsSwapOpen(true));
    });

    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(onClickMock).toHaveBeenCalled();
  });

  it('calls onSelect and updates context when an option is selected', () => {
    render(
      <Provider store={store}>
        <SelectDropdown
          options={options}
          onClick={onClickMock}
          onSelect={onSelectMock}
          isOpen
        />
      </Provider>
    );

    act(() => {
      store.dispatch(setSwapChain(undefined));
      store.dispatch(setIsSwapOpen(true));
    });

    const optionElement = screen.getByText('Ethereum');
    fireEvent.click(optionElement);

    expect(onSelectMock).toHaveBeenCalled();
    expect(store.getState().swap.swapChain).toEqual({
      chainId: 1,
      chainName: 'Ethereum',
    });
  });

  it('handles receive chain selection correctly when isReceiveOpen is true', () => {
    render(
      <Provider store={store}>
        <SelectDropdown
          options={options}
          onClick={onClickMock}
          onSelect={onSelectMock}
          isOpen
        />
      </Provider>
    );

    act(() => {
      store.dispatch(setReceiveChain(undefined));
      store.dispatch(setIsReceiveOpen(true));
    });

    const optionElement = screen.getByText('Polygon');
    fireEvent.click(optionElement);

    expect(onSelectMock).toHaveBeenCalled();
    expect(store.getState().swap.receiveChain).toEqual({
      chainId: 137,
      chainName: 'Polygon',
    });
  });
});
