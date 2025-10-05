import React, { useEffect, useState } from 'react';
import { animated, useTrail } from '@react-spring/web';
import styled from 'styled-components';

type AnimatedTitleProps = {
  text: string;
};

const AnimatedTitle: React.FC<AnimatedTitleProps> = ({ text }) => {
  const [isDisplaying, setIsDisplaying] = useState(true);
  const letters = text.split('');

  const trail = useTrail(letters.length, {
    from: { opacity: 0, transform: 'translateY(32px)' },
    to: {
      opacity: isDisplaying ? 1 : 0,
      transform: isDisplaying ? 'translateY(0px)' : 'translateY(32px)',
    },
    config: { tension: 210, friction: 20, mass: 1, duration: 25 },
  });

  useEffect(() => {
    const timeout = setTimeout(() => setIsDisplaying(false), 1250);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Overlay>
      <div className="title">
        {trail.map((styles, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <animated.span key={i} style={styles} className="letter">
            {letters[i] === ' ' ? '\u00A0' : letters[i]}
          </animated.span>
        ))}
      </div>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.color.background.body};
  z-index: 9999;

  .title {
    font-size: 48px;
    font-weight: 800;
    color: #fff;
  }

  .letter {
    display: inline-block;
  }

  @media (max-width: 640px) {
    .title {
      font-size: 24px;
    }
  }
`;

export default AnimatedTitle;
