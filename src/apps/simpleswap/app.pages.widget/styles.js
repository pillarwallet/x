/* eslint-disable no-nested-ternary */
import styled from 'styled-components';

export const Wrapper = styled.div`
  overflow: hidden;
  font-family: Inter;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${({ theme }) => theme.background};
  border-radius: 16px;
  padding:  16px 16px 64px;
  border: ${({ theme }) => (theme.value === 'white' ? '1px solid #C6D5EA' : 'initial')};
  --rt-opacity: 1;

  #confirmationsTooltip,
  #amountToTooltip,
  #amountFromTooltip {
    background: ${({ theme }) => theme.text1};
    color: ${({ theme }) => theme.tooltipText};
    max-width: 233px;
    text-align: center;
    font-size: 12px;
    border-radius: 8px;
    z-index: 10;
  }

  .questionIcon:hover {
    path {
      fill: ${({ theme }) => theme.text1};
      stroke: ${({ theme }) => theme.tooltipText};
    }
  }

  @media (min-width: 350px) {
    padding: 24px 24px 88px;
    border-radius: 24px;
  }

  @media (min-width: 470px) {
    padding: 32px 32px 80px;
    border-radius: 32px;
  }
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: flex-start;
`;

export const LogoButton = styled.a`
  height: 18px;
  cursor: pointer;
  width: 20px;
  overflow: hidden;

  svg {
    width: 85px;
  }

  @media (min-width: 350px) {
    height: 24px;
    width: 125px;
    svg {
      width: 100%;
    }
  }
`;

export const PartnerLogoButton = styled.a`
  height: 28px;
  cursor: pointer;
`;

export const StepTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: ${({ theme, $step }) => ($step === 7 ? '#3FBB7D' : theme.text1)};
  text-align: center;

  span {
    margin-left: 4px;
    margin-right: 4px;
    color: ${({ theme, $step }) =>
      $step === 'Refunded'
        ? '#23B3F2'
        : $step === 'Failed'
        ? '#E15D56'
        : $step === 'Verifying'
        ? '#EE9500'
        : theme.text1};
  }

  @media (min-width: 350px) {
    font-size: 16px;
    line-height: 140%;
  }
`;

export const CenterTitle = styled.div`
  margin-top: auto;
  font-size: 20px;
  line-height: 28px;
  color: ${({ theme }) => theme.text1};
  text-align: center;

  @media (min-width: 350px) {
    font-size: 24px;
    line-height: 34px;
  }
`;

export const CenterSubTitle = styled.div`
  margin-top: 14px;
  margin-bottom: auto;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.text3};
  text-align: center;

  @media (min-width: 350px) {
    font-size: 14px;
    line-height: 20px;
    white-space: pre;
  }
`;

export const StepSubTitle = styled.div`
  font-size: 10px;
  line-height: 12px;
  cursor: pointer;
  color: ${({ theme }) => theme.text3};
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  width: fit-content;
  margin-right: auto;
  margin-left: auto;

  @media (min-width: 350px) {
    font-size: 12px;
    line-height: 16px;
  }
`;

export const NewExchangeButton = styled.div`
  height: 48px;
  width: 100%;
  background: ${({ theme }) => theme.buttonBackground};
  border: none;
  outline: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 130%;
  color: ${({ theme }) => theme.buttonText};
  margin: auto auto 11px;

  &:hover {
    cursor: pointer;
    color: #ffffff;
    background: ${({ theme }) => theme.buttonHoverBackground};

    path {
      stroke: #ffffff;
    }
  }

  &:disabled {
    cursor: initial;
    opacity: 0.3;
    background: ${({ theme }) => theme.buttonBackground};
  }

  @media (min-width: 350px) {
    height: 56px;
    font-size: 14px;
    line-height: 20px;
    margin: auto auto 16px;
  }
`;

export const BottomContainer = styled.div`
  margin-top: auto;
`;

export const MainButton = styled.button`
  height: 48px;
  width: 100%;
  background: ${({ theme }) => theme.buttonBackground};
  border: none;
  outline: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.buttonText};
  margin-top: 8px;

  &:hover {
    cursor: pointer;
    background: #004ad9;
  }

  &:disabled {
    cursor: initial;
    opacity: 0.3;
    background: ${({ theme }) => theme.buttonBackground};
  }

  @media (min-width: 350px) {
    margin-top: 12px;
    font-size: 15px;
    line-height: 21px;
    height: 56px;
  }
`;

export const GoBackButton = styled.div`
  width: 20px;
  height: 20px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.goBackBackground};
  border-radius: 3px;

  &:hover {
    background-color: #004ad9;
    path {
      stroke: #ffffff;
    }
  }

  path {
    stroke: ${({ theme }) => theme.searchIcon};
  }

  @media (min-width: 350px) {
    width: 24px;
    height: 24px;
  }
`;

export const StepHeader = styled.div`
  margin-bottom: 12px;
  margin-top: 16px;

  @media (min-width: 350px) {
    margin-bottom: 8px;
    margin-top: 12px;
  }

  @media (min-width: 470px) {
    margin-top: 16px;
    //margin-bottom: 16px;
  }
`;

export const TooltipContainer = styled.div`
  position: relative;
  margin-left: 4px;
  width: 14px;
  height: 14px;
  display: inline-block;
  & > * {
    width: 14px;
    height: 14px;
  }
`;
