/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { Blend2 as IconBlend, Layer as IconLayers } from 'iconsax-react';
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

// components
import FormGroup from '../../Form/FormGroup';
import FormTabSelect from '../../Form/FormTabSelect';
import SendModalBatchesTabView from './SendModalBatchesTabView';
import SendModalTokensTabView from './SendModalTokensTabView';

// types
import { ITransaction } from '../../../types/blockchain';

// hooks
import useBottomMenuModal from '../../../hooks/useBottomMenuModal';
import useGlobalTransactionsBatch from '../../../hooks/useGlobalTransactionsBatch';
import { AccountBalancesContext } from '../../../providers/AccountBalancesProvider';

interface SendModalDataBase {
  title: string;
  description?: string;
  onSent?: (userOpHashes: string[]) => void;
}

export interface SendModalSingleTransactionData extends SendModalDataBase {
  transaction: ITransaction;
}

interface SendModalSingleBatchedTransactionsData extends SendModalDataBase {
  batches: {
    chainId: number;
    transactions: Omit<ITransaction, 'chainId'>[];
  }[];
}

export type SendModalData =
  | SendModalSingleTransactionData
  | SendModalSingleBatchedTransactionsData;

interface SendModalProps extends React.PropsWithChildren {
  isContentVisible?: boolean; // for animation purpose to not render rest of content and return main wrapper only
  payload?: SendModalData;
}

const SendModal = ({ isContentVisible, payload }: SendModalProps) => {
  const contextBalances = useContext(AccountBalancesContext);
  const wrapperRef = React.useRef(null);
  const { showBatchSendModal, setShowBatchSendModal } = useBottomMenuModal();
  const [t] = useTranslation();
  const { transactions: globalTransactionsBatch } =
    useGlobalTransactionsBatch();

  useEffect(() => {
    if (!isContentVisible) {
      contextBalances?.data.setUpdateData(false);
    }
    if (isContentVisible) {
      contextBalances?.data.setUpdateData(true);
    }
  }, [isContentVisible, contextBalances?.data]);

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
