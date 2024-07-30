import { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

// images
import { MdCheck } from 'react-icons/md';

// components
import ProfileIcon from '../../images/profile-icon.svg';
import CopyIcon from '../../images/copy-icon.svg';
import Body from '../Typography/Body';

type WalletAddressOverviewProps = {
    address: string;
}

const WalletAddressOverview = ({ address }: WalletAddressOverviewProps) => {
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        if (isCopied) {
          const timer = setTimeout(() => {
            setIsCopied(false);
          }, 3000);
    
          return () => clearTimeout(timer);
        }
      }, [isCopied]);


    return (
        <div className='desktop:flex tablet:flex mobile:hidden mb-[54px] gap-2.5 items-center'>
            <div className='bg-[#312F3A] p-2.5 rounded-full w-10 h-10'>
                <img src={ProfileIcon} className='w-full h-full' />
            </div>
            <Body>{address.substring(0, 6)}...{address.substring(address.length - 5)}</Body>
            <CopyToClipboard text={address} onCopy={() => setIsCopied(true)}>
                <div className='w-4 h-4'>
                {isCopied ? <MdCheck style={{ width: 'full', height: 'full' }} /> : <img src={CopyIcon} className='cursor-pointer' style={{ width: 'full', height: 'full' }}/>}
                </div>
            </CopyToClipboard>
        </div>
    )
}

export default WalletAddressOverview;
