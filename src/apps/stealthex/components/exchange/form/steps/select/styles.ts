import styled, { css } from 'styled-components';

import { NotificationIcon } from '../../../../common/icons';
import { device } from '../../../../../lib/styles/breakpoints';

type AddresInputProps = {
    widget?: 'true';
    marginBottom?: 'true';
    viewwarning?: 'true';
};

export const AddressInputContainer = styled.div<AddresInputProps>`
  position: relative;
  height: 60px;
  background: var(--light-gray);
  border-radius: ${(props) => (props.viewwarning ? '12px' : '12px 12px 0 0')};
  outline: none;
  width: 100%;
  cursor: pointer;

  @media ${device.tablet} {
    margin-bottom: ${(props) =>
        !props.marginBottom || props.viewwarning ? '0' : '26px'};
  }

  @media ${device.laptopM} {
    margin-bottom: ${(props) =>
        !props.marginBottom || props.viewwarning ? '0' : '40px'};
  }

  ${(props) =>
        !props.widget &&
        css`
      @media (max-width: 1200px) {
        height: 50px;
      }
    `}

  ${(props) =>
        props.widget &&
        css`
      @media (max-width: 679px) {
        height: 48px;
        border-radius: 8px;
      }
    `}
`;

export const NotificationContainer = styled.div``;

export const NotificationAddress = styled.span`
  position: absolute;
  transform: translateY(100%);
  width: 100%;
  display: flex;
  align-items: center;
  padding: 5.5px 8px;
  background: #ffefca;
  border-radius: 0 0 4px 4px;
  bottom: 0;
  cursor: initial;

  @media ${device.laptopM} {
    padding: 9px 12px;
  }
`;

export const StyledNotificationIcon = styled(NotificationIcon)`
  width: 15px;
  height: 15px;
  margin-right: 10px;
`;

export const NotificationText = styled.p`
  margin: 0;
  font-weight: 700;
  font-size: 10px;
  color: var(--warning-yellow);

  @media (max-width: 934px) {
    font-size: 8px;
  }
`;

export const LabelInput = styled.label<AddresInputProps>`
  position: absolute;
  top: 23px;
  padding-left: 12px;
  font-weight: bold;
  font-size: 14px;
  line-height: 17px;
  color: var(--gray);
  transition-duration: var(--transition-ease-in-out);

  ${(props) =>
        !props.widget &&
        css`
      @media (max-width: 1200px) {
        top: 19px;
        font-size: 12px;
        line-height: 15px;
      }

      @media (max-width: 767px) {
        padding-left: 6px;
      }
    `}

  ${(props) =>
        props.widget &&
        css`
      @media (max-width: 679px) {
        top: 16px;
        font-size: 12px;
      }
    `}
`;

export const AddressInput = styled.input<AddresInputProps>`
  position: absolute;
  padding-top: 20px;
  height: 100%;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  background: transparent;
  text-indent: 12px;
  border: none;
  outline: none;
  width: 100%;
  margin: 0;
  z-index: 1;

  ${(props) =>
        !props.widget &&
        css`
      @media (max-width: 1200px) {
        padding-top: 10px;
      }
    `}

  ${(props) =>
        props.widget &&
        css`
      @media (max-width: 679px) {
        padding-top: 14px;
      }
    `}

  &:focus + label,
  &:active + label,
  &:not(:focus):valid ~ label {
    top: 13px;
    padding-left: 14px;
    font-weight: 600;
    transition-duration: var(--transition-ease-in-out);
    font-size: 11px;
    line-height: 13px;
    z-index: 0;

    @media (max-width: 1200px) {
      top: 9px;
    }

    @media (max-width: 940px) {
      font-size: 8px;
      line-height: 10px;
    }
  }

  &::-ms-value {
    background-color: red;
  }

  &::placeholder {
    position: absolute;
    top: 25px;
    color: var(--gray);
    z-index: 0;
  }
`;

export const AddressError = styled.p<AddresInputProps>`
  display: flex;
  align-items: center;
  position: absolute;
  bottom: -39px;
  font-weight: bold;
  font-size: 10px;
  line-height: 12px;
  color: #dd2929;
  padding: 14px 0 16px 10px;
  border-top: 2px solid #dd2929;
  width: 100%;
  z-index: 2;
  opacity: 0.8;
  cursor: initial;
  background: linear-gradient(
    180deg,
    rgba(255, 233, 233, 1) 0%,
    rgba(255, 252, 252, 1) 100%
  );
  border-radius: 0px 0px 4px 4px;

  ${(props) =>
        !props.widget &&
        css`
      @media (max-width: 1200px) {
        bottom: 0;
        top: 48px;
      }
      @media (max-width: 767px) {
        top: 48px;
      }
    `}
`;
