import QRCode from 'qrcode.react';
import styled, { css } from 'styled-components';



import Block from '../common/block';
import { LoaderSvg, NotificationIcon, RoundedSuccessIcon } from '../../../../../../../common/icons';
import { Loader } from '../../../../../../swap/input/styles';

export const SentBlock = styled(Block)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

export const GetBlock = styled(Block)``;

export const StatusHeading = styled.h2<{ success?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  font-size: 28px;
  margin: 0;
  margin-bottom: 32px;
  line-height: 1;
  font-weight: 700;

  @media (max-width: 934px) {
    font-size: 24px;
  }
  ${(props) =>
        !props.success &&
        css`
      @media (max-width: 934px) {
        flex-direction: row-reverse;
        justify-content: flex-end;
      }
      @media (max-width: 320px) {
        justify-content: space-between;
      }
    `}
`;

export const Status = styled.span`
  padding-right: 10px;
`;

export const InfoBlockContainer = styled.div`
  & ~ & {
    margin-top: 16px;
  }
`;

export const QRCont = styled(QRCode)`
  width: 158px !important;
  height: 158px !important;

  @media (max-width: 934px) {
    width: 120px !important;
    height: 120px !important;
  }

  @media (max-width: 767px) {
    display: none !important;
  }
`;

export const NotificationAddress = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 9px 12px;
  background: #ffefca;
  border-radius: 4px;
  border: 1px solid rgba(227, 160, 9, 0.32);
  margin: 6px 0 0;

  @media (max-width: 934px) {
    padding: 7px 8px;
  }
`;

export const StyledNotificationIcon = styled(NotificationIcon)`
  width: 15px;
  height: 15px;
  margin-right: 10px;
`;

export const NotificationText = styled.p`
  margin: 0;
  font-weight: 700;
  font-size: 10px;
  color: var(--warning-yellow);

  @media (max-width: 934px) {
    font-size: 8px;
  }
`;

export const StyledLoader = styled(Loader)``;

export const LoaderIcon = styled(LoaderSvg)``;

export const Success = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;

  @media (max-width: 934px) {
    width: 24px;
    heigth: 24px;
  }
`;

export const StyledRoundedCheck = styled(RoundedSuccessIcon)``;
