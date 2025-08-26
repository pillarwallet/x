/* eslint-disable @typescript-eslint/no-use-before-define */
import styled from 'styled-components';

// components
import UniversalGasTank from './UniversalGasTank';
import GasTankHistory from './GasTankHistory';

const GasTank = () => {
  return (
    <Container>
      <LeftSection>
        <UniversalGasTank />
      </LeftSection>
      <RightSection>
        <GasTankHistory />
      </RightSection>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 24px;
    padding: 16px;
  }
`;

const LeftSection = styled.div`
  flex: 1;
  max-width: 400px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const RightSection = styled.div`
  flex: 2;
  min-width: 0;
`;

export default GasTank;
