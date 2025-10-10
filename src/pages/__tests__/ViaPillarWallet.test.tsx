import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ViaPillarWallet from '../ViaPillarWallet';
import { defaultTheme } from '../../theme';
import * as Sentry from '@sentry/react';

// Mock dependencies
vi.mock('@sentry/react');
vi.mock('../../hooks/usePrivateKeyLogin', () => ({
  default: () => ({
    setAccount: vi.fn(),
    account: null,
  }),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('ViaPillarWallet', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderComponent = () => {
    return render(
      <ThemeProvider theme={defaultTheme}>
        <MemoryRouter>
          <ViaPillarWallet />
        </MemoryRouter>
      </ThemeProvider>
    );
  };

  it('renders loading state initially', () => {
    renderComponent();
    expect(screen.getByText('Connecting to Pillar Wallet...')).toBeInTheDocument();
  });

  it('sends authentication request to webview', async () => {
    const postMessageMock = vi.fn();
    // @ts-expect-error - Mocking ReactNativeWebView for testing
    window.ReactNativeWebView = {
      postMessage: postMessageMock,
    };

    renderComponent();

    await waitFor(() => {
      expect(postMessageMock).toHaveBeenCalledWith(
        JSON.stringify({
          type: 'pillarXAuthRequest',
          value: 'pk',
        })
      );
    });
  });

  it('handles private key response from webview', async () => {
    const mockPrivateKey = '0x1234567890123456789012345678901234567890123456789012345678901234';
    
    renderComponent();

    // Wait a bit for the component to mount and set up event listeners
    await waitFor(() => {
      expect(screen.getByText('Connecting to Pillar Wallet...')).toBeInTheDocument();
    });

    // Simulate webview response
    const messageEvent = new MessageEvent('message', {
      data: JSON.stringify({
        type: 'pillarWalletPkResponse',
        value: {
          pk: mockPrivateKey,
        },
      }),
    });

    window.dispatchEvent(messageEvent);

    // The component should show authentication successful or redirect
    // Since navigation happens, we can check for localStorage instead
    await waitFor(() => {
      expect(localStorage.getItem('ACCOUNT_VIA_PK')).toBeTruthy();
    }, { timeout: 2000 });
  });

  it('tracks authentication flow in Sentry', () => {
    renderComponent();

    expect(Sentry.setContext).toHaveBeenCalledWith(
      'pillar_wallet_auth',
      expect.objectContaining({
        timestamp: expect.any(String),
        userAgent: expect.any(String),
      })
    );

    expect(Sentry.addBreadcrumb).toHaveBeenCalledWith(
      expect.objectContaining({
        category: 'authentication',
        message: 'Pillar Wallet authentication initiated',
        level: 'info',
      })
    );
  });

  it('handles invalid private key gracefully', async () => {
    renderComponent();

    // Simulate webview response with invalid private key
    const messageEvent = new MessageEvent('message', {
      data: JSON.stringify({
        type: 'pillarWalletPkResponse',
        value: {
          pk: 'invalid-key',
        },
      }),
    });

    window.dispatchEvent(messageEvent);

    await waitFor(() => {
      expect(screen.getByText('Authentication Failed')).toBeInTheDocument();
    });
  });
});
