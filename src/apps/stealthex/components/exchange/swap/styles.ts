import styled, { css, keyframes } from 'styled-components';

import {
    NewSwapMobile,
    Pointer,
    SwapArrow,
} from '../../../components/common/icons';
import { device } from '../../../lib/styles/breakpoints';

const rotateSwapIcon = keyframes`
  0% {
    transform: rotate(0deg);
  }

  50% {
    transform: rotate(179deg)
  }

  75% {
    transform: rotate(160deg)
  }

  100% {
    transform: rotate(180deg);
  }
`;

type ContainerProps = {
    preserveSpace?: boolean;
    widget?: 'true';
};

const dynamicContainerStyles = css`
  flex-direction: column;
  align-items: stretch;

  & > * + * {
    margin-left: 0;
    margin-top: 8px;
  }
`;

export const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;

  & > * + * {
    margin-left: 16px;
  }

  ${(props) =>
        !props.preserveSpace &&
        css`
      padding: 32px 0 30px;
      @media only screen and (max-width: 1200px) {
        padding: 34px 0 38px;
      }

      @media only screen and (max-width: 933px) {
        padding: 45px 0 38px;
      }

      @media only screen and (max-width: 767px) {
        padding: 20px 0 0;
      }
    `}

  ${(props) =>
        props.widget &&
        css`
      @media (max-width: 679px) {
        ${dynamicContainerStyles}
      }
    `}

    ${(props) =>
        !props.widget &&
        css`
      @media (max-width: 767px) {
        ${dynamicContainerStyles}
      }
    `}
`;

export const PointerIconContainer = styled.div`
  flex-shrink: 0;
  margin-top: 5px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 767px) {
    align-self: flex-end;
    width: 32px;
    height: 32px;
  }

  @media ${device.laptopM} {
    margin-top: 10px;
  }
`;

export const PointerIcon = styled(Pointer)`
  transform: rotate(90deg);

  @media (min-width: 767px) {
    transform: none;
  }
`;

type SwapIconProps = {
    animate?: boolean;
};
export const SwapIcon = styled(SwapArrow) <SwapIconProps>`
  flex-shrink: 0;

  ${(props) =>
        props.animate &&
        css`
      animation: ${rotateSwapIcon} 0.5s ease-in-out;
    `}
`;
export const SwapIconMobile = styled(NewSwapMobile) <SwapIconProps>`
  flex-shrink: 0;
  display: none;

  ${(props) =>
        props.animate &&
        css`
      animation: ${rotateSwapIcon} 0.5s ease-in-out;
    `}
`;

const dynamicSwapButtonStyles = css`
  align-self: flex-end;
  width: 32px;
  height: 32px;

  ${SwapIconMobile} {
    display: block;
  }

  ${SwapIcon} {
    display: none;
  }
`;

export const SwapButton = styled.button<{ widget?: 'true' }>`
  width: 40px;
  height: 40px;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px dashed var(--gray);
  background: transparent;
  cursor: pointer;
  transition: var(--transition-ease-in-out);
  transition-property: background, border;

  flex-shrink: 0;

  &:hover {
    border: 1px solid var(--brand-yellow);
    background: var(--brand-yellow);
  }

  ${(props) =>
        props.widget &&
        css`
      @media (max-width: 679px) {
        ${dynamicSwapButtonStyles}
      }
    `}

  ${(props) =>
        !props.widget &&
        css`
      @media (max-width: 767px) {
        ${dynamicSwapButtonStyles}
      }
    `}
`;

export const ErrorAction = styled.button`
  border: none;
  outline: none;
  background: none;
  font-weight: 700;
  color: inherit;
  cursor: pointer;
  border-bottom: 1px solid var(--red);
`;
