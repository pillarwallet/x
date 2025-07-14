import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import renderer, { act } from 'react-test-renderer';
import { encodeFunctionData, erc20Abi } from 'viem';
import { vi } from 'vitest';

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
  setUsdPriceReceiveToken,
  setUsdPriceSwapToken,
} from '../../../reducer/theExchangeSlice';

// components
import ExchangeAction from '../ExchangeAction';

// types
import { Token } from '../../../../../services/tokensData';
import * as useOffer from '../../../hooks/useOffer';
import { SwapOffer } from '../../../utils/types';

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

export const mockBestOffer: SwapOffer = {
  tokenAmountToReceive: 10,
  offer: {
    id: 'mock-offer-1',
    fromChainId: 1,
    fromAmountUSD: '12',
    fromAmount: '100000000000000000', // 0.1 ETH
    fromToken: {
      chainId: 1,
      address: '0x01',
      symbol: 'ETH',
      decimals: 18,
      name: 'Ether',
      priceUSD: '1200',
    },
    toChainId: 137,
    toAmountUSD: '4',
    toAmount: '10000000000000000000', // 10 POL
    toAmountMin: '9900000000000000000',
    toToken: {
      chainId: 137,
      address: '0x02',
      symbol: 'POL',
      decimals: 18,
      name: 'POL',
      priceUSD: '0.4',
    },
    insurance: {
      state: 'INSURED',
      feeAmountUsd: '0.1',
    },
    steps: [],
  },
};

const FEE_RECEIVER = '0xfee0000000000000000000000000000000000000';

// Mock hooks and utils
vi.mock('../../../../../hooks/useGlobalTransactionsBatch', () => ({
  _esModule: true,
  default: vi.fn(() => ({
    addToBatch: vi.fn(),
  })),
}));
vi.mock('../../../../../hooks/useBottomMenuModal', () => {
  return {
    _esModule: true,
    default: vi.fn(() => ({
      open: vi.fn(),
      close: vi.fn(),
      isOpen: false, // Default value for isOpen
    })),
  };
});

vi.mock('@etherspot/transaction-kit', () => ({
  useEtherspotSwaps: () => ({
    prepareCrossChainOfferTransactions: vi.fn().mockResolvedValue([]),
  }),
  useEtherspotUtils: vi.fn().mockReturnValue({
    isZeroAddress: vi.fn(),
  }),
  useWalletAddress: vi.fn().mockReturnValue({
    walletAddress: vi.fn(),
  }),
}));
vi.mock('../../../utils/converters', () => ({
  hasThreeZerosAfterDecimal: vi.fn((num) => num % 1 === 0),
  formatTokenAmount: vi.fn((amount) => {
    if (amount === undefined) return '0.00000000';
    return Number(amount).toFixed(8);
  }),
}));

vi.mock('@lifi/sdk', () => ({
  LiFi: vi.fn().mockImplementation(() => ({
    getRoutes: vi.fn().mockResolvedValue({ routes: [] }),
    getStepTransaction: vi.fn().mockResolvedValue({}),
  })),
}));

