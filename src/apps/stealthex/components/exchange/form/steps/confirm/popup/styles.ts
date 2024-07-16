import styled, { css } from 'styled-components';
import { Close } from '../../../../../common/icons';
import MainButton from '../../../../../common/main-button/main-button';



export const PopapStyles = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Button = styled.button`
  min-width: 100px;
  padding: 16px 32px;
  border-radius: 4px;
  border: none;
  background: #333;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
`;

export const Background = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100000;
`;

export const MainWrapper = styled.div`
  max-width: 985px;
  width: 100%;
`;

export const ModalWrapper = styled.div`
  background: #fff;
  color: var(--black);
  z-index: 100000;
  border-radius: 12px;
  padding-bottom: 32px;
  margin: 0 15px 0 15px;
`;

export const ModalHeader = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  background: var(--lynx-white);
  padding: 20px 40px 20px 40px;
  margin-bottom: 40px;
  border-radius: 12px 12px 0 0;

  @media (max-width: 934px) {
    font-size: 16px;
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const TitleModal = styled.h2`
  width: 98%;
  text-align: center;
  font-weight: bold;
  font-size: 18px;
  line-height: 1.4;
  color: var(--gray);

  @media (max-width: 934px) {
    font-size: 16px;
  }

  @media (max-width: 465px) {
    text-align: start;
  }
`;

export const CloseModalButton = styled.div`
  display: flex;
  cursor: pointer;
`;

export const CloseImage = styled(Close)`
  width: 22px;
  height: 22px;

  path {
    stroke: var(--gray);
  }

  &:hover,
  &:active {
    path {
      stroke: var(--dark-gray) !important;
    }
  }
`;

export const ModalText = styled.p`
  padding: 0px 40px 20px 40px;
  margin-bottom: 1em;
  font-weight: bold;
  font-size: 18px;
  line-height: 140%;
  color: var(--nero);

  @media (max-width: 934px) {
    font-size: 16px;
    padding: 0px 40px 15px 40px;
  }

  @media (max-width: 767px) {
    padding: 0px 15px 20px 15px;
  }

  @media (max-width: 570px) {
  }

  @media (max-width: 470px) {
    padding: 0px 20px 0px 15px;
  }
`;

export const CheckWrap = styled.div`
  display: flex;
  padding: 0 0 0 40px;

  @media (max-width: 767px) {
    padding: 0 0 0 15px;
  }
`;

export const ModalTextGrey = styled.p`
  position: relative;
  padding: 0px 40px 0px 0px;
  margin-bottom: 1em;
  font-weight: normal;
  font-size: 16px;
  line-height: 140%;
  color: var(--nero);

  @media (max-width: 934px) {
    font-size: 14px;
    padding: 0px 30px 0px 0px;
    margin-bottom: 10px;
  }

  @media (max-width: 767px) {
    padding: 0px 15px 20px 0px;
  }

  @media (max-width: 570px) {
  }

  @media (max-width: 470px) {
    max-width: none;
    padding: 0px 25px 4px 0px;
  }
`;

export const ModalTextGreyTwo = styled.p`
  position: relative;
  padding: 0px 15px 0px 0px;
  margin-bottom: 1em;
  font-weight: normal;
  font-size: 16px;
  line-height: 140%;
  max-width: 640px;
  padding-bottom: 28px;
  color: var(--black);

  & > a {
    font-weight: bold;
    color: var(--black);
    border-bottom: 1px dotted var(--black);
    padding-bottom: 5px;

    @media (max-width: 934px) {
      padding-bottom: 1px;
    }
  }

  a:hover {
    border-bottom: 1px transparent;
  }

  @media (max-width: 934px) {
    font-size: 14px;
    padding-bottom: 19px;
  }

  @media (max-width: 767px) {
    padding-bottom: 8px;
    max-width: auto;
  }
`;

type TermsCheckboxLabelOneProsp = {
    checked?: boolean;
};

export const TermsCheckboxLabelOne = styled.label<TermsCheckboxLabelOneProsp>`
  left: 3px;
  flex-shrink: 0;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 15px;
  height: 15px;
  margin-top: 5px;
  margin-right: 10px;
  background: ${({ checked }) => (checked ? 'var(--black)' : 'transparent')};
  border: 1px solid var(--black);
  cursor: pointer;
  border-radius: 2px;

  ${({ checked }) =>
        checked &&
        css`
      &:before {
        box-sizing: content-box;
        content: '';
        display: block;
        margin-bottom: 3px;
        width: 3px;
        height: 5px;
        border-width: 0 3px 3px 0;
        border-style: solid;
        border-color: #fff;
        transform: rotate(45deg);
      }
    `}

  input {
    display: none;
  }

  @media (max-width: 934px) {
    margin-top: 2px;
  }
`;

type TermsCheckboxLabelTwoProps = {
    checked?: boolean;
};

export const TermsCheckboxLabelTwo = styled.label<TermsCheckboxLabelTwoProps>`
  left: 3px;
  flex-shrink: 0;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 15px;
  height: 15px;
  margin-top: 5px;
  margin-right: 10px;
  background: ${({ checked }) => (checked ? 'var(--black)' : 'transparent')};
  border: 1px solid var(--black);
  cursor: pointer;
  border-radius: 2px;

  ${({ checked }) =>
        checked &&
        css`
      &:before {
        box-sizing: content-box;
        content: '';
        display: block;
        margin-bottom: 3px;
        width: 3px;
        height: 5px;
        border-width: 0 3px 3px 0;
        border-style: solid;
        border-color: #fff;
        transform: rotate(45deg);
      }
    `}

  input {
    display: none;
  }

  @media (max-width: 934px) {
    margin-top: 3px;
  }
`;

export const ExchangeButtonPopap = styled(MainButton)`
  white-space: nowrap;
  display: inline-block;
  padding: 0 0 0 40px;

  > button {
    height: 68px;
    padding: 25px 60px 24px 60px;

    > span {
      letter-spacing: 2px;

      @media (max-width: 934px) {
        letter-spacing: 1px;
      }

      @media (max-width: 767px) {
        font-size: 12px;
      }
    }

    @media (max-width: 934px) {
      height: 48px;
      padding: 25px 40px 24px 40px;
    }

    @media (max-width: 767px) {
      padding: 15px 20px 14px 20px;
    }
  }

  @media (max-width: 767px) {
    padding: 0 15px 0 15px;
    margin-left: 0;
    display: flex;
    width: auto;
  }

  @media (max-width: 320px) {
    overflow: visible;

    &.checked {
      position: sticky;
      bottom: -5%;
    }
  }

  @media (min-width: 1200px) {
    min-width: 260px;
  }
`;

export const ActiveButtonPopap = styled.a`
  position: fixed !important;
  bottom: 15px;
`;
