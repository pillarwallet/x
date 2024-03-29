import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Transition } from 'react-transition-group';

// modals
import SendModal from './SendModal';
import HistoryModal from './HistoryModal';
import AccountModal from './AccountModal';
import AppsModal from './AppsModal';

// hooks
import useBottomMenuModal from '../../hooks/useBottomMenuModal';

const BottomMenuModal = () => {
  const modalRef = React.useRef<HTMLDivElement>(null);
  const { active, activeIndex } = useBottomMenuModal();

  const lastValidActiveIndex = React.useRef<number>(activeIndex ?? 0);

  useEffect(() => {
    if (activeIndex === null) return;
    lastValidActiveIndex.current = activeIndex ?? 0;
  }, [activeIndex]);

  return (
    <Transition nodeRef={modalRef} in={!!active} timeout={100}>
      {(overlayState) => (
        <OverflowControlWrapper>
          <ModalContentVerticalAnimation $offset={overlayState === 'entered' ? 0 : 1000} $display={overlayState !== 'exited'}>
            <ModalContentHorizontalAnimation
              $in={overlayState === 'entered'}
              $activeIndex={activeIndex ?? lastValidActiveIndex.current}
            >
              {[SendModal, HistoryModal, AccountModal, AppsModal].map((Modal, index) => (
                <ModalContent key={index}>
                  {activeIndex !== null && (
                    <Modal
                      key={`${index}`}
                      isContentVisible={activeIndex === index}
                      {...(active?.type === 'send' ? { payload: active.payload } : {})}
                    />
                  )}
                </ModalContent>
              ))}
            </ModalContentHorizontalAnimation>
          </ModalContentVerticalAnimation>
        </OverflowControlWrapper>
      )}
    </Transition>
  );
}

const OverflowControlWrapper = styled.div`
  overflow: hidden;
`;

const ModalContentVerticalAnimation = styled.div<{ $offset: number; $display: boolean }>`
  transition: 100ms linear;
  transform: translateY(${({ $offset }) => $offset}px);
  display: ${({ $display }) => $display ? 'flex' : 'none'};
  flex-direction: row;
  align-content: start;
  justify-content: start;
  width: 100%;
`;

const ModalContentHorizontalAnimation = styled.div<{ $activeIndex: number; $in: boolean; }>`
  align-self: flex-start;
  ${({ $in }) => $in && 'transition: 50ms linear;'};
  ${({ $activeIndex }) => `transform: translateX(calc(${$activeIndex} * -336px));`};
  display: flex;
  flex-direction: row;
  align-content: start;
  justify-content: start;
`;

const ModalContent = styled.div`
  width: 336px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 34px 23px;
  overflow: hidden;
`;

export default BottomMenuModal;
