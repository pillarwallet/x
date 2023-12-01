import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useWallets } from '@privy-io/react-auth';
import styled from 'styled-components';

// components
import { PrimaryTitle } from '../../components/Text/Title';
import Alert from '../../components/Text/Alert';

export const App = () => {
  const [t] = useTranslation();
  const [message, setMessage] = React.useState<string>('');
  const [signedMessage, setSignedMessage] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [isSigning, setIsSigning] = React.useState<boolean>(false);
  const { wallets } = useWallets();

  const signMessage = async () => {
    if (isSigning) return;

    setIsSigning(true);
    setErrorMessage('');
    setSignedMessage('');

    try {
      const newSignedMessage = await wallets[0].sign(message);
      setSignedMessage(newSignedMessage);
    } catch (e) {
      const newErrorMessage = e instanceof Error && e?.message
        ? e.message
        : 'Failed to sign: unknown error';
      setErrorMessage(newErrorMessage);
    }

    setIsSigning(false);
  }

  useEffect(() => {
    setErrorMessage('')
    setSignedMessage('')
  }, [message]);

  return (
    <Wrapper>
      <PrimaryTitle>{t`title`}</PrimaryTitle>
      <StyledTextarea
        onChange={(e) => setMessage(e?.target?.value ?? '')}
        placeholder={t`messagePlaceholder`}
      />
      {errorMessage && (
        <Alert level="error">{errorMessage}</Alert>
      )}
      {signedMessage && (
        <Alert level="info">{signedMessage}</Alert>
      )}
      <StyledButton onClick={signMessage} disabled={isSigning}>
        {isSigning ? t`signing` : t`signMessage`}
      </StyledButton>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;

const StyledTextarea = styled.textarea`
  background: ${({ theme }) => theme.color.background.input};
  color: ${({ theme }) => theme.color.text.input};
  border: 1px solid ${({ theme }) => theme.color.border.input};
  padding: 10px 15px;
  font-size: 16px;
  width: 100%;
  height: 100px;
  resize: none;
  margin-bottom: 15px;
  border-radius: 5px;

  &:focus {
    outline: none;
  }
`;

const StyledButton = styled.button`
  background: ${({ theme }) => theme.color.background.input};
  color: ${({ theme }) => theme.color.text.input};
  font-weight: 800;
  cursor: pointer;
  border: none;
  padding: 15px;
  font-size: 20px;
  width: 100%;
  border-radius: 5px;

  &:focus {
    outline: none;
  }
`;

export default App;
