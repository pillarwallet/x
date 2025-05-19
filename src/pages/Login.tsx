/* eslint-disable @typescript-eslint/no-use-before-define */
import { useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { animated, useTransition } from '@react-spring/web';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

// components
import Button from '../components/Button';

// images
import PillarXLogo from '../assets/images/pillarX_full_white.png';

const Login = () => {
  const { login, connectWallet } = usePrivy();
  const { wallets } = useWallets();
  const [t] = useTranslation();

  useEffect(() => {
    // eslint-disable-next-line no-useless-return
    if (!wallets.length) return;
    wallets[0].loginOrLink();
  }, [wallets]);

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
        <Button
          onClick={() =>
            connectWallet({
              walletList: ['wallet_connect'],
            })
          }
          $last
          $fullWidth
        >{t`action.connectPillarWallet`}</Button>
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
  gap: 100px;
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
