import {
  Copy as CopyIcon,
  CopySuccess as CopySuccessIcon,
} from 'iconsax-react';
import { useCallback, useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

// utils

// components
import RandomAvatar from '../RandomAvatar/RandomAvatar';
import Body from '../Typography/Body';

const UserInfo = () => {
  const DUMMY_WALLET_ADDRESS = '0x4a5e60B1F60E1A23B45C67D89E0F123456789ABCD';
  const DUMMY_USERNAME = 'Tester124';

  const [copied, setCopied] = useState<boolean>(false);

  const onCopyCodeClick = useCallback(() => {
    if (copied) {
      setCopied(false);
      return;
    }

    setCopied(true);
  }, [copied]);

  useEffect(() => {
    const codeCopyActionTimeout = setTimeout(() => {
      setCopied(false);
    }, 500);

    return () => {
      clearTimeout(codeCopyActionTimeout);
    };
  }, [copied]);

  return (
    <div className="flex w-full gap-2.5 items-center mb-3">
      <div className="w-[50px] h-[50px] object-fill rounded overflow-hidden">
        <RandomAvatar name={DUMMY_WALLET_ADDRESS} variant="beam" />
      </div>
      <div className="flex flex-col w-full">
        {DUMMY_USERNAME ?? <Body className="text-white">{DUMMY_USERNAME}</Body>}
        <div className="flex gap-1.5 items-center w-full overflow-hidden">
          <p className="text-sm text-white font-light truncate">
            {DUMMY_WALLET_ADDRESS}
          </p>
          <CopyToClipboard text={DUMMY_WALLET_ADDRESS} onCopy={onCopyCodeClick}>
            <div className="cursor-pointer">
              {copied ? (
                <CopySuccessIcon size={14} color="white" />
              ) : (
                <CopyIcon size={14} color="white" />
              )}
            </div>
          </CopyToClipboard>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
