import React from 'react';

import LanguageProvider from './LanguageProvider';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  );
}

export default Providers;
