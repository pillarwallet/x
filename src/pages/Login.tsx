/* eslint-disable @typescript-eslint/no-use-before-define */
import { useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { animated, useTransition } from '@react-spring/web';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useConnect, useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';

// components
import Button from '../components/Button';

// images
import PillarXLogo from '../assets/images/pillarX_full_white.png';
import PillarWalletIcon from '../apps/leaderboard/images/pillar-wallet-icon.svg';

const Login = () => {
  const { login } = usePrivy();
  const { connectors, connect } = useConnect();
  const { address } = useAccount();
  const [t] = useTranslation();
  const navigate = useNavigate();

  // Get WalletConnect connector
  const walletConnectConnector = connectors.find(
    ({ id }) => id === 'walletConnect'
  );

  const listenForWalletConnectUri = async () => {
    if (!walletConnectConnector) {
      throw new Error('WalletConnect connector not found');
    }

    connect({ connector: walletConnectConnector });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const provider: any = await walletConnectConnector.getProvider();
    provider.once('display_uri', (uri: string) => {
      const encodedURI = encodeURIComponent(uri);
      window.location.href = `pillarwallet://wc?uri=${encodedURI}`;
    });
  };

  useEffect(() => {
    const reloaded = sessionStorage.getItem('loginPageReloaded');
    if (!address || reloaded === 'true') return;
    window.location.reload();

    sessionStorage.setItem('loginPageReloaded', 'true');
  }, [address]);

  // Redirect to passkeys page when wallet is connected
  useEffect(() => {
    if (address) {
      navigate('/passkeys');
    }
  }, [address, navigate]);

  const logoTransitions = useTransition(true, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 500 },
  });



  return (
    <Wrapper>
      {logoTransitions(
        (styles, item) =>
          item && (
            <animated.img
              src={PillarXLogo}
              alt="pillar-x-logo"
              className="max-w-[300px] h-auto"
              style={styles}
            />
          )
      )}
      <InsideWrapper>
        <Button onClick={login} $fullWidth>{t`action.getStarted`}</Button>
        <Button onClick={listenForWalletConnectUri} $last $fullWidth>
          <img src={PillarWalletIcon} alt="pillar-wallet-icon" />
          {t`action.connectPillarWallet`}
        </Button>
      </InsideWrapper>
    </Wrapper>
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
