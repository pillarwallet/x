import styled from 'styled-components';




import Block from './common/block';
import Id from './common/id';
import { device } from '../../../../../../../lib/styles/breakpoints';
import MainButton from '../../../../../../common/main-button/main-button';

export const Container = styled.div`
  position: relative;
`;

export const ButtonsBlock = styled(Block)`
  padding-top: 0;
`;

export const FailedBlock = styled(Block)`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media ${device.tablet} {
    gap: 32px;
  }

  @media ${device.tabletL} {
    gap: 40px;
  }
`;

export const FailedMessage = styled.div``;

export const FailedHeading = styled.h2`
  margin: 0;
  font-weight: bold;
  font-size: 28px;
  color: var(--nero);

  @media (max-width: 934px) {
    font-size: 24px;
  }
`;

export const FailedText = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 1.4;
  color: var(--dark-gray);

  @media (max-width: 934px) {
    font-size: 14px;
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;

  @media (max-width: 767px) {
    flex-direction: column;
  }
`;

export const LeaveReviewButton = styled.a`
  display: flex;
  align-items: center;
  margin-right: 20px;
  background: #fde937;
  border-radius: 12px;
  padding: 0 60px;
  height: 68px;
  transition: var(--transition-background);

  & > span {
    font-weight: 700;
    font-size: 16px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #1e1e1e;
  }

  &:hover {
    background: #ffcf27;
    transition: var(--transition-background);
  }

  @media (max-width: 1200px) {
    padding: 0 40px;
    height: 50px;
    margin-right: 12px;
    border-radius: 8px;

    & > span {
      font-size: 14px;
    }
  }

  @media (max-width: 767px) {
    padding: 0;
    justify-content: center;
    margin-right: 0;
    margin-bottom: 12px;
  }
`;

export const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: -6px;
  padding-right: 17px;
`;

export const NewExchangeReview = styled(MainButton)`
  & > a {
    padding: 33px 40px;
    background: #fff;
    border: 1px solid #dadada;
    box-shadow: 0px 0px 32px rgba(0, 0, 0, 0.06);

    > span {
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 140%;
      text-transform: none;
    }

    &:hover {
      border: 1px solid #2b2b2b;
      background: #fff;
      border-radius: 8px;
      color: #2b2b2b;
    }

    @media (max-width: 1200px) {
      padding: 14px 40px;
      border-radius: 8px;
    }

    @media (max-width: 767px) {
      padding: 0;
      border-radius: 8px;
    }
  }
`;

export const NewExchangeButton = styled(MainButton)`
  width: 375px;

  @media (max-width: 1050px) {
    width: 329px;
  }

  @media (max-width: 767px) {
    width: 100%;
  }
`;

export const SupportContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-bottom: 16px;

  @media ${device.tablet} {
    position: absolute;
    transform: none;
    left: auto;
    bottom: 32px;
    right: 40px;
    padding: 0;
  }
`;

export const Support = styled.a`
  font-size: 12px;

  color: var(--dark-gray);
  border-bottom: 1px dashed var(--dark-gray);

  @media (hover: hover) {
    &:hover {
      border-bottom: 1px dashed #fff;
    }
  }

  @media ${device.tablet} {
    font-size: 14px;
  }
`;

export const SubmitTicketAnchor = styled.a`
  align-self: flex-start;

  border-radius: 8px;

  background: var(--brand-yellow);

  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 48px;
  padding: 0 40px;
  color: var(--nero);
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;

  @media (hover: hover) {
    transition: var(--transition-background);
    transition-property: color, background;

    &:hover:not(:disabled) {
      background: var(--black);
      color: var(--brand-yellow);
    }
  }

  @media ${device.tablet} {
    width: auto;
  }

  @media ${device.tabletL} {
    font-size: 16px;
    letter-spacing: 2px;

    border-radius: 12px;

    height: 60px;
    padding: 0 60px;
  }
`;

export const FailedId = styled(Id)`
  margin-bottom: 0;
`;
