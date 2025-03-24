/* eslint-disable @typescript-eslint/no-use-before-define */
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

// components
import Button from '../../Button';
import FormGroup from '../../Form/FormGroup';
import Alert from '../../Text/Alert';

interface SendModalBottomButtonsProps {
  onSend: (forceSend: boolean) => void;
  safetyWarningMessage: string;
  isSendDisabled: boolean;
  isSending: boolean;
  errorMessage: string;
  estimatedCostFormatted: string;
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
            onClick={onAddToBatch}
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
            onClick={onCancel}
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
          onClick={() => onSend(!!safetyWarningMessage)}
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
  flex-direction: row;
  gap: 10px;
`;

const Cost = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.color.text.formLabel};
  font-size: 12px;
  margin-top: 10px;
`;

export default SendModalBottomButtons;
