import React from 'react';
import styled from 'styled-components';
import Button from './Button';

export interface DebugInfo {
  privy?: {
    authenticated?: boolean;
    ready?: boolean;
    user?: {
      id?: string;
      email?: string;
      wallet?: string;
    } | null;
  };
  wagmi?: {
    address?: string;
    isConnected?: boolean;
    isConnecting?: boolean;
    isPending?: boolean;
    error?: string;
    connectorsCount?: number;
    connectorIds?: string[];
    walletConnectConnector?: {
      id?: string;
      name?: string;
      ready?: boolean;
    } | null;
  };
}

interface ConnectionDebugProps {
  debugInfo: DebugInfo;
  onDisconnect?: () => void;
}

const DebugContainer = styled.div`
  color: #fff;
  font-size: 12px;
`;

const DebugSection = styled.div`
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #444;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.05);
`;

const DebugSubtitle = styled.h4`
  color: #fff;
  margin: 0 0 8px 0;
  font-size: 13px;
  font-weight: bold;
`;

const DebugItem = styled.div`
  color: #fff;
  font-size: 11px;
  margin: 4px 0;
  word-break: break-all;
  line-height: 1.3;
`;

const ErrorText = styled.span`
  color: #ff4444;
`;

const ConnectionDebug: React.FC<ConnectionDebugProps> = ({
  debugInfo,
  onDisconnect,
}) => {
  return (
    <DebugContainer>
      <DebugSection>
        <DebugSubtitle>Privy Status:</DebugSubtitle>
        <DebugItem>
          <strong>Authenticated:</strong>{' '}
          {debugInfo.privy?.authenticated ? '✅ Yes' : '❌ No'}
        </DebugItem>
        <DebugItem>
          <strong>Ready:</strong> {debugInfo.privy?.ready ? '✅ Yes' : '❌ No'}
        </DebugItem>
        {debugInfo.privy?.user && (
          <>
            <DebugItem>
              <strong>User ID:</strong> {debugInfo.privy.user.id}
            </DebugItem>
            <DebugItem>
              <strong>Email:</strong> {debugInfo.privy.user.email || 'N/A'}
            </DebugItem>
            <DebugItem>
              <strong>Wallet Address:</strong>{' '}
              {debugInfo.privy.user.wallet || 'N/A'}
            </DebugItem>
          </>
        )}
      </DebugSection>

      <DebugSection>
        <DebugSubtitle>WAGMI Status:</DebugSubtitle>
        <DebugItem>
          <strong>Connected:</strong>{' '}
          {debugInfo.wagmi?.isConnected ? '✅ Yes' : '❌ No'}
        </DebugItem>
        <DebugItem>
          <strong>Connecting:</strong>{' '}
          {debugInfo.wagmi?.isConnecting ? '🔄 Yes' : '❌ No'}
        </DebugItem>
        <DebugItem>
          <strong>Pending:</strong>{' '}
          {debugInfo.wagmi?.isPending ? '⏳ Yes' : '❌ No'}
        </DebugItem>
        <DebugItem>
          <strong>Address:</strong> {debugInfo.wagmi?.address || 'N/A'}
        </DebugItem>
        {debugInfo.wagmi?.error && (
          <DebugItem>
            <strong>Error:</strong>{' '}
            <ErrorText>{debugInfo.wagmi.error}</ErrorText>
          </DebugItem>
        )}
      </DebugSection>

      <DebugSection>
        <DebugSubtitle>WalletConnect Connector:</DebugSubtitle>
        <DebugItem>
          <strong>Connectors Found:</strong>{' '}
          {debugInfo.wagmi?.connectorsCount || 0}
        </DebugItem>
        <DebugItem>
          <strong>Connector IDs:</strong>{' '}
          {debugInfo.wagmi?.connectorIds?.join(', ') || 'None'}
        </DebugItem>
        {debugInfo.wagmi?.walletConnectConnector ? (
          <>
            <DebugItem>
              <strong>WalletConnect ID:</strong>{' '}
              {debugInfo.wagmi.walletConnectConnector.id}
            </DebugItem>
            <DebugItem>
              <strong>WalletConnect Name:</strong>{' '}
              {debugInfo.wagmi.walletConnectConnector.name}
            </DebugItem>
            <DebugItem>
              <strong>WalletConnect Ready:</strong>{' '}
              {debugInfo.wagmi.walletConnectConnector.ready
                ? '✅ Yes'
                : '❌ No'}
            </DebugItem>
          </>
        ) : (
          <DebugItem>
            <strong>WalletConnect Connector:</strong>{' '}
            <ErrorText>Not Found</ErrorText>
          </DebugItem>
        )}
      </DebugSection>

      {/* Disconnect button for testing */}
      {(debugInfo.wagmi?.isConnected || debugInfo.privy?.authenticated) &&
        onDisconnect && (
          <DebugSection>
            <DebugSubtitle>Actions:</DebugSubtitle>
            <Button
              onClick={onDisconnect}
              style={{ marginTop: '10px', backgroundColor: '#ff4444' }}
            >
              Disconnect WAGMI
            </Button>
          </DebugSection>
        )}
    </DebugContainer>
  );
};

export default ConnectionDebug;
