/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { useEtherspot, useWalletAddress } from '@etherspot/transaction-kit';
import Client, { WalletKit, WalletKitTypes } from '@reown/walletkit';
import { Core } from '@walletconnect/core';
import {
  formatJsonRpcError,
  formatJsonRpcResult,
} from '@walletconnect/jsonrpc-utils';
import { SessionTypes } from '@walletconnect/types';
import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils';
import { ethers } from 'ethers';
import { useCallback, useEffect, useRef, useState } from 'react';
import { checksumAddress, formatEther, hexToBigInt } from 'viem';

// hooks
import useBottomMenuModal from '../hooks/useBottomMenuModal';
import useGlobalTransactionsBatch from '../hooks/useGlobalTransactionsBatch';
import useWalletConnectModal from '../hooks/useWalletConnectModal';
import useWalletConnectToast from '../hooks/useWalletConnectToast';

// constants
import { SendModalData } from '../types';
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

  // WalletConnect initialisation
  const initWalletKit = useCallback(async () => {
    const core = new Core({
      projectId: process.env.REACT_APP_REOWN_PROJECT_ID,
    });

    const walletKitInit = await WalletKit.init({
      core,
      metadata: {
        name: 'PillarX',
        description: 'PillarX',
        url: 'https://pillarx.app/',
        icons: ['https://pillarx.app/favicon.ico'],
      },
    });

    setWalletKit(walletKitInit);
  }, []);

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
    walletConnectTxHashRef.current = walletConnectTxHash;
  }, [walletConnectTxHash]);

  useEffect(() => {
    walletConnectPayloadRef.current = walletConnectPayload;
  }, [walletConnectPayload]);

  const getTransactionHash = async (): Promise<string | undefined> => {
    const timeout = Date.now() + 180 * 1000; // 3 min timeout to leave enough time for the user to send the transaction and receive the hash
    while (!walletConnectTxHashRef.current && Date.now() < timeout) {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 2000);
      });

      // Use the latest value from the ref
      if (walletConnectTxHashRef.current) {
        return walletConnectTxHashRef.current;
      }

      if (!walletConnectPayloadRef.current) {
        return undefined;
      }
    }

    console.error('Transaction timeout: no transaction hash received.');

    // close send modal
    hide();

    // reset txHash to undefined
    setWalletConnectTxHash(undefined);

    // sowing error to user
    showToast({
      title: 'WalletConnect',
      subtitle:
        'Oops, the transaction timed out. Please check if the transaction has executed successfully before trying again.',
    });

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
      if (!walletKit) {
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
            title: `${session.peer?.metadata?.name || 'Unnamed App'}`,
            subtitle: 'Connected via WalletConnect',
            image: `${session.peer?.metadata?.icons[0]}`,
          });
        }
      } catch (e) {
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
        } catch (e: any) {
          console.error('Error initialising Wallet Kit:', e.message);
          showToast({
            title: 'WalletConnect error',
            subtitle:
              'Something went wrong with WalletConnect, please try again.',
          });
        }
      }

      const sessionData = getSessionFromTopic(topic);

      const dAppName = sessionData?.peer?.metadata?.name ?? 'dApp';

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
      } catch (error: any) {
        console.error('Error disconnecting session:', error.message);
        showToast({
          title: dAppName,
          subtitle: 'Error while disconnecting session. Please try again.',
          image: `${sessionData?.peer?.metadata?.icons[0]}`,
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
                ],
                methods: [PERSONAL_SIGN, ETH_SEND_TX, ETH_SIGN_TYPED_DATA],
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

  const onSessionDelete = useCallback(() => {
    // Update activeSessions after dApp disconnecting
    const updatedSessions = walletKit?.getActiveSessions();
    setActiveSessions(updatedSessions);

    showToast({
      title: 'WalletConnect',
      subtitle: 'A connection ended from the dApp.',
    });
  }, [showToast, walletKit]);

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

      const eSdk = await getSdk();

      if (request.method === PERSONAL_SIGN) {
        const requestParamsMessage = request.params[0];

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        const transaction = request.params[0];

        const isApprovalTransaction =
          !!transaction.data.startsWith('0x095ea7b3');

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
              value: formatEther(hexToBigInt(transaction.value)),
              data: transaction.data,
              chainId: chainIdNumber,
            },
          };

          showTransactionConfirmation(transactionRequest);

          setWalletConnectPayload(transactionRequest);

          requestResponse = await getTransactionHash();
        }
      }

      try {
        await walletKit?.respondSessionRequest({
          topic,
          response: formatJsonRpcResult(id, requestResponse),
        });
        setWalletConnectTxHash(undefined);
        setWalletConnectPayload(undefined);
      } catch (e: any) {
        console.error('WalletConnect session request error:', e.message);
        await walletKit?.respondSessionRequest({
          topic,
          response: formatJsonRpcError(id, e),
        });
        setWalletConnectTxHash(undefined);
        setWalletConnectPayload(undefined);
        showToast({
          title: 'WalletConnect',
          subtitle:
            'The request has failed - there was a session request error. Please try again.',
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [walletKit, getSdk]
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
    [walletKit, getSdk]
  );

  useEffect(() => {
    if (!walletKit) return;

    walletKit.on('session_proposal', onSessionProposal);
    walletKit.on('session_delete', onSessionDelete);
    walletKit.on('session_request', onSessionRequest);
    walletKit.on('proposal_expire', hideModal);
    walletKit.on('session_request_expire', onSessionRequestExpires);

    // eslint-disable-next-line consistent-return
    return () => {
      walletKit.off('session_proposal', onSessionProposal);
      walletKit.off('session_delete', onSessionDelete);
      walletKit.off('session_request', onSessionRequest);
      walletKit.on('proposal_expire', hideModal);
      walletKit.off('session_request_expire', onSessionRequestExpires);
    };
  }, [
    walletKit,
    onSessionProposal,
    onSessionDelete,
    onSessionRequest,
    onSessionRequestExpires,
    hideModal,
  ]);

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
