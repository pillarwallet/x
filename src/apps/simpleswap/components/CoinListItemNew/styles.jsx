import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 17px;
  background-color: ${({ selected, theme }) => (selected ? theme.background2 : theme.background)};
  height: 100%;
  overflow: hidden;
  &:hover {
    cursor: pointer;
    background-color: ${({ selected, theme }) =>
      selected ? theme.background2 : theme.background1};
  }

  @media (min-width: 350px) {
    padding: 8px 24px 8px 24px;
  }
`;

export const LogoRow = styled.div`
  width: 12px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const CoinTicker = styled.p`
  margin: 0 0 0 8px;
  font-family: Inter;
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;
  color: ${({ theme }) => theme.text1};

  @media (min-width: 350px) {
    margin: 0 0 0 16px;
    font-size: 18px;
    line-height: 22px;
    padding-top: 1px;
  }
`;

export const CoinLabel = styled.p`
  margin: 0 0 0 4px;
  font-family: Inter;
  font-weight: 600;
  font-size: 10px;
  line-height: 120%;
  background: ${(props) => props.background ?? '#73bf9a'};
  border-radius: 8px;
  padding: 1px 4px 2px 4px;
  color: white;

  @media (min-width: 350px) {
    margin: 0 0 0 6px;
    padding: 1px 6px 2px 6px;
    font-size: 12px;
  }
`;

export const CoinName = styled.p`
  margin: 0 0 0 8px;
  font-family: Inter;
  font-weight: 500;
  font-size: 10px;
  line-height: 120%;
  color: ${({ theme }) => theme.dropdownCoinName};

  @media (min-width: 350px) {
    margin: 0 0 0 16px;
    font-size: 14px;
    line-height: 120%;
  }
`;

export const LeftSide = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
