import { useWalletAddress } from '@etherspot/transaction-kit';
import styled from 'styled-components';
import { useLogout } from '@privy-io/react-auth';
import { useTranslation } from 'react-i18next';

// components
import Paragraph from '../Text/Paragraph';
import Button from '../Button';

const AccountModal = () => {
  const walletAddress = useWalletAddress();
  const { logout } = useLogout();
  const [t] = useTranslation();

  return (
    <Wrapper>
      <Paragraph>
        {walletAddress}<br/><br/>
        <Button onClick={logout}>{t`action.logout`}</Button>
      </Paragraph>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  word-break: break-all;
  text-align: center;
`;

export default AccountModal;
