import styled from 'styled-components';

// images
import { ReactComponent as RandomShape } from '../assets/images/random-shape.svg';

// theme
import { animation } from '../theme';


const AnimatedShape = styled(RandomShape)`
  animation: ${animation.rotateAndPulse} 20s linear infinite;
  max-width: 100%;
  user-select: none;
`;

export default AnimatedShape;
