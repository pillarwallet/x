import styled, { css } from 'styled-components';

import { Lock, UnLock } from '../../../common/icons/index';
import MainButton from '../../../common/main-button/main-button';


type TooltipBackgroundSectionProps = {
  active?: 'true';
  widget?: 'true';
};

export const TooltipBackgroundSection = styled.div<TooltipBackgroundSectionProps>`
  position: fixed;
  top: 0;
  left: 0;
  display: ${(props) => (props.active ? 'block' : 'none')};
  width: 100%;
  height: 100%;
  background: var(--nero);
  opacity: 0.2;
  z-index: 2;

  @media (min-width: 934px) {
    display: ${(props) => (props.active ? 'block' : 'none')};
  }

  ${(props) =>
    props.widget &&
    css<TooltipBackgroundSectionProps>`
      @media (min-width: 934px) {
        display: ${(props) => (props.active ? 'block' : 'none')};
      }
    `}

  ${(props) =>
    !props.widget &&
    css`
      @media (min-width: 934px) {
        display: none;
      }
    `}
`;

export const TooltipBtn = styled(MainButton)`
  display: block;
  margin: 0;
  width: auto;
  height: 32px;
  font-size: 12px;
  line-height: 20px;
  margin-top: 20px;
  border-radius: 8px;

  & > button {
    height: 32px;
  }

  ${(props) =>
    !props.widget &&
    css`
      @media (min-width: 934px) {
        display: none;
      }
    `}

  ${(props) =>
    props.widget &&
    css`
      @media (min-width: 934px) {
        & > button {
          & > span {
            font-size: 14px;
          }
        }
      }
    `}
`;

const dynamicDivTooltipAfterStyles = css`
  bottom: 40%;
  left: -5%;
  transform: rotate(90deg);
`;

const dynamicDivTooltipSmallStyles = css`
  top: -76px;
  left: 40px;
`;

const dynamicDivTooltipSmallSiteStyles = css`
  top: -75px;
  left: 50px;
`;

type DivTooltipProps = {
  active?: 'true';
  widget?: 'true';
};

export const DivTooltip = styled.div<DivTooltipProps>`
  display: ${(props) => (props.active ? 'block' : 'none')};
  position: absolute;
  top: -69px;
  left: -267px;
  width: 246px;
  height: 174px;
  background-color: #fff;
  box-shadow: 0px 0px 32px rgba(196, 196, 196, 0.3);
  border-radius: 8px;
  z-index: 999999;

  &::after {
    content: '';
    position: absolute;
    bottom: 40%;
    left: 106%;
    margin-left: -15px;
    border-width: 15px;
    border-style: solid;
    border-color: #fff transparent transparent transparent;
    transform: rotate(270deg);

    ${(props) =>
      !props.widget &&
      css`
        @media (min-width: 934px) {
          bottom: 100%;
          left: 50%;
          transform: rotate(180deg);
        }
      `}

    ${(props) =>
      props.widget &&
      css`
        @media (max-width: 679px) {
          ${dynamicDivTooltipAfterStyles};
        }
      `}

    ${(props) =>
      !props.widget &&
      css`
        @media (max-width: 767px) {
          ${dynamicDivTooltipAfterStyles};
        }
      `}
  }

  ${(props) =>
    props.widget &&
    css<DivTooltipProps>`
      @media (min-width: 934px) {
        display: ${(props) => (props.active ? 'block' : 'none')};
      }
    `}

  ${(props) =>
    !props.widget &&
    css`
      @media (min-width: 934px) {
        display: none;
        left: -121px;
        width: 274px;
        top: 56px;
      }
    `}

  @media (min-width: 1200px) {
    left: -117px;
    width: 274px;
    top: 66px;
  }

  ${(props) =>
    props.widget &&
    css`
      @media (max-width: 679px) {
        ${dynamicDivTooltipSmallStyles};
      }
    `}

  ${(props) =>
    !props.widget &&
    css`
      @media (max-width: 767px) {
        ${dynamicDivTooltipSmallSiteStyles};
      }
    `}

    ${(props) =>
    props.widget &&
    css`
      @media (max-width: 461px) {
        ${dynamicDivTooltipSmallStyles};
      }
    `}

  ${(props) =>
    !props.widget &&
    css`
      @media (max-width: 461px) {
        ${dynamicDivTooltipSmallSiteStyles};
      }
    `}
`;

