import styled from 'styled-components';



import DividerLine from '../../../common/widget/divider-line';
import { device } from '../../../../../../../lib/styles/breakpoints';

export const Container = styled.div`
  padding: 20px;
  height: 330px;

  display: grid;
  grid-template-rows: auto 1fr;

  @media ${device.mobileXL} {
    padding: 24px;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const CredentialsBlock = styled.div`
  & > ${DividerLine}:last-child {
    display: none;
  }

  @media ${device.tablet} {
    & > ${DividerLine}:last-child {
      display: block;
    }
  }
`;

export const CredentialsContent = styled.div`
  display: flex;
  flex-direction: column;

  & > ${DividerLine} {
    margin: 8px 0;
  }

  @media ${device.mobileXL} {
    align-items: flex-start;
    flex-direction: row;
    gap: 20px;

    & > ${DividerLine} {
      display: none;
    }
  }

  @media ${device.tablet} {
    align-items: center;
  }
`;

export const InputsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media ${device.tablet} {
    flex-direction: row;
  }
`;

export const Footer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  @media ${device.mobileXL} {
    flex-direction: row;
    justify-content: space-between;
  }

  @media ${device.tablet} {
    flex-direction: column;
    justify-content: center;
  }
`;
