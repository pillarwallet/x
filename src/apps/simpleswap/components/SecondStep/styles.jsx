import styled from 'styled-components';

export const InputLabel = styled.div`
  position: absolute;
  top: 6px;
  left: 8px;
  font-weight: 500;
  font-size: 10px;
  line-height: 16px;
  color: ${({ theme }) => theme.text3};

  @media (min-width: 350px) {
    left: 16px;
    font-size: 12px;
    line-height: 130%;
  }
`;

export const MainButton = styled.button`
  height: 48px;
  width: 100%;
  background: ${({ theme }) => theme.buttonBackground};
  border: none;
  outline: none;
  border-radius: 8px;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.buttonText};
  margin-top: auto;

  &:hover {
    cursor: pointer;
    background: #004ad9;
    color: #ffffff;
  }

  &:disabled {
    cursor: initial;
    opacity: 0.6;
    background: ${({ theme }) => theme.buttonBackground};
  }

  @media (min-width: 350px) {
    font-size: 15px;
    line-height: 21px;
    height: 56px;
  }
`;

export const InputGroup = styled.div`
  position: relative;
  margin-bottom: 8px;
`;
export const TextInput = styled.input`
  outline: none;
  width: 100%;
  height: 48px;
  background: ${({ theme }) => theme.background1};
  border-radius: 8px;
  padding: 14px 8px;
  padding-right: ${({ $hasTooltip }) => ($hasTooltip ? '32px' : '')};
  border: none;
  color: ${({ theme }) => theme.text1};
  text-overflow: ellipsis;

  &:focus,
  &:not([value='']) {
    background: ${({ theme }) => theme.background};
    padding: 13px 8px 0;
    border: 1px solid ${({ theme }) => theme.inputActiveBorder};
    padding-right: ${({ $hasTooltip }) => ($hasTooltip ? '32px' : '')};
  }

  &::placeholder {
    color: ${({ theme }) => theme.text3};
  }
  &:focus::placeholder {
    color: transparent;
  }

  font-weight: 400;
  font-size: 12px;
  line-height: 16px;

  @media (min-width: 350px) {
    padding: 14px 16px;
    font-size: 14px;
    line-height: 20px;
    padding-right: ${({ $hasTooltip }) => ($hasTooltip ? '40px' : '')};

    &:focus,
    &:not([value='']) {
      padding: 13px 16px 0;
      padding-right: ${({ $hasTooltip }) => ($hasTooltip ? '40px' : '')};
    }
  }
`;

export const TooltipContainer = styled.div`
  position: absolute;
  right: 10px;
  top: 8px;
`;
