import styled from 'styled-components';

export const Container = styled.div`
  margin-top: auto;
  display: flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  width: 100%;
  height: 30px;
  padding: 0 8px;

  @media (min-width: 350px) {
    padding: 0 12px;
  }

  @media (min-width: 470px) {
    padding: 0 16px;
  }
`;

export const ExchangeId = styled.div`
  font-weight: 500;
  font-size: 10px;
  line-height: 12px;
  color: ${({ theme }) => theme.text2};
  margin-right: 6px;
  @media (min-width: 350px) {
    font-size: 12px;
    line-height: 16px;
  }
`;

export const ExchangeIdValue = styled.div`
  font-weight: 500;
  font-size: 10px;
  line-height: 12px;
  color: ${({ theme }) => theme.exchangeIdValue};

  @media (min-width: 350px) {
    font-size: 12px;
    line-height: 16px;
  }
`;

export const NeedHelpText = styled.div`
  font-weight: 500;
  font-size: 10px;
  line-height: 12px;
  color: ${({ theme }) => theme.text3};
  margin-left: 5px;
  width: max-content;

  @media (min-width: 350px) {
    font-size: 12px;
    line-height: 16px;
  }
`;

export const NeedHelp = styled.a`
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-left: auto;
  text-decoration: none;

  :hover {
    ${NeedHelpText} {
      color: #004ad9;
    }

    path {
      fill: #004ad9;
    }
  }
`;
