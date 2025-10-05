import React, { useState } from 'react';
import Card from '../../../components/Text/Card';
import Button from '../../../components/Button';
import { ExportSquare as IconExportSquare, ArrowRight2 as IconArrowRight, ArrowDown2 as IconArrowDown, ArrowUp2 as IconArrowUp } from 'iconsax-react';
import manifest from '../manifest.json';
import { Section, Row, ProposalsBox, ProposalItem, ProposalBody, CollapseButton } from './Styles';

const VotingPanel: React.FC = () => {
  const [isLoadingProposals, setIsLoadingProposals] = useState(false);
  const [proposalsError, setProposalsError] = useState<string | null>(null);
  const [showProposals, setShowProposals] = useState(false);
  const [proposalsSkip, setProposalsSkip] = useState(0);
  const [hasMoreProposals, setHasMoreProposals] = useState(true);
  const [expandedProposalId, setExpandedProposalId] = useState<string | null>(null);
  const [proposals, setProposals] = useState<
    { id: string; title: string; state?: string; link?: string; end?: number; body?: string; created?: number }[]
  >([]);

  const COMMUNITY_URL = (manifest as any)?.links?.community;
  const VOTING_URL = (manifest as any)?.links?.voting;
  const VOTING_FALLBACK_URL = (manifest as any)?.links?.votingFallback;

  const renderProposalStatus = (state?: string, end?: number) => {
    if (!state) return '';
    if (state === 'active' && end) {
      const now = Math.floor(Date.now() / 1000);
      const remaining = Math.max(0, end - now);
      if (remaining <= 0) return 'Ended';
      const days = Math.floor(remaining / 86400);
      const hours = Math.floor((remaining % 86400) / 3600);
      const mins = Math.floor((remaining % 3600) / 60);
      const parts: string[] = [];
      if (days) parts.push(`${days}d`);
      if (hours || days) parts.push(`${hours}h`);
      parts.push(`${mins}m`);
      return `Ends in ${parts.join(' ')}`;
    }
    return state;
  };

  const timeAgo = (timestamp?: number) => {
    if (!timestamp) return '';
    const now = Math.floor(Date.now() / 1000);
    let diff = Math.max(0, now - timestamp);
    const units: [number, string][] = [
      [31536000, 'y'],
      [2592000, 'mo'],
      [604800, 'w'],
      [86400, 'd'],
      [3600, 'h'],
      [60, 'm'],
    ];
    for (const [sec, label] of units) {
      if (diff >= sec) {
        const val = Math.floor(diff / sec);
        return `${val}${label} ago`;
      }
    }
    return 'just now';
  };

  const openVoting = async () => {
    const communityBase = (COMMUNITY_URL || 'https://pillardao.org/').replace(/\/+$/, '');
    const primary = (VOTING_URL || `${communityBase}/voting`).replace(/\/+$/, '');
    const fallback = VOTING_FALLBACK_URL || 'https://snapshot.box/#/s:plrdao.eth/';

    try {
      const res = await fetch(primary, { method: 'GET', cache: 'no-store' });
      await new Promise((r) => setTimeout(r, 10));
      if (res && res.status === 404) {
        window.open(fallback, '_blank', 'noreferrer');
      } else {
        window.open(primary, '_blank', 'noreferrer');
      }
    } catch (e) {
      await new Promise((r) => setTimeout(r, 10));
      window.open(primary, '_blank', 'noreferrer');
    }
  };

  const loadLatestProposals = async () => {
    setIsLoadingProposals(true);
    setProposalsError(null);
    setShowProposals(true);

    const snapshotUrl = 'https://snapshot.box/#/s:plrdao.eth/';

    try {
      const gql = 'https://hub.snapshot.org/graphql';
      const body = {
        query:
          'query Proposals($space: String!, $first: Int!, $skip: Int!) { proposals(first: $first, skip: $skip, where: { space_in: [$space] }, orderBy: "created", orderDirection: desc) { id title state end created body space { id } } }',
        variables: { space: 'plrdao.eth', first: 3, skip: 0 },
      };
      const res = await fetch(gql, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Snapshot API error');
      const json = await res.json();
      const items = json?.data?.proposals || [];
      if (!items.length) throw new Error('No proposals');

      const mapped =
        items.map((p: any) => ({
          id: p.id,
          title: p.title,
          state: p.state,
          end: p.end,
          created: p.created,
          body: p.body,
          link: `${snapshotUrl}proposal/${p.id}`,
        }));
      setProposals(mapped);
      setProposalsSkip(items.length);
      setHasMoreProposals(items.length >= 3);
    } catch (e) {
      setProposalsError('Could not load proposals');
      setProposals([]);
    } finally {
      setIsLoadingProposals(false);
    }
  };

  const loadMoreProposals = async () => {
    setIsLoadingProposals(true);
    setProposalsError(null);
    const snapshotUrl = 'https://snapshot.box/#/s:plrdao.eth/';

    try {
      const gql = 'https://hub.snapshot.org/graphql';
      const body = {
        query:
          'query Proposals($space: String!, $first: Int!, $skip: Int!) { proposals(first: $first, skip: $skip, where: { space_in: [$space] }, orderBy: "created", orderDirection: desc) { id title state end created body space { id } } }',
        variables: { space: 'plrdao.eth', first: 20, skip: proposalsSkip },
      };
      const res = await fetch(gql, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Snapshot API error');
      const json = await res.json();
      const items = Array.isArray(json?.data?.proposals)
        ? json.data.proposals
        : [];
      if (!items.length) {
        setHasMoreProposals(false);
        return;
      }

      const mapped = items.map((p: any) => ({
        id: p.id,
        title: p.title,
        state: p.state,
        end: p.end,
        created: p.created,
        body: p.body,
        link: `${snapshotUrl}proposal/${p.id}`,
      }));

      setProposals((prev) => [...prev, ...mapped]);
      setProposalsSkip((prev) => prev + items.length);
      setHasMoreProposals(items.length >= 20);
    } catch (e) {
      setProposalsError('Could not load more proposals');
    } finally {
      setIsLoadingProposals(false);
    }
  };

  return (
    <Section>
      <Card
        title="Vote on Proposals"
        content="Review the latest proposals below or open PillarDAO voting to see more and cast your vote."
      >
        {!showProposals && (
          <Row>
            <Button onClick={loadLatestProposals} $secondary $fullWidth>
              View latest proposals
            </Button>
          </Row>
        )}

        {showProposals && (
          <ProposalsBox>
            {isLoadingProposals && <p>Loading latest proposals...</p>}
            {!isLoadingProposals && proposalsError && (
              <Row>
                <Button onClick={openVoting} $secondary $fullWidth>
                  View proposals
                </Button>
              </Row>
            )}
            {!isLoadingProposals && !proposalsError && (
              <>
                {proposals.map((p) => (
                  <div key={p.id}>
                    <ProposalItem onClick={() => setExpandedProposalId(expandedProposalId === p.id ? null : p.id)}>
                      <div className="title">
                        <span className="chevron">
                          {expandedProposalId === p.id ? (
                            <IconArrowDown size={16} />
                          ) : (
                            <IconArrowRight size={16} />
                          )}
                        </span>
                        <span className="text">{p.title}</span>
                      </div>
                      <div className="status">{renderProposalStatus(p.state, p.end)}</div>
                      <div className="actions" onClick={(e) => e.stopPropagation()}>
                        <a href={p.link} target="_blank" rel="noreferrer" aria-label="Open proposal in new tab" title="Open on Snapshot">
                          <IconExportSquare size={16} />
                        </a>
                      </div>
                    </ProposalItem>
                    {expandedProposalId === p.id && (
                      <ProposalBody>
                        <div className="content">{p.body?.slice(0, 1000) || 'No description available.'}</div>
                        <div className="meta">Posted {timeAgo(p.created)}</div>
                        <CollapseButton onClick={() => setExpandedProposalId(null)}>
                          Collapse <IconArrowUp size={16} />
                        </CollapseButton>
                      </ProposalBody>
                    )}
                  </div>
                ))}
                {hasMoreProposals && (
                  <Row>
                    <Button onClick={loadMoreProposals} $secondary $fullWidth>
                      View more proposals
                    </Button>
                  </Row>
                )}
              </>
            )}
          </ProposalsBox>
        )}

        <Row>
          <Button onClick={openVoting} $fullWidth>
            Open PillarDAO voting
            <span style={{ display: 'inline-flex', marginLeft: 6 }}>
              <IconExportSquare size={16} />
            </span>
          </Button>
        </Row>
      </Card>
    </Section>
  );
};

export default VotingPanel;

