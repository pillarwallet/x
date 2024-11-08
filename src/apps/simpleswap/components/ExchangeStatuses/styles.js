import styled from 'styled-components';

export const IconsContainer = styled.div`
  display: flex;
  width: fit-content;
  justify-content: space-between;
  align-items: center;
  gap: 2px;
  margin-right: 8px;
  margin-left: 4px;

  color: ${({ theme }) => theme.arrowBlockBackground};
`;

export const ActiveStepName = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.text1};
  display: none;
  @media (min-width: 470px) {
    display: inline;
    margin-left: 4px;
    flex: 1 0 auto;
  }
`;
