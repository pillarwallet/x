import styled from 'styled-components';

export const Container = styled.div`
  font-family: 'Inter';
  font-style: normal;
  width: 100%;
  padding: 12px 34px 12px 40px;
  position: relative;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: ${({ $color }) => $color};
  background-color: ${({ $background }) => $background};
  border-top: 7px solid ${({ $color }) => $color};
  border-radius: 8px;
  margin-bottom: 8px;

  @media (min-width: 350px) {
    padding: 16px 38px 16px 44px;
  }
`;

export const TooltipIconContainer = styled.div`
  position: absolute;
  width: 24px;
  height: 24px;
  top: 8px;
  left: 8px;

  @media (min-width: 350px) {
    top: 12px;
    left: 12px;
  }
`;

export const CloseIconContainer = styled.div`
  position: absolute;
  top: 11px;
  right: 11px;
  width: 18px;
  height: 18px;

  @media (min-width: 350px) {
    top: 16px;
    right: 16px;
  }
`;
