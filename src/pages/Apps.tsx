import React, { Suspense, useEffect } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from 'i18next';
import styled from 'styled-components';

// components
import { PrimaryTitle } from '../components/Text/Title';

// apps
import { loadAppsList } from '../apps';

// types
import { AppManifest, RecordPerKey } from '../types';

// theme
import { animation } from '../theme';

const AppSplash = ({ namespace }: { namespace: string }) => (
  <AppSplashWrapper>
    <AppSplashInner>
      <AppIcon namespace={namespace} />
    </AppSplashInner>
  </AppSplashWrapper>
);

const App = ({ namespace }: { namespace: string }) => {
  // TODO: add default NotFound app in case namespace missing?
  const ComponentToRender = React.lazy(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // artificial 1s delay
    return import(`../apps/${namespace}`);
  });

  return (
    <Suspense fallback={<AppSplash namespace={namespace} />}>
      <ComponentToRender />
    </Suspense>
  );
};

const AppIcon = ({ namespace }: { namespace: string }) => {
  const [iconSrc, setIconSrc] = React.useState<string | undefined>(undefined);
  const [iconLoaded, setIconLoaded] = React.useState<boolean>(false);
  const imageRef = React.useRef<HTMLImageElement>(null);

  useEffect(() => {
    const loadIconSrc = async () => {
      const icon = await import(`../apps/${namespace}/icon.png`);
      setIconSrc(icon.default);
    }

    loadIconSrc();
  }, [namespace]);

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
      <AppIconImage ref={imageRef} src={iconSrc} display={iconLoaded} />
    </>
  );
};

const Apps = () => {
  const [t] = useTranslation();
  const [apps, setApps] = React.useState<RecordPerKey<AppManifest>>({});
  const [loadedAppNamespace, setLoadedAppNamespace] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    const loadedApps = loadAppsList();
    setApps(loadedApps);
  }, []);

  if (loadedAppNamespace) {
    return (
      <I18nextProvider i18n={i18n} defaultNS={`app:${loadedAppNamespace}`}>
        <App namespace={loadedAppNamespace} />
      </I18nextProvider>
    );
  }

  return (
    <Wrapper>
      <PrimaryTitle>{t`title.apps`}</PrimaryTitle>
      <AppsList>
        {Object.keys(apps).map((appNamespace) => (
          <AppListItem
            key={appNamespace}
            onClick={() => setLoadedAppNamespace(appNamespace)}
          >
            <AppIcon namespace={appNamespace} />
          </AppListItem>
        ))}
      </AppsList>
    </Wrapper>
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

const AppIconImage = styled.img<{ display: boolean }>`
  display: ${({ display }) => display ? 'block' : 'none'};
  max-width: 100%;
  border-radius: 20px;
`;

const AppIconSkeleton = styled.div`
  animation: ${animation.skeleton} 1s linear infinite alternate;
  height: 100%;
  border-radius: 20px;
`;

export default Apps;
