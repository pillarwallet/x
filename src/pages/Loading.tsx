import React from 'react';
import styled from 'styled-components';

// theme
import { animation } from '../theme';

const Loading = () => (
  <Wrapper>
    <AnimatedLoadingLogo />
  </Wrapper>
);

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const AnimatedLoadingLogo = styled.div`
  font-size: 50px;
  font-weight: 700;
  width: 150px;
  height: 150px;
  line-height: 140px;
  border-radius: 50%;
  background: ${({ theme }) => theme.color.background.loadingLogo};
  color: ${({ theme }) => theme.color.text.loadingLogo};
  text-align: center;
  animation: ${animation.pulse} 5s ease-in-out infinite;

  &:before {
    content: 'Px';
  }
`;

export default Loading;
