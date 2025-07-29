/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import * as Sentry from '@sentry/react';

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
  allowBatching = true,
  onAddToBatch,
  onCancel,
}: SendModalBottomButtonsProps) => {
  const [t] = useTranslation();

  // Sentry context for bottom buttons
  React.useEffect(() => {
    Sentry.setContext('send_buttons', {
      isSendDisabled,
      isSending,
      hasError: !!errorMessage,
      hasSafetyWarning: !!safetyWarningMessage,
      allowBatching,
      estimatedCostFormatted,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    });
  }, [
    isSendDisabled,
    isSending,
    errorMessage,
    safetyWarningMessage,
    allowBatching,
    estimatedCostFormatted,
  ]);

  const handleSendClick = (ignoreSafetyWarning?: boolean) => {
    const buttonId = ignoreSafetyWarning ? 'send_anyway' : 'send';

    Sentry.addBreadcrumb({
      category: 'send_buttons',
      message: 'Send button clicked',
      level: 'info',
      data: {
        buttonId,
        ignoreSafetyWarning,
        isSendDisabled,
        isSending,
        hasError: !!errorMessage,
        hasSafetyWarning: !!safetyWarningMessage,
      },
    });

    onSend(ignoreSafetyWarning);
  };

  const handleAddToBatchClick = () => {
    Sentry.addBreadcrumb({
      category: 'send_buttons',
      message: 'Add to batch button clicked',
      level: 'info',
      data: {
        isSendDisabled,
        isSending,
        hasError: !!errorMessage,
      },
    });

    onAddToBatch?.();
  };

  const handleCancelClick = () => {
    Sentry.addBreadcrumb({
      category: 'send_buttons',
      message: 'Cancel button clicked',
      level: 'info',
      data: {
        isSendDisabled,
        isSending,
        hasError: !!errorMessage,
      },
    });

    onCancel?.();
  };

  return (
    <FormGroup>
      {!!safetyWarningMessage && !errorMessage && (
        <Alert>{safetyWarningMessage}</Alert>
      )}
      {!!errorMessage && <Alert>{`${t`label.error`}: ${errorMessage}`}</Alert>}
      <ButtonsWrapper>
        {allowBatching ? (
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
        ) : (
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
        )}
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
