import styled from 'styled-components';

export const Text = styled.div`
  width: 113px;
  font-weight: 500;
  font-size: 10px;
  line-height: 12px;
  color: ${({ theme }) => theme.text2};
  margin-right: 16px;

  @media (min-width: 350px) {
    width: 118px;
    font-size: 13px;
    line-height: 16px;
  }
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 14px;
`;

export const RowValue = styled.div`
  font-weight: 500;
  font-size: 12px;
  line-height: 12px;
  white-space: nowrap;
  color: ${({ theme }) => theme.addressInfoText};
  margin-right: 3px;

  @media (min-width: 350px) {
    margin-right: 8px;
    font-size: 13px;
    line-height: 16px;
  }
`;
