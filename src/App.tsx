import React from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import { PrivyProvider } from '@privy-io/react-auth';

import { defaultTheme } from './theme';
import LanguageProvider from './providers/LanguageProvider';
import Navigation from './navigation';
import BottomMenu from './components/BottomMenu';

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
        <PrivyProvider
          appId={process.env.REACT_APP_PRIVY_APP_ID as string}
          config={{ appearance: { theme: 'light' } }}
        >
          <BrowserRouter>
            <ContentWrapper>
              <Navigation />
            </ContentWrapper>
            <BottomMenu />
          </BrowserRouter>
        </PrivyProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 60px 20px 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default App;
