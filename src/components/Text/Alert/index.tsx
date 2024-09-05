/* eslint-disable @typescript-eslint/no-use-before-define */
import { Danger as AlertIcon } from 'iconsax-react';
import React from 'react';
import styled from 'styled-components';

const Alert = ({
  icon,
  outline = true,
  children,
}: React.PropsWithChildren<{
  icon?: React.ReactNode;
  outline?: boolean;
}>) => {
  return (
    <Wrapper $outline={outline}>
      <Icon>{icon ?? <AlertIcon size={18} />}</Icon>
      {children}
    </Wrapper>
  );
};

const Wrapper = styled.p<{ $outline?: boolean }>`
  padding: 13px 13px 13px;
  background: ${({ theme, $outline }) =>
    $outline ? 'transparent' : theme.color.background.alert};
  ${({ theme, $outline }) =>
    $outline && `border: 1px solid ${theme.color.border.alertOutline};`}
  color: ${({ theme }) => theme.color.text.alert};
  margin-bottom: 15px;
  font-size: 12px;
  border-radius: 6px;
  min-height: 35px;
  display: flex;
  align-items: center;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Icon = styled.span`
  display: inline-block;
  margin-right: 10px;
`;

export default Alert;
