import React, { useEffect, useMemo, useState } from 'react';
import { useReadContract } from 'wagmi';
import Card from '../../../components/Text/Card';
import Button from '../../../components/Button';
import placeholderNftImage from '../images/pillar-dao-member-nft.png';
import { Section, MembershipRow, NftBox, Row } from './Styles';

type MembershipPanelProps = {
  resolvedAddress: `0x${string}`;
  nftContract: `0x${string}`;
  daoContract: `0x${string}`;
  chainId: number;
  isConnected: boolean;
};

type PillarDaoMembershipCache = {
  address: `0x${string}`;
  chainId: number;
  nftContract: `0x${string}`;
  tokenId?: string;
  depositTimestamp?: number;
  updatedAt: number;
};

const membershipCacheKey = (chainId: number, address: `0x${string}`, nft: `0x${string}`) =>
  `pillardao:membership:${chainId}:${nft}:${address.toLowerCase()}`;

const readMembershipCache = (chainId: number, address: `0x${string}`, nft: `0x${string}`): PillarDaoMembershipCache | null => {
  try {
    const raw = localStorage.getItem(membershipCacheKey(chainId, address, nft));
    if (!raw) return null;
    return JSON.parse(raw) as PillarDaoMembershipCache;
  } catch { return null; }
};

const writeMembershipCache = (entry: PillarDaoMembershipCache) => {
  try {
    localStorage.setItem(membershipCacheKey(entry.chainId, entry.address, entry.nftContract), JSON.stringify(entry));
  } catch { /* noop */ }
};

