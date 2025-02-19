import { animated, useSpring } from '@react-spring/web';
import { ReactNode, useEffect, useState } from 'react';

// images
import CloseSquare from '../../images/close-square.svg';

interface WalletConnectToastProps {
  children: ReactNode;
  onClose: () => void;
}

const WalletConnectToast = ({ children, onClose }: WalletConnectToastProps) => {
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
    }, 5000);

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
      className="flex fixed bottom-4 right-4 max-w-80 bg-white text-medium_grey p-4 rounded-xl ml-4 shadow-lg z-[500]"
    >
      <div
        id="walletConnect-toast"
        className="flex justify-between items-start"
      >
        <div className="flex">{children}</div>
        <button type="button" onClick={handleClose}>
          <img src={CloseSquare} alt="close-toast" className="w-5 h-5" />
        </button>
      </div>
    </animated.div>
  );
};

export default WalletConnectToast;
