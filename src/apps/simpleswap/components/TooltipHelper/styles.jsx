import styled from 'styled-components';

export const Tooltip = styled.div`
  z-index: 1;
  position: absolute;
  max-width: 226px;
  width: max-content;
  padding: 8px 12px;
  ${({ $direction }) => $direction}: 0;
  top: 50%;
  transform: translateY(-50%)
    translateX(
      calc(
        ${({ $direction }) => ($direction === 'left' ? '-' : '')}100%
          ${({ $direction }) => ($direction === 'left' ? '-' : '+')} 9px
      )
    );
  background: ${({ $color }) => $color};
  border-radius: 8px;
  color: ${({ $textColor }) => $textColor};
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
`;

export const Container = styled.div`
  width: ${({ $size }) => $size || '30px'};
  height: 30px;
  position: relative;
  display: flex;
  align-items: center;

  svg {
    width: ${({ $size }) => $size || '24px'};
  }

  &:not(:hover) {
    ${Tooltip} {
      display: none;
    }
  }
`;

export const TriangleIcon = styled.div`
width: 24px;
height: 14px;
margin-${({ $direction }) => $direction}: -4px;
  position: absolute;
  ${({ $direction }) => $direction}: 97%;
  top: 50%;
  transform: translateY(-50%)  rotate(${({ $direction }) =>
    $direction === 'right' ? '90' : '-90'}deg);
`;
