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

  return (
    <div
      className={`flex fixed bottom-4 right-4 max-w-80 bg-white text-medium_grey p-4 rounded-xl
                  transition-all duration-300 ease-in-out ml-4
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                `}
      style={{ zIndex: 500 }}
    >
      <div className="flex justify-between items-start">
        <div className="flex">{children}</div>
        <button type="button" onClick={handleClose}>
          <img src={CloseSquare} alt="close-toast" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default WalletConnectToast;
