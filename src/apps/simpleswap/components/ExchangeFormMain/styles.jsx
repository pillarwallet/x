import styled from 'styled-components';

import swap from '../../icons/swap.svg';

export const Main = styled.div`
  position: relative;
  height: 100%;
  padding-top: 16px;

  @media (min-width: 350px) {
    padding-top: 20px;
  }
  @media (min-width: 470px) {
    padding-top: 24px;
  }
`;

export const Controls = styled.div`
  height: 48px;
  display: flex;
  justify-content: ${({ onlyFloating }) => (onlyFloating ? 'flex-end' : 'space-between')};
  align-items: center;
`;

export const FloatingButton = styled.div`
  width: 34px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FloatingText = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  line-height: 120%;
  color: ${({ isHover, theme }) => (isHover ? theme.rateTextHover : theme.text3)};
  margin-left: 4px;

  @media (min-width: 350px) {
    font-size: 12px;
    line-height: 16%;
    margin-left: 7px;
  }
`;

export const FloatingRow = styled.div`
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  cursor: ${({ $isDisabled }) => ($isDisabled ? 'initial' : 'pointer')};
  pointer-events: ${({ $tooltipIsShown }) => ($tooltipIsShown ? 'none' : 'auto')};
  :hover {
    ${FloatingText} {
      color: ${({ theme }) => theme.textLinkHover};
    }

    .lockIcon path {
      fill: white;
    }

    .triangleIcon > path,
    .triangleIcon circle {
      fill: #004ad9;
    }
  }
  @media (min-width: 350px) {
    margin-left: 16px;
  }
`;

export const SwapRow = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.background2};
  border-radius: 12px;
  cursor: pointer;
  transition: 0.2s;

  ${({ $isDisabled }) =>
    $isDisabled
      ? `
    pointer-events: none;
    opacity: 0.3;
  `
      : ''}

  &:hover {
    background: #004ad9;

    path {
      fill: #ffffff;
    }
  }

  @media (min-width: 1280px) {
    ${({ $isDesktopHorizontal }) => {
      if ($isDesktopHorizontal)
        return `margin: 16px 8px 0;
                transform: rotate(90deg);`;
      return '';
    }})
  }
`;

export const SwapIconContainer = styled.div`
  width: 24px;
  height: 24px;
  background-image: url(${swap});
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;

  &.animate {
    transform: rotate(180deg);
    transition: 0.5s;
  }

  @media (min-width: 350px) {
    width: 30px;
    height: 30px;
  }
`;

export const Button = styled.button`
  position: absolute;
  bottom: 0;
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

  &:hover {
    cursor: pointer;
    background: #004ad9;
    color: #ffffff;
  }

  &:disabled {
    cursor: initial;
    opacity: 0.3;
    background: ${({ theme }) => theme.buttonBackground};

    &:hover {
      color: ${({ theme }) => theme.buttonText};
    }
  }

  @media (min-width: 350px) {
    height: 56px;
    font-size: 15px;
  }
`;

export const AgreementsText = styled.p`
  margin: 24px auto 0 auto;
  color: ${({ theme }) => theme.text3};
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  line-height: 14px;
  width: fit-content;
  max-width: 180px;

  @media (min-width: 350px) {
    max-width: 230px;
    font-size: 12px;
    line-height: 16px;
  }

  @media (min-width: 470px) {
    max-width: unset;
    font-size: 11px;
  }
`;

export const AgreementsTextLink = styled.a`
  margin: 0;
  font-size: 10px;
  line-height: 12px;
  text-decoration: none;
  color: ${({ theme }) => theme.textLink};

  @media (min-width: 350px) {
    font-size: 12px;
    line-height: 16px;
  }

  @media (min-width: 470px) {
    font-size: 11px;
  }

  &:hover {
    text-decoration: underline;
    color: ${({ theme }) => theme.textLinkHover};
  }
`;

export const PopupRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;

  svg {
    margin-left: 0 !important;
    margin-right: 4px;
  }
`;

export const PopupHeader = styled.div`
  font-family: 'Inter';
  font-weight: 500;
  font-size: 14px;
  line-height: 120%;
`;

export const PopupText = styled.div`
  font-family: 'Inter';
  font-weight: 400;
  font-size: 14px;
  line-height: 140%;
  color: #859ab5;
  margin-bottom: ${({ $withMargin }) => ($withMargin ? '4px' : '')};

  @media (min-width: 1280px) {
    padding-right: 0;
  }
`;

export const PopupButton = styled.div`
  width: 100%;
  border-radius: 8px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter';
  font-weight: 400;
  font-size: 14px;
  line-height: 140%;
  color: #ffffff;
  margin-top: 4px;
  cursor: pointer;
  background: #0f75fc;
  :hover {
    background: #004ad9;
    color: #ffffff;
  }
`;

export const PopupClose = styled.div`
  width: 24px;
  height: 24px;
  position: absolute;
  top: 8px;
  right: 8px;
  cursor: pointer;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.closeIcon};
  svg {
    transform: scale(0.6);
  }
  svg path {
    stroke: ${({ theme }) => theme.closeIcon};
  }

  :hover {
    border: 1px solid ${({ theme }) => theme.hoverCloseIcon};
    svg path {
      stroke: ${({ theme }) => theme.hoverCloseIcon};
    }
  }
`;
