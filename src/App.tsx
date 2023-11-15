import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { logEvent } from './services/analytics';

const HelloWorldText = styled.div`
  text-align: center;
  margin-top: 50px;
  font-size: 30px;
`;

const InstallButton = styled.span`
  display: inline-block;
  text-align: center;
  margin-top: 50px;
  font-size: 18px;
  background: #fff;
  color: #000;
  padding: 5px 15px;
  cursor: pointer;
  
  &:hover {
    opacity: 0.5;
  }
`;

interface PWABeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
}

const App = () => {
  const [t] = useTranslation();
  const [isPwaInstalled, setIsPwaInstalled] = useState<boolean>(false);
  const [pwaInstall, setPwaInstall] = useState<PWABeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const callback = (event: Event) => {
      event.preventDefault();
      setPwaInstall(event as PWABeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', callback);

    return () => {
      window.removeEventListener('beforeinstallprompt', callback);
    }
  }, []);

  useEffect(() => {
    const callback = () => {
      setIsPwaInstalled(true);
      logEvent('pwa_install_successful');
    };

    window.addEventListener('appinstalled', callback);

    return () => {
      window.removeEventListener('appinstalled', callback);
    }
  }, []);

  const handleInstall = async () => {
    if (!pwaInstall) {
      console.warn('PWA install not found');
      return;
    }

    try {
      logEvent('pwa_install_started');
      await pwaInstall.prompt();
    } catch (e) {
      console.warn('Failed to install PWA:', e);
    }
  };

  return (
    <HelloWorldText>
      <p>{t`common.helloWorld`}</p>
      {!!pwaInstall && !isPwaInstalled && (
        <InstallButton onClick={handleInstall}>
          Install
        </InstallButton>
      )}
    </HelloWorldText>
  );
}

export default App;
