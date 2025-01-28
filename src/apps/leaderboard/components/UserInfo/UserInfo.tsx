import {
  Copy as CopyIcon,
  CopySuccess as CopySuccessIcon,
} from 'iconsax-react';
import { useCallback, useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { TbTriangleFilled, TbTriangleInvertedFilled } from 'react-icons/tb';

// types
import { LeaderboardRankChange } from '../../../../types/api';

// utils
import { truncateAddress } from '../../../../utils/blockchain';

// components
import RandomAvatar from '../RandomAvatar/RandomAvatar';
import Body from '../Typography/Body';
import BodySmall from '../Typography/BodySmall';

type UserInfoProps = {
  rank: number;
  walletAddress: string;
  rankChange?: LeaderboardRankChange;
  username?: string;
};

const UserInfo = ({
  rank,
  username,
  walletAddress,
  rankChange,
}: UserInfoProps) => {
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

  const rankChangeTriangle =
    rankChange === LeaderboardRankChange.DECREASED ? (
      <TbTriangleFilled color="#FF366C" size={9} />
    ) : (
      <TbTriangleInvertedFilled color="#05FFDD" size={9} />
    );

  return (
    <div className="flex gap-3.5 items-center">
      <Body
        className={`text-purple_light ${rankChange === LeaderboardRankChange.NO_CHANGE && 'mr-[23px]'}`}
      >
        #{rank}
      </Body>
      {rankChange !== LeaderboardRankChange.NO_CHANGE && rankChangeTriangle}
      <div className="w-[50px] h-[50px] object-fill rounded mr-3.5 overflow-hidden">
        <RandomAvatar name={walletAddress} />
      </div>
      <div className="flex flex-col">
        {username ?? <Body className="text-white">{username}</Body>}
        <div className="flex gap-3.5 items-end">
          <BodySmall className="text-purple_light">
            {truncateAddress(walletAddress, 18)}
          </BodySmall>
          <CopyToClipboard text={walletAddress} onCopy={onCopyCodeClick}>
            <div className="flex gap-2 items-center cursor-pointer self-end">
              {copied ? (
                <CopySuccessIcon
                  size={16}
                  color="#E2DDFF"
                  data-testid="copy-success-icon"
                />
              ) : (
                <CopyIcon size={15} color="#E2DDFF" data-testid="copy-icon" />
              )}
            </div>
          </CopyToClipboard>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
