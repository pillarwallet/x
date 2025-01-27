/* eslint-disable @typescript-eslint/no-use-before-define */
import { animated, useTransition } from '@react-spring/web';
import { useEffect, useState } from 'react';
import BigBangStarField from 'react-big-bang-star-field';
import styled from 'styled-components';
import '../styles/landing/tailwind.css';

// images
import PillarXLogoLoading from '../assets/images/pillarX_full_white.png';

type LoadingProps = {
  type: 'enter' | 'wait';
};

const Loading = ({ type }: LoadingProps) => {
  const [show, setShow] = useState(true);

  const logoTransitions = useTransition(show, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 500 },
  });

  const starsTransitions = useTransition(show, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 500 },
  });

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Wrapper>
      {type === 'wait' ? (
        <p>Loading...</p>
      ) : (
        logoTransitions(
          (styles, item) =>
            item && (
              <animated.img
                src={PillarXLogoLoading}
                alt="pillar-x-logo"
                className="max-w-[300px] h-auto"
                style={styles}
              />
            )
        )
      )}
      {starsTransitions(
        (styles, item) =>
          item && (
            <animated.div
              style={{
                ...styles,
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
            >
              <BigBangStarField
                numStars={400}
                maxStarSpeed={2}
                scale={2}
                size={{ width: 100, height: 100 }}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                }}
                starColor="255, 255, 255"
              />
            </animated.div>
          )
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export default Loading;
