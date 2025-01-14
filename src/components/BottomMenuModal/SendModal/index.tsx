/* eslint-disable @typescript-eslint/no-use-before-define */
import { Blend2 as IconBlend, Layer as IconLayers } from 'iconsax-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

// components
import FormGroup from '../../Form/FormGroup';
import FormTabSelect from '../../Form/FormTabSelect';
import SendModalBatchesTabView from './SendModalBatchesTabView';
import SendModalTokensTabView from './SendModalTokensTabView';

// types
import { SendModalData } from '../../../types';

// hooks
import useBottomMenuModal from '../../../hooks/useBottomMenuModal';
import useGlobalTransactionsBatch from '../../../hooks/useGlobalTransactionsBatch';

interface SendModalProps extends React.PropsWithChildren {
  isContentVisible?: boolean; // for animation purpose to not render rest of content and return main wrapper only
  payload?: SendModalData;
}

const SendModal = ({ isContentVisible, payload }: SendModalProps) => {
  const wrapperRef = React.useRef(null);
  const { showBatchSendModal, setShowBatchSendModal } = useBottomMenuModal();
  const [t] = useTranslation();
  const { transactions: globalTransactionsBatch } =
    useGlobalTransactionsBatch();

  if (!isContentVisible) {
    return <Wrapper />;
  }

  return (
    <Wrapper id="send-modal" ref={wrapperRef}>
      {!payload && (
        <FormGroup>
          <FormTabSelect
            items={[
              {
                title: t`title.assets`,
                icon: <IconBlend size={20} />,
              },
              {
                title: t`title.batches`,
                icon: <IconLayers size={20} />,
                notificationText: `${globalTransactionsBatch.length}`,
              },
            ]}
            onChange={(index) => setShowBatchSendModal(index === 1)}
          />
        </FormGroup>
      )}
      {showBatchSendModal && <SendModalBatchesTabView />}
      {!showBatchSendModal && <SendModalTokensTabView payload={payload} />}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  max-height: 100%;

  &::-webkit-scrollbar {
    display: none;
  }

  overflow-y: scroll;

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export default SendModal;
