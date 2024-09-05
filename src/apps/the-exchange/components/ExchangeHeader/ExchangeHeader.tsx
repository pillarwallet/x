// components
import Body from '../Typography/Body';
import BodySmall from '../Typography/BodySmall';

// images
import XLogo from '../../images/x-logo.png';

const ExchangeHeader = () => {
  return (
    <div className="flex flex-col mb-20 desktop:mb-28 ">
      <div className="flex gap-1 items-center">
        <img
          src={XLogo}
          alt="the-exchange-logo"
          className="w-[25px] h-[18.5px]"
        />
        <Body className="text-lg text-medium_grey">The Exchange</Body>
      </div>
      <BodySmall className="text-sm text-medium_grey">by PillarX</BodySmall>
    </div>
  );
};

export default ExchangeHeader;
