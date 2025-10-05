import React, { useMemo, useState } from 'react';
import Card from '../../../components/Text/Card';
import Button from '../../../components/Button';
import TextInput from '../../../components/Form/TextInput';
import { useWalletConnect } from '../../../services/walletConnect';
import useTransactionKit from '../../../hooks/useTransactionKit';
import CopyHelp from './CopyHelp';
import signInImage from '../images/wallet-connect-sign-in-example.png';
import manifest from '../manifest.json';
import { Section, Row, ConnectLayout, ConnectAside, ConnectInline, SmallNote, RightAddon, WalletInfo, ConnectError, SessionItem } from './Styles';

const OnboardingPanel: React.FC = () => {
  const { connect, activeSessions, isLoadingConnect, disconnect, disconnectAllSessions } = useWalletConnect();
  const { walletAddress: accountAddress } = useTransactionKit();
  const hasSessions = useMemo(() => !!activeSessions && Object.keys(activeSessions).length > 0, [activeSessions]);
  const [wcUri, setWcUri] = useState('');
  const [connectError, setConnectError] = useState<string | null>(null);

  const COMMUNITY_URL = (manifest as any)?.links?.community;
  const CHAT_URL = (manifest as any)?.links?.chat;
  const CHAT_FALLBACK_URL = (manifest as any)?.links?.chatFallback;
  const PILLAR_NFT_SIGNUP_URL = (manifest as any)?.links?.NFTsignup;

  const openCommunitySocial = async () => {
    const communityBase = (COMMUNITY_URL || 'https://pillardao.org/').replace(/\/+$/, '');
    const primary = (CHAT_URL || `${communityBase}/chat`).replace(/\/+$/, '');
    const fallback = CHAT_FALLBACK_URL || 'https://discord.com/invite/t39xKhzSPb';
    try {
      const res = await fetch(primary, { method: 'GET', cache: 'no-store' });
      await new Promise((r) => setTimeout(r, 10));
      if (res && res.status === 404) window.open(fallback, '_blank', 'noreferrer');
      else window.open(primary, '_blank', 'noreferrer');
    } catch {
      await new Promise((r) => setTimeout(r, 10));
      window.open(primary, '_blank', 'noreferrer');
    }
  };

  return (
    <>
      <Section>
        <Card
          title="Get Your Membership"
          content="Stake PLR tokens and mint your membership NFT"
        >
          <Row>
            <SmallNote>1) Open the Pillar DAO NFT web page</SmallNote>
            <SmallNote>2) Find the "How to become a Member" login</SmallNote>
            <SmallNote>3) Sign in with WalletConnect to connect the signup to this wallet</SmallNote>
          </Row>
          {!hasSessions && (
            <SmallNote>
              <strong>
                On the site, choose WalletConnect from the available wallets. When a QR code shows, tap “copy” (or “open in wallet”), then come back and paste the URI here.
              </strong>
            </SmallNote>
          )}
          <Row>
            <ConnectLayout>
              {!hasSessions && (
                <>
                  <CopyHelp imageSrc={signInImage} overlayCollapsed="Choose WalletConnect" />
                  <CopyHelp overlayCollapsed="How to copy the WC URI" />
                </>
              )}
              <ConnectAside $fullWidth={hasSessions}>
                <ConnectInline $singleColumn={hasSessions}>
                  {!hasSessions && (
                    <>
                      <SmallNote>Paste a WalletConnect URI</SmallNote>
                      <TextInput
                        placeholder="wc:..."
                        value={wcUri}
                        onValueChange={(v) => { setWcUri(v); setConnectError(null); }}
                        rightAddon={
                          <RightAddon>
                            {!!wcUri && (
                              <Button $small $secondary title="Clear the WalletConnect URI" onClick={() => { setWcUri(''); setConnectError(null); }}>Clear</Button>
                            )}
                            <Button
                              $small
                              title="Connect your PillarX wallet via WalletConnect"
                              disabled={!wcUri || isLoadingConnect}
                              onClick={async () => {
                                const uri = (wcUri || '').trim();
                                if (!uri) return;
                                if (!uri.startsWith('wc:')) { setConnectError("Please paste a valid URI starting with 'wc:'"); return; }
                                setConnectError(null);
                                await connect(uri);
                              }}
                            >
                              {isLoadingConnect ? 'Connecting...' : 'Connect'}
                            </Button>
                          </RightAddon>
                        }
                      />
                      {!!connectError && (<ConnectError role="alert">{connectError}</ConnectError>)}
                    </>
                  )}
                  {hasSessions && (
                    <>
                    <Card title="" content="">
                      <WalletInfo>
                      <span className="label">Your wallet</span>
                      <span className="value">{(() => {
                        const a = (accountAddress || '').trim();
                        if (!a) return '';
                        if (a.length <= 12) return a;
                        return `${a.slice(0, 6)}...${a.slice(-4)}`;
                      })()}</span>
                    </WalletInfo>
                    </Card>
                    
                    <Card title="Connected" content="Now check the opened PillarDAO tab. Scroll to the new member form and fill that in."></Card>
                    </>
                    )}
                </ConnectInline>
              </ConnectAside>
            </ConnectLayout>
          </Row>
          <Row>
            <Button onClick={() => window.open(PILLAR_NFT_SIGNUP_URL, '_blank', 'noreferrer')} $fullWidth>
              Open Pillar DAO Member Signup
            </Button>
          </Row>
          <Row>
            <Button onClick={openCommunitySocial} $secondary $fullWidth>
              Join Pillar DAO chat and community
            </Button>
          </Row>
        </Card>
      </Section>
      {hasSessions && (
        <Section>
          <Card title="Active dApp Sessions" content="Manage your WalletConnect sessions connected to this wallet.">
            {Object.values(activeSessions || {}).map((s: any) => (
              <SessionItem key={s.topic}>
                <div className="meta">
                  {s.peer?.metadata?.icons?.[0] ? (<img src={s.peer.metadata.icons[0]} alt="dApp" />) : null}
                  <div>
                    <div className="name">{s.peer?.metadata?.name || 'dApp'}</div>
                    <div className="url">{s.peer?.metadata?.url || ''}</div>
                  </div>
                </div>
                <div>
                  <Button $small $secondary onClick={() => disconnect(s.topic)}>Disconnect</Button>
                </div>
              </SessionItem>
            ))}
            <Row>
              <Button $secondary onClick={disconnectAllSessions}>Disconnect all</Button>
            </Row>
          </Card>
        </Section>
      )}
    </>
  );
};

export default OnboardingPanel;
