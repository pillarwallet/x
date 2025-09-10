/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { act, renderHook } from '@testing-library/react';

// utils
import { MobulaChainNames } from '../../utils/constants';

// components
import useChainSelect from '../useChainSelect';

describe('useChainSelect', () => {
  it('initializes with All chains', () => {
    const { result } = renderHook(() => useChainSelect());

    expect(result.current.chains).toBe(MobulaChainNames.All);
    expect(typeof result.current.setChains).toBe('function');
  });

  it('updates chains when setChains is called', () => {
    const { result } = renderHook(() => useChainSelect());

    act(() => {
      result.current.setChains(MobulaChainNames.Ethereum);
    });

    expect(result.current.chains).toBe(MobulaChainNames.Ethereum);
  });

  it('maintains state across multiple updates', () => {
    const { result } = renderHook(() => useChainSelect());

    act(() => {
      result.current.setChains(MobulaChainNames.Ethereum);
    });

    expect(result.current.chains).toBe(MobulaChainNames.Ethereum);

    act(() => {
      result.current.setChains(MobulaChainNames.Polygon);
    });

    expect(result.current.chains).toBe(MobulaChainNames.Polygon);

    act(() => {
      result.current.setChains(MobulaChainNames.All);
    });

    expect(result.current.chains).toBe(MobulaChainNames.All);
  });

  it('returns the same setChains function reference', () => {
    const { result, rerender } = renderHook(() => useChainSelect());

    const firstSetChains = result.current.setChains;

    rerender();

    expect(result.current.setChains).toBe(firstSetChains);
  });
});