describe('<ExchangeAction />', () => {
  beforeEach(() => {
    import.meta.env.VITE_SWAP_FEE_RECEIVER = FEE_RECEIVER;
    vi.clearAllMocks();
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
    expect(screen.getByText('POL')).toBeInTheDocument();
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

  it('displays fee info for native token fee', async () => {
    vi.spyOn(useOffer, 'default').mockReturnValue({
      getStepTransactions: vi.fn().mockResolvedValue([
        {
          to: FEE_RECEIVER,
          value: BigInt('1000000000000000'), // 0.001 ETH in wei
          data: '0x',
          chainId: 1,
        },
      ]),
      getBestOffer: vi.fn(),
    });

    render(
      <Provider store={store}>
        <ExchangeAction />
      </Provider>
    );
    act(() => {
      store.dispatch(setBestOffer(mockBestOffer));
    });
    await waitFor(() =>
      expect(
        screen.getByText(
          (content) =>
            content.includes('Fee:') &&
            content.includes('0.001') &&
            content.includes('ETH')
        )
      ).toBeInTheDocument()
    );
  });

  it('displays fee info for stablecoin fee', async () => {
    // Encode 10 USDC (6 decimals)
    const usdcAmount = BigInt(10 * 10 ** 6);
    const usdcData = encodeFunctionData({
      abi: erc20Abi,
      functionName: 'transfer',
      args: [FEE_RECEIVER, usdcAmount],
    });
    vi.spyOn(useOffer, 'default').mockReturnValue({
      getStepTransactions: vi.fn().mockResolvedValue([
        {
          to: '0x02', // stablecoin contract
          value: BigInt(0),
          data: usdcData,
          chainId: 137,
        },
      ]),
      getBestOffer: vi.fn(),
    });
    act(() => {
      store.dispatch(
        setSwapToken({
          ...mockTokenAssets[1],
          contract: '0x02',
          symbol: 'USDC',
          decimals: 6,
        })
      );
      store.dispatch(
        setBestOffer({
          ...mockBestOffer,
          offer: {
            ...mockBestOffer.offer,
            fromToken: {
              ...mockBestOffer.offer.fromToken,
              address: '0x02',
              symbol: 'USDC',
              decimals: 6,
            },
            fromChainId: 137,
          },
        })
      );
    });
    render(
      <Provider store={store}>
        <ExchangeAction />
      </Provider>
    );
    await waitFor(() =>
      expect(
        screen.getByText(
          (content) =>
            content.includes('Fee:') &&
            content.includes('10') &&
            content.includes('USDC')
        )
      ).toBeInTheDocument()
    );
  });

  it('displays fee info for wrapped token fee', async () => {
    // Encode 10 WETH (18 decimals)
    const wethAmount = BigInt(10 * 10 ** 18);
    const wethData = encodeFunctionData({
      abi: erc20Abi,
      functionName: 'transfer',
      args: [FEE_RECEIVER, wethAmount],
    });
    vi.spyOn(useOffer, 'default').mockReturnValue({
      getStepTransactions: vi.fn().mockResolvedValue([
        {
          to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH contract
          value: BigInt(0),
          data: wethData,
          chainId: 1,
        },
      ]),
      getBestOffer: vi.fn(),
    });
    act(() => {
      store.dispatch(
        setSwapToken({
          ...mockTokenAssets[0],
          contract: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WETH',
          decimals: 18,
        })
      );
      store.dispatch(
        setBestOffer({
          ...mockBestOffer,
          offer: {
            ...mockBestOffer.offer,
            fromToken: {
              ...mockBestOffer.offer.fromToken,
              address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
              symbol: 'WETH',
              decimals: 18,
            },
            fromChainId: 1,
          },
        })
      );
    });
    render(
      <Provider store={store}>
        <ExchangeAction />
      </Provider>
    );
    await waitFor(() =>
      expect(
        screen.getByText(
          (content) =>
            content.includes('Fee:') &&
            content.includes('10') &&
            content.includes('WETH')
        )
      ).toBeInTheDocument()
    );
  });

  it('displays fee info for non-stable ERC20 fee (native fallback)', async () => {
    vi.spyOn(useOffer, 'default').mockReturnValue({
      getStepTransactions: vi.fn().mockResolvedValue([
        {
          to: FEE_RECEIVER,
          value: BigInt('2000000000000000'), // 0.002 ETH in wei
          data: '0x',
          chainId: 1,
        },
      ]),
      getBestOffer: vi.fn(),
    });
    act(() => {
      store.dispatch(
        setSwapToken({
          ...mockTokenAssets[0],
          contract: '0xSOMEERC20',
          symbol: 'RANDOM',
        })
      );
      store.dispatch(
        setBestOffer({
          ...mockBestOffer,
          offer: {
            ...mockBestOffer.offer,
            fromToken: {
              ...mockBestOffer.offer.fromToken,
              address: '0xSOMEERC20',
              symbol: 'RANDOM',
              decimals: 18,
            },
            fromChainId: 1,
          },
        })
      );
    });
    render(
      <Provider store={store}>
        <ExchangeAction />
      </Provider>
    );
    await waitFor(() =>
      expect(
        screen.getByText(
          (content) =>
            content.includes('Fee:') &&
            content.includes('0.002') &&
            content.includes('ETH')
        )
      ).toBeInTheDocument()
    );
  });

  it('shows an error if getStepTransactions fails', async () => {
    vi.spyOn(useOffer, 'default').mockReturnValue({
      getStepTransactions: vi.fn().mockRejectedValue(new Error('Test error')),
      getBestOffer: vi.fn(), // Provide a default mock for getBestOffer
    });
    render(
      <Provider store={store}>
        <ExchangeAction />
      </Provider>
    );
    act(() => {
      store.dispatch(setBestOffer(mockBestOffer));
    });
    await waitFor(() =>
      expect(
        screen.getByText(/unable to prepare the swap/i)
      ).toBeInTheDocument()
    );
  });
});
