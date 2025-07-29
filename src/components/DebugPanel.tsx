import React, { useState } from 'react';
import styled from 'styled-components';

interface DebugPanelProps {
  children: React.ReactNode;
  title?: string;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

const DebugPanel: React.FC<DebugPanelProps> = ({
  children,
  title = 'Debug Information',
  isOpen: controlledIsOpen,
  onToggle,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  // Use controlled state if provided, otherwise use internal state
  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = (open: boolean) => {
    if (controlledIsOpen === undefined) {
      setInternalIsOpen(open);
    }
    onToggle?.(open);
  };

  const DebugPanelContainer = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.9);
    border-top: 1px solid #333;
  `;

  const DebugToggleButton = styled.button`
    width: 100%;
    padding: 10px 20px;
    background: rgba(0, 0, 0, 0.8);
    border: none;
    border-bottom: 1px solid #333;
    color: #fff;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    font-weight: bold;

    &:hover {
      background: rgba(0, 0, 0, 0.9);
    }
  `;

  const DebugToggleText = styled.span`
    color: #fff;
  `;

  const DebugToggleIcon = styled.span<{ isOpen: boolean }>`
    color: #fff;
    font-size: 12px;
    transition: transform 0.3s ease;
    transform: ${(props) => (props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  `;

  const DebugContent = styled.div<{ isOpen: boolean }>`
    max-height: ${(props) => (props.isOpen ? '60vh' : '0')};
    overflow: hidden;
    transition: max-height 0.3s ease;
  `;

  const DebugContentInner = styled.div`
    padding: 20px;
    max-height: 60vh;
    overflow-y: auto;
  `;

  return (
    <DebugPanelContainer>
      <DebugToggleButton onClick={() => setIsOpen(!isOpen)}>
        <DebugToggleText>{title}</DebugToggleText>
        <DebugToggleIcon isOpen={isOpen}>▼</DebugToggleIcon>
      </DebugToggleButton>

      <DebugContent isOpen={isOpen}>
        <DebugContentInner>{children}</DebugContentInner>
      </DebugContent>
    </DebugPanelContainer>
  );
};

export default DebugPanel;
