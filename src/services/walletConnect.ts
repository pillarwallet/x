/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { useEtherspot } from '@etherspot/transaction-kit';
import Client, { WalletKit, WalletKitTypes } from '@reown/walletkit';
import { Core } from '@walletconnect/core';
import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils';
import { useCallback, useEffect, useState } from 'react';
import { hexToString } from 'viem';
import {
  ETH_SEND_TX,
  ETH_SIGN,
  ETH_SIGN_TX,
  ETH_SIGN_TYPED_DATA,
  ETH_SIGN_TYPED_DATA_V4,
  PERSONAL_SIGN,
  WALLETCONNECT_EVENT,
  WALLET_SWITCH_CHAIN,
} from '../utils/walletConnectConstants';

export const useWalletConnect = (accountAddress: string) => {
  // const { wallets } = useWallets();
  const { getSdk } = useEtherspot();
  const [walletKit, setWalletKit] = useState<Client>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activeSessions, setActiveSessions] = useState<any>();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [infoMessage, setInfoMessage] = useState<string>('');
  const [isLoadingConnect, setIsLoadingConnect] = useState<boolean>(false);
  const [isLoadingDisconnectAll, setIsLoadingDisconnectAll] =
    useState<boolean>(false);
  const [isLoadingDisconnect, setIsLoadingDisconnect] =
    useState<boolean>(false);

  // WalletConnect initialisation
  const initWalletKit = useCallback(async () => {
    if (walletKit) return;
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
  }, [walletKit]);

  useEffect(() => {
    // Look for current active sessions
    const currentActiveSessions = walletKit?.getActiveSessions();
    setActiveSessions(currentActiveSessions);
  }, [walletKit]);

  useEffect(() => {
    if (walletKit) return;
    initWalletKit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletKit, accountAddress]);

  useEffect(() => {
    if (errorMessage !== '') {
      // Reset after 5 seconds
      setTimeout(() => setErrorMessage(''), 5000);
    }

    if (infoMessage !== '') {
      // Reset after 5 seconds
      setTimeout(() => setInfoMessage(''), 5000);
    }
  }, [errorMessage, infoMessage]);

  const getSessionFromTopic = useCallback(
    (topic: string) => {
      const connections = Object.values(walletKit?.getActiveSessions() || {});
      return connections.find(
        (c) => c.topic === topic || c.pairingTopic === topic
      );
    },
    [walletKit]
  );

  const connect = useCallback(
    async (copiedUri: string) => {
      if (!walletKit) {
        await initWalletKit();
      }

      try {
        setIsLoadingConnect(true);
        await walletKit?.core.pairing.pair({
          uri: copiedUri,
        });

        // Update activeSessions after pairing
        const updatedSessions = walletKit?.getActiveSessions();
        setActiveSessions(updatedSessions);

        setInfoMessage('Wallet successfully paired.');
      } catch (e) {
        setErrorMessage(
          'Wallet could not successfully paired. Please make sure your WalletConnect link is still valid.'
        );
      }

      setIsLoadingConnect(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [walletKit]
  );

  const disconnect = useCallback(
    async (topic: string) => {
      if (!walletKit) {
        await initWalletKit();
      }

      const sessionData = getSessionFromTopic(topic);

      const dAppName = sessionData?.peer.metadata.name ?? 'dApp';

      try {
        setIsLoadingDisconnect(true);
        await walletKit?.disconnectSession({
          topic,
          reason: getSdkError('USER_DISCONNECTED'),
        });

        setInfoMessage(`Session with ${dAppName} disconnected`);

        // Update activeSessions after disconnecting
        const updatedSessions = walletKit?.getActiveSessions();
        setActiveSessions(updatedSessions);
      } catch (error) {
        setErrorMessage(`Error while disconnecting session with ${dAppName}`);
      }

      setIsLoadingDisconnect(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [walletKit]
  );

  const disconnectAllSessions = useCallback(async () => {
    if (!walletKit) {
      await initWalletKit();
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
        setInfoMessage('All sessions disconnected');
      } catch (error) {
        setErrorMessage(
          'Error while disconnecting one or several sessions. Please try again, or try disconnecting sessions individually.'
        );
      }
      setIsLoadingDisconnectAll(false);
    }

    // Update activeSessions after all sessions are disconnected
    setActiveSessions(walletKit?.getActiveSessions());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletKit]);

  const onSessionProposal = useCallback(
    async (proposal: WalletKitTypes.SessionProposal) => {
      const { id, params } = proposal;

      const approvedNamespaces = buildApprovedNamespaces({
        proposal: params,
        supportedNamespaces: {
          eip155: {
            chains: ['eip155:1', 'eip155:100', 'eip155:137'],
            methods: [
              PERSONAL_SIGN,
              ETH_SIGN,
              ETH_SEND_TX,
              ETH_SIGN_TX,
              ETH_SIGN_TYPED_DATA,
              ETH_SIGN_TYPED_DATA_V4,
              WALLET_SWITCH_CHAIN,
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
              'chainChanged',
              'accountsChanged',
            ],
            accounts: [
              `eip155:1:${accountAddress}`,
              `eip155:100:${accountAddress}`,
              `eip155:137:${accountAddress}`,
            ],
          },
        },
      });

      const existingClientSession =
        walletKit?.getActiveSessions()[params.pairingTopic];

      if (!existingClientSession) {
        try {
          await walletKit?.approveSession({
            id,
            namespaces: approvedNamespaces,
          });

          setActiveSessions(walletKit?.getActiveSessions());
        } catch (error) {
          await walletKit?.rejectSession({
            id,
            reason: getSdkError('USER_REJECTED'),
          });

          setErrorMessage('Session approval rejected.');
        }
      } else {
        setErrorMessage('Something went wrong, please try again.');
      }
    },
    [accountAddress, walletKit]
  );

  const onSessionRequest = useCallback(
    async (requestEvent: WalletKitTypes.SessionRequest) => {
      // const { id, topic, params } = requestEvent;
      // const { request: requestHere } = params;
      // const requestParamsMessage = requestHere.params[0];
      // console.log('REQUEST EVENT', requestEvent);
      // // convert `requestParamsMessage` by using a method like hexToUtf8
      // const message = ethers.utils.toUtf8String(requestParamsMessage);
      // console.log(message);
      // // sign the message
      // const signedMessage = await wallets[0].sign(message);
      // console.log('signMessage', signedMessage);
      // const response: JsonRpcResponse = {
      //   id,
      //   result: signedMessage,
      //   jsonrpc: '2.0',
      // };
      // console.log('RESPONSE', response);
      // await walletKit?.respondSessionRequest({ topic, response });
      console.log(requestEvent);
      const { topic, params, id } = requestEvent;
      const { request: requestt } = params;
      const requestParamsMessage = requestt.params[0];

      const message = hexToString(requestParamsMessage);
      console.log('Message to sign:', message);

      // const signedMessage = await wallets[0].sign(message);
      const eSdk = await getSdk(137);

      const signedMessageEtherspotSdk = await eSdk.signMessage({
        message,
      });

      console.log('Signed message:', signedMessageEtherspotSdk);

      const response = {
        id,
        result: signedMessageEtherspotSdk,
        jsonrpc: '2.0',
      };

      await walletKit?.respondSessionRequest({ topic, response });
    },
    [walletKit, getSdk]
  );

  useEffect(() => {
    if (!walletKit) return;

    walletKit.on('session_proposal', onSessionProposal);
    walletKit.on('session_request', onSessionRequest);

    // eslint-disable-next-line consistent-return
    return () => {
      walletKit.off('session_proposal', onSessionProposal); // Clean up listener
      walletKit.off('session_request', onSessionRequest);
    };
  }, [walletKit, onSessionProposal, onSessionRequest]);

  return {
    connect,
    disconnect,
    disconnectAllSessions,
    activeSessions,
    errorMessage,
    infoMessage,
    isLoadingConnect,
    isLoadingDisconnect,
    isLoadingDisconnectAll,
  };
};
