import styled from 'styled-components';

export const Tooltip = styled.div`
  position: absolute;
  padding: 10px 11px;
  right: 0;
  top: -118px;
  background: #ffffff;
  border: 1px solid #004ad9;
  border-radius: 8px;
  color: #ffffff;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
`;

export const Container = styled.div`
  width: 24px;
  height: 24px;
  position: relative;
  margin-top: 6px;

  &:not(:hover) {
    ${Tooltip} {
      display: none;
    }
  }
`;
