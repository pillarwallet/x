import styled from 'styled-components';

export const Container = styled.div`
  padding: 1px 4px;
  border-radius: 4px;
  border: ${({ theme }) => `1px solid ${theme.border}`};
  color: ${({ theme }) => theme.allSteps};
  font-size: 12px;
  display: flex;
  align-items: center;
  margin-left: 8px;
  margin-right: auto;

  letter-spacing: 1px;
  @media (min-width: 350px) {
    margin-left: 10px;
  }
`;

export const Step = styled.div`
  color: ${({ theme }) => theme.currentStep};
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
`;

export const TextDivider = styled.span`
  font-size: 13px;
`;