const MembershipPanel: React.FC<MembershipPanelProps> = ({ resolvedAddress, nftContract, daoContract, chainId, isConnected }) => {
  const [cached, setCached] = useState<PillarDaoMembershipCache | null>(null);

  useEffect(() => {
    if (!isConnected) { setCached(null); return; }
    const c = readMembershipCache(chainId, resolvedAddress, nftContract);
    setCached(c);
  }, [isConnected, chainId, resolvedAddress, nftContract]);

  const erc721BalanceAbi = [
    { inputs: [{ name: 'owner', type: 'address' }], name: 'balanceOf', outputs: [{ type: 'uint256' }], stateMutability: 'view', type: 'function' },
  ] as const;
  const erc721EnumerableAbi = [
    { inputs: [{ name: 'owner', type: 'address' }, { name: 'index', type: 'uint256' }], name: 'tokenOfOwnerByIndex', outputs: [{ type: 'uint256' }], stateMutability: 'view', type: 'function' },
  ] as const;
  const membershipTimestampAbi = [
    { inputs: [{ name: 'member', type: 'address' }], name: 'viewDepositTimestamp', outputs: [{ type: 'uint256' }], stateMutability: 'view', type: 'function' },
  ] as const;

  const nftBalanceRead = useReadContract({
    abi: erc721BalanceAbi,
    address: nftContract,
    functionName: 'balanceOf',
    args: [resolvedAddress],
    chainId,
    query: { enabled: Boolean(isConnected) },
  });

  const nftFirstTokenRead = useReadContract({
    abi: erc721EnumerableAbi,
    address: nftContract,
    functionName: 'tokenOfOwnerByIndex',
    args: [resolvedAddress, BigInt(0)],
    chainId,
    query: {
      enabled: Boolean(isConnected && (nftBalanceRead?.data as bigint) !== undefined && (nftBalanceRead?.data as bigint) > BigInt(0)),
    },
  });

  const effectiveMembershipId = useMemo(() => {
    const balance = nftBalanceRead?.data as bigint | undefined;
    if (!balance || balance === BigInt(0)) return BigInt(0);
    const id = nftFirstTokenRead?.data as bigint | undefined;
    if (id && id > BigInt(0)) return id;
    const cachedId = cached?.tokenId ? BigInt(cached.tokenId) : BigInt(0);
    return cachedId > BigInt(0) ? cachedId : BigInt(0);
  }, [nftBalanceRead?.data, nftFirstTokenRead?.data, cached?.tokenId]);

  const depositTsRead = useReadContract({
    abi: membershipTimestampAbi,
    address: daoContract,
    functionName: 'viewDepositTimestamp',
    args: [resolvedAddress],
    chainId,
    query: { enabled: Boolean(isConnected) },
  });

  const effectiveDepositTs = useMemo(() => {
    const onchain = Number(depositTsRead?.data || BigInt(0));
    if (onchain > 0) return onchain;
    return cached?.depositTimestamp || 0;
  }, [depositTsRead?.data, cached?.depositTimestamp]);

  const truncate = (addr?: string) => {
    if (!addr) return '';
    const a = addr.trim();
    if (a.length <= 12) return a;
    return `${a.slice(0, 6)}...${a.slice(-4)}`;
  };

  useEffect(() => {
    if (!isConnected) return;
    const tokenId = nftFirstTokenRead?.data as bigint | undefined;
    const depositTs = Number(depositTsRead?.data || BigInt(0));
    const hasUseful = (tokenId && tokenId > BigInt(0)) || depositTs > 0;
    if (!hasUseful) return;
    writeMembershipCache({
      address: resolvedAddress,
      chainId,
      nftContract,
      tokenId: tokenId && tokenId > BigInt(0) ? String(tokenId) : cached?.tokenId,
      depositTimestamp: depositTs > 0 ? depositTs : (cached?.depositTimestamp || 0),
      updatedAt: Date.now(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, chainId, resolvedAddress, nftContract, nftFirstTokenRead?.data, depositTsRead?.data]);

  if (!isConnected) {
    return (
      <Section>
        <Card title="Your Membership" content="Connect a wallet to view your PillarDAO membership.">
          <MembershipRow>
            <div className="left">
              <div className="label">Connected Wallet</div>
              <div className="value">—</div>
              <div className="label">Membership</div>
              <div className="value">Not connected</div>
            </div>
            <div className="right">
              <NftBox>
                <p>Connect a wallet to view.</p>
              </NftBox>
            </div>
          </MembershipRow>
        </Card>
      </Section>
    );
  }

  return (
    <Section>
      <Card title="Your Membership" content="View your PillarDAO membership status for the connected wallet.">
        <MembershipRow>
          <div className="left">
            <div className="label">Connected Wallet</div>
            <div className="value">{truncate(resolvedAddress)}</div>
            {effectiveMembershipId > BigInt(0) && (
              <>
                <div className="label">Membership ID</div>
                <div className="value">{effectiveMembershipId.toString()}</div>
              </>
            )}
            <div className="label">Member Since</div>
            <div className="value">
              {effectiveDepositTs > 0
                ? (() => {
                    const d = new Date(effectiveDepositTs * 1000);
                    const date = d.toLocaleDateString();
                    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    return `${date} ${time}`;
                  })()
                : '—'}
            </div>
          </div>
          <div className="right">
            <NftBox>
              {effectiveMembershipId > BigInt(0) ? (
                <img src={placeholderNftImage} alt="PillarDAO Member NFT" />
              ) : (
                <p>No Member NFT in this Pillar X wallet.</p>
              )}
            </NftBox>
            {effectiveMembershipId > BigInt(0) && (
              <>
                <Row>
                  <Button
                    $secondary
                    $small
                    onClick={() => {
                      const tokenId = String(effectiveMembershipId);
                      const base = 'https://polygonscan.com/token';
                      const url = `${base}/${nftContract}?a=${tokenId}`;
                      window.open(url, '_blank', 'noopener,noreferrer');
                    }}
                  >
                    View on Polygonscan
                  </Button>
                </Row>
                <Row>
                  <Button
                    $secondary
                    $small
                    onClick={() => {
                      const tokenId = String(effectiveMembershipId);
                      const base = 'https://polygon.blockscout.com/token';
                      const url = `${base}/${nftContract}/instance/${tokenId}`;
                      window.open(url, '_blank', 'noopener,noreferrer');
                    }}
                  >
                    View on Blockscout
                  </Button>
                </Row>
              </>
            )}
          </div>
        </MembershipRow>
      </Card>
    </Section>
  );
};

export default MembershipPanel;

