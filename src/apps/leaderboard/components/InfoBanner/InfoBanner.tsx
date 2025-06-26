import { useState } from 'react';
import { MdOutlineClose } from 'react-icons/md';

// images
import InfoIcon from '../../images/info-icon.svg?react';

// components
import BodySmall from '../Typography/BodySmall';

const InfoBanner = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative bg-[#3C80FF]/[.1] desktop:py-5 desktop:px-6 tablet:py-5 tablet:px-6 mobile:p-4 rounded-2xl border-[1px] border-[#3C80FF]/[.1] w-full mb-3">
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="absolute top-2 right-2 text-blue-900 hover:text-blue-700 focus:outline-none"
        aria-label="Close info banner"
      >
        <MdOutlineClose size={12} color="white" />
      </button>
      <div className="flex gap-3 desktop:items-center tablet:items-center mobile:items-start">
        <div className="flex-shrink-0 flex items-center justify-center rounded-full bg-[#3C80FF]/[.4] desktop:w-9 desktop:h-9 tablet:w-9 tablet:h-9 mobile:w-4 mobile:h-4">
          <InfoIcon className="mobile:w-[2.3px] h-auto" />
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
