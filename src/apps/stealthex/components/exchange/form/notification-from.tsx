import React from 'react';
import styled from 'styled-components';

import { CloseToast, NotificationIcon } from '../../common/icons';

export const Container = styled.div`
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, 0%);
  top: 12px;
  padding: 20px 20px 20px 20px;
  background: rgba(254, 253, 235, 0.98);
  border: 1px solid rgba(227, 160, 9, 0.32);
  border-radius: 12px;
  z-index: 999;

  @media (max-width: 934px) {
    width: 96%;
    top: 8px;
    padding: 14px 11px 14px 14px;
  }

  @media (max-width: 450px) {
    width: 93%;
  }
`;

export const NotificationImg = styled(NotificationIcon)``;

export const NotificationText = styled.p`
  width: 324px;
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 17px;
  display: flex;
  align-items: center;
  color: var(--warning-yellow);
  padding: 0;
  margin: 0 20px 0 16px;

  @media (max-width: 934px) {
    width: 96%;
  }

  @media (max-width: 767px) {
    width: 73%;
  }
`;

export const CloseButtonContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0;
  cursor: pointer;
`;

export const CloseButton = styled(CloseToast)``;

const NotificationForm: React.FC<{ text: string; onClose?: () => void }> = ({
    text,
    onClose,
}) => {
    return (
        <Container>
            <NotificationImg />
            <NotificationText>{text}</NotificationText>
            <CloseButtonContainer onClick={onClose}>
                <CloseButton fill="#E3A009" />
            </CloseButtonContainer>
        </Container>
    );
};

export default NotificationForm;