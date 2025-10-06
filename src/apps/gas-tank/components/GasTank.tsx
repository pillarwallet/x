/* eslint-disable @typescript-eslint/no-use-before-define */
import styled from 'styled-components';

// components
import UniversalGasTank from './UniversalGasTank';
import GasTankHistory from './GasTankHistory';

const GasTank = () => {
  return (
    <Container>
      <UniversalGasTank />
    </Container>
  );
};

const Container = styled.div`
  margin: 0 auto;
  padding: 32px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export default GasTank;
