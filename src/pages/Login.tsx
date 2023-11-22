import React, { useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import styled from 'styled-components';

// components
import Button from '../components/Button';
import Paragraph from '../components/Text/Paragraph';

const Login = () => {
  const { login } = usePrivy();

  useEffect(() => {
    login();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Wrapper>
      <LogoText>Px</LogoText>
      <Button onClick={login}>Get Started</Button>
      <Paragraph>
        Lorem ipsum dolor sit amet consectetur,<br/>
         adipiscing elit. Donec euismod
      </Paragraph>
    </Wrapper>
  )
}

const LogoText = styled.h1`
  font-size: 80px;
  font-weight: 700;
  margin-bottom: 30px;
  color: ${({ theme }) => theme.color.text.body};
  text-align: center;
  text-shadow: 0 0 20px rgba(0, 0, 0, 0.25);
`;

const Wrapper = styled.div`
  margin-top: calc(50% - 150px);
  text-align: center;
`;

export default Login;
