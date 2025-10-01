import { animated, useSpring } from '@react-spring/web';
import React, { useEffect, useRef } from 'react';

// assets
import ConfirmedIcon from '../../assets/confirmed-icon.svg';
import FailedIcon from '../../assets/failed-icon.svg';
import PendingIcon from '../../assets/pending.svg';

// types
import { TransactionStatusState } from '../../types/types';

// utils
import { getStatusConfig } from '../../utils/utils';

interface TransactionStatusIconProps {
  status: TransactionStatusState;
}

const TransactionStatusIcon: React.FC<TransactionStatusIconProps> = ({
  status,
}) => {
  const config = getStatusConfig(status);
  const shouldAnimateRef = useRef(false);

  // Check if we should show heartbeat animation
  const shouldAnimate =
    status === 'Starting Transaction' || status === 'Transaction Pending';

  // Update the ref whenever shouldAnimate changes
  shouldAnimateRef.current = shouldAnimate;

  // Heartbeat animation spring
  const [springs, api] = useSpring(() => ({
    from: { scale: 1, filter: 'blur(0px)', rotate: '0deg' },
    to: { scale: 1, filter: 'blur(0px)', rotate: '0deg' },
  }));

  useEffect(() => {
    if (shouldAnimate) {
      // Start the heartbeat animation loop
      const startHeartbeat = () => {
        // Step 1: bigger + blurry - 0.1s
        api.start({
          to: { scale: 1.1, filter: 'blur(1px)' },
          config: { duration: 100 },
          onRest: () => {
            // Check if we should still animate before continuing
            if (!shouldAnimateRef.current) return;

            // Step 2: back to normal - 0.1s
            api.start({
              to: { scale: 1, filter: 'blur(0px)' },
              config: { duration: 100 },
              onRest: () => {
                // Check if we should still animate before continuing
                if (!shouldAnimateRef.current) return;

                // Step 3: bigger + blurry - 0.1s
                api.start({
                  to: { scale: 1.1, filter: 'blur(1px)' },
                  config: { duration: 100 },
                  onRest: () => {
                    // Check if we should still animate before continuing
                    if (!shouldAnimateRef.current) return;

                    // Step 4: back to normal - 0.7s
                    api.start({
                      to: { scale: 1, filter: 'blur(0px)' },
                      config: { duration: 700 },
                      onRest: () => {
                        // Restart the animation after it completes
                        if (shouldAnimateRef.current) {
                          startHeartbeat();
                        }
                      },
                    });
                  },
                });
              },
            });
          },
        });
      };

      startHeartbeat();
    } else {
      // Stop any ongoing animations and reset to normal state
      api.stop();
      api.start({
        to: { scale: 1, filter: 'blur(0px)' },
        config: { duration: 200 },
      });
    }
  }, [shouldAnimate, api]);

  // Handle rotation animation for Success/Failed states
  useEffect(() => {
    if (status === 'Transaction Complete' || status === 'Transaction Failed') {
      // Start rotated and slightly smaller, then snap into place with zoom effect
      api.set({ rotate: '-90deg', scale: 0.9 });
      api.start({
        to: { rotate: '0deg', scale: 1.05 },
        config: { duration: 200 },
        onRest: () => {
          // Quick zoom back to normal size
          api.start({
            to: { scale: 1 },
            config: { duration: 100 },
          });
        },
      });
    }
  }, [status, api]);

  const getIcon = () => {
    switch (config.icon) {
      case 'confirmed':
        return ConfirmedIcon;
      case 'failed':
        return FailedIcon;
      case 'pending':
      default:
        return PendingIcon;
    }
  };

  return (
    <animated.div className={config.containerClasses} style={springs}>
      <img src={getIcon()} alt={status} className={config.iconClasses} />
    </animated.div>
  );
};

export default React.memo(TransactionStatusIcon);
