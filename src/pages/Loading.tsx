import styled from 'styled-components';

// components
import AnimatedShape from '../components/AnimatedShape';

const Loading = () => (
  <Wrapper>
    <AnimatedShape />
  </Wrapper>
);

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;


export default Loading;
