import { chainNameToChainIdTokensData } from '../../../../services/tokensData';
import { getLogoForChainId } from '../../../../utils/blockchain';
import { MobulaChainNames } from '../../utils/constants';
import GlobeIcon from '../../assets/globe-icon.svg';
import SelectedIcon from '../../assets/selected-icon.svg';

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
                  <img src={GlobeIcon} alt="globe-icon" />
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
                    <img src={SelectedIcon} alt="selected-icon" />
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
