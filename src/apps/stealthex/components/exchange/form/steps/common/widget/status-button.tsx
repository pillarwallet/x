import React from 'react';
import styled from 'styled-components';
import { device } from '../../../../../../lib/styles/breakpoints';
import { ArrowExchange } from '../../../../../common/icons';
import { Status } from '../../exchange/views/widget/styles';

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

const StatusButton: React.FC<{ children: string; onClick?: () => void }> = ({
    children,
    onClick,
  }) => {
    return <Container onClick={onClick}>
    <StyledArrowIcon />
    <Status>{children}</Status>
  </Container>
}

export default StatusButton;