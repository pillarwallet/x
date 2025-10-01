import { animated, useSpring } from '@react-spring/web';
import { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';

type PulseToastProps = {
  onClose: () => void;
};

const PulseToast = ({ onClose }: PulseToastProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  useEffect(() => {
    setIsVisible(true);

    const timer = setTimeout(() => {
      handleClose();
    }, 8000);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toastAnimation = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0px)' : 'translateY(20px)',
    config: { tension: 200, friction: 20 },
  });

  return (
    <animated.div
      style={toastAnimation}
      className="flex fixed bottom-4 right-4 max-w-80 bg-[#8A77FF] text-medium_grey p-4 rounded-lg shadow-lg z-[500] border border-white/[.5]"
      data-testid="pulse-toast"
    >
      <div className="flex flex-col">
        <div className="flex justify-between">
          <p className="text-sm font-medium text-white mb-2">
            Welcome to Pulse (beta)
          </p>
          <button
            type="button"
            className="absolute top-2 right-2"
            onClick={handleClose}
            aria-label="Close"
            data-testid="pulse-toast-close"
          >
            <MdClose color="white" />
          </button>
        </div>
        <p className="text-xs font-normal text-white">
          You’re trying out the beta version of Pulse: expect improvements
          ahead. Thank you for being part of the journey!
        </p>
      </div>
    </animated.div>
  );
};

export default PulseToast;
