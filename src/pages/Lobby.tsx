import styled from 'styled-components';

// components
import AppsList from '../components/AppsList';

const Lobby = () => {
  return (
    <Wrapper>
      <AppsList />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  padding: 120px 25px;
  max-width: 350px;
  margin: 0 auto;
`;

export default Lobby;
