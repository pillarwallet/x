import React from 'react';
import { act, renderHook } from '@testing-library/react';

// providers
import GlobalTransactionsBatchProvider, { IGlobalBatchTransaction } from '../GlobalTransactionsBatchProvider';

// hooks
import useGlobalTransactionsBatch from '../../hooks/useGlobalTransactionsBatch';

const mockBlockTransaction: IGlobalBatchTransaction = {
  to: '0x123',
  title: 'test',
  chainId: 1,
}

describe('GlobalTransactionsBatchProvider', () => {
  let wrapper: React.FC;

  beforeEach(() => {
    wrapper = ({ children }: React.PropsWithChildren) => (
      <GlobalTransactionsBatchProvider>
        {children}
      </GlobalTransactionsBatchProvider>
    );
  });

  it('initializes with empty batches', () => {
    const { result } = renderHook(() => useGlobalTransactionsBatch(), { wrapper });
    expect(result.current.transactions).toEqual([]);
  });

  it('adds transactions to batches correctly', async () => {
    const { result } = renderHook(() => useGlobalTransactionsBatch(), { wrapper });

    act(() => {
      result.current.addToBatch({ id: '1', ...mockBlockTransaction });
      result.current.addToBatch({ id: '3', ...mockBlockTransaction, chainId: 137 });
      result.current.addToBatch({ id: '2', ...mockBlockTransaction });
      result.current.addToBatch(mockBlockTransaction);
    });

    expect(Object.keys(result.current.transactions).length).toEqual(4);
    expect(result.current.transactions[0].id).toEqual('1');
    expect(result.current.transactions[1].id).toEqual('3');
    expect(result.current.transactions[2].id).toEqual('2');
    expect(result.current.transactions[3].id?.startsWith('0x')).toBeTruthy(); // assigns id automatically
  });

  it('removes transactions from batches correctly', async () => {
    const { result } = renderHook(() => useGlobalTransactionsBatch(), { wrapper });

    act(() => {
      result.current.addToBatch({ id: '1', ...mockBlockTransaction });
      result.current.addToBatch({ id: '3', ...mockBlockTransaction, chainId: 137 });
      result.current.addToBatch({ id: '2', ...mockBlockTransaction });
    });

    expect(result.current.transactions.length).toEqual(3);

    act(() => {
      result.current.removeFromBatch('2');
      result.current.removeFromBatch('3');
    });

    expect(result.current.transactions.length).toEqual(1);
    expect(result.current.transactions[0].id).toEqual('1');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
