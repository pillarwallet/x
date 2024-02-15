import { useWalletAddress } from '@etherspot/transaction-kit';
import styled from 'styled-components';
import { useLogout } from '@privy-io/react-auth';
import { useTranslation } from 'react-i18next';

// components
import Paragraph from '../Text/Paragraph';
import Button from '../Button';

interface AccountModalProps {
  isContentVisible?: boolean; // for animation purpose to not render rest of content and return main wrapper only
}

const AccountModal = ({ isContentVisible }: AccountModalProps) => {
  const walletAddress = useWalletAddress();
  const { logout } = useLogout();
  const [t] = useTranslation();

  if (!isContentVisible) {
    return <Wrapper />
  }

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
