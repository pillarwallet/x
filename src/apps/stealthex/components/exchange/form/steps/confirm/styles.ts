import styled from 'styled-components';


import { Block as GenericBlock } from '../../styles';
import { device } from '../../../../../lib/styles/breakpoints';
import MainButton from '../../../../common/main-button/main-button';

export const Block = styled(GenericBlock)`
  padding-top: 20px;
  padding-bottom: 20px;

  @media ${device.tablet} {
    padding-top: 32px;
    padding-bottom: 32px;
  }
`;

export const FlexContainer = styled.div`
  display: flex;

  @media (max-width: 767px) {
    flex-direction: column;
  }
`;

export const BoxContainer = styled.div``;

export const BreakAllText = styled.span`
  visibility: hidden;
  position: absolute;
  background-color: var(--nero);
  top: 100%;
  left: 19%;
  margin-left: -60px;
  color: #fff;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 10px;
  line-height: 12px;
  text-align: center;
  padding: 8px;
  box-shadow: 0px 0px 32px rgba(196, 196, 196, 0.3);
  border-radius: 4px;
  z-index: 1;

  &.get-all_text {
    left: 14%;

    @media (max-width: 934px) {
      left: 27%;
    }

    @media (max-width: 767px) {
      left: 0%;
    }
  }

  @media (max-width: 934px) {
    left: 28%;
  }

  @media (max-width: 767px) {
    left: 0%;
    margin-left: 0px;
  }
`;

type AmountProps = {
    exceeds?: boolean;
};

export const Amount = styled.p<AmountProps>`
  position: relative;
  display: auto;
  flex-direction: auto;
  font-weight: bold;
  font-size: 30px;
  line-height: 20px;
  margin: 0 0 15px 0;
  padding-top: 10px;
  color: var(--black);

  @media (max-width: 934px) {
    font-size: 16px;
    margin-bottom: 5px;
    padding-top: 0px;
  }

  @media (max-width: 640px) {
    margin-bottom: 10px;
  }

  &:hover {
    ${BreakAllText} {
      visibility: ${({ exceeds }) => (exceeds ? 'visible' : 'hidden')};
    }
  }
`;

export const Title = styled.h2`
  font-weight: normal;
  font-size: 16px;
  line-height: 22.4px;
  margin: 0;
  color: var(--dark-gray);
  padding-bottom: 11px;

  @media (max-width: 934px) {
    font-size: 14px;
    line-height: 19.6px;
  }

  @media (max-width: 640px) {
    padding-bottom: 5px;
  }
`;

export const Line = styled.div`
  border-bottom: 1px solid var(--medium-gray);
  width: 100%;

  @media (max-width: 767px) {
    display: none;
  }

  @media (min-width: 640px) {
    display: none;
  }
`;

export const ArrowImg = styled.div`
  position: relative !important;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  margin-top: -15px;
  border-radius: 50%;
  position: absolute;
  margin-bottom: 35px;

  @media (min-width: 767px) {
    top: 7px;
    width: 40px;
    height: 40px;
    margin: 0 37px;
    margin-top: 0;
    transform: rotate(-90deg);
  }

  @media (max-width: 767px) {
    margin: 0 15px 0 15px;
  }

  @media (max-width: 767px) {
    margin: 0 0 15px 0;
  }
`;
export const Address = styled.div`
  display: flex;
  justify-content: flex-start;
  height: 100%;
  align-items: center;
`;

export const RecipientsAddress = styled.span`
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 1.4;
  color: var(--black);
  word-wrap: break-word;
  word-break: break-all;
  text-align: left;
  display: flex;

  @media (min-width: 1200px) {
    font-size: 18px;
  }

  @media (max-width: 1200px) {
    font-size: 16px;
    line-height: 22px;
  }
`;
export const RecipientsTitle = styled.h3`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 22px;
  margin: 0;
  color: var(--dark-gray);

  @media (max-width: 934px) {
    padding-bottom: 5px;
  }

  @media (min-width: 1200px) {
    flex: 0 0 auto;
    font-size: 16px;
  }
`;

export const RecipientsTitleExtraId = styled(RecipientsTitle)`
  padding-top: 12px;
`;

export const Error = styled.p`
  width: 391px;
  font-weight: 600;
  font-size: 10px;
  line-height: 12px;
  margin-top: 20px;
  padding: 9px 6px;
  margin: 0;
  background-color: #ef6565;
  color: #fff;
  border-radius: 4px;

  @media (max-width: 500px) {
    width: 257px;
  }
`;

export const Btn = styled(MainButton)`
  width: 220px;
  margin: 0;

  @media (max-width: 934px) {
    width: 120px;
  }

  > button {
    height: 68px;

    @media (max-width: 767px) {
      border-radius: 8px;
    }

    & > span {
      font-weight: bold;
    }

    @media (max-width: 934px) {
      height: 48px;
    }
  }
`;

export const CopyStyle = styled.div`
  top: -10px;
  padding: 0;
  margin: 0;
`;

export const LinkP = styled.p``;

export const Footer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  @media ${device.tablet} {
    padding-top: 50px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

export const Buttons = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
  justify-content: center;

  @media ${device.tablet} {
    width: auto;
  }
`;
