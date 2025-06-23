/* eslint-disable react/no-unknown-property */
import styled, { css } from 'styled-components';

import Loader from '../loaders/legacy-loader';
import { Link } from 'react-router-dom';

export const ButtonText = styled.span`
  display: flex;
  justify-content: center;
  position: relative;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 1px;

  ${({ isloading }) =>
    isloading &&
    css`
      opacity: 0;
    `}

  @media(max-width: 934px) {
    font-size: 14px;
  }
`;

export const buttonStyle = css`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50px;
  padding: ${({ $beforeexchange }) =>
    $beforeexchange ? '22px 55px' : '11px 20px 10px 20px'};
  border-radius: 12px;

  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 1px;
  color: var(--black);
  text-transform: uppercase;

  background: ${({ bordered }) => (bordered ? '#fff' : 'var(--brand-yellow)')};
  border-style: solid;
  border-color: var(--medium-gray);
  border-radius: 12px;
  border-width: ${({ bordered }) => (bordered ? '1px 1px 1px 1px' : '0')};

  cursor: pointer;
  outline: none;

  &.main-button-disabled,
  &:disabled {
    opacity: 0.4;
    pointer-events: none;
  }

  @media (hover: hover) {
    transition: var(--transition-background);
    transition-property: color, background, border-color;

    ${({ bordered }) =>
    bordered
      ? css`
            &:hover:not(:disabled) {
              border-color: var(--lynx-white);
              background: var(--lynx-white);
              color: var(--black);

              &:before {
                border-color: var(--black);
                background: var(--black);
              }
            }
          `
      : css`
            &:hover:not(:disabled) {
              background: var(--black);
              color: var(--brand-yellow);

              &:before {
                background: var(--black);
              }
            }
          `}
  }

  @media (min-width: 1200px) {
    font-size: 16px;
    height: 60px;
  }

  @media (max-width: 940px) {
    border-radius: 8px;
  }

  @media (max-width: 385px) {
    padding: ${({ $beforeexchange }) => ($beforeexchange ? '0px 0px' : '')};
  }
`;

export const ButtonLoader = styled(Loader)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
`;

export const StyledMainLink = styled(
  ({ bordered, href, children, ...rest }) => (
    <Link href={href} passHref>
      <a bordered={bordered} {...rest}>
        {children}
      </a>
    </Link >
  )
)`
  ${buttonStyle}
`;

export const StyledMainButton = styled.button`
  ${buttonStyle}
`;

export const ButtonContainer = styled.div`
  overflow: hidden;

  ${({ mr }) =>
    mr &&
    css`
      margin-right: ${mr};
    `}

  ${({ toLeft }) =>
    toLeft &&
    css`
      transform: rotate(180deg);

      ${ButtonText} {
        transform: rotate(-180deg);
      }
    `}
`;
