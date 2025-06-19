import { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

// images
import { MdCheck } from 'react-icons/md';

// components
import CopyIcon from '../../images/token-market-data-copy.png';
import RandomAvatar from '../RandomAvatar/RandomAvatar';
import Body from '../Typography/Body';

type WalletAddressOverviewProps = {
  address: string;
};

const WalletAddressOverview = ({ address }: WalletAddressOverviewProps) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [isCopied]);

  return (
    <div className="desktop:flex tablet:flex mobile:hidden mb-[54px] gap-2.5 items-center">
      <div className="bg-medium_grey rounded-full w-10 h-10 overflow-hidden">
        <RandomAvatar name={address} />
      </div>
      <Body>
        {address.substring(0, 6)}...{address.substring(address.length - 5)}
      </Body>
      <CopyToClipboard text={address} onCopy={() => setIsCopied(true)}>
        <div className="w-4 h-4">
          {isCopied ? (
            <MdCheck style={{ width: 'full', height: 'full' }} />
          ) : (
            <img
              src={CopyIcon}
              alt="copy-adress-icon"
              className="cursor-pointer"
              style={{ width: 'full', height: 'full' }}
            />
          )}
        </div>
      </CopyToClipboard>
    </div>
  );
};

export default WalletAddressOverview;
