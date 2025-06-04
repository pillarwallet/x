/* eslint-disable react/button-has-type */
/* eslint-disable no-console */
import React, { useRef } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useXInterface } from './useXInterface';
import useBottomModal from '../hooks/useBottomMenuModal';

export const XInterfaceExample: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { showAccount, hide } = useBottomModal();
  const { user, login, logout } = usePrivy();

  const { registerMethods, callIframeMethod } = useXInterface({
    allowedOrigins: ['https://your-iframe-domain.com'],
  });

  // Register methods that can be called from the iframe
  React.useEffect(() => {
    registerMethods({
      showActionBarAccounts: () => showAccount(),
      hideActionBar: () => hide(),
      getUser: () => user,
      login: () => login(),
      logout: () => logout(),
    });
  }, [registerMethods, user, login, logout, showAccount, hide]);

  // Example of calling a method in the iframe
  const handleIframeAction = async () => {
    if (iframeRef.current) {
      try {
        const result = await callIframeMethod(
          iframeRef.current,
          'someIframeMethod',
          'arg1',
          'arg2'
        );
        console.log('Iframe method result:', result);
      } catch (error) {
        console.error('Error calling iframe method:', error);
      }
    }
  };

  return (
    <div>
      <iframe
        ref={iframeRef}
        src="https://your-iframe-domain.com"
        title="X-Interface Example"
        style={{ width: '100%', height: '500px', border: 'none' }}
      />
      <button onClick={handleIframeAction}>Call Iframe Method</button>
    </div>
  );
};
