/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

// hooks
import useRelaySdk from '../useRelaySdk';

// Mock dependencies
vi.mock('@relayprotocol/relay-sdk', () => ({
  RelayClient: vi.fn(),
  convertViemChainToRelayChain: vi.fn(),
  createClient: vi.fn(),
  MAINNET_RELAY_API: 'https://api.relayprotocol.com',
}));

vi.mock('viem/chains', () => ({
  arbitrum: { id: 42161, name: 'Arbitrum' },
  base: { id: 8453, name: 'Base' },
  bsc: { id: 56, name: 'BSC' },
  gnosis: { id: 100, name: 'Gnosis' },
  mainnet: { id: 1, name: 'Ethereum' },
  optimism: { id: 10, name: 'Optimism' },
  polygon: { id: 137, name: 'Polygon' },
}));

vi.mock('../../../hooks/useTransactionKit', () => ({
  default: vi.fn(),
}));

const mockRelayClient = {
  getQuote: vi.fn(),
  execute: vi.fn(),
};

const mockConvertViemChainToRelayChain = vi.fn();
const mockCreateClient = vi.fn();

describe('useRelaySdk', () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    const { convertViemChainToRelayChain, createClient } = await import(
      '@relayprotocol/relay-sdk'
    );
    (convertViemChainToRelayChain as any).mockImplementation(
      mockConvertViemChainToRelayChain
    );
    (createClient as any).mockImplementation(mockCreateClient);
  });

  it('initializes with default values when no account address', async () => {
    const useTransactionKit = await import(
      '../../../../hooks/useTransactionKit'
    );

    (useTransactionKit.default as any).mockReturnValue({
      walletAddress: null,
    });

    const { result } = renderHook(() => useRelaySdk());

    expect(result.current.relayClient).toBe(undefined);
    expect(result.current.isInitialized).toBe(false);
    expect(result.current.accountAddress).toBe(null);
  });

  it('initializes RelayClient when account address is available', async () => {
    const useTransactionKit = await import(
      '../../../../hooks/useTransactionKit'
    );
    const { convertViemChainToRelayChain, createClient } = await import(
      '@relayprotocol/relay-sdk'
    );

    (useTransactionKit.default as any).mockReturnValue({
      walletAddress: '0x1234567890123456789012345678901234567890',
    });

    (mockConvertViemChainToRelayChain as any).mockImplementation(
      (chain: any) => ({
        id: chain.id,
        name: chain.name,
      })
    );
    (mockCreateClient as any).mockReturnValue(mockRelayClient);

    const { result } = renderHook(() => useRelaySdk());

    await waitFor(() => {
      expect(convertViemChainToRelayChain).toHaveBeenCalledTimes(7); // Called for each chain
    });

    await waitFor(() => {
      expect(createClient).toHaveBeenCalledWith({
        baseApiUrl: 'https://api.relayprotocol.com',
        source: 'pillarx-pulse',
        chains: expect.arrayContaining([
          expect.objectContaining({ id: 1, name: 'Ethereum' }),
          expect.objectContaining({ id: 137, name: 'Polygon' }),
          expect.objectContaining({ id: 8453, name: 'Base' }),
          expect.objectContaining({ id: 42161, name: 'Arbitrum' }),
          expect.objectContaining({ id: 10, name: 'Optimism' }),
          expect.objectContaining({ id: 56, name: 'BSC' }),
          expect.objectContaining({ id: 100, name: 'Gnosis' }),
        ]),
      });
    });

    await waitFor(() => {
      expect(result.current.relayClient).toBe(mockRelayClient);
      expect(result.current.isInitialized).toBe(true);
      expect(result.current.accountAddress).toBe(
        '0x1234567890123456789012345678901234567890'
      );
    });
  });

  it('handles client creation error', async () => {
    const useTransactionKit = await import(
      '../../../../hooks/useTransactionKit'
    );

    (useTransactionKit.default as any).mockReturnValue({
      walletAddress: '0x1234567890123456789012345678901234567890',
    });

    (mockConvertViemChainToRelayChain as any).mockImplementation(
      (chain: any) => ({
        id: chain.id,
        name: chain.name,
      })
    );

    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const error = new Error('Client creation failed');
    (mockCreateClient as any).mockImplementation(() => {
      throw error;
    });

    const { result } = renderHook(() => useRelaySdk());

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to initialize Relay SDK:',
        error
      );
    });

    await waitFor(() => {
      expect(result.current.relayClient).toBe(undefined);
      expect(result.current.isInitialized).toBe(false);
      expect(result.current.accountAddress).toBe(
        '0x1234567890123456789012345678901234567890'
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it('resets state when account address becomes null', async () => {
    const useTransactionKit = await import(
      '../../../../hooks/useTransactionKit'
    );

    const mockUseTransactionKit = vi.fn();
    (useTransactionKit.default as any).mockImplementation(
      mockUseTransactionKit
    );

    // Initial state with account address
    (mockUseTransactionKit as any).mockReturnValue({
      walletAddress: '0x1234567890123456789012345678901234567890',
    });

    (mockConvertViemChainToRelayChain as any).mockImplementation(
      (chain: any) => ({
        id: chain.id,
        name: chain.name,
      })
    );
    (mockCreateClient as any).mockReturnValue(mockRelayClient);

    const { result, rerender } = renderHook(() => useRelaySdk());

    await waitFor(() => {
      expect(result.current.relayClient).toBe(mockRelayClient);
      expect(result.current.isInitialized).toBe(true);
    });

    // Change account address to null
    (mockUseTransactionKit as any).mockReturnValue({
      walletAddress: null,
    });

    rerender();

    expect(result.current.relayClient).toBe(undefined);
    expect(result.current.isInitialized).toBe(false);
    expect(result.current.accountAddress).toBe(null);
  });

  it('reinitializes when account address changes', async () => {
    const useTransactionKit = await import(
      '../../../../hooks/useTransactionKit'
    );

    const mockUseTransactionKit = vi.fn();
    (useTransactionKit.default as any).mockImplementation(
      mockUseTransactionKit
    );

    // Initial state with first account address
    (mockUseTransactionKit as any).mockReturnValue({
      walletAddress: '0x1234567890123456789012345678901234567890',
    });

    (mockConvertViemChainToRelayChain as any).mockImplementation(
      (chain: any) => ({
        id: chain.id,
        name: chain.name,
      })
    );
    (mockCreateClient as any).mockReturnValue(mockRelayClient);

    const { result, rerender } = renderHook(() => useRelaySdk());

    await waitFor(() => {
      expect(result.current.relayClient).toBe(mockRelayClient);
      expect(result.current.isInitialized).toBe(true);
    });

    // Change to different account address
    (mockUseTransactionKit as any).mockReturnValue({
      walletAddress: '0x9876543210987654321098765432109876543210',
    });

    rerender();

    await waitFor(() => {
      expect(result.current.accountAddress).toBe(
        '0x9876543210987654321098765432109876543210'
      );
    });
  });

  it('converts all supported chains correctly', async () => {
    const useTransactionKit = await import(
      '../../../../hooks/useTransactionKit'
    );
    const { convertViemChainToRelayChain } = await import(
      '@relayprotocol/relay-sdk'
    );

    (useTransactionKit.default as any).mockReturnValue({
      walletAddress: '0x1234567890123456789012345678901234567890',
    });

    (mockConvertViemChainToRelayChain as any).mockImplementation(
      (chain: any) => ({
        id: chain.id,
        name: chain.name,
      })
    );
    (mockCreateClient as any).mockReturnValue(mockRelayClient);

    renderHook(() => useRelaySdk());

    await waitFor(() => {
      expect(convertViemChainToRelayChain).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1, name: 'Ethereum' })
      );
    });

    await waitFor(() => {
      expect(convertViemChainToRelayChain).toHaveBeenCalledWith(
        expect.objectContaining({ id: 137, name: 'Polygon' })
      );
    });

    await waitFor(() => {
      expect(convertViemChainToRelayChain).toHaveBeenCalledWith(
        expect.objectContaining({ id: 8453, name: 'Base' })
      );
    });

    await waitFor(() => {
      expect(convertViemChainToRelayChain).toHaveBeenCalledWith(
        expect.objectContaining({ id: 42161, name: 'Arbitrum' })
      );
    });

    await waitFor(() => {
      expect(convertViemChainToRelayChain).toHaveBeenCalledWith(
        expect.objectContaining({ id: 10, name: 'Optimism' })
      );
    });

    await waitFor(() => {
      expect(convertViemChainToRelayChain).toHaveBeenCalledWith(
        expect.objectContaining({ id: 56, name: 'BSC' })
      );
    });

    await waitFor(() => {
      expect(convertViemChainToRelayChain).toHaveBeenCalledWith(
        expect.objectContaining({ id: 100, name: 'Gnosis' })
      );
    });
  });

  it('uses correct client configuration', async () => {
    const useTransactionKit = await import(
      '../../../../hooks/useTransactionKit'
    );
    const { createClient } = await import('@relayprotocol/relay-sdk');

    (useTransactionKit.default as any).mockReturnValue({
      walletAddress: '0x1234567890123456789012345678901234567890',
    });

    (mockConvertViemChainToRelayChain as any).mockImplementation(
      (chain: any) => ({
        id: chain.id,
        name: chain.name,
      })
    );
    (mockCreateClient as any).mockReturnValue(mockRelayClient);

    renderHook(() => useRelaySdk());

    await waitFor(() => {
      expect(createClient).toHaveBeenCalledWith({
        baseApiUrl: 'https://api.relayprotocol.com',
        source: 'pillarx-pulse',
        chains: expect.any(Array),
      });
    });
  });
});
