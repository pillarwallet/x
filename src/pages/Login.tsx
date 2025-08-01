/* eslint-disable @typescript-eslint/no-use-before-define */
import { usePrivy } from '@privy-io/react-auth';
import { animated, useTransition } from '@react-spring/web';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import Plausible from 'plausible-tracker';

// components
import Button from '../components/Button';
import DebugPanel from '../components/DebugPanel';
import ConnectionDebug, { DebugInfo } from '../components/ConnectionDebug';

// images
import PillarWalletIcon from '../apps/leaderboard/images/pillar-wallet-icon.svg';
import PillarXLogo from '../assets/images/pillarX_full_white.png';

// Plausible Domain Config
const { trackEvent } = Plausible({
  domain: import.meta.env.VITE_PLAUSIBLE_DOMAIN,
});

const Login = () => {
  const { login, authenticated, user, ready } = usePrivy();
  const { connectors, connect, isPending, error } = useConnect();
  const { address, isConnected, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();
  const [t] = useTranslation();
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({});
  const [logoPressStart, setLogoPressStart] = useState<number | null>(null);

  // Get WalletConnect connector
  const walletConnectConnector = connectors.find(
    ({ id }) => id === 'walletConnect'
  );

  // Update debug info
  useEffect(() => {
    setDebugInfo({
      privy: {
        authenticated,
        ready,
        user: user
          ? {
              id: user.id,
              email: user.email?.address,
              wallet: user.wallet?.address,
            }
          : null,
      },
      wagmi: {
        address,
        isConnected,
        isConnecting,
        isPending,
        error: error?.message,
        connectorsCount: connectors.length,
        connectorIds: connectors.map((c) => c.id),
        walletConnectConnector: walletConnectConnector
          ? {
              id: walletConnectConnector.id,
              name: walletConnectConnector.name,
              ready: Boolean(walletConnectConnector.ready),
            }
          : null,
      },
    });
  }, [
    authenticated,
    ready,
    user,
    address,
    isConnected,
    isConnecting,
    isPending,
    error,
    connectors,
    walletConnectConnector,
  ]);

  const listenForWalletConnectUri = async () => {
    if (!walletConnectConnector) {
      console.error('WalletConnect: Connector not found');
      throw new Error('WalletConnect connector not found');
    }

    try {
      connect({ connector: walletConnectConnector });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const provider: any = await walletConnectConnector.getProvider();

      if (provider) {
        // Event listener for display_uri
        provider.once('display_uri', (uri: string) => {
          const encodedURI = encodeURIComponent(uri);
          const deeplinkUrl = `pillarwallet://wc?uri=${encodedURI}`;
          window.location.href = deeplinkUrl;
        });

        // Add additional event listeners for debugging
        provider.on('connect', () => {
          // Event listener for connect
        });

        provider.on('disconnect', () => {
          // Event listener for disconnect
        });

        provider.on('error', () => {
          console.error('WalletConnect: error event:', error);
        });
      } else {
        console.error('WalletConnect: Failed to get provider');
      }
    } catch (connectError) {
      console.error(
        'WalletConnect: Error during connection process:',
        connectError
      );
      throw connectError;
    }
  };

  useEffect(() => {
    const reloaded = sessionStorage.getItem('loginPageReloaded');
    if (!address || reloaded === 'true') return;
    window.location.reload();

    sessionStorage.setItem('loginPageReloaded', 'true');
  }, [address]);

  // Long press handler for debug mode
  useEffect(() => {
    if (logoPressStart) {
      const timer = setTimeout(() => {
        const pressDuration = Date.now() - logoPressStart;
        if (pressDuration >= 5000) {
          // 5 seconds
          localStorage.setItem('debug_connections', 'true');
          window.location.reload();
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [logoPressStart]);

  const handleLogoMouseDown = () => {
    setLogoPressStart(Date.now());
  };

  const handleLogoMouseUp = () => {
    setLogoPressStart(null);
  };

  const handleLogoMouseLeave = () => {
    setLogoPressStart(null);
  };

  const logoTransitions = useTransition(true, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 500 },
  });

  return (
    <>
      <Wrapper>
        {logoTransitions(
          (styles, item) =>
            item && (
              <animated.img
                src={PillarXLogo}
                alt="pillar-x-logo"
                className="max-w-[300px] h-auto"
                style={styles}
                onMouseDown={handleLogoMouseDown}
                onMouseUp={handleLogoMouseUp}
                onMouseLeave={handleLogoMouseLeave}
                onTouchStart={handleLogoMouseDown}
                onTouchEnd={handleLogoMouseUp}
                onTouchCancel={handleLogoMouseLeave}
              />
            )
        )}
        <InsideWrapper>
          <Button onClick={() => {trackEvent('Login Page Get Started'); login();}} $fullWidth>{t`action.getStarted`}</Button>
          <Button onClick={() => {trackEvent('Login Page Connect Pillar Wallet'); listenForWalletConnectUri();}} $last $fullWidth>
            <img src={PillarWalletIcon} alt="pillar-wallet-icon" />
            {t`action.connectPillarWallet`}
          </Button>
        </InsideWrapper>
      </Wrapper>

      {/* Debug Panel */}
      {localStorage.getItem('debug_connections') === 'true' && (
        <DebugPanel title="Connection Debug">
          <ConnectionDebug
            debugInfo={debugInfo}
            onDisconnect={() => {
              if (debugInfo.wagmi?.isConnected) disconnect();
            }}
          />
        </DebugPanel>
      )}
    </>
  );
};

const Wrapper = styled.div`
  height: 100vh;
  padding: 50px 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 500px;
  margin: 0 auto;
`;

const InsideWrapper = styled.div`
  height: 35vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default Login;
