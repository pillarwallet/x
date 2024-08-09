import React from 'react';
import styled from 'styled-components';
import { device } from '../../../../../../lib/styles/breakpoints';
import { ArrowExchange } from '../../../../../common/icons';



const Container = styled.button`
  font-size: 18px;
  font-weight: 700;
  color: var(--nero);

  display: flex;
  align-items: center;
  gap: 10px;

  cursor: pointer;

  @media ${device.mobileXL} {
    font-size: 24px;
    gap: 15px;
  }
`;

const StyledArrowIcon = styled(ArrowExchange).attrs({ fill: '#dadada' })`
  transform: rotate(90deg);
`;

const StepButton: React.FC<{ text: string; onClick?: () => void }> = ({
  text,
  onClick,
}) => {
  return (
    <Container onClick={onClick}>
      <StyledArrowIcon />
      <span>{text}</span>
    </Container>
  );
};

export default StepButton;
