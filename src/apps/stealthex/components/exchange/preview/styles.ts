import styled, { css } from 'styled-components';
import { device } from '../../../lib/styles/breakpoints';
import MainButton from '../../common/main-button/main-button';
import { WidgetBy } from '../../common/icons';


export const WidgetTitle = styled.h1`
  color: var(--nero);
  font-size: 20px;
  line-height: 24px;
  width: 100%;
  text-align: center;
  font-weight: 700;
  margin: 0;

  @media ${device.mobileXL} {
    font-size: 32px;
    line-height: 40px;
    font-weight: 600;
  }
`;

export const StyledExchange = styled.div`
  display: flex;
  flex-direction: column;
  align-items: baseline;
  padding: 0px 40px 40px;
  box-shadow: 0px 5px 30px rgba(196, 196, 196, 0.3);
  border-radius: 12px;
  background: #fff;

  @media (max-width: 1200px) {
    padding: 0px 40px 40px; 
  }

  @media (max-width: 767px) {
    padding: 0px 16px 16px;
  }
`;

export const WidgetStyledExchange = styled(StyledExchange)`
  box-shadow: 0px 5px 30px rgba(196, 196, 196, 0.3);
  padding: 20px 20px 42px;
  position: relative;
  overflow: auto;
  width: 90vw;

  @media (max-width: 680px) {
    width: 100%;
  }

  @media ${device.mobileXL} {
    padding: 45px 24px;

    & > *:nth-child(2) {
      padding: 40px 0;
    }
  }

  @media ${device.tablet} {
    padding: 45px 42px;
  }
`;

type ExchangeButtonProps = {
    widget?: 'true';
};

export const ExchangeButton = styled(MainButton) <ExchangeButtonProps>`
  ${(props) =>
        props.widget &&
        css`
      margin-top: 32px;
      width: 100%;

      & > button {
        height: 48px;
        border-radius: 12px;
      }

      & > button,
      & span {
        font-size: 14px;
      }

      @media ${device.mobileXL} {
        max-width: 293px;
        margin: 0;

        & > button {
          height: 60px;
        }

        & > button,
        & span {
          font-size: 16px;
        }
      }
    `}

  ${(props) =>
        !props.widget &&
        css`
      min-width: 219px;
      white-space: nowrap;

      a {
        min-width: 100%;
      }

      span {
        min-width: 137px;
      }

      @media (max-width: 767px) {
        width: auto;
        margin-left: 0;
      }

      @media (max-width: 478px) {
        width: 100%;
        margin-left: 0;
      }

      @media (min-width: 1200px) {
        min-width: 293px;
      }

      @media (max-width: 767px) {
        width: 222px;
      }

      @media (max-width: 767px) {
        padding-top: 32px;
      }

      @media (max-width: 415px) {
        width: 100%;
      }
    `}
`;

type ExchangeExtraProps = {
    widget?: 'true';
};

export const ExchangeExtra = styled.div<ExchangeExtraProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: relative;

  ${(props) =>
        props.widget &&
        css`
      @media (min-width: 1200px) {
        margin-top: 13px;
      }
    `}
`;

export const WidgetByLink = styled.a`
  position: absolute;
  bottom: 12px;
  right: 12px;
  display: flex;

  @media ${device.mobileXL} {
    bottom: 16px;
    right: 16px;
  }
`;

export const StyledWidgetBy = styled(WidgetBy)``;
