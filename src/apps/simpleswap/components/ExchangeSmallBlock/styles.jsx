import styled from 'styled-components';

export const Container = styled.div`
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  position: relative;
  flex-direction: column;

  @media (min-width: 470px) {
    flex-direction: row;
    margin-bottom: 16px;
  }
`;

export const CoinBlock = styled.div`
  position: relative;
  width: 100%;
  height: 48px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 20px 8px 0;

  @media (min-width: 350px) {
    padding: 0 0 0 80px;
    display: flex;
    align-items: center;
  }

  @media (min-width: 470px) {
    display: block;
    width: calc(50% - 4px);
    height: auto;
    padding: 18px 16px 10px;
    :first-child {
      margin-bottom: 0;
    }
  }
`;

export const Label = styled.div`
  font-weight: 500;
  font-size: 10px;
  line-height: 12px;
  color: ${({ theme }) => theme.text2};
  display: flex;
  align-items: center;

  position: absolute;
  white-space: nowrap;
  left: 8px;
  top: 8px;

  #floatingTooltip {
    background: ${({ theme }) => theme.text1};
    color: ${({ theme }) => theme.tooltipText};
    max-width: 233px;
    text-align: center;
    font-size: 12px;
    border-radius: 8px;
    text-wrap: wrap;
    z-index: 10;
  }

  @media (min-width: 350px) {
    font-size: 12px;
    line-height: 16px;
    left: 16px;
    top: 16px;
  }

  @media (min-width: 470px) {
    top: 8px;
  }
`;

export const CoinRow = styled.div`
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 12px;
  line-height: 20px;
  width: 100%;
  color: ${({ theme }) => theme.text1};

  @media (min-width: 350px) {
    font-size: 14px;
  }

  @media (min-width: 470px) {
    margin-top: 6px;
  }
`;

export const CoinIcon = styled.div`
  width: 16px;
  height: 16px;
  margin-right: 6px;
`;

export const ArrowBlock = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.arrowBlockBackground};
  border-radius: 8px;
  top: 50%;
  right: 14px;
  transform: translate(0, -50%) rotate(90deg);
  width: 24px;
  height: 24px;
  padding: 5px;

  @media (min-width: 350px) {
    width: 30px;
    height: 30px;
    padding: 6px;
  }

  @media (min-width: 470px) {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

export const InputToTilda = styled.div`
  display: flex;
  width: 5px;
  height: 4px;
  margin: 0 3px 0 0;

  @media (min-width: 350px) {
    width: 10px;
    height: 8px;
    margin: 0 4px 0 0;
  }
`;

export const DropdownTickerLabel = styled.div`
  background: ${({ $background }) => $background};
  border-radius: 8px;
  padding: 1px 4px 2px 4px;
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 6px;
  line-height: 120%;
  color: white;
  margin-left: 6px;

  @media (min-width: 350px) {
    padding: 1px 6px 2px 6px;
    font-size: 12px;
  }
`;

export const CoinValue = styled.div`
  max-width: 40%;
  margin-right: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: ${({ $isDisabled }) => $isDisabled ? 'none' : 'all'};
  @media (min-width: 470px) {
    max-width: 80%;
  }
`;

export const QuestionIcon = styled.div`
  margin-left: 4px;
  display: flex;
  align-items: center;
  svg {
    width: 12px;
    height: 12px;
  }
`;
