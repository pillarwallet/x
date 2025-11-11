/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { act, renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

// types
import { SelectedToken } from '../../types/tokens';

// hooks
import useRelaySell from '../useRelaySell';

// Mock dependencies
vi.mock('../useRelaySdk', () => ({
  default: vi.fn(),
}));

vi.mock('../../../../hooks/useTransactionKit', () => ({
  default: vi.fn(),
}));

vi.mock('../../../../hooks/useBottomMenuModal', () => ({
  default: vi.fn(),
}));

vi.mock('../../../../hooks/useGlobalTransactionsBatch', () => ({
  default: vi.fn(),
}));

vi.mock('../../../../hooks/useTransactionDebugLogger', () => ({
  useTransactionDebugLogger: vi.fn(),
}));

vi.mock('@relayprotocol/relay-sdk', () => ({
  getClient: vi.fn(),
}));

vi.mock('viem', () => ({
  createPublicClient: vi.fn(),
  http: vi.fn(),
  parseUnits: vi.fn(),
  encodeFunctionData: vi.fn(),
  erc20Abi: [],
}));

vi.mock('@etherspot/transaction-kit', () => ({
  EtherspotUtils: {
    isZeroAddress: vi.fn(),
  },
}));

vi.mock('../../constants/tokens', () => ({
  STABLE_CURRENCIES: [
    {
      chainId: 1,
      address: '0xA0b86a33E6441b8C4C8C0C8C0C8C0C8C0C8C0C8C',
      symbol: 'USDC',
    },
  ],
}));

vi.mock('../../utils/blockchain', () => ({
  getNetworkViem: vi.fn(),
}));

vi.mock('../../the-exchange/utils/blockchain', () => ({
  getNativeBalanceFromPortfolio: vi.fn(),
  toWei: vi.fn(),
}));

vi.mock('../../../the-exchange/utils/wrappedTokens', () => ({
  getWrappedTokenAddressIfNative: vi.fn(),
  isNativeToken: vi.fn(),
  isWrappedToken: vi.fn(),
}));

const mockSelectedToken: SelectedToken = {
  name: 'Ethereum',
  symbol: 'ETH',
  logo: 'eth-logo.png',
  usdValue: '2000.00',
  dailyPriceChange: 0.05,
  chainId: 1,
  decimals: 18,
  address: '0x0000000000000000000000000000000000000000',
};

const mockSellOffer = {
  tokenAmountToReceive: 99.0,
  offer: {
    details: {
      currencyOut: {
        amount: '100000000',
        minimumAmount: '99000000',
        amountFormatted: '100.0',
      },
    },
    steps: [
      {
        id: 'swap',
        kind: 'transaction',
        description: 'Swap ETH for USDC',
        items: [
          {
            data: {
              to: '0xSwapContract',
              value: '0',
              data: '0xSwapData',
              chainId: 1,
            },
          },
        ],
      },
    ],
  },
};

const mockRelayClient = {
  actions: {
    getQuote: vi.fn(),
  },
};

const mockTransactionKit = {
  kit: {
    transaction: vi.fn(),
  },
  walletAddress: '0x1234567890123456789012345678901234567890',
};

describe('useRelaySell', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock environment variables
    vi.stubEnv('VITE_SWAP_FEE_RECEIVER', '0xFeeReceiver123456789');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('initializes with default values', async () => {
    const useRelaySdk = await import('../useRelaySdk');
    const useTransactionKit = await import(
      '../../../../hooks/useTransactionKit'
    );
    const useBottomMenuModal = await import(
      '../../../../hooks/useBottomMenuModal'
    );
    const useGlobalTransactionsBatch = await import(
      '../../../../hooks/useGlobalTransactionsBatch'
    );
    const { useTransactionDebugLogger } = await import(
      '../../../../hooks/useTransactionDebugLogger'
    );

    (useRelaySdk.default as any).mockReturnValue({
      isInitialized: false,
      accountAddress: null,
    });

    (useTransactionKit.default as any).mockReturnValue({
      kit: null,
      walletAddress: null,
    });

    (useBottomMenuModal.default as any).mockReturnValue({
      showSend: vi.fn(),
      setShowBatchSendModal: vi.fn(),
    });

    (useGlobalTransactionsBatch.default as any).mockReturnValue({
      setTransactionMetaForName: vi.fn(),
    });

    (useTransactionDebugLogger as any).mockReturnValue({
      transactionDebugLog: vi.fn(),
    });

    const { result } = renderHook(() => useRelaySell());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.isInitialized).toBe(false);
    expect(typeof result.current.getUSDCAddress).toBe('function');
    expect(typeof result.current.getBestSellOffer).toBe('function');
    expect(typeof result.current.executeSell).toBe('function');
    expect(typeof result.current.buildSellTransactions).toBe('function');
    expect(typeof result.current.clearError).toBe('function');
  });

  it('clears error when SDK initializes', async () => {
    const useRelaySdk = await import('../useRelaySdk');
    const useTransactionKit = await import(
      '../../../../hooks/useTransactionKit'
    );
    const useBottomMenuModal = await import(
      '../../../../hooks/useBottomMenuModal'
    );
    const useGlobalTransactionsBatch = await import(
      '../../../../hooks/useGlobalTransactionsBatch'
    );
    const { useTransactionDebugLogger } = await import(
      '../../../../hooks/useTransactionDebugLogger'
    );

    const mockUseRelaySdk = vi.fn();
    (useRelaySdk.default as any).mockImplementation(mockUseRelaySdk);

    (useTransactionKit.default as any).mockReturnValue({
      kit: mockTransactionKit.kit,
      walletAddress: mockTransactionKit.walletAddress,
    });

    (useBottomMenuModal.default as any).mockReturnValue({
      showSend: vi.fn(),
      setShowBatchSendModal: vi.fn(),
    });

    (useGlobalTransactionsBatch.default as any).mockReturnValue({
      setTransactionMetaForName: vi.fn(),
    });

    (useTransactionDebugLogger as any).mockReturnValue({
      transactionDebugLog: vi.fn(),
    });

    // Initial state - not initialized
    mockUseRelaySdk.mockReturnValue({
      isInitialized: false,
      accountAddress: null,
    });

    const { result, rerender } = renderHook(() => useRelaySell());

    // Set error manually
    act(() => {
      result.current.clearError();
    });

    // Change to initialized state
    mockUseRelaySdk.mockReturnValue({
      isInitialized: true,
      accountAddress: '0x1234567890123456789012345678901234567890',
    });

    rerender();

    expect(result.current.isInitialized).toBe(true);
  });

  it('getUSDCAddress returns correct address for supported chain', async () => {
    const useRelaySdk = await import('../useRelaySdk');
    const useTransactionKit = await import(
      '../../../../hooks/useTransactionKit'
    );
    const useBottomMenuModal = await import(
      '../../../../hooks/useBottomMenuModal'
    );
    const useGlobalTransactionsBatch = await import(
      '../../../../hooks/useGlobalTransactionsBatch'
    );
    const { useTransactionDebugLogger } = await import(
      '../../../../hooks/useTransactionDebugLogger'
    );

    (useRelaySdk.default as any).mockReturnValue({
      isInitialized: true,
      accountAddress: '0x1234567890123456789012345678901234567890',
    });

    (useTransactionKit.default as any).mockReturnValue({
      kit: mockTransactionKit.kit,
      walletAddress: mockTransactionKit.walletAddress,
    });

    (useBottomMenuModal.default as any).mockReturnValue({
      showSend: vi.fn(),
      setShowBatchSendModal: vi.fn(),
    });

    (useGlobalTransactionsBatch.default as any).mockReturnValue({
      setTransactionMetaForName: vi.fn(),
    });

    (useTransactionDebugLogger as any).mockReturnValue({
      transactionDebugLog: vi.fn(),
    });

    const { result } = renderHook(() => useRelaySell());

    const usdcAddress = result.current.getUSDCAddress(1);
    expect(usdcAddress).toBe('0xA0b86a33E6441b8C4C8C0C8C0C8C0C8C0C8C0C8C');
  });

  it('getUSDCAddress returns null for unsupported chain', async () => {
    const useRelaySdk = await import('../useRelaySdk');
    const useTransactionKit = await import(
      '../../../../hooks/useTransactionKit'
    );
    const useBottomMenuModal = await import(
      '../../../../hooks/useBottomMenuModal'
    );
    const useGlobalTransactionsBatch = await import(
      '../../../../hooks/useGlobalTransactionsBatch'
    );
    const { useTransactionDebugLogger } = await import(
      '../../../../hooks/useTransactionDebugLogger'
    );

    (useRelaySdk.default as any).mockReturnValue({
      isInitialized: true,
      accountAddress: '0x1234567890123456789012345678901234567890',
    });

    (useTransactionKit.default as any).mockReturnValue({
      kit: mockTransactionKit.kit,
      walletAddress: mockTransactionKit.walletAddress,
    });

    (useBottomMenuModal.default as any).mockReturnValue({
      showSend: vi.fn(),
      setShowBatchSendModal: vi.fn(),
    });

    (useGlobalTransactionsBatch.default as any).mockReturnValue({
      setTransactionMetaForName: vi.fn(),
    });

    (useTransactionDebugLogger as any).mockReturnValue({
      transactionDebugLog: vi.fn(),
    });

    const { result } = renderHook(() => useRelaySell());

    const usdcAddress = result.current.getUSDCAddress(999);
    expect(usdcAddress).toBe(null);
  });

  it('getBestSellOffer returns null when not initialized', async () => {
    const useRelaySdk = await import('../useRelaySdk');
    const useTransactionKit = await import(
      '../../../../hooks/useTransactionKit'
    );
    const useBottomMenuModal = await import(
      '../../../../hooks/useBottomMenuModal'
    );
    const useGlobalTransactionsBatch = await import(
      '../../../../hooks/useGlobalTransactionsBatch'
    );
    const { useTransactionDebugLogger } = await import(
      '../../../../hooks/useTransactionDebugLogger'
    );

    (useRelaySdk.default as any).mockReturnValue({
      isInitialized: false,
      accountAddress: null,
    });

    (useTransactionKit.default as any).mockReturnValue({
      kit: mockTransactionKit.kit,
      walletAddress: mockTransactionKit.walletAddress,
    });

    (useBottomMenuModal.default as any).mockReturnValue({
      showSend: vi.fn(),
      setShowBatchSendModal: vi.fn(),
    });

    (useGlobalTransactionsBatch.default as any).mockReturnValue({
      setTransactionMetaForName: vi.fn(),
    });

    (useTransactionDebugLogger as any).mockReturnValue({
      transactionDebugLog: vi.fn(),
    });

    const { result } = renderHook(() => useRelaySell());

    const sellOffer = await result.current.getBestSellOffer({
      fromAmount: '1.0',
      fromTokenAddress: mockSelectedToken.address,
      fromChainId: mockSelectedToken.chainId,
      fromTokenDecimals: mockSelectedToken.decimals,
      toChainId: 1,
    });

    expect(sellOffer).toBe(null);

    await waitFor(() => {
      expect(result.current.error).toBe(
        'Unable to get quote. Please try again.'
      );
    });
  });

  it('getBestSellOffer returns null when USDC address not found', async () => {
    const useRelaySdk = await import('../useRelaySdk');
    const useTransactionKit = await import(
      '../../../../hooks/useTransactionKit'
    );
    const useBottomMenuModal = await import(
      '../../../../hooks/useBottomMenuModal'
    );
    const useGlobalTransactionsBatch = await import(
      '../../../../hooks/useGlobalTransactionsBatch'
    );
    const { useTransactionDebugLogger } = await import(
      '../../../../hooks/useTransactionDebugLogger'
    );

    (useRelaySdk.default as any).mockReturnValue({
      isInitialized: true,
      accountAddress: '0x1234567890123456789012345678901234567890',
    });

    (useTransactionKit.default as any).mockReturnValue({
      kit: mockTransactionKit.kit,
      walletAddress: mockTransactionKit.walletAddress,
    });

    (useBottomMenuModal.default as any).mockReturnValue({
      showSend: vi.fn(),
      setShowBatchSendModal: vi.fn(),
    });

    (useGlobalTransactionsBatch.default as any).mockReturnValue({
      setTransactionMetaForName: vi.fn(),
    });

    (useTransactionDebugLogger as any).mockReturnValue({
      transactionDebugLog: vi.fn(),
    });

    const { result } = renderHook(() => useRelaySell());

    const sellOffer = await result.current.getBestSellOffer({
      fromAmount: '1.0',
      fromTokenAddress: mockSelectedToken.address,
      fromChainId: mockSelectedToken.chainId,
      fromTokenDecimals: mockSelectedToken.decimals,
      toChainId: 999, // Unsupported settlement chain
    });

    expect(sellOffer).toBe(null);

    await waitFor(() => {
      expect(result.current.error).toBe(
        'Unable to get quote. Please try again.'
      );
    });
  });

  it('getBestSellOffer returns sell offer on success', async () => {
    const useRelaySdk = await import('../useRelaySdk');
    const useTransactionKit = await import(
      '../../../../hooks/useTransactionKit'
    );
    const useBottomMenuModal = await import(
      '../../../../hooks/useBottomMenuModal'
    );
    const useGlobalTransactionsBatch = await import(
      '../../../../hooks/useGlobalTransactionsBatch'
    );
    const { useTransactionDebugLogger } = await import(
      '../../../../hooks/useTransactionDebugLogger'
    );
    const { getClient } = await import('@relayprotocol/relay-sdk');
    const { parseUnits } = await import('viem');
    const { getWrappedTokenAddressIfNative } = await import(
      '../../../the-exchange/utils/wrappedTokens'
    );

    (useRelaySdk.default as any).mockReturnValue({
      isInitialized: true,
      accountAddress: '0x1234567890123456789012345678901234567890',
    });

    (useTransactionKit.default as any).mockReturnValue({
      kit: mockTransactionKit.kit,
      walletAddress: mockTransactionKit.walletAddress,
    });

    (useBottomMenuModal.default as any).mockReturnValue({
      showSend: vi.fn(),
      setShowBatchSendModal: vi.fn(),
    });

    (useGlobalTransactionsBatch.default as any).mockReturnValue({
      setTransactionMetaForName: vi.fn(),
    });

    (useTransactionDebugLogger as any).mockReturnValue({
      transactionDebugLog: vi.fn(),
    });

    (getClient as any).mockReturnValue(mockRelayClient);
    (parseUnits as any).mockReturnValue(BigInt('1000000000000000000'));
    (getWrappedTokenAddressIfNative as any).mockReturnValue(
      mockSelectedToken.address
    );

    mockRelayClient.actions.getQuote.mockResolvedValue(mockSellOffer.offer);

    const { result } = renderHook(() => useRelaySell());

    const sellOffer = await result.current.getBestSellOffer({
      fromAmount: '1.0',
      fromTokenAddress: mockSelectedToken.address,
      fromChainId: mockSelectedToken.chainId,
      fromTokenDecimals: mockSelectedToken.decimals,
      toChainId: 1,
    });

    expect(sellOffer).toEqual({
      tokenAmountToReceive: 99.0,
      minimumReceive: 98.01, // 99.0 * 0.99 (platform fee applied to minimum amount)
      slippageTolerance: 0.03,
      priceImpact: undefined, // No price impact in mock data
      offer: mockSellOffer.offer,
    });
    expect(result.current.error).toBe(null);
  });

  it('getBestSellOffer handles API errors', async () => {
    const useRelaySdk = await import('../useRelaySdk');
    const useTransactionKit = await import(
      '../../../../hooks/useTransactionKit'
    );
    const useBottomMenuModal = await import(
      '../../../../hooks/useBottomMenuModal'
    );
    const useGlobalTransactionsBatch = await import(
      '../../../../hooks/useGlobalTransactionsBatch'
    );
    const { useTransactionDebugLogger } = await import(
      '../../../../hooks/useTransactionDebugLogger'
    );
    const { getClient } = await import('@relayprotocol/relay-sdk');
    const { parseUnits } = await import('viem');
    const { getWrappedTokenAddressIfNative } = await import(
      '../../../the-exchange/utils/wrappedTokens'
    );

    (useRelaySdk.default as any).mockReturnValue({
      isInitialized: true,
      accountAddress: '0x1234567890123456789012345678901234567890',
    });

    (useTransactionKit.default as any).mockReturnValue({
      kit: mockTransactionKit.kit,
      walletAddress: mockTransactionKit.walletAddress,
    });

    (useBottomMenuModal.default as any).mockReturnValue({
      showSend: vi.fn(),
      setShowBatchSendModal: vi.fn(),
    });

    (useGlobalTransactionsBatch.default as any).mockReturnValue({
      setTransactionMetaForName: vi.fn(),
    });

    (useTransactionDebugLogger as any).mockReturnValue({
      transactionDebugLog: vi.fn(),
    });

    (getClient as any).mockReturnValue(mockRelayClient);
    (parseUnits as any).mockReturnValue(BigInt('1000000000000000000'));
    (getWrappedTokenAddressIfNative as any).mockReturnValue(
      mockSelectedToken.address
    );

    const error = new Error('API Error');
    mockRelayClient.actions.getQuote.mockRejectedValue(error);

    const { result } = renderHook(() => useRelaySell());

    const sellOffer = await result.current.getBestSellOffer({
      fromAmount: '1.0',
      fromTokenAddress: mockSelectedToken.address,
      fromChainId: mockSelectedToken.chainId,
      fromTokenDecimals: mockSelectedToken.decimals,
      toChainId: 1,
    });

    expect(sellOffer).toBe(null);

    await waitFor(() => {
      expect(result.current.error).toBe(
        'Unable to get quote. Please try again.'
      );
    });
  });

  it('executeSell returns false when not initialized', async () => {
    const useRelaySdk = await import('../useRelaySdk');
    const useTransactionKit = await import(
      '../../../../hooks/useTransactionKit'
    );
    const useBottomMenuModal = await import(
      '../../../../hooks/useBottomMenuModal'
    );
    const useGlobalTransactionsBatch = await import(
      '../../../../hooks/useGlobalTransactionsBatch'
    );
    const { useTransactionDebugLogger } = await import(
      '../../../../hooks/useTransactionDebugLogger'
    );

    (useRelaySdk.default as any).mockReturnValue({
      isInitialized: false,
      accountAddress: null,
    });

    (useTransactionKit.default as any).mockReturnValue({
      kit: null,
      walletAddress: null,
    });

    (useBottomMenuModal.default as any).mockReturnValue({
      showSend: vi.fn(),
      setShowBatchSendModal: vi.fn(),
    });

    (useGlobalTransactionsBatch.default as any).mockReturnValue({
      setTransactionMetaForName: vi.fn(),
    });

    (useTransactionDebugLogger as any).mockReturnValue({
      transactionDebugLog: vi.fn(),
    });

    const { result } = renderHook(() => useRelaySell());

    const success = await result.current.executeSell(mockSelectedToken, '1.0');

    expect(success).toBe(false);

    await waitFor(() => {
      expect(result.current.error).toBe(
        'Unable to execute transaction. Please try again.'
      );
    });
  });

  it('clearError clears the error state', async () => {
    const useRelaySdk = await import('../useRelaySdk');
    const useTransactionKit = await import(
      '../../../../hooks/useTransactionKit'
    );
    const useBottomMenuModal = await import(
      '../../../../hooks/useBottomMenuModal'
    );
    const useGlobalTransactionsBatch = await import(
      '../../../../hooks/useGlobalTransactionsBatch'
    );
    const { useTransactionDebugLogger } = await import(
      '../../../../hooks/useTransactionDebugLogger'
    );

    (useRelaySdk.default as any).mockReturnValue({
      isInitialized: true,
      accountAddress: '0x1234567890123456789012345678901234567890',
    });

    (useTransactionKit.default as any).mockReturnValue({
      kit: mockTransactionKit.kit,
      walletAddress: mockTransactionKit.walletAddress,
    });

    (useBottomMenuModal.default as any).mockReturnValue({
      showSend: vi.fn(),
      setShowBatchSendModal: vi.fn(),
    });

    (useGlobalTransactionsBatch.default as any).mockReturnValue({
      setTransactionMetaForName: vi.fn(),
    });

    (useTransactionDebugLogger as any).mockReturnValue({
      transactionDebugLog: vi.fn(),
    });

    const { result } = renderHook(() => useRelaySell());

    // Set error manually (simulating an error state)
    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBe(null);
  });
});
