import styled, { keyframes } from 'styled-components';

import { LoaderSvg } from '../icons';

const loadingAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const SimpleLoader = styled(LoaderSvg)`
  animation: ${loadingAnimation} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
`;

export default SimpleLoader;
