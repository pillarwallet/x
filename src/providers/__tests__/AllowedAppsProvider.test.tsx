import { renderHook, waitFor } from '@testing-library/react';
import axios from 'axios';
import React from 'react';
import { vi } from 'vitest';

// types
import type { Mock } from 'vitest';

// providers
import AllowedAppsProvider from '../AllowedAppsProvider';

// hooks
import useAllowedApps from '../../hooks/useAllowedApps';

describe('AllowedAppsProvider', () => {
  const allowedAppsMock = [
    { appId: 'allowed-app-1' },
    { appId: 'allowed-app-2' },
    { appId: 'allowed-app-3' },
  ];

  let wrapper: React.FC;

  beforeEach(() => {
    wrapper = ({ children }: React.PropsWithChildren) => (
      <AllowedAppsProvider>{children}</AllowedAppsProvider>
    );

    (axios.get as Mock).mockImplementation(() =>
      Promise.resolve({ data: allowedAppsMock })
    );
  });

  it('initializes with empty list and loading state', () => {
    const { result } = renderHook(() => useAllowedApps(), { wrapper });
    expect(result.current.isLoading).toEqual(true);
    expect(result.current.allowed).toEqual([]);
  });

  it('updates list correctly', async () => {
    const { result } = renderHook(() => useAllowedApps(), { wrapper });

    expect(result.current.isLoading).toEqual(true);

    await waitFor(async () => {
      expect(result.current.isLoading).toEqual(false);
    });

    expect(result.current.allowed).toEqual(
      allowedAppsMock.map((app) => app.appId)
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});
