import styled, { keyframes } from 'styled-components';

const loading = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const StyledLoader = styled.div<{width: string | number, height: string | number}>`
  box-sizing: border-box;
  display: block;
  border: 4px solid #fff;
  width: ${(props) => (props.width ? `${props.width}px` : '20px')};
  height: ${(props) => (props.height ? `${props.height}px` : '20px')};
  margin: auto;
  border-radius: 50px;
  -o-border-radius: 50%;
  -ms-border-radius: 50%;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  animation: ${loading} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: ${({ color }) => color || 'var(--brand-yellow)'} transparent
    transparent transparent;

  &:nth-child(1) {
    animation-delay: -0.45s;
  }
  &:nth-child(2) {
    animation-delay: -0.3s;
  }
  &:nth-child(3) {
    animation-delay: -0.15s;
  }
`;

const LegacyLoader = ({ ...props }: {className: string, color: string, width: number | string, height: number | string}) => {
  const { className, color, width, height } = props;

  return (
    <StyledLoader
      className={className}
      color={color}
      width={width}
      height={height}
    />
  );
};

export default LegacyLoader;
