/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import { Link as ReactRouterLink } from 'react-router-dom';
import styled, { css } from 'styled-components';

const linkStyles = css`
  display: inline-block;
  font-weight: ${({ bold }) => (bold ? '600' : '400')};
  color: ${({ color }) => color || 'var(--black)'};
`;

const RouterLink = styled(({ href, ...props }) => {
  if (props.blank) {
    return (
      <Link href={href} target="_blank" {...props}>
        {props.children}
      </Link>
    );
  }

  return (
    <ReactRouterLink href={href} passHref>
      <Link {...props}>{props.children}</Link>
    </ReactRouterLink>
  );
})`
  ${linkStyles}
`;

const Link = styled.a`
  ${linkStyles}
`;

const ButtonLink = styled.button`
  ${linkStyles}
  margin: 0;
  padding: 0;
  background: none;
  border-width: 0 0 2px 0;
  box-shadow: none;
  outline: none;
  cursor: pointer;
`;

export const Text = styled.span`
  position: relative;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 28px;
  line-height: 34px;
  margin-top: 15px;
  border-color: transparent;
  @media (max-width: 934px) {
    font-size: 20px;
    line-height: 24px;
  }
  &:hover,
  &:active {
    &:before {
      content: '';
      position: absolute;
      padding-top: 38px;
      width: 100%;
      height: 3px;
      color: var(--brand-yellow);
      border-bottom: 3px solid var(--brand-yellow);
      @media (max-width: 934px) {
        padding-top: 28px;
      }
    }
  }
`;

const InlineLink = ({
  component = '',
  to = '',
  href = '',
  children,
  bold,
  ...props
}) => {
  if (component === 'button')
    return (
      <>
        <ButtonLink {...props} bold={bold ? 'true' : undefined} />
        <Text>{children}</Text>
      </>
    );
  if (component === 'a')
    return (
      <RouterLink href={href} {...props} bold={bold ? 'true' : undefined}>
        <Text>{children}</Text>
      </RouterLink>
    );
  return (
    <a href={href || to} target='_blank' rel="noreferrer" {...props}>
      <Text bold={bold ? 'true' : undefined}>{children}</Text>
    </a>
  );
};

export default InlineLink;
