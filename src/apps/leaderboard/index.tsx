// styles
import styled from 'styled-components';
import './styles/tailwindLeaderboard.css';

const App = () => {
  return (
    <Wrapper id="deposit-app">
      <h1 className="text-4xl mb-8">Leaderboard</h1>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  margin: 0 auto 60px auto;
  flex-direction: column;

  @media (min-width: 768px) {
    padding: 52px 60px;
  }

  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

export default App;
