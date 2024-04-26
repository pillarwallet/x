import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

// components
import Alert from '../components/Text/Alert';

const NotFound = ({ message }: { message?: string }) => {
  const [t] = useTranslation();

  return (
    <Wrapper>
      <Alert>{message ?? t`error.pageNotFound`}</Alert>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 50px 16px;
`;

export default NotFound;
