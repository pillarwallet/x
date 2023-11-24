import React from 'react';
import styled, { keyframes } from 'styled-components';

const Loading = ({ complete }: { complete?: boolean }) => {
  return (
    <Wrapper>
      <AnimatedLoadingLogo complete={complete} />
    </Wrapper>
  );
}

const loadingAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(2);
  }
  100% {
    transform: scale(1);
  }
`;

const loadingCompleteAnimation = keyframes`
  100% {
    transform: scale(99999);
  }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  min-height: 100vh;
`;

const AnimatedLoadingLogo = styled.div<{ complete?: boolean }>`
  margin-top: calc(50% - 150px);
  font-size: 50px;
  font-weight: 700;
  width: 150px;
  height: 150px;
  line-height: 140px;
  border-radius: 50%;
  background: ${({ theme }) => theme.color.background.loadingLogo};
  color: ${({ theme }) => theme.color.text.loadingLogo};
  text-align: center;
  animation: ${({ complete }) => complete ? loadingCompleteAnimation : loadingAnimation} 5s ease-in-out infinite;

  &:before {
    content: 'Px';
  }
`;

export default Loading;
