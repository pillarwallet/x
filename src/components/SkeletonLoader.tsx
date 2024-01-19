import styled from 'styled-components';

// theme
import { animation } from '../theme';

const SkeletonLoader = styled.div<{ $height?: string; $width?: string; $radius?: string; }>`
  height: ${({ $height }) => $height || '100%'};
  width: ${({ $width }) => $width || '100%'};
  animation: ${animation.skeleton} 1s linear infinite alternate;
  border-radius: ${({ $radius }) => $radius || '8px'};
`;

export default SkeletonLoader;
