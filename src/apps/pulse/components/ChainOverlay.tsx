import { chainNameToChainIdTokensData } from '../../../services/tokensData';
import { getLogoForChainId } from '../../../utils/blockchain';
import { MobulaChainNames } from '../utils/constants';

export interface ChainOverlayProps {
  setShowChainOverlay: React.Dispatch<React.SetStateAction<boolean>>;
  setOverlayStyle: React.Dispatch<React.SetStateAction<React.CSSProperties>>;
  setChains: React.Dispatch<React.SetStateAction<MobulaChainNames>>;
  overlayStyle: React.CSSProperties;
  chains: MobulaChainNames;
}

export default function ChainOverlay(chainOverlayProps: ChainOverlayProps) {
  const {
    setShowChainOverlay,
    setChains,
    setOverlayStyle,
    overlayStyle,
    chains,
  } = chainOverlayProps;
  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 200,
          height: 210,
          zIndex: 1999,
        }}
        onClick={() => {
          setShowChainOverlay(false);
          setOverlayStyle({});
        }}
      />
      <div style={overlayStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: '12px 0', height: '100%', overflowY: 'auto' }}>
          {Object.values(MobulaChainNames).map((chain) => {
            const isSelected = chains === chain;
            const isAll = chain === MobulaChainNames.All;
            let logo = null;
            if (isAll) {
              logo = (
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 24,
                    height: 24,
                  }}
                >
                  {/* Inline SVG for globe */}
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g opacity="0.5">
                      <circle
                        opacity="0.3"
                        cx="9.99976"
                        cy="10"
                        r="9"
                        fill="white"
                      />
                      <path
                        d="M9.99992 19.0001C14.9706 19.0001 19.0001 14.9706 19.0001 9.99992C19.0001 5.02927 14.9706 0.999756 9.99992 0.999756C5.02927 0.999756 0.999756 5.02927 0.999756 9.99992C0.999756 14.9706 5.02927 19.0001 9.99992 19.0001Z"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6.3999 1.89966H7.29992C5.54488 7.15575 5.54488 12.8439 7.29992 18.1H6.3999"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12.7 1.89966C14.455 7.15575 14.455 12.8439 12.7 18.1"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1.90015 13.6V12.7C7.15624 14.455 12.8443 14.455 18.1004 12.7V13.6"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1.90015 7.29992C7.15624 5.54488 12.8443 5.54488 18.1004 7.29992"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </svg>
                </span>
              );
            } else {
              const chainId = chainNameToChainIdTokensData(chain);
              logo = (
                <img
                  src={getLogoForChainId(chainId)}
                  alt={chain}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: '#23222A',
                  }}
                />
              );
            }
            return (
              <div
                key={chain}
                onClick={() => {
                  setChains(chain);
                  setShowChainOverlay(false);
                  setOverlayStyle({});
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 18px',
                  cursor: 'pointer',
                  background: isSelected ? '#29292F' : 'transparent',
                  color: isSelected ? '#fff' : '#b0b0b0',
                  fontWeight: isSelected ? 500 : 400,
                  fontSize: 16,
                  position: 'relative',
                }}
              >
                {logo}
                <span style={{ flex: 1, marginLeft: 10 }}>
                  {chain === MobulaChainNames.All ? 'All chains' : chain}
                </span>
                {isSelected && (
                  <div>
                    <svg
                      width="8"
                      height="6"
                      viewBox="0 0 8 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 2.71429L3.13426 5L7 1"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
