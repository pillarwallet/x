import styled from 'styled-components';

export const Tooltip = styled.div`
  padding: 8px 12px;
  background: #ffffff;
  box-shadow: 0px 0px 7px rgba(38, 54, 84, 0.1);
  border-radius: 3px;
  z-index: 12312;

  font-family: Roboto, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  color: #7d7e8d;
`;

export const NewTooltip = styled.div`
  position: relative;
  padding: 4px;
  background: #252c44;
  border-radius: 4px;
  font-family: Inter, sans-serif;
  font-feature-settings: 'calt' off;
  font-weight: 500;
  font-size: 9px;
  line-height: 120%;
  color: #ffffff;
`;

export const MemoTooltip = styled.div`
  position: relative;
  padding: 12px 16px;
  background: #252c44;
  border-radius: 8px;
  font-family: Inter, sans-serif;
  font-feature-settings: 'calt' off;
  font-weight: 400;
  font-size: 14px;
  line-height: 140%;
  color: #ffffff;
  width: 288px;
`;

export const FixedTooltip = styled.div`
  position: relative;
  background: ${({ theme }) => theme.text1};
  color: ${({ theme }) => theme.tooltipText};
  width: calc(100vw - 32px);
  z-index: 23232;
  padding: 8px 12px;
  background: ${({ theme }) => theme.text1};
  color: ${({ theme }) => theme.tooltipText};
  border-radius: 8px;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%;
  word-wrap: anywhere;

  @media (min-width: 350px) {
    width: calc(100vw - 60px);
    padding: 16px 24px;
    left: -16px !important;
  }

  @media (min-width: 470px) {
    width: calc(100vw - 80px);
    padding: 16px 24px;
  }
`;

export const Triangle = styled.div`
  height: 10px;
  width: 10px;
  position: absolute;
  bottom: -4px;
  left: calc(50% - 5px);
  clip-path: polygon(0% 0%, 100% 100%, 0% 100%);
  transform: rotate(-45deg);
  border-radius: 0 0 0 3px;
  background: #252c44;
`;

export const TopTriangle = styled.div`
  height: 10px;
  width: 10px;
  position: absolute;
  top: -4px;
  left: ${({ $offset }) => ($offset ? `${$offset}px` : 'calc(50% - 5px)')};
  clip-path: polygon(0% 0%, 100% 100%, 0% 100%);
  transform: rotate(135deg);
  border-radius: 0 0 0 2px;
  background: ${({ theme }) => theme.text1};

  @media (min-width: 350px) {
    ${({ $offsetMedium }) => ($offsetMedium ? `left: ${$offsetMedium}px` : '')};
  }

  @media (min-width: 470px) {
    ${({ $offsetLarge }) => ($offsetLarge ? `left: ${$offsetLarge}px` : '')};
  }
`;

export const TopCenterTriangle = styled.div`
  height: 10px;
  width: 10px;
  position: absolute;
  top: -4px;
  left: calc(50% - 5px);
  clip-path: polygon(0% 0%, 100% 100%, 0% 100%);
  transform: rotate(135deg);
  border-radius: 0 0 0 2px;
  background: #252c44;
`;

export const LeftCenterTriangle = styled.div`
  height: 10px;
  width: 10px;
  position: absolute;
  top: calc(50% - 5px);
  left: -4px;
  clip-path: polygon(0% 0%, 100% 100%, 0% 100%);
  transform: rotate(45deg);
  border-radius: 0 0 0 2px;
  background: #252c44;
`;
