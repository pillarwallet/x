/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, useEffect } from 'react';
import { Transition } from 'react-transition-group';
import styled from 'styled-components';

// context
import { AccountBalancesContext } from '../../providers/AccountBalancesProvider';
import { AccountNftsContext } from '../../providers/AccountNftsProvider';

// modals
import AccountModal from './AccountModal';
import AppsModal from './AppsModal';
import HistoryModal from './HistoryModal';
import SendModal from './SendModal';

// hooks
import useBottomMenuModal from '../../hooks/useBottomMenuModal';

const BottomMenuModal = () => {
  const modalRef = React.useRef<HTMLDivElement>(null);
  const contextNfts = useContext(AccountNftsContext);
  const contextBalances = useContext(AccountBalancesContext);
  const { active, activeIndex, hide } = useBottomMenuModal();

  const lastValidActiveIndex = React.useRef<number>(activeIndex ?? 0);

  useEffect(() => {
    if (activeIndex === null) return;
    lastValidActiveIndex.current = activeIndex ?? 0;
  }, [activeIndex]);

  useEffect(() => {
    if (activeIndex === 0 || activeIndex === 2) {
      contextNfts?.data.setUpdateData(true);
      contextBalances?.data.setUpdateData(true);
    }
  }, [contextNfts?.data, contextBalances?.data, activeIndex]);

  return (
    <Transition nodeRef={modalRef} in={!!active} timeout={100}>
      {(overlayState) => (
        <OverflowControlWrapper>
          <ModalContentVerticalAnimation
            $offset={overlayState === 'entered' ? 0 : 1000}
            $display={overlayState !== 'exited'}
          >
            <ModalContentHorizontalAnimation
              $in={overlayState === 'entered'}
              $activeIndex={activeIndex ?? lastValidActiveIndex.current}
            >
              {[SendModal, HistoryModal, AccountModal, AppsModal].map(
                (Modal, index) => (
                  <ModalContent key={index}>
                    <Modal
                      key={`${index}`}
                      isContentVisible={activeIndex === index}
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...(active?.type === 'send'
                        ? { payload: active.payload }
                        : {})}
                    />
                  </ModalContent>
                )
              )}
            </ModalContentHorizontalAnimation>
            <ModalHandlebar onClick={hide} />
          </ModalContentVerticalAnimation>
        </OverflowControlWrapper>
      )}
    </Transition>
  );
};

const OverflowControlWrapper = styled.div`
  overflow: hidden;
`;

const ModalContentVerticalAnimation = styled.div<{
  $offset: number;
  $display: boolean;
}>`
  transition: 100ms linear;
  transform: translateY(${({ $offset }) => $offset}px);
  display: ${({ $display }) => ($display ? 'flex' : 'none')};
  flex-direction: row;
  align-content: start;
  justify-content: start;
  width: 100%;
  position: relative;
`;

const ModalContentHorizontalAnimation = styled.div<{
  $activeIndex: number;
  $in: boolean;
}>`
  align-self: flex-start;
  ${({ $in }) => $in && 'transition: 50ms linear;'};
  ${({ $activeIndex }) =>
    `transform: translateX(calc(${$activeIndex} * -336px));`};
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
  padding: 31px 20px 20px;
  overflow: hidden;
  max-height: 50vh;
`;

const ModalHandlebar = styled.div`
  background: ${({ theme }) => theme.color.background.bottomModalHandlebar};
  height: 4px;
  width: 40px;
  cursor: pointer;
  border-radius: 2px;
  position: absolute;
  top: 14px;
  left: 148px;
`;

export default BottomMenuModal;
