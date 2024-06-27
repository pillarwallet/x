import styled from 'styled-components';

// components
import App from '../apps/pillarx-app';

const Lobby = () => {
  return (
    <Wrapper>
      <App />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  margin: 0 auto;
`;

export default Lobby;
