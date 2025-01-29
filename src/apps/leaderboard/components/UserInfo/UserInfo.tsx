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
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 769);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      <TbTriangleFilled
        data-testid="leaderboard-rank-up"
        color="#FF366C"
        size={9}
      />
    ) : (
      <TbTriangleInvertedFilled
        data-testid="leaderboard-rank-down"
        color="#05FFDD"
        size={9}
      />
    );

  return (
    <div
      id="leaderboard-user-data"
      data-testid="leaderboard-user-data"
      className="flex desktop:gap-3.5 tablet:gap-3.5 mobile:gap-1.5 items-center"
    >
      <div className="flex items-center desktop:gap-3.5 tablet:gap-3.5 mobile:gap-1.5">
        <div
          className={`relative group desktop:w-[35px] tablet:w-[35px] mobile:w-[30px] ${
            rankChange === LeaderboardRankChange.NO_CHANGE &&
            'desktop:mr-[23px] tablet:mr-[23px] mobile:mr-[15px]'
          }`}
        >
          <Body className="text-purple_light truncate overflow-hidden w-full mobile:text-sm">
            #{rank}
          </Body>
          <span className="absolute left-1/2 top-full mt-1 w-max max-w-xs -translate-x-1/2 scale-0 text-white text-xs group-hover:scale-100 transition">
            #{rank}
          </span>
        </div>
        {rankChange !== LeaderboardRankChange.NO_CHANGE && rankChangeTriangle}
        <div className="desktop:w-[50px] desktop:h-[50px] tablet:w-[50px] tablet:h-[50px] mobile:w-[40px] mobile:h-[40px] object-fill rounded mr-3.5 overflow-hidden">
          <RandomAvatar name={walletAddress} variant="beam" />
        </div>
      </div>
      <div className="flex flex-col w-[60%]">
        {username ?? <Body className="text-white">{username}</Body>}
        <div className="flex desktop:gap-3.5 tablet:gap-3.5 mobile:gap-1.5 items-end">
          <BodySmall className="text-purple_light">
            {isMobile
              ? `${walletAddress.slice(0, 6)}...`
              : truncateAddress(walletAddress, 18)}
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
