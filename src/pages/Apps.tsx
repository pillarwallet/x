import React, { Suspense, useEffect } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from 'i18next';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';

// components
import { PrimaryTitle } from '../components/Text/Title';
import Alert from '../components/Text/Alert';

// apps
import { loadAppsList } from '../apps';

// types
import { AppManifest, RecordPerKey } from '../types';

// theme
import { animation } from '../theme';

// navigation
import { navigationRoute } from '../navigation';

// pages
import NotFound from './NotFound';

const AppSplash = ({ appId }: { appId: string }) => (
  <AppSplashWrapper>
    <AppSplashInner>
      <AppIcon appId={appId} />
    </AppSplashInner>
  </AppSplashWrapper>
);

const App = ({ id }: { id: string }) => {
  const [t] = useTranslation();

  const ComponentToRender = React.lazy(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // artificial 1s delay
    try {
      return import(`../apps/${id}`);
    } catch (e) {
      return { default: () => <Alert level="error">{t`error.appNotFound`}</Alert> };
    }
  });

  return (
    <Suspense fallback={<AppSplash appId={id} />}>
      <ComponentToRender />
    </Suspense>
  );
};

const AppIcon = ({ appId }: { appId: string }) => {
  const [iconSrc, setIconSrc] = React.useState<string | undefined>(undefined);
  const [iconLoaded, setIconLoaded] = React.useState<boolean>(false);
  const imageRef = React.useRef<HTMLImageElement>(null);

  useEffect(() => {
    const loadIconSrc = async () => {
      const icon = await import(`../apps/${appId}/icon.png`);
      setIconSrc(icon.default);
    }

    loadIconSrc();
  }, [appId]);

  useEffect(() => {
    if (!imageRef.current || !iconSrc) return;

    if (imageRef.current.complete) {
      setIconLoaded(true);
      return;
    }

    imageRef.current.onload = () => setIconLoaded(true);
  }, [imageRef, iconSrc]);

  return (
    <>
      {!iconLoaded && <AppIconSkeleton />}
      <AppIconImage ref={imageRef} src={iconSrc} $display={iconLoaded} />
    </>
  );
};

const Apps = () => {
  const [t] = useTranslation();
  const [apps, setApps] = React.useState<RecordPerKey<AppManifest>>({});
  const { appId } = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    const loadedApps = loadAppsList();
    setApps(loadedApps);
  }, []);


  if (!appId) {
    return (
      <Wrapper>
        <PrimaryTitle>{t`title.apps`}</PrimaryTitle>
        <AppsList>
          {Object.keys(apps).map((appId) => (
            <AppListItem
              key={appId}
              onClick={() => navigate(navigationRoute.apps + '/' + appId)}
            >
              <AppIcon appId={appId} />
            </AppListItem>
          ))}
        </AppsList>
      </Wrapper>
    );
  }

  if (!apps[appId]) {
    return (
      <NotFound message={t`error.appNotFound`} />
    );
  }

  return (
    <I18nextProvider i18n={i18n} defaultNS={`app:${appId}`}>
      <App id={appId} />
    </I18nextProvider>
  );
}

const Wrapper = styled.div`
  display: block;
  width: 100%;
  height: 100%;
`;

const AppSplashWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const AppSplashInner = styled.div`
  width: 150px;
  height: 150px;
  animation: ${animation.pulse} 5s ease-in-out infinite;
`;

const AppsList = styled.div`
  margin-top: 60px;
`;

const AppListItem = styled.div`
  width: 130px;
  height: 130px;
  border-radius: 20px;
  overflow: hidden;
  transition: all .1s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
    opacity: 0.9;
  }
`;

const AppIconImage = styled.img<{ $display: boolean }>`
  display: ${({ $display }) => $display ? 'block' : 'none'};
  max-width: 100%;
  border-radius: 20px;
`;

const AppIconSkeleton = styled.div`
  animation: ${animation.skeleton} 1s linear infinite alternate;
  height: 100%;
  border-radius: 20px;
`;

export default Apps;
