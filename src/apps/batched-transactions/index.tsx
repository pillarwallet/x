import { Box, Card, CssVarsProvider } from '@mui/joy';
import JoyButton from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MdDelete } from 'react-icons/md';
import styled from 'styled-components';

// components
import Button from '../../components/Button';
import FormGroup from '../../components/Form/FormGroup';
import Label from '../../components/Form/Label';
import Select from '../../components/Form/Select';
import TextInput from '../../components/Form/TextInput';
import useBottomMenuModal from '../../hooks/useBottomMenuModal';

// utils
import { getChainName, visibleChains } from '../../utils/blockchain';

interface Transaction {
  to: string;
  value: string;
  data: string;
}

const App = () => {
  const [t] = useTranslation();
  const [transactions, setTransactions] = React.useState<{
    [id: number]: Transaction;
  }>({
    [+new Date()]: { to: '', data: '', value: '' },
  });

  const chainOptions = visibleChains.map((chain) => ({
    id: `${chain.id}`,
    title: getChainName(chain.id),
    value: chain.id,
  }));

  const [chainId, setChainId] = React.useState<number>(+chainOptions[0]?.value);
  const { showTransactionConfirmation } = useBottomMenuModal();

  const isSendDisabled = Object.values(transactions).some(
    (transaction) => !transaction.to
  );

  const send = () => {
    if (isSendDisabled) return;
    showTransactionConfirmation({
      title: 'Basic Transaction',
      description: `This will execute ${Object.values(transactions).length} of your transactions on ${chainId} chain`,
      batches: [
        {
          chainId,
          transactions: Object.values(transactions).map((transaction) => {
            return {
              to: transaction.to,
              value: transaction.value || undefined,
              data: transaction.data || undefined,
            };
          }),
        },
      ],
    });
  };

  const updateTransaction = (
    id: number,
    key: keyof Transaction,
    value: string
  ) => {
    setTransactions((current) => ({
      ...current,
      [id]: {
        ...current[id],
        [key]: value,
      },
    }));
  };

  const addTransaction = () => {
    setTransactions((current) => ({
      ...current,
      [+new Date()]: { to: '', data: '', value: '' },
    }));
  };

  const removeTransaction = (id: number) => {
    setTransactions((current) => {
      const newTransactions = { ...current };
      delete newTransactions[id];
      return newTransactions;
    });
  };

  return (
    <Wrapper>
      <FormWrapper>
        <FormGroup>
          <Label>{t`chain`}</Label>
          <Select
            options={chainOptions}
            onChange={(option) => setChainId(+option?.value)}
            defaultSelectedId={chainOptions[0]?.id}
          />
        </FormGroup>
        <CssVarsProvider defaultMode="dark">
          {Object.keys(transactions).map((transactionId, index) => (
            <Card key={transactionId} sx={{ mb: 2 }}>
              {Object.keys(transactions).length > 1 && (
                <RemoveButton onClick={() => removeTransaction(+transactionId)}>
                  <MdDelete />
                </RemoveButton>
              )}
              <Chip>Transaction {index + 1}</Chip>
              <FormGroup>
                <Label>{t`destinationAddress`}</Label>
                <TextInput
                  onValueChange={(value) =>
                    updateTransaction(+transactionId, 'to', value ?? '')
                  }
                />
              </FormGroup>
              <FormGroup>
                <Label>{t`transactionValue`}</Label>
                <TextInput
                  onValueChange={(value) =>
                    updateTransaction(+transactionId, 'value', value ?? '')
                  }
                />
              </FormGroup>
              <FormGroup>
                <Label>{t`transactionCallData`}</Label>
                <StyledTextarea
                  onChange={(e) =>
                    updateTransaction(
                      +transactionId,
                      'data',
                      e?.target?.value ?? ''
                    )
                  }
                />
              </FormGroup>
            </Card>
          ))}
        </CssVarsProvider>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <JoyButton
            color="neutral"
            size="sm"
            variant="outlined"
            onClick={addTransaction}
            sx={{ mb: 6 }}
          >
            {t`addMoreTransactions`}
          </JoyButton>
        </Box>
        <Button
          disabled={isSendDisabled}
          onClick={send}
          $fullWidth
        >{t`send`}</Button>
      </FormWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 40px 25px 120px;
  min-height: calc(100vh - 240px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const FormWrapper = styled.div`
  width: 100%;
`;

const StyledTextarea = styled.textarea`
  background: ${({ theme }) => theme.color.background.input};
  color: ${({ theme }) => theme.color.text.input};
  border: none;
  padding: 10px 15px;
  font-size: 16px;
  width: 100%;
  height: 100px;
  resize: none;
  border-radius: 5px;

  &:focus {
    outline: none;
  }
`;

const RemoveButton = styled.div`
  cursor: pointer;
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 5px;
  width: 30px;
  height: 30px;
  text-align: center;
  background: #ff000080;
  border-radius: 50%;

  &:hover {
    opacity: 0.7;
  }
`;

export default App;
