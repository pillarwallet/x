import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useWallets } from '@privy-io/react-auth';
import styled from 'styled-components';

// components
import { PrimaryTitle } from '../../components/Text/Title';

const Alert = ({
  level = 'info',
  children,
}: React.PropsWithChildren<{
  level?: 'info' | 'success' | 'warning' | 'error'
}>) => {
  const color = {
    background: {
      info: '#BEF',
      error: '#D8000C',
      success: '#DFF2BF',
      warning: '#FEEFB3',
    },
    text: {
      info: '#059',
      error: '#FFBABA',
      success: '#270',
      warning: '#9F6000',
    },
  };

  return (
    <AlertText
      $background={color.background[level]}
      $color={color.text[level]}
    >
      {children}
    </AlertText>
  );
}

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
  border: none;
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

const AlertText = styled.p<{ $color: string; $background: string; }>`
  padding: 13px 15px;
  background: ${({ $background }) => $background};
  color: ${({ $color }) => $color};
  word-break: break-all;
  margin-bottom: 15px;
  font-size: 14px;
  border-radius: 5px;
`;

export default App;
