import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { vi } from 'vitest';

// types
import type { Mock } from 'vitest';

// hooks
import { useWalletConnect } from '../../../../../services/walletConnect';

// components
import WalletConnectDropdown from '../WalletConnectDropdown';

vi.mock('../../../../../services/walletConnect', () => ({
  useWalletConnect: vi.fn(),
}));

Object.defineProperty(navigator, 'clipboard', {
  value: {
    readText: vi.fn(),
  },
  writable: true,
});

// 'Type' for the return value of `useWalletConnect` hook
interface UseWalletConnectProps {
  connect: vi.mock;
  disconnect: vi.mock;
  disconnectAllSessions: vi.mock;
  activeSessions:
    | Record<
        string,
        { topic: string; peer: { metadata: { name: string; icons: string[] } } }
      >
    | undefined;
  isLoadingConnect: boolean;
  isLoadingDisconnect: boolean;
  isLoadingDisconnectAll: boolean;
}

describe('<WalletConnectDropdown />', () => {
  const mockConnect = vi.fn();
  const mockDisconnect = vi.fn();
  const mockDisconnectAllSessions = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useWalletConnect as Mock).mockReturnValue({
      connect: mockConnect,
      disconnect: mockDisconnect,
      disconnectAllSessions: mockDisconnectAllSessions,
      activeSessions: {},
      isLoadingConnect: false,
      isLoadingDisconnect: false,
      isLoadingDisconnectAll: false,
    });
  });

  it('renders correctly and matches snapshot', () => {
    const tree = renderer.create(<WalletConnectDropdown />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('toggles the dropdown on click', () => {
    render(<WalletConnectDropdown />);
    const dropdown = screen.getByText('WalletConnect');
    fireEvent.click(dropdown);
    expect(
      screen.getByText(
        'Copy WalletConnect URL & click below to automatically connect'
      )
    ).toBeInTheDocument();
    fireEvent.click(dropdown);
    expect(
      screen.queryByText(
        'Copy WalletConnect URL & click below to automatically connect'
      )
    ).not.toBeInTheDocument();
  });

  it('calls connect function with a URI when connect button is clicked', async () => {
    const copiedUri = 'some-mocked-uri';

    (navigator.clipboard.readText as Mock).mockImplementation(() =>
      Promise.resolve(copiedUri)
    );

    render(<WalletConnectDropdown />);
    fireEvent.click(screen.getByText('WalletConnect'));
    const connectButton = screen.getByText('Connect dApp');

    fireEvent.click(connectButton);

    await waitFor(() => {
      expect(mockConnect).toHaveBeenCalled();
    });
  });

  it('displays active sessions when available', () => {
    (useWalletConnect as Mock).mockReturnValue({
      connect: mockConnect,
      disconnect: mockDisconnect,
      disconnectAllSessions: mockDisconnectAllSessions,
      activeSessions: {
        session1: {
          topic: '123',
          peer: { metadata: { name: 'Test dApp', icons: [''] } },
        },
      },
      isLoadingConnect: false,
      isLoadingDisconnect: false,
      isLoadingDisconnectAll: false,
    });

    render(<WalletConnectDropdown />);
    fireEvent.click(screen.getByText('WalletConnect'));
    expect(screen.getByText('Test dApp')).toBeInTheDocument();
  });

  it('calls disconnect when disconnect button is clicked', async () => {
    (useWalletConnect as Mock<UseWalletConnectProps>).mockReturnValue({
      connect: mockConnect,
      disconnect: mockDisconnect,
      disconnectAllSessions: mockDisconnectAllSessions,
      activeSessions: {
        session1: {
          topic: '123',
          peer: { metadata: { name: 'Test dApp', icons: [''] } },
        },
      },
      isLoadingConnect: false,
      isLoadingDisconnect: false,
      isLoadingDisconnectAll: false,
    });
    render(<WalletConnectDropdown />);
    fireEvent.click(screen.getByText('WalletConnect'));
    const disconnectButton = screen.getByText('Disconnect');
    fireEvent.click(disconnectButton);
    await waitFor(() => {
      expect(mockDisconnect).toHaveBeenCalledWith('123');
    });
  });

  it('disconnectAll button appears when several sessions are connected', async () => {
    (useWalletConnect as Mock).mockReturnValue({
      connect: mockConnect,
      disconnect: mockDisconnect,
      disconnectAllSessions: mockDisconnectAllSessions,
      activeSessions: {
        session1: {
          topic: '123',
          peer: { metadata: { name: 'Test dApp', icons: [''] } },
        },
        session2: {
          topic: '456',
          peer: { metadata: { name: 'Another dApp', icons: [''] } },
        },
      },
      isLoadingConnect: false,
      isLoadingDisconnect: false,
      isLoadingDisconnectAll: false,
    });

    render(<WalletConnectDropdown />);
    fireEvent.click(screen.getByText('WalletConnect'));
    const disconnectAllButton = screen.getByText('Disconnect all');

    expect(disconnectAllButton).toBeInTheDocument();
  });
});
