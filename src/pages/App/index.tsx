/* eslint-disable react/no-unstable-nested-components */
import { animated, useSpring, useTrail } from '@react-spring/web';
import i18n from 'i18next';
import React, { Suspense, useEffect, useState } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';

// hooks
import useAllowedApps from '../../hooks/useAllowedApps';
import useBottomMenuModal from '../../hooks/useBottomMenuModal';
import useTransactionKit from '../../hooks/useTransactionKit';

// components
import Alert from '../../components/Text/Alert';

// apps
import { loadApp } from '../../apps';
import { ApiAllowedApp } from '../../providers/AllowedAppsProvider';

type AnimatedAppTitleProps = {
  text: string;
};

const AnimatedAppTitle: React.FC<AnimatedAppTitleProps> = ({ text }) => {
  const [isDisplaying, setIsDisplaying] = useState(true);

  const letters = text.split('');

  const trail = useTrail(letters.length, {
    from: { opacity: 0, transform: 'translateY(32px)' },
    to: {
      opacity: isDisplaying ? 1 : 0,
      transform: isDisplaying ? 'translateY(0px)' : 'translateY(32px)',
    },
    config: {
      tension: 210,
      friction: 20,
      mass: 1,
      duration: 25, // equivalent to 250 ms
    },
  });

  useEffect(() => {
    const timeout = setTimeout(() => setIsDisplaying(false), 1250); // 1250 for fade-in and fade-out
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      id="app-loading-screen-animated-text"
      className="flex justify-center items-center min-h-screen"
    >
      <div className="text-6xl font-bold text-white sm:text-2xl">
        {trail.map((styles, i) => (
          <animated.span key={i} style={styles} className="inline-block">
            {letters[i] === ' ' ? '\u00A0' : letters[i]}
          </animated.span>
        ))}
      </div>
    </div>
  );
};

const App = ({ id }: { id: string }) => {
  const [t] = useTranslation();
  const { isAnimated, allowed, setIsAnimated } = useAllowedApps();
  const [app, setApp] = useState<ApiAllowedApp | null>();
  const { setShowBatchSendModal, showAccount, showHistory, showApps, showSend, showTransactionConfirmation } = useBottomMenuModal();
  const { walletAddress } = useTransactionKit();

  const [springs, api] = useSpring(() => ({
    from: { opacity: 0 },
    to: { opacity: 1 },
  }));

  useEffect(() => {
    const fetchApp = async () => {
      const foundApp = allowed.find((app) => app.appId === id);
      if (!foundApp) return;
      const loadedApp = await loadApp(foundApp);
      console.log('loadedApp', loadedApp);
      setApp(loadedApp as ApiAllowedApp);

      // Start the spring animation with reset, immediate, and configuration
      api.start({
        from: { opacity: 0 },
        to: { opacity: 1 },
        config: { duration: 500 },
        delay: isAnimated ? 1500 : 0, // 1500 delay to wait for animated text to fade in and out and overflow with app fade in animation
        reset: true,
      });
    };

    fetchApp();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Reset the animated loading flag after the initial animation finishes
  useEffect(() => {
    if (!isAnimated) return;
    const timeout = setTimeout(() => setIsAnimated(false), 1500);
    return () => clearTimeout(timeout);
  }, [isAnimated, setIsAnimated]);

  // External App Iframe Component
  const ExternalAppIframe = React.useMemo(() => {
    if (app?.type !== 'app-external' || !app.launchUrl) return null;

    return () => {
      const iframeRef = React.useRef<HTMLIFrameElement>(null);

      React.useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
          console.log('incoming event', event.data);
          // Verify origin for security
          if (!app.launchUrl || event.origin !== new URL(app.launchUrl).origin) return;

          if (event.data?.type === 'showAccount') {
            showAccount();
          }

          if (event.data?.type === 'showHistory') {
            showHistory();
          }

          if (event.data?.type === 'showApps') {
            showApps();
          }

          if (event.data?.type === 'showSend') {
            showSend();
          }

          if (event.data?.type === 'showTransactionConfirmation') {
            showTransactionConfirmation(event.data.payload);
          }

          if (event.data?.type === 'showBatchSendModal') {
            setShowBatchSendModal(true);
          }

          /**
           * If the app asks for the account data, return the account data
           */
          if (event.data?.type === 'getWalletAddresses') {
            iframeRef.current?.contentWindow?.postMessage({
              type: 'walletAddresses',
              payload: [{
                address: walletAddress,
                type: 'smart'
              }],
            }, '*');
          }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
      }, [app.launchUrl]);

      return (
        <iframe
          ref={iframeRef}
          src={app.launchUrl}
          style={{
            all: 'unset',
            width: '100vw',
            height: '100vh',
            border: 'none',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 1,
            background: 'white',
            display: 'block'
          }}
          title={app.title || app.name}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        />
      );
    };
  }, [app?.type, app?.launchUrl, app?.title, app?.name]);

  const ComponentToRender = React.lazy(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, isAnimated ? 1500 : 0); // 1500 delay to wait for animated text to fade in and out and overflow with app fade in animation
    }); // artificial 1s delay

    try {
      const appImport = await import(`../../apps/${id}`);
      return appImport;
    } catch (e) {
      console.error(`Failed to load app component for ${id}`, e);
      return { default: () => <Alert>{t`error.appNotFound`}</Alert> };
    }
  });

  // If it's an external app, render the iframe directly
  if (app?.type === 'app-external' && ExternalAppIframe) {
    return <ExternalAppIframe />;
  }

  return (
    <Suspense
      fallback={
        isAnimated && <AnimatedAppTitle text={app?.title || 'App loading...'} />
      }
    >
      <I18nextProvider i18n={i18n} defaultNS={`app:${id}`}>
        <animated.div
          style={{
            height: '100%',
            ...springs,
          }}
        >
          <ComponentToRender />
        </animated.div>
      </I18nextProvider>
    </Suspense>
  );
};

export default App;
