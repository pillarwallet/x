import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Transition } from 'react-transition-group';

// modals
import SendModal from './SendModal';
import HistoryModal from './HistoryModal';
import AccountModal from './AccountModal';
import AppsModal from './AppsModal';

// providers
import { BottomMenuItem } from '../../providers/BottomMenuModalProvider';

const BottomMenuModal = ({
  activeMenuItem,
  onClose,
}: {
  activeMenuItem: BottomMenuItem | null,
  onClose: () => void,
}) => {
  const overlayRef = React.useRef<HTMLDivElement>(null);

  const activeMenuItemIndex = React.useMemo(() => {
    return activeMenuItem?.type
      ? ['send', 'history', 'account', 'apps'].indexOf(activeMenuItem.type)
      : null;
  }, [activeMenuItem?.type]);

  const lastValidActiveMenuItemIndex = React.useRef<number>(activeMenuItemIndex ?? 0);

  useEffect(() => {
    const localRef = overlayRef.current;
    if (!localRef) return;

    const handleOverlayClick = (e: Event) => {
      if (e.target !== localRef) return;
      onClose();
      e.preventDefault();
    };

    localRef.addEventListener('click', handleOverlayClick);

    return () => {
      if (!localRef) return;
      localRef.removeEventListener('click', handleOverlayClick);
    };
  }, [overlayRef, onClose]);

  useEffect(() => {
    if (activeMenuItemIndex === null) return;
    lastValidActiveMenuItemIndex.current = activeMenuItemIndex ?? 0;
  }, [activeMenuItemIndex]);

  return (
    <Transition nodeRef={overlayRef} in={activeMenuItemIndex !== null} timeout={100}>
      {(overlayState) => (
        <Overlay
          ref={overlayRef}
          $blur={overlayState === 'entered' ? 5 : 0}
          $display={overlayState !== 'exited'}
        >
          <ModalContentVerticalAnimation $in={overlayState === 'entered'}>
            <ModalContentHorizontalAnimation
              $in={overlayState === 'entered'}
              $activeIndex={activeMenuItemIndex ?? lastValidActiveMenuItemIndex.current}
            >
              {[SendModal, HistoryModal, AccountModal, AppsModal].map((Modal, index) => (
                <ModalContentWrapper key={index}>
                  <ModalContent>
                    {activeMenuItemIndex !== null && (
                      <Modal
                        key={`${index}`}
                        isContentVisible={activeMenuItemIndex === index}
                        {...(activeMenuItem?.type === 'send' ? activeMenuItem.data : {})}
                      />
                    )}
                  </ModalContent>
                </ModalContentWrapper>
              ))}
            </ModalContentHorizontalAnimation>
          </ModalContentVerticalAnimation>
        </Overlay>
      )}
    </Transition>
  );
}

const Overlay = styled.div<{
  $blur: number;
  $display: boolean;
}>`
  position: fixed;
  z-index: 98;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: 100ms linear;
  backdrop-filter: blur(${({ $blur }) => $blur}px);
  display: ${({ $display }) => $display ? 'flex' : 'none'};
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 114px;
  overflow: hidden;
`;

const ModalContentVerticalAnimation = styled.div<{ $in: boolean }>`
  transition: 100ms linear;
  transform: translateY(${({ $in }) => $in ? 0 : 1000}px);
  display: flex;
  flex-direction: row;
  align-content: start;
  justify-content: start;
  width: 100%;
`;

const ModalContentHorizontalAnimation = styled.div<{ $activeIndex: number; $in: boolean; }>`
  align-self: flex-start;
  ${({ $in }) => $in && 'transition: 200ms linear;'};
  ${({ $activeIndex }) => `transform: translateX(calc(${$activeIndex} * -100vw));`};
  display: flex;
  flex-direction: row;
  align-content: start;
  justify-content: start;
`;

const ModalContentWrapper = styled.div`
  width: 100vw;
  display: flex;
  align-content: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  width: 350px;
  min-height: 350px; // fixed height only for preview
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 32px;
  padding: 34px 23px;
  background: ${({ theme }) => theme.color.background.bottomMenuModal};
  backdrop-filter: blur(5px);
  overflow: hidden;
`;

export default BottomMenuModal;