export const TooltipContent = styled.div`
  padding: 0 12px;
`;

type TitleProps = {
  widget?: 'true';
};

export const Title = styled.h2<TitleProps>`
  font-weight: bold;
  font-size: 12px;
  line-height: 15px;
  padding: 12px 0 4px 0;
  margin: 0;

  ${(props) =>
    !props.widget &&
    css`
      @media (min-width: 934px) {
        font-size: 14px;
        line-height: 16px;
        padding: 0;
        margin: 12px 0;
      }
    `}
`;

type TextProps = {
  widget?: 'true';
};

export const Text = styled.p<TextProps>`
  font-size: 10px;
  line-height: 12px;
  margin: 0;

  ${(props) =>
    !props.widget &&
    css`
      @media (min-width: 934px) {
        font-size: 14px;
        line-height: 16px;
        margin-bottom: 14px;
      }
    `}
`;

export const LockCont = styled.div`
  line-height: 1;
`;

export const LockInput = styled(Lock)<{ widget?: 'true' }>`
  &.active {
    fill: var(--black);
  }

  ${(props) =>
    !props.widget &&
    css`
      @media (max-width: 934px) {
        height: 16px;
      }
    `}

  ${(props) =>
    props.widget &&
    css`
      @media (max-width: 679px) {
        height: 12px;
      }
    `}

  ${(props) =>
    !props.widget &&
    css`
      @media (max-width: 767px) {
        height: 12px;
      }
    `}
`;

export const UnLockInput = styled(UnLock)<{ widget?: 'true' }>`
  cursor: pointer;

  &:hover {
    fill: var(--black);
  }

  ${(props) =>
    !props.widget &&
    css`
      @media (max-width: 934px) {
        height: 16px;
      }
    `}

  ${(props) =>
    props.widget &&
    css`
      @media (max-width: 679px) {
        height: 12px;
      }
    `}

  ${(props) =>
    !props.widget &&
    css`
      @media (max-width: 767px) {
        height: 12px;
      }
    `}
`;

const dynamicRateButtonStyles = css`
  border-radius: 50%;
  box-shadow: rgb(0 0 0 / 15%) 0px 0px 8px;
  width: 24px;
  height: 24px;
`;

export const RateButton = styled.div<{ widget?: 'true' }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: #fff;
  border-radius: 8px;

  @media (max-width: 1200px) {
    width: 32px;
    height: 32px;
  }

  ${(props) =>
    props.widget &&
    css`
      @media (max-width: 679px) {
        ${dynamicRateButtonStyles};
      }
    `}

  ${(props) =>
    !props.widget &&
    css`
      @media (max-width: 767px) {
        ${dynamicRateButtonStyles};
      }
    `}
`;

const dynamicTooltipNewStyles = css`
  width: 24px;
  height: 24px;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
`;

export const TooltipNew = styled.div<{ widget?: 'true' }>`
  cursor: pointer;
  position: relative;

  @media (max-width: 1200px) {
    width: 32px;
    height: 32px;
  }

  ${(props) =>
    props.widget &&
    css`
      @media (max-width: 679px) {
        ${dynamicTooltipNewStyles};
      }
    `}

  ${(props) =>
    !props.widget &&
    css`
      @media (min-width: 934px) {
        &:hover {
          ${DivTooltip} {
            display: block;
          }
        }
      }
      @media (max-width: 767px) {
        ${dynamicTooltipNewStyles};
      }
    `}
`;
