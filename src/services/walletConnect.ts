/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { usePrivy } from '@privy-io/react-auth';
import Client, { WalletKit, WalletKitTypes } from '@reown/walletkit';
import * as Sentry from '@sentry/react';
import { Core } from '@walletconnect/core';
import {
  formatJsonRpcError,
  formatJsonRpcResult,
} from '@walletconnect/jsonrpc-utils';
import { SessionTypes } from '@walletconnect/types';
import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils';
import { ethers } from 'ethers';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  checksumAddress,
  createPublicClient,
  formatEther,
  hexToBigInt,
  http,
  isAddressEqual,
} from 'viem';
import { useAccount } from 'wagmi';

// hooks
import useBottomMenuModal from '../hooks/useBottomMenuModal';
import useGlobalTransactionsBatch from '../hooks/useGlobalTransactionsBatch';
import useTransactionKit from '../hooks/useTransactionKit';
import useWalletConnectModal from '../hooks/useWalletConnectModal';
import useWalletConnectToast from '../hooks/useWalletConnectToast';

// constants
import { SendModalData } from '../types';
import {
  ETH_SEND_TX,
  ETH_SIGN_TYPED_DATA,
  ETH_SIGN_TYPED_DATA_V4,
  PERSONAL_SIGN,
  WALLETCONNECT_EVENT,
  getWalletAddressesFromSession,
} from '../utils/walletConnect';

// utils
import { getNetworkViem } from '../apps/deposit/utils/blockchain';
import { useComprehensiveLogout } from '../utils/logout';

// Helper function to capture Sentry events with context
const captureWithContext = (
  contextName: string,
  contextData: Record<string, unknown>,
  captureFn: () => void
) => {
  Sentry.withScope((scope) => {
    scope.setContext(contextName, contextData);
    captureFn();
  });
};

