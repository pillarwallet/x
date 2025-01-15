/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { useEtherspot, useWalletAddress } from '@etherspot/transaction-kit';
import Client, { WalletKit, WalletKitTypes } from '@reown/walletkit';
import { Core } from '@walletconnect/core';
import {
  formatJsonRpcError,
  formatJsonRpcResult,
} from '@walletconnect/jsonrpc-utils';
import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils';
import { ethers } from 'ethers';
import { useCallback, useEffect, useState } from 'react';

// hooks
import useBottomMenuModal from '../hooks/useBottomMenuModal';
import useGlobalTransactionsBatch from '../hooks/useGlobalTransactionsBatch';
import useWalletConnectToast from '../hooks/useWalletConnectToast';

// constants
import {
  ETH_SEND_TX,
  ETH_SIGN_TYPED_DATA,
  PERSONAL_SIGN,
  WALLETCONNECT_EVENT,
} from '../utils/walletConnectConstants';

export const useWalletConnect = () => {
  const wallet = useWalletAddress();
  const { getSdk } = useEtherspot();
  const [walletKit, setWalletKit] = useState<Client>();
  const [activeSessions, setActiveSessions] = useState<any>();
  const [isLoadingConnect, setIsLoadingConnect] = useState<boolean>(false);
  const { addToBatch } = useGlobalTransactionsBatch();
  const { showSend, setShowBatchSendModal } = useBottomMenuModal();
  const { showToast } = useWalletConnectToast();
  const [isLoadingDisconnectAll, setIsLoadingDisconnectAll] =
    useState<boolean>(false);
  const [isLoadingDisconnect, setIsLoadingDisconnect] =
    useState<boolean>(false);

  // WalletConnect initialisation
  const initWalletKit = useCallback(async () => {
    const core = new Core({
      projectId: process.env.REACT_APP_REOWN_PROJECT_ID,
    });

    const walletKitInit = await WalletKit.init({
      core,
      metadata: {
        name: 'PillarX Wallet',
        description: 'PillarX Wallet',
        url: 'https://pillarx.app/',
        icons: [],
      },
    });

    setWalletKit(walletKitInit);
  }, []);

  useEffect(() => {
    if (walletKit) return;
    const initWallet = async () => {
      try {
        await initWalletKit();
      } catch (e) {
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

      try {
        setIsLoadingConnect(true);
        const peerWalletConnect = await walletKit?.core.pairing.pair({
          uri: copiedUri,
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
          showToast({
            title: `${session.peer.metadata.name}`,
            subtitle: 'Connected via WalletConnect.',
            image: `${session.peer.metadata.icons[0]}`,
          });
        }
      } catch (e) {
        if (`${e}`.includes('Missing or invalid')) {
          showToast({
            title: 'Missing or invalid connection',
            subtitle: 'Missing or invalid WalletConnect connection.',
          });
        } else if (`${e}`.includes('Pairing already exists')) {
          showToast({
            title: 'Connection already exists',
            subtitle: 'Please try again with a new WalletConnect connection.',
          });
        } else if (`${e}`.includes('URI has expired')) {
          showToast({
            title: 'Connection has expired',
            subtitle: 'Please try again with a new WalletConnect connection.',
          });
        } else {
          showToast({
            title: 'Something went wrong.',
            subtitle:
              'Please make sure you are using a valid WalletConnect connection.',
          });
        }
      }
      setIsLoadingConnect(false);
    },
    [walletKit, initWalletKit, showToast, getSessionFromTopic]
  );

  const disconnect = useCallback(
    async (topic: string) => {
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

      const sessionData = getSessionFromTopic(topic);

      const dAppName = sessionData?.peer.metadata.name ?? 'dApp';

      try {
        setIsLoadingDisconnect(true);
        await walletKit?.disconnectSession({
          topic,
          reason: getSdkError('USER_DISCONNECTED'),
        });

        showToast({
          title: dAppName,
          subtitle: 'Session disconnected.',
          image: `${sessionData?.peer.metadata.icons[0]}`,
        });

        // Update activeSessions after disconnecting
        const updatedSessions = walletKit?.getActiveSessions();
        setActiveSessions(updatedSessions);
      } catch (error) {
        showToast({
          title: dAppName,
          subtitle: 'Error while disconnecting session. Please try again.',
          image: `${sessionData?.peer.metadata.icons[0]}`,
        });
      }

      setIsLoadingDisconnect(false);
    },
    [getSessionFromTopic, initWalletKit, showToast, walletKit]
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

    for (const topic of sessionTopics) {
      try {
        setIsLoadingDisconnectAll(true);
        await walletKit?.disconnectSession({
          topic,
          reason: getSdkError('USER_DISCONNECTED'),
        });
        showToast({
          title: 'All sessions disconnected',
          subtitle: 'All sessions disconnected successfully.',
        });
      } catch (error) {
        showToast({
          title: 'Unsuccessful disconnection',
          subtitle:
            'Error while disconnecting one or several sessions. Please try again, or try disconnecting sessions individually.',
        });
      }
      setIsLoadingDisconnectAll(false);
    }

    // Update activeSessions after all sessions are disconnected
    setActiveSessions(walletKit?.getActiveSessions());
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
                chains: ['eip155:1', 'eip155:100', 'eip155:137', 'eip155:8453'],
                methods: [
                  PERSONAL_SIGN,
                  // ETH_SIGN,
                  ETH_SEND_TX,
                  // ETH_SIGN_TX,
                  ETH_SIGN_TYPED_DATA,
                  // ETH_SIGN_TYPED_DATA_V4,
                  // WALLET_SWITCH_CHAIN,
                ],
                events: [
                  WALLETCONNECT_EVENT.AUTH_REQUEST,
                  WALLETCONNECT_EVENT.CALL_REQUEST,
                  WALLETCONNECT_EVENT.CONNECT,
                  WALLETCONNECT_EVENT.DISCONNECT,
                  WALLETCONNECT_EVENT.SESSION_DELETE,
                  WALLETCONNECT_EVENT.SESSION_PROPOSAL,
                  WALLETCONNECT_EVENT.SESSION_REQUEST,
                  WALLETCONNECT_EVENT.SESSION_UPDATE,
                  WALLETCONNECT_EVENT.TRANSPORT_ERROR,
                  WALLETCONNECT_EVENT.CHAIN_CHANGED,
                  'accountsChanged',
                ],
                accounts: [
                  `eip155:1:${wallet}`,
                  `eip155:100:${wallet}`,
                  `eip155:137:${wallet}`,
                  `eip155:8453:${wallet}`,
                ],
              },
            },
          });

          await walletKit?.approveSession({
            id,
            namespaces: approvedNamespaces,
          });

          setActiveSessions(walletKit?.getActiveSessions());
        } catch (e) {
          await walletKit?.rejectSession({
            id,
            reason: getSdkError('USER_REJECTED'),
          });

          if (`${e}`.includes('Non conforming namespaces')) {
            if (`${e}`.includes('approve() namespaces chains')) {
              showToast({
                title: `${params.proposer.metadata.name} not compatible`,
                subtitle: `PillarX wallet chains not compatible with ${params.proposer.metadata.name} chains.`,
              });
            } else if (`${e}`.includes('approve() namespaces events')) {
              showToast({
                title: `${params.proposer.metadata.name} not compatible`,
                subtitle: `PillarX wallet events not compatible with ${params.proposer.metadata.name} events.`,
              });
            } else if (`${e}`.includes('approve() namespaces methods')) {
              showToast({
                title: `${params.proposer.metadata.name} not compatible`,
                subtitle: `PillarX wallet methods not compatible with ${params.proposer.metadata.name} methods.`,
              });
            } else {
              showToast({
                title: `${params.proposer.metadata.name} not compatible`,
                subtitle: `PillarX wallet not compatible with ${params.proposer.metadata.name}.`,
              });
            }
          } else {
            showToast({
              title: 'WalletConnect session rejected',
              subtitle: 'Session approval rejected.',
            });
          }
        }
      } else {
        showToast({
          title: 'Connection already exists',
          subtitle: 'Please try again with a new WalletConnect connection.',
        });
      }
    },
    [showToast, wallet, walletKit]
  );

  const onSessionDelete = useCallback(() => {
    // Update activeSessions after dApp disconnecting
    const updatedSessions = walletKit?.getActiveSessions();
    setActiveSessions(updatedSessions);

    showToast({
      title: 'Connection ended',
      subtitle: 'A WalletConnect connection ended from the dApp.',
    });
  }, [showToast, walletKit]);

  const onSessionRequest = useCallback(
    async (requestEvent: WalletKitTypes.SessionRequest) => {
      const { topic, params, id } = requestEvent;
      const { request, chainId } = params;

      const chainIdNumber = Number(chainId.replace('eip155:', ''));
      let requestResponse: string | undefined;

      const eSdk = await getSdk();

      if (request.method === PERSONAL_SIGN) {
        const requestParamsMessage = request.params[0];

        const humanReadableMessage =
          ethers.utils.toUtf8String(requestParamsMessage);

        const message = request.params.filter(
          (p: string) => !ethers.utils.isAddress(p)
        )[0];

        requestResponse = await eSdk.signMessage({
          message,
        });
      }

      if (request.method === ETH_SIGN_TYPED_DATA) {
        const requestParamsMessage = await request.params[1];

        // Safe parsing
        const parseRequest =
          typeof requestParamsMessage === 'string'
            ? JSON.parse(requestParamsMessage)
            : requestParamsMessage;

        const { domain } = parseRequest;
        const { types } = parseRequest;
        const { primaryType } = parseRequest;
        const { message } = parseRequest;

        requestResponse = await eSdk.signTypedData({
          domain,
          types,
          primaryType,
          message,
        });
      }

      if (request.method === ETH_SEND_TX) {
        const sendTransactionToBatch = async () => {
          try {
            addToBatch({
              title: 'WalletConnect transaction',
              description: '',
              chainId: chainIdNumber,
              to: eSdk.getEOAAddress(),
              value: request.params.value,
              data: request.params.data,
            });
            setShowBatchSendModal(true);
            showSend();
          } catch (error) {
            showToast({
              title: 'Transaction batch fail',
              subtitle:
                'The transaction was not able to be added this to the queue at the moment. Please try again.',
            });
          }
        };

        await sendTransactionToBatch();

        requestResponse = 'Transaction sent to PillarX wallet.';
      }

      try {
        console.log(
          'formatJsonRpcResult:',
          formatJsonRpcResult(id, requestResponse)
        );
        await walletKit?.respondSessionRequest({
          topic,
          response: formatJsonRpcResult(id, requestResponse),
        });
      } catch (e: any) {
        console.log('ERROR', formatJsonRpcError(id, e));
        await walletKit?.respondSessionRequest({
          topic,
          response: formatJsonRpcError(id, e),
        });
      }
    },
    [walletKit, getSdk]
  );

  useEffect(() => {
    if (!walletKit) return;

    walletKit.on('session_proposal', onSessionProposal);
    walletKit.on('session_delete', onSessionDelete);
    walletKit.on('session_request', onSessionRequest);

    // eslint-disable-next-line consistent-return
    return () => {
      walletKit.off('session_proposal', onSessionProposal);
      walletKit.off('session_delete', onSessionDelete);
      walletKit.off('session_request', onSessionRequest);
    };
  }, [walletKit, onSessionProposal, onSessionDelete, onSessionRequest]);

  return {
    connect,
    disconnect,
    disconnectAllSessions,
    activeSessions,
    isLoadingConnect,
    isLoadingDisconnect,
    isLoadingDisconnectAll,
  };
};
