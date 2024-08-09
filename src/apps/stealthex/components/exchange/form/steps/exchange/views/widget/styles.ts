import qrcode from 'qrcode.react';
import styled from 'styled-components';

import {
    NotificationIcon,
    RoundedCheck,
    Support as SupportIcon,
} from '../../../../../../common/icons';
import GenericLoader from '../../../../../../common/loaders/simple-loader';

import DataBlock from '../../../common/widget/data-block';
import EmbedDividerLine from '../../../common/widget/divider-line';
import ExchangeData from '../../../common/widget/exchange-data';
import { device } from '../../../../../../../lib/styles/breakpoints';

export const Container = styled.article`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 330px;
`;

export const DividerLine = styled(EmbedDividerLine)`
  margin: 8px 0;

  @media ${device.mobileXL} {
    margin: 12px 0;
  }
`;

export const StyledExchangeData = styled(ExchangeData)`
  grid-column: 1 / 3;

  @media ${device.mobileXL} {
    grid-row: 3 / 4;
    grid-column: 1 / 2;

    & > svg {
      margin: 0;
      margin-left: 5px;
      margin-top: 5px;
    }
  }

  @media ${device.tablet} {
    flex-direction: column;

    & > svg {
      align-self: flex-start;
      transform: rotate(90deg);
    }
  }
`;

export const Content = styled.div`
  padding: 20px;
  padding-bottom: 0;
  background: #fff;

  display: grid;
  column-gap: 20px;
  grid-template-columns: 1fr 2fr;

  & > ${DividerLine}:nth-child(2n) {
    grid-column: 1 / 3;
  }

  @media ${device.mobileXL} {
    grid-template-columns: repeat(3, 1fr);
    justify-items: start;
    padding: 24px;

    & > ${DividerLine}:nth-child(2n) {
      grid-column: 1 / 4;
    }
  }

  @media ${device.tablet} {
    grid-template-columns: repeat(5, 1fr);

    & > ${DividerLine}:nth-child(2n) {
      grid-column: 1 / 6;
    }
  }
`;

export const StatusRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  grid-column: 1 / 3;

  @media ${device.mobileXL} {
    grid-column: 1 / 4;
    justify-self: stretch;
  }

  @media ${device.tablet} {
    grid-column: 1 / 6;
  }
`;

export const Status = styled.h1`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--nero);
  line-height: 1;

  @media ${device.mobileXL} {
    font-size: 24px;
  }
`;

export const LoaderWithTimer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Timer = styled.span`
  font-size: 14px;
  color: var(--dark-gray);
`;

export const Loader = styled(GenericLoader)``;

export const Footer = styled.footer`
  padding: 5px 24px;
  background: var(--nero);
  margin: 0;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const IdContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const IdLabel = styled.span`
  color: var(--medium-gray);
  font-size: 8px;
  font-weight: 700;

  @media ${device.mobileXL} {
    font-size: 10px;
  }
`;

export const Id = styled.span`
  color: #fcfcfc;
  font-size: 14px;
  font-weight: 700;

  @media ${device.mobileXL} {
    font-size: 16px;
  }
`;

export const StyledQRCode = styled(qrcode)`
  padding: 5px;
  border: 1px solid var(--light-gray);
  border-radius: 4px;

  width: 98px !important;
  height: 98px !important;

  grid-column: 1 / 2;

  @media ${device.mobileXL} {
    width: 116px !important;
    height: 116px !important;
  }

  @media ${device.tabletL} {
    width: 134px !important;
    height: 134px !important;
  }
`;

export const WaitingBlock = styled.div`
  grid-column: 1 / 3;
  width: 100%;

  display: grid;

  @media ${device.mobileXL} {
    grid-row: 3 / 4;
    grid-column: 2 / 5;
  }

  @media ${device.tablet} {
    grid-column: 2 / 6;
    grid-template-columns: auto 1fr;

    & > ${DividerLine} {
      display: none;
    }
  }
`;

export const WaitingContent = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: auto 1fr;

  @media ${device.mobileXL} {
    gap: 28px;
  }
`;

export const WaitingExtraContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;

  @media ${device.mobileXL} {
    flex-direction: row;
    justify-content: flex-start;
  }

  @media ${device.tablet} {
    flex-direction: column;
    gap: 8px;
    align-items: flex-end;
    justify-content: flex-end;
  }
`;

