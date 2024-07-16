
import React from 'react';
import styled from 'styled-components';



import { useTranslation } from 'react-i18next';
import Copy from '../../../../../../../common/copy';
import { device } from '../../../../../../../../lib/styles/breakpoints';

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 5px;
  font-size: 14px;
  color: var(--dark-gray);
  margin-bottom: 20px;

  @media ${device.mobileS} {
    margin-bottom: 32px;
  }

  @media ${device.tablet} {
    font-size: 16px;
    gap: 10px;
    margin-bottom: 40px;
  }
`;

const StyledId = styled.span`
  font-weight: bold;
  font-size: 16px;
  color: var(--nero);
  background-color: var(--light-gray);
  padding: 6px 12px;
  border-radius: 70px;

  @media ${device.tabletL} {
    font-size: 18px;
  }
`;

const Id: React.FC<{ id: string; className?: string }> = ({
  id,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <Container className={className} >
      <span>{t('exchangeID')}: </span>{' '}
      <StyledId data-testid="exchange-id">{id}</StyledId>
      <Copy text={id} />
    </Container>
  );
};

export default Id;