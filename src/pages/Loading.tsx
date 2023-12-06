import React from 'react';
import styled from 'styled-components';

// images
import randomShapeImage from '../assets/images/random-shape.png';

// theme
import { animation } from '../theme';

const Loading = () => (
  <Wrapper>
    <AnimatedShape src={randomShapeImage} alt="random shape" />
  </Wrapper>
);

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const AnimatedShape = styled.img`
  animation: ${animation.rotateAndPulse} 20s linear infinite;
  max-width: 100%;
  user-select: none;
`;

export default Loading;
