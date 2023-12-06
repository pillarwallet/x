import React from 'react';
import styled from 'styled-components';

import { ReactComponent as RandomShape } from '../assets/images/random-shape.svg';

// theme
import { animation } from '../theme';

const Loading = () => (
  <Wrapper>
    <AnimatedShape />
  </Wrapper>
);

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const AnimatedShape = styled(RandomShape)`
  animation: ${animation.rotateAndPulse} 20s linear infinite;
`;

export default Loading;
