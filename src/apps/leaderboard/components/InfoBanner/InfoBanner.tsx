import { useState } from 'react';
import { MdOutlineClose } from 'react-icons/md';

// images
import { ReactComponent as InfoIcon } from '../../images/info-icon.svg';

// components
import BodySmall from '../Typography/BodySmall';

const InfoBanner = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative bg-[#3C80FF]/[.1] py-5 px-6 rounded-2xl border-[1px] border-[#3C80FF]/[.1] w-full mb-3">
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="absolute top-2 right-2 text-blue-900 hover:text-blue-700 focus:outline-none"
        aria-label="Close info banner"
      >
        <MdOutlineClose size={12} color="white" />
      </button>
      <div className="flex gap-3 items-center">
        <div className="flex items-center justify-center rounded-full bg-[#3C80FF]/[.4] w-9 h-9">
          <InfoIcon />
        </div>
        <div className="flex flex-col">
          <BodySmall className="font-normal text-white">
            Earn PX Points by migrating, trading, and earning PnL.
          </BodySmall>
          <BodySmall className="font-normal text-white">
            Top users qualify for the lottery. OG users from Pillar Wallet get
            exclusive badges.
          </BodySmall>
        </div>
      </div>
    </div>
  );
};

export default InfoBanner;
