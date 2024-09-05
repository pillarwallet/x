/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-use-before-define */
import i18n from 'i18next';
import React, { Suspense, useEffect } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import styled from 'styled-components';

// components
import AppIcon from '../../components/AppIcon';
import Alert from '../../components/Text/Alert';

// theme
import { animation } from '../../theme';

// apps
import { loadApp } from '../../apps';

const AppSplash = ({ appId }: { appId: string }) => (
  <AppSplashWrapper>
    <AppSplashInner>
      <AppIcon appId={appId} />
    </AppSplashInner>
  </AppSplashWrapper>
);

const App = ({ id }: { id: string }) => {
  const [t] = useTranslation();

  useEffect(() => {
    loadApp(id);
  }, [id]);

  const ComponentToRender = React.lazy(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    }); // artificial 1s delay
    try {
      return await import(`../../apps/${id}`);
    } catch (e) {
      return { default: () => <Alert>{t`error.appNotFound`}</Alert> };
    }
  });

  return (
    <Suspense fallback={<AppSplash appId={id} />}>
      <I18nextProvider i18n={i18n} defaultNS={`app:${id}`}>
        <ComponentToRender />
      </I18nextProvider>
    </Suspense>
  );
};

const AppSplashWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100vh - 240px);
`;

const AppSplashInner = styled.div`
  width: 150px;
  height: 150px;
  animation: ${animation.pulse()} 5s ease-in-out infinite;
`;

export default App;
