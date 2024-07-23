import styled, { css } from 'styled-components';

import { ArrowBack } from '../../../components/common/icons';
import SimpleLoader from '../../../components/common/loaders/simple-loader';
import { device } from '../../../lib/styles/breakpoints';
import { Link } from 'react-router-dom';

export const StyledSection = styled.section`
  width: 100%;
  max-width: 1372px;
  margin: 0 auto;
  padding: 15px 16px 0;
  position: relative;

  @media ${device.tablet} {
    padding-top: 29px;
    padding-bottom: 97px;
  }

  @media ${device.tabletL} {
    padding-top: 49px;
  }

  @media ${device.laptopM} {
    padding-top: 72px;
  }
`;

export const TabsContainer = styled.div`
  padding: 0 15px;

  @media ${device.tablet} {
    padding: 0 40px;
  }
`;

export const FormSizer = styled.div`
  max-width: 965px;
  width: 100%;
  margin: 0 auto;
  z-index: 0;

  display: flex;
  align-items: center;
  position: relative;
  height: 100%;
`;

export const NextLink = styled(Link)`
  background: red;
`;

export const ContainerArrow = styled.div`
  position: absolute;
  left: var(--horizontal-padding);
  top: 234px;
  z-index: 1;

  @media (max-width: 1085px) {
    top: 500px;
  }

  @media ${device.laptopM} {
    top: 270px;
  }
`;

export const LinkGoBack = styled.button`
  opacity: 0.4;

  width: 19px;
  height: 19px;

  & > svg {
    width: 16px;
  }

  &:hover {
    opacity: 1;
    cursor: pointer;
  }
`;

export const Arrow = styled(ArrowBack)``;

type StepsContainer = {
  resetbottompadding?: boolean;
};

export const StepsContainer = styled.div<StepsContainer>`
  padding: 16px 16px ${(props) => (props.resetbottompadding ? 0 : '20px')};

  @media ${device.tablet} {
    padding: 40px 40px ${(props) => (props.resetbottompadding ? 0 : '32px')};
  }

  @media ${device.laptopM} {
    padding: 40px 40px ${(props) => (props.resetbottompadding ? 0 : '40px')};
  }
`;

export const Title = styled.h1`
  text-align: center;
  font-size: 22px;
  line-height: 26px;
  margin: 0 0 15px 0;
  display: block;

  @media (min-width: 768px) {
    display: none;
  }
`;

type FormContainerProps = {
  widget?: 'true';
};

export const FormContainer = styled.div<FormContainerProps>`
  position: relative;
  width: 90vw;
  background: #fff;
  box-shadow: 0px 5px 30px rgba(196, 196, 196, 0.3);
  z-index: 3;
  border-radius: 12px;

  @media (max-width: 680px) {
    width: 100%;
  }
`;

export const Content = styled.div``;

export const Block = styled.div`
  padding-left: 16px;
  padding-right: 16px;

  @media ${device.tablet} {
    padding-left: 40px;
    padding-right: 40px;
  }
`;

type DividerLineProps = {
  desktopOnly?: boolean;
  mobileonly?: 'true' | 'false';
};

export const DividerLine = styled.hr<DividerLineProps>`
  width: 100%;
  border: none;
  margin: 0;
  border-top: 2px solid var(--light-gray);

  ${(props) =>
    props.mobileonly === 'true' &&
    css`
      display: block;

      @media ${device.mobileXL} {
        display: none;
      }
    `}

  ${(props) =>
    props.desktopOnly &&
    css`
      display: none;

      @media ${device.tablet} {
        display: block;
      }
    `}
`;

export const ErrorHeading = styled.h2`
  margin: 0;
  padding: 40px 0;
  font-weight: bold;
  font-size: 24px;
  color: var(--nero);

  @media ${device.tabletL} {
    font-size: 28px;
  }
`;

export const WidgetStepsPlaceholder = styled.div`
  height: 65px;
`;

export const WidgetStepsContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 4;
`;

export const LoaderContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
`;

export const Loader = styled(SimpleLoader)``;
