import React from 'react';
import styled from 'styled-components';
import walletConnectImage from '../images/wallet-connect-example.png';

type CopyHelpProps = {
  imageSrc?: string;
  overlayCollapsed?: string;
  overlayExpanded?: string;
};

// Displays the provided screenshot with an overlay arrow pointing at the copy icon
const CopyHelp: React.FC<CopyHelpProps> = ({
  imageSrc = walletConnectImage,
  overlayCollapsed = 'How to copy the WC URI',
  overlayExpanded = 'Tap to collapse',
}) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Container>
      <Figure
        type="button"
        $expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
        aria-pressed={expanded}
      >
        <Img src={imageSrc} alt="WalletConnect screenshot" $expanded={expanded} />

        {/* In-overlay toggle helper */}
        <OverlayPill>{expanded ? overlayExpanded : overlayCollapsed}</OverlayPill>
      </Figure>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Figure = styled.button<{ $expanded: boolean }>`
  position: relative;
  display: inline-block;
  width: auto;
  height: ${({ $expanded }) => ($expanded ? 'auto' : '146px')};
  max-width: ${({ $expanded }) => ($expanded ? '640px' : '260px')};
  border-radius: 12px;
  background: ${({ theme }) => theme.color.background.card};
  border: 1px solid ${({ theme }) => theme.color.border.alertOutline};
  cursor: pointer;
  transition: max-width 0.2s ease-in-out, height 0.2s ease-in-out, transform 0.1s ease-in-out;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  overflow: hidden; /* keep overlays clipped to the figure */
  padding: 0;

  &:active {
    transform: scale(0.995);
  }
`;

const Img = styled.img<{ $expanded: boolean }>`
  display: block;
  width: ${({ $expanded }) => ($expanded ? '100%' : 'auto')};
  height: ${({ $expanded }) => ($expanded ? 'auto' : '100%')};
  object-fit: contain; /* ensure full image is visible */
  border-radius: 12px;
  filter: ${({ $expanded }) => ($expanded ? 'none' : 'grayscale(100%)')};
  transition: filter 0.2s ease-in-out;
`;

/* Arrow and highlight intentionally removed per request */

const OverlayPill = styled.div`
  position: absolute;
  left: 12px;
  right: 12px; /* constrain within figure */
  bottom: 12px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 600;
  pointer-events: none;
  white-space: nowrap;
  max-width: calc(100% - 24px);
  overflow: hidden;
  text-overflow: ellipsis;
  box-sizing: border-box;
`;

export default CopyHelp;
