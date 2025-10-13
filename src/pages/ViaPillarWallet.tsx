import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { isAddress } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import * as Sentry from '@sentry/react';
import usePrivateKeyLogin from '../hooks/usePrivateKeyLogin';

/**
 * @name ViaPillarWallet
 * @description This component handles authentication from within the Pillar Wallet
 * React Native app. It communicates with the webview to securely receive the
 * private key without exposing it in URL parameters.
 */
const ViaPillarWallet = () => {
  const navigate = useNavigate();
  const { setAccount } = usePrivateKeyLogin();
  const [status, setStatus] = useState<'requesting' | 'received' | 'error'>('requesting');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const authRequestId = `pillar_wallet_auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Set Sentry context for this authentication flow
    Sentry.setContext('pillar_wallet_auth', {
      authRequestId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    });

    Sentry.addBreadcrumb({
      category: 'authentication',
      message: 'Pillar Wallet authentication initiated',
      level: 'info',
      data: {
        authRequestId,
      },
    });

    /**
     * Handler for receiving messages from the React Native webview
     */
    const handleWebViewMessage = (event: MessageEvent) => {

      console.log('handleWebViewMessage', event);
      try {
        const data = JSON.parse(event.data);

        Sentry.addBreadcrumb({
          category: 'authentication',
          message: 'Received webview message',
          level: 'info',
          data: {
            authRequestId,
            messageType: data?.type,
            hasValue: !!data?.value,
          },
        });

        // Check if this is the private key response
        if (data?.type === 'pillarWalletPkResponse' && data?.value?.pk) {
          const privateKey = data.value.pk;

          Sentry.addBreadcrumb({
            category: 'authentication',
            message: 'Private key received from webview',
            level: 'info',
            data: {
              authRequestId,
            },
          });

          try {
            // Convert private key to account address
            const privateKeyToAccountAddress = privateKeyToAccount(
              privateKey as `0x${string}`
            );

            if (isAddress(privateKeyToAccountAddress.address)) {
              // Set the account in state
              setAccount(privateKeyToAccountAddress.address);

              // Store in localStorage
              localStorage.setItem(
                'ACCOUNT_VIA_PK',
                privateKeyToAccountAddress.address
              );

              setStatus('received');

              Sentry.addBreadcrumb({
                category: 'authentication',
                message: 'Private key authentication successful',
                level: 'info',
                data: {
                  authRequestId,
                  accountAddress: privateKeyToAccountAddress.address,
                },
              });

              Sentry.captureMessage('Pillar Wallet authentication successful', {
                level: 'info',
                tags: {
                  component: 'authentication',
                  action: 'pillar_wallet_auth_success',
                  authRequestId,
                },
                contexts: {
                  pillar_wallet_auth: {
                    authRequestId,
                    accountAddress: privateKeyToAccountAddress.address,
                  },
                },
              });

              // Navigate to the main app
              setTimeout(() => {
                navigate('/');
              }, 500);
            } else {
              throw new Error('Invalid address derived from private key');
            }
          } catch (error) {
            console.error('Error processing private key:', error);
            setStatus('error');
            setErrorMessage('Failed to process private key');

            Sentry.captureException(error, {
              tags: {
                component: 'authentication',
                action: 'pillar_wallet_auth_error',
                authRequestId,
              },
              contexts: {
                pillar_wallet_auth: {
                  authRequestId,
                  error: error instanceof Error ? error.message : String(error),
                },
              },
            });
          }
        }
      } catch (error) {
        console.error('Error parsing webview message:', error);

        Sentry.captureException(error, {
          tags: {
            component: 'authentication',
            action: 'pillar_wallet_message_parse_error',
            authRequestId,
          },
          contexts: {
            pillar_wallet_auth: {
              authRequestId,
              error: error instanceof Error ? error.message : String(error),
            },
          },
        });
      }
    };

    // Add event listener for webview messages
    window.addEventListener('message', handleWebViewMessage);

    // Request private key from the React Native app
    const requestPrivateKey = () => {
      const message = JSON.stringify({
        type: 'pillarXAuthRequest',
        value: 'pk',
      });

      Sentry.addBreadcrumb({
        category: 'authentication',
        message: 'Requesting private key from webview',
        level: 'info',
        data: {
          authRequestId,
          message,
        },
      });

      // Send message to React Native webview
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(message);
      } else {
        // Fallback for testing in browser
        window.postMessage(message, '*');
      }
    };

    // Send the request after a short delay to ensure webview is ready
    const requestTimer = setTimeout(() => {
      requestPrivateKey();
    }, 100);

    // Cleanup
    return () => {
      window.removeEventListener('message', handleWebViewMessage);
      clearTimeout(requestTimer);
    };
  }, [navigate, setAccount]);

  return (
    <Container>
      {status === 'requesting' && (
        <>
          <LoadingSpinner />
          <StatusText>Connecting to Pillar Wallet...</StatusText>
        </>
      )}
      {status === 'received' && (
        <>
          <SuccessIcon>✓</SuccessIcon>
          <StatusText>Logged in!</StatusText>
        </>
      )}
      {status === 'error' && (
        <ErrorContainer>
          <ErrorTitle>Authentication Failed</ErrorTitle>
          <ErrorMessage>{errorMessage}</ErrorMessage>
          <RetryButton onClick={() => window.location.reload()}>
            Retry
          </RetryButton>
        </ErrorContainer>
      )}
    </Container>
  );
};

// Extend Window interface to include ReactNativeWebView
declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${({ theme }) => theme.color.background.body};
  padding: 20px;
`;

const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid ${({ theme }) => theme.color.background.card};
  border-top-color: ${({ theme }) => theme.color.text.body};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const SuccessIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #10b981;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: bold;
`;

const StatusText = styled.p`
  color: ${({ theme }) => theme.color.text.body};
  font-size: 16px;
  margin-top: 20px;
  text-align: center;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  max-width: 400px;
`;

const ErrorTitle = styled.h2`
  color: ${({ theme }) => theme.color.text.body};
  font-size: 24px;
  margin: 0;
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.color.text.body};
  font-size: 16px;
  text-align: center;
  margin: 0;
`;

const RetryButton = styled.button`
  background: ${({ theme }) => theme.color.background.card};
  color: ${({ theme }) => theme.color.text.body};
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

export default ViaPillarWallet;

