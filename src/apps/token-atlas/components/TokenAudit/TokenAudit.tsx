// services
import { chainIdToChainNameTokensData } from '../../../../services/tokensData';

// reducer
import { useAppSelector } from '../../hooks/useReducerHooks';

// images
import ExternalLinkLogo from '../../images/external-link-audit.svg';
import GoPlusLogo from '../../images/go-plus-logo.png';
import HoneypotLogo from '../../images/honeypot-logo.png';
import TokenAuditIcon from '../../images/token-audit-icon.png';
import TokenSnifferLogo from '../../images/token-sniffer-logo.png';

// types
import { SelectedTokenType } from '../../types/types';

// components
import BodySmall from '../Typography/BodySmall';

const TokenAudit = () => {
  const selectedToken = useAppSelector(
    (state) => state.tokenAtlas.selectedToken as SelectedTokenType | undefined
  );

  const formattedChainNameTokenSniffer = () => {
    switch (selectedToken?.chainId) {
      case 1:
        return 'eth';
      case 137:
        return 'poly';
      case 56:
        return 'bsc';
      case 10:
        return 'opt';
      case 42161:
        return 'arb';
      case 100:
        return 'xdai';
      case 8453:
        return 'base';
      default:
        return 'eth';
    }
  };

  const honeypotSupportedChains = [1, 56, 8453];

  const tokenSnifferUrl = `https://tokensniffer.com/token/${formattedChainNameTokenSniffer()}/${selectedToken?.address}`;
  const goPlusUrl = `https://gopluslabs.io/token-security/${selectedToken?.chainId ?? 1}/${selectedToken?.address}`;
  const honeypotUrl = `https://honeypot.is/${selectedToken?.chainId === 56 ? '' : (chainIdToChainNameTokensData(selectedToken?.chainId).toLowerCase() ?? 1)}?address=${selectedToken?.address}`;

  const tokenAuditList = [
    {
      name: 'Token Sniffer',
      logo: TokenSnifferLogo,
      url: tokenSnifferUrl,
    },
    {
      name: 'Go Plus',
      logo: GoPlusLogo,
      url: goPlusUrl,
    },
    ...(selectedToken &&
    honeypotSupportedChains.includes(selectedToken?.chainId ?? 1)
      ? [
          {
            name: 'Honeypot.is',
            logo: HoneypotLogo,
            url: honeypotUrl,
          },
        ]
      : []),
  ];

  return (
    <div className="flex flex-col w-full gap-2.5">
      <div className="flex gap-1.5 items-center">
        <img
          src={TokenAuditIcon}
          alt="token-audit-icon"
          className="w-3.5 h-4"
        />
        <BodySmall className="font-normal">Token Audit</BodySmall>
      </div>
      <p className="italic font-normal text-xs text-white/[.5]">
        Identify potential scam contracts via these providers, but take note
        that there is no 100% guarantee.
      </p>
      <div className="flex flex-wrap gap-x-4 gap-y-2.5">
        {tokenAuditList.map((audit, index) => (
          <a
            key={index}
            href={audit.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-1.5 items-center no-underline"
          >
            <img
              className="w-[18px] h-[18px]"
              src={audit.logo}
              alt={`${audit.name.toLowerCase()}-logo`}
            />
            <BodySmall className="font-normal">{audit.name}</BodySmall>
            <img
              className="w-3 h-3"
              src={ExternalLinkLogo}
              alt="external-link-icon"
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export default TokenAudit;
