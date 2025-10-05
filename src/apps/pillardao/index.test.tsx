// PillarDAO tests: run only this app's tests
// - Single file (CI-style):
//     npm run -s test -- run src/apps/pillardao/index.test.tsx
// - All PillarDAO tests (glob):
//     npm run -s test -- run "src/apps/pillardao/**/*.test.tsx"
// - Watch this file locally (if you prefer watch mode):
//     npx vitest watch src/apps/pillardao/index.test.tsx
//
// The splash intro is skipped in test mode so tabs render immediately.


/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, beforeEach, vi, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { defaultTheme } from '../../theme';

// Mock hooks used by the sub-app to keep UI simple in tests
vi.mock('./components/AnimatedTitle', () => ({
  default: ({ text }: { text: string }) => text,
}));

vi.mock('../../hooks/useTransactionKit', () => ({
  default: () => ({ walletAddress: undefined }),
}));

vi.mock('../../services/walletConnect', () => ({
  useWalletConnect: () => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
    disconnectAllSessions: vi.fn(),
    activeSessions: {},
    isLoadingConnect: false,
    isLoadingDisconnect: false,
    isLoadingDisconnectAll: false,
  }),
}));

vi.mock('../../hooks/useWalletConnectToast', () => ({
  default: () => ({ showToast: vi.fn() }),
}));

// Override wagmi for this test: we don't need real provider behavior,
// just ensure hooks render without throwing and record calls if needed.
vi.mock('wagmi', () => ({
  WagmiProvider: ({ children }: any) => children,
  createConfig: vi.fn(() => ({})),
  useReadContract: vi.fn(() => ({ data: undefined, refetch: vi.fn() })),
}));

// Import after mocks
import PillarDaoApp from './index';

describe('PillarDAO Sub-app', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderApp = () =>
    render(
      <MemoryRouter initialEntries={["/pillardao"]}>
        <ThemeProvider theme={defaultTheme}>
          <PillarDaoApp />
        </ThemeProvider>
      </MemoryRouter>
    );

  it('renders header and tabs', async () => {
    renderApp();
    expect(await screen.findByText('Voting')).toBeInTheDocument();
    expect(await screen.findByText('Join PillarDAO')).toBeInTheDocument();
    expect(await screen.findByText('My DAO NFT')).toBeInTheDocument();
  });

  it('shows WalletConnect URI input when no sessions are active', async () => {
    renderApp();
    fireEvent.click(await screen.findByText('Join PillarDAO'));
    expect(
      await screen.findByPlaceholderText('wc:...')
    ).toBeInTheDocument();
  });

  it('opens voting link (primary) when clicking Open PillarDAO voting', async () => {
    renderApp();

    // Mock network and window.open used by openVoting
    const fetchSpy = vi
      .spyOn(global, 'fetch' as any)
      .mockResolvedValue({ ok: true, status: 200 } as any);
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    const btn = (await screen.findAllByText('Open PillarDAO voting'))[0];
    fireEvent.click(btn);

    // allow micro waits inside the handler
    await new Promise((r) => setTimeout(r, 20));

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://pillardao.org/voting',
      expect.objectContaining({ method: 'GET' })
    );
    expect(openSpy).toHaveBeenCalledWith(
      'https://pillardao.org/voting',
      '_blank',
      'noreferrer'
    );
  });

  it('falls back to Snapshot when voting URL 404s', async () => {
    renderApp();

    const fetchSpy = vi
      .spyOn(global, 'fetch' as any)
      .mockResolvedValue({ ok: false, status: 404 } as any);
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    const btn = (await screen.findAllByText('Open PillarDAO voting'))[0];
    fireEvent.click(btn);

    await new Promise((r) => setTimeout(r, 20));

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://pillardao.org/voting',
      expect.objectContaining({ method: 'GET' })
    );
    expect(openSpy).toHaveBeenCalledWith(
      'https://snapshot.box/#/s:plrdao.eth/',
      '_blank',
      'noreferrer'
    );
  });

  it('opens community chat link when clicking community button', async () => {
    renderApp();

    const fetchSpy = vi
      .spyOn(global, 'fetch' as any)
      .mockResolvedValue({ ok: true, status: 200 } as any);
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    fireEvent.click(await screen.findByText('Join PillarDAO'));
    const btn = await screen.findByText('Join Pillar DAO chat and community');
    fireEvent.click(btn);
    await new Promise((r) => setTimeout(r, 20));

    // With current manifest, primary is community base + '/chat'
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://pillardao.org/chat',
      expect.objectContaining({ method: 'GET' })
    );
    expect(openSpy).toHaveBeenCalledWith(
      'https://pillardao.org/chat',
      '_blank',
      'noreferrer'
    );
  });

  it('falls back to Discord invite when community chat URL 404s', async () => {
    renderApp();

    const fetchSpy = vi
      .spyOn(global, 'fetch' as any)
      .mockResolvedValue({ ok: false, status: 404 } as any);
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    fireEvent.click(await screen.findByText('Join PillarDAO'));
    const btn = await screen.findByText('Join Pillar DAO chat and community');
    fireEvent.click(btn);
    await new Promise((r) => setTimeout(r, 20));

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://pillardao.org/chat',
      expect.objectContaining({ method: 'GET' })
    );
    expect(openSpy).toHaveBeenCalledWith(
      'https://discord.com/invite/t39xKhzSPb',
      '_blank',
      'noreferrer'
    );
  });

  it('shows NFT signup card when Join tab selected', async () => {
    renderApp();
    fireEvent.click(await screen.findByText('Join PillarDAO'));
    expect(await screen.findByText('Get Your Membership')).toBeInTheDocument();
    expect(
      await screen.findByText('Open Pillar DAO Member Signup')
    ).toBeInTheDocument();
  });
});
