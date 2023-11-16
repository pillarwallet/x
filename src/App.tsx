import React from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { RouterProvider } from 'react-router-dom';

import { defaultTheme } from './theme';
import LanguageProvider from './providers/LanguageProvider';
import navigation from './navigation';

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

const App = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />
      <LanguageProvider>
        <RouterProvider router={navigation} />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
