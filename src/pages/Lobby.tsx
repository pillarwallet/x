/* eslint-disable @typescript-eslint/no-use-before-define */
import { animated, useSpring } from '@react-spring/web';
import styled from 'styled-components';

// components
import App from '../apps/pillarx-app';

const Lobby = () => {
  const [springs] = useSpring(() => ({
    from: { opacity: 0 },
    to: { opacity: 1 },
  }));
  return (
    <Wrapper>
      <animated.div
        style={{
          height: '100%',
          width: '100%',
          ...springs,
        }}
      >
        <App />
      </animated.div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  margin: 0 auto;
`;

export default Lobby;
