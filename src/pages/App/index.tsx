/* eslint-disable react/no-unstable-nested-components */
import { animated, useSpring, useTrail } from '@react-spring/web';
import i18n from 'i18next';
import React, { Suspense, useEffect, useState } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';

// components
import Alert from '../../components/Text/Alert';

// apps
import { loadApp } from '../../apps';
import { AppManifest } from '../../types';

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
  const [app, setApp] = useState<AppManifest | null>();

  const [springs, api] = useSpring(() => ({
    from: { opacity: 0 },
    to: { opacity: 1 },
  }));

  useEffect(() => {
    const loadedApp = loadApp(id);
    setApp(loadedApp);

    // Start the spring animation with reset, immediate, and configuration
    api.start({
      from: { opacity: 0 },
      to: { opacity: 1 },
      config: { duration: 500 },
      delay: 1500, // 1500 delay to wait for animated text to fade in and out and overflow with app fade in animation
      reset: true,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const ComponentToRender = React.lazy(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 1500); // 1500 delay to wait for animated text to fade in and out and overflow with app fade in animation
    }); // artificial 1s delay
    try {
      return await import(`../../apps/${id}`);
    } catch (e) {
      return { default: () => <Alert>{t`error.appNotFound`}</Alert> };
    }
  });

  return (
    <Suspense
      fallback={<AnimatedAppTitle text={app?.title || 'App loading...'} />}
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