export const WaitingExtraRow = styled.div`
  display: flex;
  gap: 5px;
  align-items: baseline;
`;

export const WaitingExtraIdLabel = styled.span`
  color: var(--nero);
  font-size: 8px;
  font-weight: 700;

  @media ${device.mobileXL} {
    font-size: 10px;
  }
`;

export const WaitingExtraId = styled.span`
  display: inline-block;
  padding: 8px;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  background: var(--lynx-white);
  border-radius: 4px;

  @media ${device.mobileXL} {
    font-size: 16px;
  }
`;

export const StyledWarningIcon = styled(NotificationIcon)`
  flex-shrink: 0;
`;

export const Warning = styled.div`
  max-width: 110px;
  background: #ffefca;
  border-radius: 4px;
  color: #e7a000;
  font-size: 8px;
  font-weight: 700;
  padding: 6px;
  line-height: 1.3;

  display: flex;
  align-items: center;
  gap: 8px;

  @media ${device.mobileXL} {
    max-width: none;
    font-size: 10px;
    padding: 9px 12px;
  }
`;

export const WaitingBlockAddress = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;

  grid-column: 2 / 3;
`;

export const StyledCopyButton = styled.button`
  background: var(--brand-yellow);
  color: var(--nero);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 34px;
  width: 100%;
  max-width: 172px;
  border-radius: 8px;
  cursor: pointer;

  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;

  @media ${device.mobileXL} {
    font-size: 12px;
    height: 40px;
    gap: 10px;
  }

  @media (hover: hover) {
    transition: var(--transition-ease-in-out);
    transition-property: background-color, color;

    & > svg {
      transition: var(--transition-fill);
    }

    &:hover {
      background: var(--nero);
      color: var(--brand-yellow);

      & > svg {
        fill: var(--light-gray);
      }
    }
  }
`;

export const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;

  @media ${device.mobileXL} {
    & > ${DividerLine}:first-child, & > ${DividerLine}:last-child {
      display: none;
    }
  }
`;

export const AddressBlock = styled(InfoBlock)`
  grid-column: 1 / 3;
  grid-row: 4 / 5;

  @media ${device.mobileXL} {
    grid-column: 2 / 3;
    grid-row: 3 / 4;

    & > ${DividerLine}:first-child, & > ${DividerLine}:last-child {
      display: none;
    }
  }

  @media ${device.tablet} {
    grid-column: 2 / 4;
  }
`;

export const ExtraBlock = styled(InfoBlock)`
  grid-column: 1 / 3;
  grid-row: 5 / 7;

  @media ${device.mobileXL} {
    grid-column: 3 / 4;
    grid-row: 3 / 4;
  }

  @media ${device.tablet} {
    grid-column: 4 / 6;
  }
`;

export const Success = styled.div`
  width: 24px;
  height: 24px;
  background: var(--green);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledRoundedCheck = styled(RoundedCheck)``;

export const FailedBlock = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const FailedDescription = styled.p`
  margin: 0;
  padding: 0;

  font-size: 10px;
  line-height: 1.2;
  color: var(--dark-gray);

  @media ${device.mobileXL} {
    font-size: 12px;
  }
`;

export const SupportLink = styled.a`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const StyledSupportIcon = styled(SupportIcon)``;

export const Support = styled.span`
  font-weight: 700;
  font-size: 8px;
  color: var(--gray);

  @media ${device.mobileXL} {
    font-size: 10px;
  }
`;

export const Details = styled(DataBlock)`
  font-size: 12px;
  line-height: 1.2;

  @media ${device.mobileXL} {
    font-size: 16px;
  }
`;

export const SubmitTicketAnchor = styled.a`
  background: var(--brand-yellow);

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 48px;
  border-radius: 8px;
  margin-top: 8px;

  color: var(--nero);
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;

  @media (hover: hover) {
    transition: var(--transition-ease-in-out);
    transition-property: color, background;

    &:hover:not(:disabled) {
      background: var(--black);
      color: var(--brand-yellow);
    }
  }

  @media ${device.mobileXL} {
    font-size: 16px;
    letter-spacing: 2px;

    border-radius: 12px;

    height: 68px;
    margin-top: 22px;
  }
`;
