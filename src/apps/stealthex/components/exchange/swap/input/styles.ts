import styled, { css, keyframes } from 'styled-components';

type ContainerProps = {
  dropdownActive?: 'true';
  widget?: 'true';
  error?: 'true';
};

export const Container = styled.div`
  flex: 1 1 100%;
`;

export const ContainerInput = styled.div<ContainerProps>`
  background: ${(props) =>
    props.dropdownActive ? 'var(--lynx-white)' : 'var(--light-gray)'};
  border-radius: ${(props) =>
    props.dropdownActive || props.error ? '12px 12px 0 0' : '12px'};
  position: relative;
  flex: 1 1 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 60px;
  ${(props) =>
    !props.widget &&
    css`
      @media only screen and (max-width: 1200px) {
        height: 50px;
      }

      @media only screen and (max-width: 767px) {
        flex: 0 0 48px;
        width: 100%;
      }
    `}

  ${(props) =>
    props.widget &&
    css`
      flex-basis: 60px;

      ${AmountInput} {
        font-size: 20px;
      }

      ${Label} {
        font-size: 11px;
      }

      ${Details} {
        padding: 3px 10px 0;
      }

      ${Selected} {
        padding: 10px 12px;
        margin-right: 10px;
      }

      ${Symbol} {
        font-size: 14px;
      }

      @media (max-width: 679px) {
        height: 48px;
        flex-basis: 48px;

        ${AmountInput} {
          font-size: 14px;
        }

        ${Label} {
          font-size: 8px;
        }

        ${Details} {
          padding: 4px 8px 0;
        }

        ${Selected} {
          padding: 7px;
          margin-right: 8px;
        }

        ${Symbol} {
          font-size: 12px;
        }
      }
    `}
`;

type DetailsProps = {
  addlockspace?: 'true';
};

export const Details = styled.div<DetailsProps>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1 1 100%;
  padding: 8px 10px 0;

  & > * + * {
    margin-top: 7px;
  }

  @media only screen and (max-width: 1200px) {
    padding-left: 8px;
  }

  @media only screen and (max-width: 767px) {
    padding: 8px;
  }

  ${(props) =>
    props.addlockspace &&
    css`
      @media only screen and (max-width: 767px) {
        padding-left: 15px;
      }
    `}
`;

export const Label = styled.label`
  line-height: 1;
  font-weight: 600;
  font-size: 11px;
  color: var(--gray);

  @media only screen and (max-width: 1200px) {
    font-size: 8px;
  }
`;

export const AmountInput = styled.input`
  line-height: 0;
  border: none;
  background: none;
  outline: none;
  padding: 0;
  width: 0;
  min-width: 100%;

  font-size: 20px;
  font-weight: 600;
  color: var(--black);

  &,
  &:disabled {
    opacity: 1;
    color: var(--black);
    -webkit-text-fill-color: var(--black);
  }

  @media only screen and (max-width: 1200px) {
    font-size: 16px;
  }

  @media only screen and (max-width: 767px) {
    font-size: 14px;
  }
`;

export const Selected = styled.button`
  background: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 12px;
  margin-right: 12px;
  cursor: pointer;

  &::after {
    content: '';
    display: block;
    width: 0px;
    height: 0px;
    border-style: solid;
    border-width: 9px 4.5px 0px;
    border-color: var(--black) transparent transparent transparent;
    margin-left: 8px;
  }

  @media only screen and (max-width: 1200px) {
    padding: 7px 12px;
    margin-right: 9px;
    z-index: 1;
  }
`;

export const CurrencyIcon = styled.img`
  margin-right: 10px;
  object-fit: contain;
`;

export const Symbol = styled.span`
  color: var(--black);
  font-size: 14px;
  line-height: 1;
  font-weight: 700;
`;

export const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
  line-height: 1;
  z-index: 99;
`;

export const DropdownInput = styled.input`
  border: none;
  background: none;
  outline: none;
  padding: 0;
  width: 0;
  min-width: 100%;
  padding: 20px 15px;

  font-size: 16px;
  font-weight: 700;
  color: var(--black);

  &::placeholder {
    color: var(--gray);
  }

  @media only screen and (max-width: 1200px) {
    padding: 15.5px 15px;
  }

  @media only screen and (max-width: 767px) {
    font-size: 14px;
  }
`;

const indicatorHideStyles = css`
  margin: 0;
  width: 0;
  height: 0;
`;

const indicatorVisibleStyles = css`
  margin-right: 8px;
  width: 28px;
  height: 28px;
`;

type IndicatorContainerProps = {
  visuallyhideonmobile?: 'true';
  widget?: 'true';
};

export const IndicatorContainer = styled.div<IndicatorContainerProps>`
  border-radius: 8px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  align-self: center;
  margin-right: 12px;

  @media only screen and (max-width: 1200px) {
    margin-right: 9px;
  }

  ${(props) =>
    props.widget
      ? props.visuallyhideonmobile
        ? css`
            @media only screen and (max-width: 679px) {
              ${indicatorHideStyles};
            }
          `
        : css`
            @media only screen and (max-width: 679px) {
              ${indicatorVisibleStyles};
            }
          `
      : props.visuallyhideonmobile
        ? css`
            @media only screen and (max-width: 767px) {
              ${indicatorHideStyles};
            }
          `
        : css`
            @media only screen and (max-width: 767px) {
              ${indicatorVisibleStyles};
            }
          `}
`;

const loading = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const Loader = styled.div`
  display: flex;
  width: 20px;
  height: 20px;
  animation: ${loading} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
`;

type ErrorProps = {
  type?: string;
  widget?: 'true';
};

export const Error = styled.div<ErrorProps>`
  position: absolute;
  bottom: 0;
  transform: translateY(100%);
  border-top: 2px solid var(--red);
  width: 100%;
  height: 30px;
  font-weight: 700;
  font-size: 10px;
  padding: 8px 0px 8px 10px;
  background: linear-gradient(rgb(255, 233, 233) 0%, rgb(255, 252, 252) 100%);
  border-radius: 0px 0px 4px 4px;
  color: var(--red);
  line-height: 1;
  z-index: 1;

  ${(props) =>
    props.widget &&
    css<ErrorProps>`
      @media (max-width: 679px) {
        width: ${(props) =>
          props.type == 'send' ? 'calc(100% - 40px - 8px)' : '100%'};
      }
    `}

  ${(props) =>
    !props.widget &&
    css<ErrorProps>`
      @media (max-width: 767px) {
        width: ${(props) =>
          props.type == 'send' ? 'calc(100% - 32px - 8px)' : '100%'};
      }
    `}
`;
