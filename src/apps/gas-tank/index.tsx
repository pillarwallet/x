/* eslint-disable @typescript-eslint/no-use-before-define */
import styled from 'styled-components';

// styles
import './styles/gasTank.css';

// components
import GasTank from './components/GasTank';

export const App = () => {
  return (
    <Wrapper>
      <GasTank />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  margin: 0 auto;
  flex-direction: column;
  max-width: 1248px;
  padding: 32px;

  @media (min-width: 1024px) {
    padding: 52px 62px;
  }

  @media (max-width: 1024px) {
    padding: 52px 32px;
  }

  @media (max-width: 768px) {
    padding: 32px 16px;
  }
`;

export default App;
