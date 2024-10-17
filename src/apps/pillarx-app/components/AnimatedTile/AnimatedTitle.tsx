import { animated, useSpring } from '@react-spring/web';
import { ReactNode } from 'react';
import { useInView } from 'react-intersection-observer';

const AnimatedTile = ({
  children,
  isDataLoading,
}: {
  children: ReactNode;
  isDataLoading: boolean;
}) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    rootMargin: '100px 0px 0px 0px',
  });

  const animationProps = useSpring({
    transform:
      inView && !isDataLoading ? 'translateY(0px)' : 'translateY(100px)',
    config: { tension: 170, friction: 26 },
  });

  return (
    <animated.div style={animationProps} ref={ref}>
      {children}
    </animated.div>
  );
};

export default AnimatedTile;
