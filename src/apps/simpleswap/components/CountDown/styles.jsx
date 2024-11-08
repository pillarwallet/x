import styled from 'styled-components';

export const Container = styled.div`
  width: max-content;
  color: #e15d56;
  background-color: #e15d5633;
  border-radius: 28px;
  font-weight: 500;
  font-size: 10px;
  line-height: 12px;
  margin-left: 8px;
  padding: 2px 6px;

  @media (min-width: 350px) {
    font-size: 12px;
    line-height: 16px;
    padding: 2px 9px;
  }
`;
