import styled from 'styled-components';

export const CoinRow = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  color: ${({ theme }) => theme.text1};
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;

  #amountTooltip {
    background: ${({ theme }) => theme.text1};
    color: ${({ theme }) => theme.tooltipText};
    max-width: 124px;
    text-align: center;
    font-size: 12px;
  }

  @media (min-width: 350px) {
    line-height: 20px;
    margin-left: 9px;
    font-size: 16px;
    max-width: 80%;
  }
`;

export const SendBox = styled.div`
  width: max-content;
  max-width: 100%;
  text-wrap: nowrap;
  display: flex;
  flex-direction: column;
  text-align: center;
  padding: 8px 20px;
  border: 1px solid ${({ theme }) => theme.border};
  height: 51px;

  border-radius: 8px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 16px;
  font-weight: 500;
  font-size: 10px;
  line-height: 12px;

  color: ${({ theme }) => theme.text2};

  @media (min-width: 350px) {
    height: 37px;

    font-size: 12px;
    line-height: 16px;
    align-items: center;
    margin-bottom: 8px;
    padding: 0 20px;
    flex-direction: row;
  }
`;

export const CoinIcon = styled.div`
  width: 16px;
  height: 16px;
  margin-right: 6px;
`;

export const AddressBlock = styled.div`
  display: flex;
  width: 100%;
  height: 98px;
  padding: 10px;
  background: ${({ theme }) => theme.addressBlockBackground};
  border-radius: 8px;
  margin-top: 8px;
  @media (min-width: 350px) {
    height: 108px;
  }
`;

export const AddressText = styled.div`
  width: 100%;
  color: ${({ theme }) => theme.addressBlockText};
  overflow-wrap: anywhere;
  margin-right: 9px;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  @media (min-width: 350px) {
    margin-left: 16px;
  }
`;

export const IconColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 20px;
`;

export const Text = styled.div`
  font-weight: 500;
  font-size: 10px;
  line-height: 12px;
  color: ${({ color, theme }) => color || theme.text2};
  margin-right: 8px;

  @media (min-width: 350px) {
    font-size: 12px;
    line-height: 16px;
  }
`;

export const Memo = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 16px;

  @media (min-width: 350px) {
    margin-top: 8px;
  }
`;

export const MemoIcon = styled.div`
  width: 18px;
  height: 18px;
  cursor: pointer;

  #memoTooltip,
  #warningTooltip {
    background: #ee7500;
    color: #ffffff;
    max-width: 188px;
    text-align: center;
    font-size: 12px;
  }

  &:hover {
    svg * {
      fill: #ee7500;
    }
  }
`;

export const MemoValue = styled.div`
  font-weight: 500;
  font-size: 10px;
  line-height: 12px;
  color: #ee9500;
  margin-right: 5px;
  margin-left: 5px;

  @media (min-width: 350px) {
    font-size: 12px;
    line-height: 16px;
  }
`;

export const Amount = styled.span`
  text-overflow: ellipsis;
  max-width: max-content;
  overflow: hidden;
  margin-right: 4px;
  pointer-events: ${({ $isDisabled }) => $isDisabled ? 'none' : 'all'};
`;