export const useWalletConnect = () => {
  const { walletAddress: wallet, kit } = useTransactionKit();
  const [walletKit, setWalletKit] = useState<Client>();
  const [activeSessions, setActiveSessions] =
    useState<Record<string, SessionTypes.Struct>>();
  const [isLoadingConnect, setIsLoadingConnect] = useState<boolean>(false);
  const {
    showTransactionConfirmation,
    hide,
    setWalletConnectPayload,
    walletConnectPayload,
  } = useBottomMenuModal();
  const { showToast } = useWalletConnectToast();
  const { showModal, hideModal } = useWalletConnectModal();
  const { user } = usePrivy();
  const { isConnected } = useAccount();

  const { logout: comprehensiveLogout } = useComprehensiveLogout();
  const { walletConnectTxHash, setWalletConnectTxHash } =
    useGlobalTransactionsBatch();
  const [isLoadingDisconnectAll, setIsLoadingDisconnectAll] =
    useState<boolean>(false);
  const [isLoadingDisconnect, setIsLoadingDisconnect] =
    useState<boolean>(false);
  const walletConnectTxHashRef = useRef<string | undefined>(
    walletConnectTxHash
  );
  const walletConnectPayloadRef = useRef<SendModalData | undefined>(
    walletConnectPayload
  );

  const prevSessionsRef = useRef<Record<string, SessionTypes.Struct>>({});

  // Sentry context for WalletConnect state
  useEffect(() => {
    Sentry.setContext('walletconnect_state', {
      hasWallet: !!wallet,
      hasWalletKit: !!walletKit,
      activeSessionsCount: Object.keys(activeSessions || {}).length,
      isLoadingConnect,
      isLoadingDisconnect,
      isLoadingDisconnectAll,
      hasUser: !!user,
      isConnected,
      hasWalletConnectTxHash: !!walletConnectTxHash,
      hasWalletConnectPayload: !!walletConnectPayload,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    });
  }, [
    wallet,
    walletKit,
    activeSessions,
    isLoadingConnect,
    isLoadingDisconnect,
    isLoadingDisconnectAll,
    user,
    isConnected,
    walletConnectTxHash,
    walletConnectPayload,
  ]);

  const handleLogout = async () => {
    const logoutId = `walletconnect_logout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Start Sentry transaction for logout
    Sentry.setContext('walletconnect_logout', {
      logoutId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      hasUser: !!user,
      isConnected,
      activeSessionsCount: Object.keys(activeSessions || {}).length,
    });

    Sentry.addBreadcrumb({
      category: 'walletconnect',
      message: 'WalletConnect logout initiated',
      level: 'info',
      data: {
        logoutId,
        hasUser: !!user,
        isConnected,
        activeSessionsCount: Object.keys(activeSessions || {}).length,
      },
    });

    let logoutError: Error | null = null;

    try {
      // Use comprehensive logout for both Privy and WAGMI
      await comprehensiveLogout();

      Sentry.addBreadcrumb({
        category: 'walletconnect',
        message: 'Comprehensive logout completed',
        level: 'info',
        data: { logoutId },
      });

      Sentry.captureMessage('WalletConnect logout completed successfully', {
        level: 'info',
        tags: {
          component: 'walletconnect',
          action: 'logout_success',
          logoutId,
        },
        contexts: {
          walletconnect_logout_success: {
            logoutId,
            hasUser: !!user,
            isConnected,
            activeSessionsCount: Object.keys(activeSessions || {}).length,
          },
        },
      });

      // Reload the page to ensure clean state
      window.location.reload();
    } catch (error) {
      logoutError = error instanceof Error ? error : new Error(String(error));

      Sentry.captureException(error, {
        tags: {
          component: 'walletconnect',
          action: 'logout_error',
          logoutId,
        },
        contexts: {
          walletconnect_logout_error: {
            logoutId,
            error: logoutError.message,
            hasUser: !!user,
            isConnected,
          },
        },
      });

      // Still reload the page even if logout fails
      window.location.reload();
    }
  };

  // useCallback to check if one of the walletConnect session
  // has been initialised by Privy login
  const isAddressInSessionViaPrivy = useCallback(
    (session: SessionTypes.Struct): boolean => {
      const addresses = getWalletAddressesFromSession(session);
      return addresses.some((addr) =>
        isAddressEqual(
          addr as `0x${string}`,
          user?.wallet?.address as `0x${string}`
        )
      );
    },
    [user?.wallet?.address]
  );

  // This is to logout if session was initialised by Privy
  const checkAndLogoutIfPrivySession = useCallback(
    (session: SessionTypes.Struct | undefined) => {
      if (!session) return false;

      const wasPrivyLinked = isAddressInSessionViaPrivy(session);

      if (wasPrivyLinked && user?.wallet?.address) {
        handleLogout();
        return true;
      }
      return false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isAddressInSessionViaPrivy, user?.wallet?.address]
  );

  // WalletConnect initialisation
  const initWalletKit = useCallback(async () => {
    const initId = `walletkit_init_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Start Sentry transaction for WalletKit initialization
    Sentry.withScope((scope) => {
      scope.setContext('walletkit_init', {
        initId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        projectId: import.meta.env.VITE_REOWN_PROJECT_ID ? 'SET' : 'NOT_SET',
        hasWallet: !!wallet,
        hasUser: !!user,
      });
    });

    Sentry.addBreadcrumb({
      category: 'walletconnect',
      message: 'Starting WalletKit initialization',
      level: 'info',
      data: {
        initId,
        projectId: import.meta.env.VITE_REOWN_PROJECT_ID ? 'SET' : 'NOT_SET',
      },
    });

    try {
      const core = new Core({
        projectId: import.meta.env.VITE_REOWN_PROJECT_ID,
      });

      Sentry.addBreadcrumb({
        category: 'walletconnect',
        message: 'WalletConnect Core created',
        level: 'info',
        data: { initId },
      });

      const walletKitInit = await WalletKit.init({
        core: core as any,
        metadata: {
          name: 'PillarX',
          description: 'PillarX',
          url: 'https://pillarx.app/',
          icons: ['https://pillarx.app/favicon.ico'],
        },
      });

      setWalletKit(walletKitInit);

      Sentry.addBreadcrumb({
        category: 'walletconnect',
        message: 'WalletKit initialization completed',
        level: 'info',
        data: {
          initId,
          hasWalletKit: !!walletKitInit,
        },
      });

      Sentry.captureMessage('WalletKit initialization completed successfully', {
        level: 'info',
        tags: {
          component: 'walletconnect',
          action: 'walletkit_init_success',
          initId,
        },
        contexts: {
          walletkit_init_success: {
            initId,
            hasWalletKit: !!walletKitInit,
            projectId: import.meta.env.VITE_REOWN_PROJECT_ID
              ? 'SET'
              : 'NOT_SET',
          },
        },
      });

      // Transaction completed successfully
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          component: 'walletconnect',
          action: 'walletkit_init_error',
          initId,
        },
        contexts: {
          walletkit_init_error: {
            initId,
            error: error instanceof Error ? error.message : String(error),
            projectId: import.meta.env.VITE_REOWN_PROJECT_ID
              ? 'SET'
              : 'NOT_SET',
          },
        },
      });
      throw error;
    }
  }, [wallet, user]);

  useEffect(() => {
    if (walletKit) return;
    const initWallet = async () => {
      try {
        await initWalletKit();
      } catch (e: any) {
        console.error('Error initialising Wallet Kit:', e.message);
        showToast({
          title: 'WalletConnect error',
          subtitle:
            'Something went wrong with WalletConnect, please try again.',
        });
      }
    };
    initWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initWalletKit, walletKit]);

  useEffect(() => {
    if (walletKit) {
      // Look for current active sessions
      const currentActiveSessions = walletKit?.getActiveSessions();
      setActiveSessions(currentActiveSessions);
    }
  }, [walletKit]);

  useEffect(() => {
    if (activeSessions) {
      prevSessionsRef.current = { ...activeSessions };
    }
  }, [activeSessions]);

  useEffect(() => {
    walletConnectTxHashRef.current = walletConnectTxHash;
  }, [walletConnectTxHash]);

  useEffect(() => {
    walletConnectPayloadRef.current = walletConnectPayload;
  }, [walletConnectPayload]);

  const getTransactionHash = async (): Promise<string | undefined> => {
    const txHashId = `get_tx_hash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Start Sentry transaction for transaction hash retrieval
    const contextData = {
      txHashId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      hasWalletConnectTxHash: !!walletConnectTxHashRef.current,
      hasWalletConnectPayload: !!walletConnectPayloadRef.current,
      timeout: 180000, // 3 minutes
    };

    Sentry.addBreadcrumb({
      category: 'walletconnect',
      message: 'Starting transaction hash retrieval',
      level: 'info',
      data: {
        txHashId,
        hasWalletConnectTxHash: !!walletConnectTxHashRef.current,
        hasWalletConnectPayload: !!walletConnectPayloadRef.current,
      },
    });

    const timeout = Date.now() + 180 * 1000; // 3 min timeout to leave enough time for the user to send the transaction and receive the hash
    let attempts = 0;
    while (!walletConnectTxHashRef.current && Date.now() < timeout) {
      attempts += 1;

      await new Promise<void>((resolve) => {
        setTimeout(resolve, 2000);
      });

      // Use the latest value from the ref
      if (walletConnectTxHashRef.current) {
        Sentry.addBreadcrumb({
          category: 'walletconnect',
          message: 'Transaction hash received successfully',
          level: 'info',
          data: {
            txHashId,
            attempts,
            txHash: walletConnectTxHashRef.current,
          },
        });

        const currentAttempts = attempts;
        const currentTxHash = walletConnectTxHashRef.current;
        const currentTimeElapsed = Date.now() - (timeout - 180000);

        captureWithContext('get_transaction_hash', contextData, () => {
          Sentry.captureMessage('Transaction hash retrieved successfully', {
            level: 'info',
            tags: {
              component: 'walletconnect',
              action: 'tx_hash_success',
              txHashId,
            },
            contexts: {
              tx_hash_success: {
                txHashId,
                attempts: currentAttempts,
                txHash: currentTxHash,
                timeElapsed: currentTimeElapsed,
              },
            },
          });
        });

        return walletConnectTxHashRef.current;
      }

      if (!walletConnectPayloadRef.current) {
        Sentry.addBreadcrumb({
          category: 'walletconnect',
          message: 'WalletConnect payload cleared during hash retrieval',
          level: 'warning',
          data: {
            txHashId,
            attempts,
          },
        });

        Sentry.captureMessage(
          'WalletConnect payload cleared during hash retrieval',
          {
            level: 'warning',
            tags: {
              component: 'walletconnect',
              action: 'tx_hash_payload_cleared',
              txHashId,
            },
            contexts: {
              tx_hash_payload_cleared: {
                txHashId,
                attempts,
                timeElapsed: Date.now() - (timeout - 180000),
              },
            },
          }
        );

        return undefined;
      }

      // Log progress every 10 attempts
      if (attempts % 10 === 0) {
        Sentry.addBreadcrumb({
          category: 'walletconnect',
          message: 'Transaction hash retrieval in progress',
          level: 'info',
          data: {
            txHashId,
            attempts,
            timeElapsed: Date.now() - (timeout - 180000),
          },
        });
      }
    }

    console.error('Transaction timeout: no transaction hash received.');

    Sentry.captureMessage('Transaction hash retrieval timeout', {
      level: 'error',
      tags: {
        component: 'walletconnect',
        action: 'tx_hash_timeout',
        txHashId,
      },
      contexts: {
        tx_hash_timeout: {
          txHashId,
          attempts,
          timeElapsed: 180000,
          hasWalletConnectTxHash: !!walletConnectTxHashRef.current,
          hasWalletConnectPayload: !!walletConnectPayloadRef.current,
        },
      },
    });

    // close send modal
    hide();

    // reset txHash to undefined
    setWalletConnectTxHash(undefined);

    return undefined;
  };

  const getSessionFromTopic = useCallback(
    (topic: string) => {
      const connections = Object.values(walletKit?.getActiveSessions() || {});
      return connections.find(
        (connection) =>
          connection.topic === topic || connection.pairingTopic === topic
      );
    },
    [walletKit]
  );

  const connect = useCallback(
    async (copiedUri: string) => {
      const connectId = `walletconnect_connect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Start Sentry transaction for WalletConnect connection
      Sentry.withScope((scope) => {
        scope.setContext('walletconnect_connect', {
          connectId,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          hasWalletKit: !!walletKit,
          hasWallet: !!wallet,
          hasUser: !!user,
          uriLength: copiedUri.length,
          uriStartsWith: copiedUri.substring(0, 20),
        });
      });

      Sentry.addBreadcrumb({
        category: 'walletconnect',
        message: 'Starting WalletConnect connection',
        level: 'info',
        data: {
          connectId,
          hasWalletKit: !!walletKit,
          uriLength: copiedUri.length,
        },
      });

      if (!walletKit) {
        try {
          await initWalletKit();

          Sentry.addBreadcrumb({
            category: 'walletconnect',
            message: 'WalletKit initialized during connection',
            level: 'info',
            data: { connectId },
          });
        } catch (e: any) {
          console.error('Error initialising Wallet Kit:', e.message);

          Sentry.captureException(e, {
            tags: {
              component: 'walletconnect',
              action: 'connect_init_error',
              connectId,
            },
            contexts: {
              walletconnect_connect_error: {
                connectId,
                error: e.message,
                hasWalletKit: !!walletKit,
              },
            },
          });

          showToast({
            title: 'WalletConnect error',
            subtitle:
              'Something went wrong with WalletConnect, please try again.',
          });

          return;
        }
      }

      try {
        setIsLoadingConnect(true);

        Sentry.addBreadcrumb({
          category: 'walletconnect',
          message: 'Initiating WalletConnect pairing',
          level: 'info',
          data: { connectId },
        });

        const peerWalletConnect = await walletKit?.core.pairing.pair({
          uri: copiedUri,
        });

        Sentry.addBreadcrumb({
          category: 'walletconnect',
          message: 'WalletConnect pairing completed',
          level: 'info',
          data: {
            connectId,
            hasPeerWalletConnect: !!peerWalletConnect,
            topic: peerWalletConnect?.topic,
          },
        });

        // Update activeSessions after pairing
        const updatedSessions = walletKit?.getActiveSessions();
        setActiveSessions(updatedSessions);

        // Wait for the session to be fully registered
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });

        const session = getSessionFromTopic(peerWalletConnect?.topic || '');
        if (session) {
          Sentry.addBreadcrumb({
            category: 'walletconnect',
            message: 'WalletConnect session found',
            level: 'info',
            data: {
              connectId,
              sessionName: session.peer?.metadata?.name,
              sessionIcons: session.peer?.metadata?.icons?.length,
            },
          });

          showToast({
            title: `${session.peer?.metadata?.name || 'Unnamed App'}`,
            subtitle: 'Connected via WalletConnect',
            image: `${session.peer?.metadata?.icons[0]}`,
          });

          Sentry.captureMessage('WalletConnect connection successful', {
            level: 'info',
            tags: {
              component: 'walletconnect',
              action: 'connect_success',
              connectId,
            },
            contexts: {
              walletconnect_connect_success: {
                connectId,
                sessionName: session.peer?.metadata?.name,
                sessionIcons: session.peer?.metadata?.icons?.length,
                topic: peerWalletConnect?.topic,
              },
            },
          });
        } else {
          Sentry.captureMessage(
            'WalletConnect session not found after pairing',
            {
              level: 'warning',
              tags: {
                component: 'walletconnect',
                action: 'connect_session_not_found',
                connectId,
              },
              contexts: {
                walletconnect_connect_warning: {
                  connectId,
                  topic: peerWalletConnect?.topic,
                  hasPeerWalletConnect: !!peerWalletConnect,
                },
              },
            }
          );
        }
      } catch (e) {
        Sentry.captureException(e, {
          tags: {
            component: 'walletconnect',
            action: 'connect_error',
            connectId,
          },
          contexts: {
            walletconnect_connect_error: {
              connectId,
              error: e instanceof Error ? e.message : String(e),
              errorString: `${e}`,
            },
          },
        });

        if (`${e}`.includes('Missing or invalid')) {
          showToast({
            title: 'WalletConnect',
            subtitle: 'Missing or invalid connection.',
          });
        } else if (`${e}`.includes('Pairing already exists')) {
          showToast({
            title: 'WalletConnect',
            subtitle:
              'Connection already exists. Please try again with a new connection.',
          });
        } else if (`${e}`.includes('URI has expired')) {
          showToast({
            title: 'WalletConnect',
            subtitle:
              'Connection has expired. Please try again with a new connection.',
          });
        } else {
          showToast({
            title: 'WalletConnect',
            subtitle:
              'Something went wrong. Please make sure you are using a valid connection.',
          });
        }
      } finally {
        setIsLoadingConnect(false);
      }
    },
    [walletKit, initWalletKit, showToast, getSessionFromTopic, wallet, user]
  );

  const disconnectSession = useCallback(
    async (topic: string) => {
      const disconnectId = `walletconnect_disconnect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Start Sentry transaction for session disconnection
      Sentry.withScope((scope) => {
        scope.setContext('walletconnect_disconnect', {
          disconnectId,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          topic,
          hasWalletKit: !!walletKit,
          hasUser: !!user,
        });
      });

      Sentry.addBreadcrumb({
        category: 'walletconnect',
        message: 'Starting WalletConnect session disconnection',
        level: 'info',
        data: {
          disconnectId,
          topic,
          hasWalletKit: !!walletKit,
        },
      });

      if (!walletKit) {
        try {
          await initWalletKit();

          Sentry.addBreadcrumb({
            category: 'walletconnect',
            message: 'WalletKit initialized during disconnection',
            level: 'info',
            data: { disconnectId },
          });
        } catch (e: any) {
          console.error('Error initialising Wallet Kit:', e.message);

          Sentry.captureException(e, {
            tags: {
              component: 'walletconnect',
              action: 'disconnect_init_error',
              disconnectId,
            },
            contexts: {
              walletconnect_disconnect_error: {
                disconnectId,
                error: e.message,
                topic,
                hasWalletKit: !!walletKit,
              },
            },
          });

          showToast({
            title: 'WalletConnect error',
            subtitle:
              'Something went wrong with WalletConnect, please try again.',
          });

          return;
        }
      }

      const sessionData = getSessionFromTopic(topic);
      const dAppName = sessionData?.peer?.metadata?.name ?? 'dApp';

      Sentry.addBreadcrumb({
        category: 'walletconnect',
        message: 'Session data retrieved for disconnection',
        level: 'info',
        data: {
          disconnectId,
          dAppName,
          hasSessionData: !!sessionData,
          sessionIcons: sessionData?.peer?.metadata?.icons?.length,
        },
      });

      try {
        setIsLoadingDisconnect(true);

        Sentry.addBreadcrumb({
          category: 'walletconnect',
          message: 'Initiating WalletConnect session disconnection',
          level: 'info',
          data: { disconnectId, topic },
        });

        await walletKit?.disconnectSession({
          topic,
          reason: getSdkError('USER_DISCONNECTED'),
        });

        Sentry.addBreadcrumb({
          category: 'walletconnect',
          message: 'WalletConnect session disconnection completed',
          level: 'info',
          data: { disconnectId, topic },
        });

        showToast({
          title: dAppName,
          subtitle: 'Session disconnected.',
          image: `${sessionData?.peer.metadata.icons[0]}`,
        });

        // Update activeSessions after disconnecting
        const updatedSessions = walletKit?.getActiveSessions();
        setActiveSessions(updatedSessions);

        checkAndLogoutIfPrivySession(sessionData);

        Sentry.captureMessage(
          'WalletConnect session disconnection successful',
          {
            level: 'info',
            tags: {
              component: 'walletconnect',
              action: 'disconnect_success',
              disconnectId,
            },
            contexts: {
              walletconnect_disconnect_success: {
                disconnectId,
                topic,
                dAppName,
                hasSessionData: !!sessionData,
              },
            },
          }
        );
      } catch (error: any) {
        console.error('Error disconnecting session:', error.message);

        Sentry.captureException(error, {
          tags: {
            component: 'walletconnect',
            action: 'disconnect_error',
            disconnectId,
          },
          contexts: {
            walletconnect_disconnect_error: {
              disconnectId,
              error: error.message,
              topic,
              dAppName,
              hasSessionData: !!sessionData,
            },
          },
        });

        showToast({
          title: dAppName,
          subtitle: 'Error while disconnecting session. Please try again.',
          image: `${sessionData?.peer?.metadata?.icons[0]}`,
        });
      } finally {
        setIsLoadingDisconnect(false);
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [walletKit, getSessionFromTopic, initWalletKit, showToast, user]
  );

  const disconnectAllSessions = useCallback(async () => {
    if (!walletKit) {
      try {
        await initWalletKit();
      } catch (e) {
        showToast({
          title: 'WalletConnect error',
          subtitle:
            'Something went wrong with WalletConnect, please try again.',
        });
      }
    }

    const currentSessions = walletKit?.getActiveSessions() ?? {};
    const sessionTopics = Object.keys(currentSessions);

    // Filter out any Privy session
    const topicsToDisconnect = sessionTopics.filter((topic) => {
      const session = currentSessions[topic];
      return !isAddressInSessionViaPrivy(session);
    });

    for (const topic of topicsToDisconnect) {
      try {
        setIsLoadingDisconnectAll(true);
        await walletKit?.disconnectSession({
          topic,
          reason: getSdkError('USER_DISCONNECTED'),
        });
        showToast({
          title: 'WalletConnect',
          subtitle: 'All sessions disconnected successfully.',
        });
      } catch (error) {
        showToast({
          title: 'WalletConnect',
          subtitle:
            'Error while disconnecting one or several sessions. Please try again, or try disconnecting sessions individually.',
        });
      }
      setIsLoadingDisconnectAll(false);
    }

    // Update activeSessions after all sessions are disconnected
    setActiveSessions(walletKit?.getActiveSessions());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initWalletKit, showToast, walletKit]);

  const onSessionProposal = useCallback(
    async (proposal: WalletKitTypes.SessionProposal) => {
      const { id, params } = proposal;

      const existingClientSession =
        walletKit?.getActiveSessions()[params.pairingTopic];

      if (!existingClientSession) {
        try {
          const approvedNamespaces = buildApprovedNamespaces({
            proposal: params,
            supportedNamespaces: {
              eip155: {
                chains: [
                  'eip155:11155111',
                  'eip155:1',
                  'eip155:100',
                  'eip155:137',
                  'eip155:8453',
                  'eip155:56',
                  'eip155:10',
                  'eip155:42161',
                ],
                methods: [
                  PERSONAL_SIGN,
                  ETH_SEND_TX,
                  ETH_SIGN_TYPED_DATA,
                  ETH_SIGN_TYPED_DATA_V4,
                ],
                events: [
                  WALLETCONNECT_EVENT.SESSION_PROPOSAL,
                  WALLETCONNECT_EVENT.SESSION_DELETE,
                  WALLETCONNECT_EVENT.SESSION_REQUEST,
                  WALLETCONNECT_EVENT.PROPOSAL_EXPIRE,
                  WALLETCONNECT_EVENT.SESSION_REQUEST_EXPIRE,
                ],
                accounts: [
                  `eip155:11155111:${wallet}`,
                  `eip155:1:${wallet}`,
                  `eip155:100:${wallet}`,
                  `eip155:137:${wallet}`,
                  `eip155:8453:${wallet}`,
                  `eip155:56:${wallet}`,
                  `eip155:10:${wallet}`,
                  `eip155:42161:${wallet}`,
                ],
              },
            },
          });

          const handleConfirmProposal = async () => {
            await walletKit?.approveSession({
              id,
              namespaces: approvedNamespaces,
            });

            setActiveSessions(walletKit?.getActiveSessions());
          };

          const handleRejectProposal = async () => {
            await walletKit?.rejectSession({
              id,
              reason: getSdkError('USER_REJECTED'),
            });
          };
          showModal(proposal, handleConfirmProposal, handleRejectProposal);
        } catch (e) {
          await walletKit?.rejectSession({
            id,
            reason: getSdkError('USER_REJECTED'),
          });

          const dAppName = params?.proposer?.metadata?.name || 'Unnamed App';

          if (`${e}`.includes('Non conforming namespaces')) {
            if (`${e}`.includes('approve() namespaces chains')) {
              showToast({
                title: 'WalletConnect',
                subtitle: `PillarX chains not compatible with ${dAppName} chains.`,
              });
            } else if (`${e}`.includes('approve() namespaces events')) {
              showToast({
                title: 'WalletConnect',
                subtitle: `PillarX events not compatible with ${dAppName} events.`,
              });
            } else if (`${e}`.includes('approve() namespaces methods')) {
              showToast({
                title: 'WalletConnect',
                subtitle: `PillarX methods not compatible with ${dAppName} methods.`,
              });
            } else {
              showToast({
                title: 'WalletConnect',
                subtitle: `PillarX not compatible with ${dAppName}.`,
              });
            }
          } else {
            showToast({
              title: 'WalletConnect',
              subtitle: `Session approval rejected with ${dAppName}.`,
            });
          }
        }
      } else {
        showToast({
          title: 'WalletConnect',
          subtitle:
            'Connection already exists. Please try again with a new connection.',
        });
      }
    },
    [showModal, showToast, wallet, walletKit]
  );

  const onSessionDelete = useCallback(
    (event: { topic: string }) => {
      const deletedTopic = event.topic;

      const deletedSession = prevSessionsRef.current[deletedTopic];

      checkAndLogoutIfPrivySession(deletedSession);

      // Update activeSessions after dApp disconnecting
      const updatedSessions = walletKit?.getActiveSessions();
      setActiveSessions(updatedSessions);

      showToast({
        title: 'WalletConnect',
        subtitle: 'A connection ended from the dApp.',
      });
    },
    [showToast, walletKit, checkAndLogoutIfPrivySession]
  );

  const onSessionRequest = useCallback(
    async (requestEvent: WalletKitTypes.SessionRequest) => {
      const { topic, params, id } = requestEvent;
      const { request, chainId } = params;

      // Retrieve session metadata
      const sessions = walletKit?.getActiveSessions();
      const session = sessions?.[topic];
      const dAppName = session?.peer?.metadata?.name;

      const chainIdNumber = Number(chainId.replace('eip155:', ''));
      let requestResponse: string | undefined;

      try {
        // Get wallet mode
        const { walletMode } = kit.getEtherspotProvider().getConfig();
        const isDelegatedEoa = walletMode === 'delegatedEoa';

        if (request.method === PERSONAL_SIGN) {
          const requestParamsMessage = request.params[0];

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const humanReadableMessage =
            ethers.utils.toUtf8String(requestParamsMessage);

          const message = request.params.filter(
            (p: string) => !ethers.utils.isAddress(p)
          )[0];

          if (isDelegatedEoa) {
            // In delegatedEoa mode, use wallet client directly
            const walletClient = await kit
              .getEtherspotProvider()
              .getWalletClient();

            const { account } = walletClient;
            if (!account) {
              throw new Error('Wallet client does not have an account');
            }

            requestResponse = await walletClient.signMessage({
              account,
              message: { raw: message as `0x${string}` },
            });

            const publicClient = createPublicClient({
              chain: getNetworkViem(chainIdNumber),
              transport: http(),
            });

            const valid = await publicClient.verifyMessage({
              address: account.address,
              message: { raw: message as `0x${string}` },
              signature: requestResponse as `0x${string}`,
            });

            if (!valid) {
              // eslint-disable-next-line no-console
              console.error('Signature verification failed');
            }
          } else {
            // In modular mode, use SDK
            const eSdk = await kit.getSdk(chainIdNumber);
            requestResponse = await eSdk.signMessage({
              message,
            });
          }
        }

        if (
          request.method === ETH_SIGN_TYPED_DATA ||
          request.method === ETH_SIGN_TYPED_DATA_V4
        ) {
          const requestParamsMessage = await request.params[1];

          const parseRequest =
            typeof requestParamsMessage === 'string'
              ? JSON.parse(requestParamsMessage)
              : requestParamsMessage;

          const { domain } = parseRequest;
          const { types } = parseRequest;
          const { primaryType } = parseRequest;
          const { message } = parseRequest;

          if (isDelegatedEoa) {
            // In delegatedEoa mode, use wallet client directly
            const walletClient = await kit
              .getEtherspotProvider()
              .getWalletClient();

            const { account } = walletClient;
            if (!account) {
              throw new Error('Wallet client does not have an account');
            }

            requestResponse = await walletClient.signTypedData({
              account,
              domain,
              types,
              primaryType,
              message,
            });
          } else {
            // In modular mode, use SDK
            const eSdk = await kit.getSdk(chainIdNumber);
            requestResponse = await eSdk.signTypedData({
              domain,
              types,
              primaryType,
              message,
            });
          }
        }

        if (request.method === ETH_SEND_TX) {
          const transaction = request.params[0];

          const isApprovalTransaction =
            !!transaction.data?.startsWith('0x095ea7b3');

          if (isApprovalTransaction) {
            const approvalRequest = {
              title: 'WalletConnect Approval Request',
              description: `${dAppName} is requesting approval for a contract.`,
              transaction: {
                to: checksumAddress(transaction.to),
                data: transaction.data,
                chainId: chainIdNumber,
              },
            };

            showTransactionConfirmation(approvalRequest);

            setWalletConnectPayload(approvalRequest);

            requestResponse = await getTransactionHash();
          } else {
            const transactionRequest = {
              title: 'WalletConnect Transaction Request',
              description: `${dAppName} wants to send a transaction`,
              transaction: {
                to: checksumAddress(transaction.to),
                value: transaction.value
                  ? formatEther(hexToBigInt(transaction.value))
                  : '0',
                data: transaction.data,
                chainId: chainIdNumber,
              },
            };

            showTransactionConfirmation(transactionRequest);

            setWalletConnectPayload(transactionRequest);

            requestResponse = await getTransactionHash();
          }
        }

        // Respond with success
        await walletKit?.respondSessionRequest({
          topic,
          response: formatJsonRpcResult(id, requestResponse),
        });
        setWalletConnectTxHash(undefined);
        setWalletConnectPayload(undefined);
      } catch (e: any) {
        console.error('WalletConnect session request error:', e.message);
        try {
          await walletKit?.respondSessionRequest({
            topic,
            response: formatJsonRpcError(id, e),
          });
        } catch (responseError) {
          console.error(
            'Error responding to WalletConnect request:',
            responseError
          );
        }

        setWalletConnectTxHash(undefined);
        setWalletConnectPayload(undefined);
        showToast({
          title: 'WalletConnect',
          subtitle:
            'The request has failed or has timed out - there was a session request error. Please check if the transaction has executed successfully before trying again.',
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [walletKit, kit]
  );

  const onSessionRequestExpires = useCallback(
    async (requestEvent: WalletKitTypes.SessionRequestExpire) => {
      const { id } = requestEvent;

      const pendingSessions = walletKit?.getPendingSessionRequests() || [];

      const matchingSession = pendingSessions.find(
        (session) => session.id === id
      );

      if (!matchingSession) {
        showToast({
          title: 'WalletConnect',
          subtitle:
            'The request has failed - there was a session request error. Please try again.',
        });
        return;
      }

      const { topic } = matchingSession;

      try {
        await walletKit?.respondSessionRequest({
          topic,
          response: formatJsonRpcError(id, 'Session request expired'),
        });
        showToast({
          title: 'WalletConnect',
          subtitle: 'The session request has expired. Please try again.',
        });
      } catch (e: any) {
        console.error('WalletConnect session request error:', e.message);
        await walletKit?.respondSessionRequest({
          topic,
          response: formatJsonRpcError(id, e),
        });
        showToast({
          title: 'WalletConnect',
          subtitle:
            'The request has failed - there was a session request error. Please try again.',
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [walletKit, kit]
  );

  // Handler for WalletConnect Relay errors (unknown payloads from expired sessions, etc.)
  const handleUnknownEvent = useCallback((error: any) => {
    // Silently handle WalletConnect Relay errors for unknown payloads
    // These are often from expired sessions or incompatible dApps
    // eslint-disable-next-line no-console
    console.error('WalletConnect unknown event/error:', error);
  }, []);

  useEffect(() => {
    if (!walletKit) return;

    walletKit.on('session_proposal', onSessionProposal);
    walletKit.on('session_delete', onSessionDelete);
    walletKit.on('session_request', onSessionRequest);
    walletKit.on('proposal_expire', hideModal);
    walletKit.on('session_request_expire', onSessionRequestExpires);

    // Catch any unknown/error events from WalletConnect Core
    if ((walletKit as any).core) {
      (walletKit as any).core.relayer.on('relayer_error', handleUnknownEvent);
    }

    const initialSessions = walletKit.getActiveSessions();
    if (initialSessions) {
      prevSessionsRef.current = { ...initialSessions };
    }

    // eslint-disable-next-line consistent-return
    return () => {
      walletKit.off('session_proposal', onSessionProposal);
      walletKit.off('session_delete', onSessionDelete);
      walletKit.off('session_request', onSessionRequest);
      walletKit.off('proposal_expire', hideModal);
      walletKit.off('session_request_expire', onSessionRequestExpires);

      if ((walletKit as any).core) {
        (walletKit as any).core.relayer.off(
          'relayer_error',
          handleUnknownEvent
        );
      }
    };
  }, [
    walletKit,
    onSessionProposal,
    onSessionDelete,
    onSessionRequest,
    onSessionRequestExpires,
    hideModal,
    handleUnknownEvent,
  ]);

  return {
    connect,
    disconnect: disconnectSession,
    disconnectAllSessions,
    activeSessions,
    isLoadingConnect,
    isLoadingDisconnect,
    isLoadingDisconnectAll,
  };
};
