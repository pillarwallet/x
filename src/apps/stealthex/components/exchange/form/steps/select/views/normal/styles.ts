import * as RadioGroup from '@radix-ui/react-radio-group';
import styled from 'styled-components';


import MainButton from '../../../../../../common/main-button/main-button';
import { device } from '../../../../../../../lib/styles/breakpoints';

import { Block } from '../../../../styles';

export const Container = styled(Block)`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-top: 16px;
  padding-bottom: 16px;

  @media ${device.tablet} {
    padding-top: 32px;
    padding-bottom: 40px;
  }

  @media ${device.laptopM} {
    gap: 40px;
    padding-top: 40px;
    padding-bottom: 40px;
  }
`;

export const SelectBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const SelectBlockTitle = styled.span`
  font-size: 14px;
  line-height: 1;
  font-weight: 700;
`;

export const SelectBlockContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;

  @media ${device.tablet} {
    flex-direction: row;
    gap: 10px;
  }
`;

export const NextButton = styled(MainButton)`
  width: 100%;
  flex-shrink: 0;
  border-radius: 12px;

  & > button {
    height: 48px;
  }

  @media ${device.tablet} {
    width: 122px;
  }

  @media ${device.laptopM} {
    width: 155px;

    & > button {
      height: 60px;
    }
  }
`;

export const RefundAddressContainer = styled.div`
  margin-top: 12px;

  @media ${device.tabletL} {
    margin-top: 20px;
  }
`;

export const DesktopOnly = styled.div`
  margin-top: 15px;
  display: none;

  @media ${device.tablet} {
    margin-top: 8px;
    display: block;
  }

  @media ${device.laptopM} {
    margin-top: 0;
  }
`;

export const MobileOnly = styled.div`
  @media ${device.tablet} {
    display: none;
  }
`;

export const StyledRadioRoot = styled(RadioGroup.Root)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 11px;

  @media ${device.tablet} {
    gap: 15px;
    flex-direction: row;
  }
`;

export const PaymentOfferContainer = styled.div`
  flex: 0 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

  height: 60px;
  padding: 8px 12px;
  outline: 1px solid #edebeb;
  border-radius: 8px;
  cursor: pointer;

  &[data-state='error'] {
    opacity: 0.5;
    cursor: default;
  }

  &[data-state='checked'] {
    outline: 2px solid var(--brand-yellow);
  }

  @media ${device.tablet} {
    flex: 1 1 0;
  }

  @media ${device.tabletL} {
    height: 60px;
    padding: 10px 16px;
    border-radius: 12px;
  }
`;

export const PaymentOfferDescription = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media ${device.tabletL} {
    gap: 16px;
  }
`;

export const PaymentOfferLogo = styled.span`
  display: flex;
  max-width: 96px;

  @media ${device.tabletL} {
    max-width: none;
  }
`;

export const PaymentOfferStats = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  height: 100%;
  gap: 4px;

  @media ${device.tabletL} {
    gap: 8px;
  }
`;

export const PaymentOfferError = styled.span`
  color: var(--nero);
  font-weight: 700;
  font-size: 14px;
`;

export const PaymentOfferEstimate = styled.span`
  font-size: 12px;
  font-weight: 700;
  line-height: 15px;

  display: flex;
  flex-direction: column;
  align-items: flex-end;

  @media ${device.tabletL} {
    font-size: 14px;
    line-height: 17px;

    flex-direction: row;
    gap: 4px;
  }
`;

export const PaymentOfferPayments = styled.div`
  display: flex;
  gap: 8px;
`;

export const PaymentOfferPaymentLogo = styled.span`
  display: flex;

  img {
    max-height: 13px !important;
  }

  @media ${device.tablet} {
    img {
      max-height: none;
    }
  }
`;

export const StyledRadioItem = styled(RadioGroup.Item)`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #edebeb;
  display: flex;
  align-items: center;
  justify-content: center;

  &:not(:disabled) {
    cursor: pointer;
  }

  &[data-state='checked'] {
    border: 1px solid var(--brand-yellow);
    background: var(--brand-yellow);
  }
`;

export const StyledRadioIndicator = styled(RadioGroup.Indicator)`
  background: #fff;
  width: 8px;
  height: 8px;
  border-radius: 50%;
`;
