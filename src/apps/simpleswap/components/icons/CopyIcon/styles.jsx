import styled from 'styled-components';

export const Tooltip = styled.div`
  display: none;
  position: absolute;
  width: 40px;
  height: 19px;
  padding: 4px;
  top: -26px;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ $hoverBackground }) => $hoverBackground};
  border-radius: 4px;
  color: #ffffff;
  font-weight: 600;
  font-size: 9px;
  line-height: 11px;
`;

export const Container = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  position: relative;
  background-color: ${({ $background }) => $background};

  path {
    stroke: ${({ $color }) => $color};
  }

  ${({ $isActive }) => {
    if ($isActive) {
      return `${Tooltip} {
     display: block;
     }`;
    }
    return '';
  }}

  &:hover {
    background-color: ${({ $hoverBackground }) => $hoverBackground};

    path {
      stroke: ${({ $hoverColor }) => $hoverColor};
    }
  }
`;

export const TriangleIcon = styled.div`
  width: 12px;
  height: 6px;
  position: absolute;

  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
`;
