import { useWalletAddress } from '@etherspot/transaction-kit';
import styled from 'styled-components';

// components
import Paragraph from '../Text/Paragraph';

const AccountModal = () => {
  const walletAddress = useWalletAddress();
  return (
    <Wrapper>
      <Paragraph>
        {walletAddress}
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
