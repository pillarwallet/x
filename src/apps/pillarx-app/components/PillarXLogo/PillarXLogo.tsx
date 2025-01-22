/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useEffect, useState } from 'react';

// images
import CloseIcon from '../../images/add.png';

// components
import Body from '../Typography/Body';
import BodySmall from '../Typography/BodySmall';

type PillarXLogoProps = {
  src: string;
  className?: string;
};

export const PillarXLogo = ({ src, className }: PillarXLogoProps) => {
  const [clickCount, setClickCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [isTestnet, setIsTestnet] = useState<string>(() => {
    const savedState = localStorage.getItem('isTestnet');
    return savedState || process.env.REACT_APP_USE_TESTNETS || 'false';
  });

  const handleLogoClick = () => {
    if (clickCount === 0) {
      const newTimer = setTimeout(() => {
        setClickCount(0);
      }, 1000);
      setTimer(newTimer);
    }

    setClickCount((prevCount) => prevCount + 1);

    if (clickCount + 1 === 3) {
      setIsModalOpen(true);
      setClickCount(0);
      if (timer) clearTimeout(timer);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    localStorage.setItem('isTestnet', isTestnet);
  }, [isTestnet]);

  const handleToggle = () => {
    setIsTestnet((prevState) => {
      const newState = prevState === 'true' ? 'false' : 'true';
      setTimeout(() => {
        window.location.reload();
      }, 500);
      return newState;
    });
  };

  return (
    <>
      <img
        src={src}
        alt="pillar-x-logo"
        className={`w-min ${className}`}
        onClick={handleLogoClick}
      />
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-6 bg-container_grey rounded-lg p-8 w-full max-w-md desktop:mx-12 tablet:mx-12 mobile:mx-6">
            <img
              src={CloseIcon}
              alt="close-modal-button"
              className="fixed top-0 right-0 w-[40px] h-[40px] mt-6 mr-4 mb-20 desktop:mr-14 desktop:mb-28"
              onClick={closeModal}
            />
            <Body>Switch network</Body>
            <div className="flex w-full gap-4 items-center justify-center">
              <BodySmall>Mainnet</BodySmall>
              <div
                onClick={handleToggle}
                className={`relative inline-flex w-8 h-[18px] rounded-[20px] p-0.5 cursor-pointer transition-colors duration-300 ${
                  isTestnet === 'true' ? 'bg-purple_medium' : 'bg-[#5F5C6E]'
                }`}
              >
                <span
                  className={`absolute top-[2px] bottom-0 h-3.5 w-3.5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                    isTestnet === 'true' ? 'translate-x-3.5' : 'translate-x-0'
                  }`}
                />
              </div>
              <BodySmall>Testnet</BodySmall>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PillarXLogo;
