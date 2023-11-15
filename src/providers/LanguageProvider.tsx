import React from 'react';
import i18n from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';

// translations
import translationEn from '../translations/en.json';

i18n
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    resources: {
      en: { translation: translationEn },
    },
    interpolation: {
      escapeValue: false // https://www.i18next.com/translation-function/interpolation#unescape
    }
  });

const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}

export default LanguageProvider;
