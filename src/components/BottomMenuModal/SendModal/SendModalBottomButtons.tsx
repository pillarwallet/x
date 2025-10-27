/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

// components
import Button from '../../Button';
import FormGroup from '../../Form/FormGroup';
import Alert from '../../Text/Alert';

interface SendModalBottomButtonsProps {
  onSend: (ignoreSafetyWarning?: boolean) => void;
  safetyWarningMessage?: string;
  isSendDisabled: boolean;
  isSending: boolean;
  errorMessage?: string;
  estimatedCostFormatted?: string;
  allowBatching?: boolean;
  onAddToBatch?: () => void;
  onCancel?: () => void;
}

const SendModalBottomButtons = ({
  onSend,
  safetyWarningMessage,
  isSendDisabled,
  isSending,
  errorMessage,
  estimatedCostFormatted,
  // Disabled line check here as we may need this in future
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  allowBatching = true,
  onAddToBatch,
  onCancel,
}: SendModalBottomButtonsProps) => {
  const [t] = useTranslation();

  const handleSendClick = (ignoreSafetyWarning?: boolean) => {
    onSend(ignoreSafetyWarning);
  };

  const handleAddToBatchClick = () => {
    onAddToBatch?.();
  };

  const handleCancelClick = () => {
    onCancel?.();
  };

  return (
    <FormGroup>
      {!!safetyWarningMessage && !errorMessage && (
        <Alert>{safetyWarningMessage}</Alert>
      )}
      {!!errorMessage && <Alert>{`${t`label.error`}: ${errorMessage}`}</Alert>}
      <ButtonsWrapper>
        {onAddToBatch ? (
          <Button
            id="add-to-batch-button-send-modal"
            disabled={isSendDisabled}
            onClick={handleAddToBatchClick}
            $secondary
            $fullWidth
            $last
          >
            {t`action.addToBatch`}
          </Button>
        ) : onCancel ? (
          <Button
            id="cancel-button-send-modal"
            disabled={isSendDisabled}
            onClick={handleCancelClick}
            $secondary
            $fullWidth
            $last
          >
            {t`action.cancel`}
          </Button>
        ) : null}
        <Button
          id="send-button-send-modal"
          disabled={isSendDisabled}
          onClick={() => handleSendClick(!!safetyWarningMessage)}
          $fullWidth
          $last
        >
          {isSending && t`progress.sending`}
          {!isSending &&
            (safetyWarningMessage && !errorMessage
              ? t`action.sendAnyway`
              : t`action.send`)}
        </Button>
      </ButtonsWrapper>
      {!!errorMessage && !!estimatedCostFormatted && (
        <Cost id="cost-send-modal">
          {t`label.transactionCost`}: {estimatedCostFormatted}
        </Cost>
      )}
    </FormGroup>
  );
};

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
`;

const Cost = styled.div`
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-top: 12px;
`;

export default SendModalBottomButtons;
