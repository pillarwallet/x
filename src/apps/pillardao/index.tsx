import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
// Uses the app's global WagmiProvider; no local provider here
import manifest from './manifest.json';
import headerImage from './images/pillar-dao-image.png';
import AnimatedTitle from './components/AnimatedTitle';
import VotingPanel from './components/VotingPanel';
import OnboardingPanel from './components/OnboardingPanel';
import MembershipPanel from './components/MembershipPanel';
import useTransactionKit from '../../hooks/useTransactionKit';


const PillarDaoInner = () => {
  const navigate = useNavigate();
  const isTestMode =
    typeof process !== 'undefined' &&
    typeof process.env !== 'undefined' &&
    process.env.NODE_ENV === 'test';
  const introMs = Math.max(0, Number((manifest as any)?.introMs ?? 1500));
  const [showIntro, setShowIntro] = useState(!(isTestMode || introMs === 0));
  const { walletAddress } = useTransactionKit();
  const [activeTab, setActiveTab] = useState<'voting' | 'onboarding' | 'membership'>('voting');
  const [headerImgOk, setHeaderImgOk] = useState(true);

  const goHome = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setActiveTab('onboarding');
    try { navigate('/pillardao'); } catch {}
  };

  useEffect(() => {
    if (isTestMode || introMs === 0) {
      setShowIntro(false);
      return;
    }
    const t = setTimeout(() => setShowIntro(false), introMs);
    return () => clearTimeout(t);
  }, [isTestMode, introMs]);

  const CONTRACTS = (manifest as any)?.contracts || {};
  const POLYGON_CHAIN_ID = Number(CONTRACTS.chainId);
  const NFT_CONTRACT = CONTRACTS.nft as `0x${string}`;
  const DAO_CONTRACT = CONTRACTS.dao as `0x${string}`;
  const resolvedAddress = (walletAddress || '0x0000000000000000000000000000000000000000') as `0x${string}`;

  const COMMUNITY_URL = (manifest as any)?.links?.community;
  const VOTING_URL = (manifest as any)?.links?.voting;
  const VOTING_FALLBACK_URL = (manifest as any)?.links?.votingFallback;
  const CHAT_URL = (manifest as any)?.links?.chat;
  const CHAT_FALLBACK_URL = (manifest as any)?.links?.chatFallback;
  const PILLAR_NFT_SIGNUP_URL = (manifest as any)?.links?.NFTsignup;

  if (showIntro) {
    return <AnimatedTitle text={(manifest as any)?.title || 'Pillar DAO'} />;
  }

  return (
    <Wrapper>
      <Header>
        <HeaderLink href="/pillardao" onClick={goHome} aria-label="Go to PillarDAO home">
          <img
            src={headerImage}
            alt="Pillar DAO"
            onError={() => { if (headerImgOk) setHeaderImgOk(false); }}
          />
        </HeaderLink>
        {!headerImgOk && (
          <HeaderLink href="/pillardao" onClick={goHome} aria-label="Go to PillarDAO home">
            <h1 className="fallbackTitle">Pillar DAO</h1>
          </HeaderLink>
        )}
        <p>Get your membership NFT and join socials.</p>
      </Header>

      <Tabs>
        <TabButton
          $active={activeTab === 'voting'}
          onClick={() => setActiveTab('voting')}
        >
          Voting
        </TabButton>
        <TabButton
          $active={activeTab === 'membership'}
          onClick={() => setActiveTab('membership')}
        >
          My DAO NFT
        </TabButton>
        <TabButton
          $active={activeTab === 'onboarding'}
          onClick={() => setActiveTab('onboarding')}
        >
          Join PillarDAO
        </TabButton>
      </Tabs>
      {activeTab === 'onboarding' && (
        <OnboardingPanel/>
      )}
      {activeTab === 'voting' && (
        <VotingPanel/>
      )}
      {activeTab === 'membership' && (
        <MembershipPanel
          resolvedAddress={resolvedAddress}
          nftContract={NFT_CONTRACT}
          daoContract={DAO_CONTRACT}
          chainId={POLYGON_CHAIN_ID}
          isConnected={Boolean(walletAddress)}
        />
      )}

      {/* Panels render their own content */}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  font-size: 16px;
  line-height: 1.5;
`;

const Header = styled.div`
  margin: 10px 0 18px;

  img {
    display: block;
    width: auto; /* keep intrinsic width */
    height: auto; /* keep intrinsic height */
    max-width: 100%; /* shrink if container is smaller */
    margin-bottom: 10px;
  }

  h1 {
    font-size: 24px;
    font-weight: 700;
    margin: 0 0 6px;
  }

  .fallbackTitle {
    font-size: 14px;
    font-weight: 600;
  }

  p {
    font-size: 14px;
    color: ${({ theme }) => theme.color.text.cardContent};
  }
`;

const HeaderLink = styled.a`
  display: inline-block;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
`;

const Tabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
`;

const TabButton = styled.button<{ $active?: boolean }>`
  padding: 8px 12px;
  border-radius: 6px; /* match Button rounding */
  border: 1px solid
    ${({ theme }) => theme.color.border.alertOutline};
  background: ${({ theme, $active }) =>
    $active ? theme.color.background.card : 'transparent'};
  color: ${({ theme }) => theme.color.text.cardTitle};
  font-size: 13px;
  cursor: pointer;
`;

const PillarDaoApp = () => <PillarDaoInner />;

export default PillarDaoApp;
