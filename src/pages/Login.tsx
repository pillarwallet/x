import React from 'react';
import { usePrivy } from '@privy-io/react-auth';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

// images
import { ReactComponent as RandomShape } from '../assets/images/random-shape.svg';

// components
import Button from '../components/Button';
import { PrimaryTitle } from '../components/Text/Title';

// theme
import { animation } from '../theme';

const Login = () => {
  const { login } = usePrivy();
  const [t] = useTranslation();

  return (
    <Wrapper>
      <HeroTitle>{t`content.welcomeToPillarX`}</HeroTitle>
      <AnimatedShape />
      <Button onClick={login} fullWidth>{t`action.getStarted`}</Button>
    </Wrapper>
  )
}

const HeroTitle = styled(PrimaryTitle)`
  font-size: 45px;
  line-height: 45px;
  width: 210px;
  text-align: center;
  margin-top: 16vh;
`;

const Wrapper = styled.div`
  height: 100vh;
  padding: 50px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  max-width: 500px;
  margin: 0 auto;
`;

const AnimatedShape = styled(RandomShape)`
  animation: ${animation.rotateAndPulse} 20s linear infinite;
`;

export default Login;
