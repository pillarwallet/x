/* eslint-disable @typescript-eslint/no-use-before-define */
import { usePrivy } from '@privy-io/react-auth';
import { animated, useTransition } from '@react-spring/web';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

// components
import Button from '../components/Button';

// images
import PillarXLogo from '../assets/images/pillarX_full_white.png';

const Login = () => {
  const { login } = usePrivy();
  const [t] = useTranslation();

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
      <Button onClick={login} $fullWidth>{t`action.getStarted`}</Button>
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

export default Login;
