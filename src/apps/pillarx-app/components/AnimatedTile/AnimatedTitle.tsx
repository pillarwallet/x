import { animated, useSpring } from '@react-spring/web';
import { ReactNode, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

// types
import { Projection } from '../../../../types/api';

// hooks
import { useRecordPresenceMutation } from '../../../../services/pillarXApiPresence';

const AnimatedTile = ({
  children,
  isDataLoading,
  data,
  accountAddress,
}: {
  children: ReactNode;
  isDataLoading: boolean;
  data: Projection;
  accountAddress?: string;
}) => {
  /**
   * Import the recordPresence mutation from the
   * pillarXApiPresence service. We use this to
   * collect data on when each tile is being viewed
   */
  const [recordPresence] = useRecordPresenceMutation();

  const [animationComplete, setAnimationComplete] = useState(false);

  const { meta } = data || {};
  const tileDisplay = meta?.display;

  const [ref, inView] = useInView({
    threshold: 0.1,
    rootMargin: '100px 0px 0px 0px',
  });

  useEffect(() => {
    if (animationComplete) {
      recordPresence({
        address: accountAddress,
        action: 'app:feed:viewTile',
        value: {
          tileId: data.id,
          tileName: tileDisplay?.title || '',
          layout: data.layout,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationComplete]);

  const animationProps = useSpring({
    transform:
      inView && !isDataLoading ? 'translateY(0px)' : 'translateY(100px)',
    config: { tension: 170, friction: 26 },
    onRest: () => {
      if (inView) {
        setAnimationComplete(true);
      } else {
        setAnimationComplete(false);
      }
    },
  });

  return (
    <animated.div style={animationProps} ref={ref}>
      {children}
    </animated.div>
  );
};

export default AnimatedTile;
