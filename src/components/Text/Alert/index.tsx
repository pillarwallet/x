import React from 'react';
import styled, { useTheme } from 'styled-components';

const Alert = ({
  level = 'info',
  children,
}: React.PropsWithChildren<{
  level?: 'info' | 'success' | 'warning' | 'error'
}>) => {
  const theme = useTheme();
  return (
    <AlertText
      $background={theme.color.background[level]}
      $color={theme.color.text[level]}
    >
      {children}
    </AlertText>
  );
}

const AlertText = styled.p<{ $color: string; $background: string; }>`
  padding: 15px;
  background: ${({ $background }) => $background};
  color: ${({ $color }) => $color};
  word-break: break-all;
  margin-bottom: 15px;
  font-size: 14px;
  border-radius: 5px;
`;


export default Alert;
