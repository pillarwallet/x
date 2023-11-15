import React from 'react';
import { ThemeProvider } from 'styled-components';

import LanguageProvider from './LanguageProvider';
import { defaultTheme } from '../theme';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default Providers;
