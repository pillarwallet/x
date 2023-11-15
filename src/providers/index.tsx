import React from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

import LanguageProvider from './LanguageProvider';
import { defaultTheme } from '../theme';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: ${({ theme }) => theme.font.primary};
    background: ${({ theme }) => theme.color.background.body};
    color: ${({ theme }) => theme.color.text.body};
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
`;


const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default Providers;
