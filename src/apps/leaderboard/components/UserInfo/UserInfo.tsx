import { useCallback, useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { MdCheck } from 'react-icons/md';
import { TbTriangleFilled, TbTriangleInvertedFilled } from 'react-icons/tb';

// images
import CopyIcon from '../../../pillarx-app/images/token-market-data-copy.png';

// types
import { LeaderboardRankChange } from '../../../../types/api';

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
  const [displayedWalletAddress, setDisplayWalletAddress] =
    useState<string>('');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 769) {
        setDisplayWalletAddress(
          `${walletAddress.slice(0, 10)}...${walletAddress.slice(-8)}`
        );
      } else if (window.innerWidth < 769 && window.innerWidth >= 369) {
        setDisplayWalletAddress(
          `${walletAddress.slice(0, 5)}...${walletAddress.slice(-4)}`
        );
      } else if (window.innerWidth <= 368) {
        setDisplayWalletAddress(`${walletAddress.slice(0, 7)}...`);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [walletAddress]);

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
        color="#05FFDD"
        size={9}
      />
    ) : (
      <TbTriangleInvertedFilled
        data-testid="leaderboard-rank-down"
        color="#FF366C"
        size={9}
      />
    );

  return (
    <div
      id="leaderboard-user-data"
      data-testid="leaderboard-user-data"
      className="flex desktop:gap-3.5 tablet:gap-3.5 mobile:gap-1.5 items-center"
    >
      <div className="flex items-center desktop:gap-2.5 tablet:gap-2.5 mobile:gap-1.5">
        <div
          className={`relative group desktop:w-[45px] tablet:w-[45px] mobile:w-[35px] flex-shrink-0 ${
            rankChange === LeaderboardRankChange.NO_CHANGE &&
            'desktop:mr-[19px] tablet:mr-[19px] mobile:mr-0'
          }`}
        >
          <Body className="truncate text-white overflow-hidden mobile:text-sm w-full">
            #{rank}
          </Body>
          <span className="absolute left-1/2 top-full mt-1 w-max max-w-xs -translate-x-1/2 scale-0 group-hover:scale-100 transition text-white text-xs z-10">
            #{rank}
          </span>
        </div>

        <div className="desktop:flex tablet:flex mobile:hidden">
          {rankChange !== LeaderboardRankChange.NO_CHANGE && rankChangeTriangle}
        </div>

        <div className="flex-shrink-0 desktop:w-[50px] desktop:h-[50px] tablet:w-[50px] tablet:h-[50px] mobile:w-[40px] mobile:h-[40px] object-fill rounded overflow-hidden">
          <RandomAvatar name={walletAddress} variant="beam" />
        </div>
      </div>
      <div className="flex flex-col w-[60%]">
        {username ?? <Body className="text-white">{username}</Body>}
        <div className="flex items-center desktop:w-[200px] tablet:w-[200px] mobile:w-[120px] xxs:w-[100px] justify-between gap-2">
          <BodySmall className="font-normal text-white">
            {displayedWalletAddress}
          </BodySmall>
          <div className="flex-shrink-0 w-[16px] h-[16px] flex items-center justify-center">
            <CopyToClipboard
              text={walletAddress || ''}
              onCopy={onCopyCodeClick}
            >
              <div className="cursor-pointer">
                {copied ? (
                  <MdCheck className="w-[13px] h-[13px] text-white opacity-50" />
                ) : (
                  <img
                    src={CopyIcon}
                    alt="copy-address"
                    className="w-[13px] h-[15px]"
                  />
                )}
              </div>
            </CopyToClipboard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
