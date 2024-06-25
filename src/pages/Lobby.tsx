import styled from 'styled-components';
import App from '../apps/pillarx-app';

// components
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
