/* eslint-disable react/no-unstable-nested-components */
// types
import {
  Copy as CopyIcon,
  CopySuccess as CopySuccessIcon,
} from 'iconsax-react';
import { useCallback, useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Points, Projection } from '../../../../types/api';

// components
import PointsFormattedTimestamp from '../PointsFormattedTimestamp/PointsFormattedTimestamp';
import PointsInfo from '../PointsInfo/PointsInfo';
import TileContainer from '../TileContainer/TileContainer';
import Body from '../Typography/Body';
import BodySmall from '../Typography/BodySmall';

// images
import PointsTileImage from '../../images/pillarX-points-tile.jpeg';
import CalendarIcon from '../../images/points-calendar.svg';
import ClockIcon from '../../images/points-clock.svg';
import CrownIcon from '../../images/points-crown.svg';
import ShareIcon from '../../images/points-export.svg';
import PxLogo from '../../images/points-px-logo.svg';
import RankingIcon from '../../images/points-ranking.svg';

type PointsTileProps = {
  data: Projection | undefined;
  isDataLoading: boolean;
};

const PointsTile = ({ data, isDataLoading }: PointsTileProps) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [tileWidth, setTileWidth] = useState<'desktop-tablet' | 'mobile'>(
    'desktop-tablet'
  );

  const pointsData = data?.data as Points;

  useEffect(() => {
    const getWindowWidth = () => {
      if (window.innerWidth <= 768) {
        setTileWidth('mobile');
      } else {
        setTileWidth('desktop-tablet');
      }
    };

    getWindowWidth();
    window.addEventListener('resize', getWindowWidth);

    return () => {
      window.removeEventListener('resize', getWindowWidth);
    };
  }, []);

  const onCopyCodeClick = useCallback(() => {
    if (copied) {
      setCopied(false);
      return;
    }

    if (!pointsData.referrals.code) {
      console.warn('No referral code to copy');
      return;
    }

    setCopied(true);
  }, [pointsData?.referrals?.code, copied]);

  useEffect(() => {
    const codeCopyActionTimeout = setTimeout(() => {
      setCopied(false);
    }, 500);

    return () => {
      clearTimeout(codeCopyActionTimeout);
    };
  }, [copied]);

  if (!data || isDataLoading) {
    return null;
  }

  return (
    <TileContainer id="points-tile">
      <div
        className="flex flex-col w-full rounded-2xl bg-no-repeat bg-center desktop:p-10 desktop:pt-[30px] tablet:p-5 mobile:p-3"
        style={{
          backgroundImage: `url(${PointsTileImage})`,
          backgroundSize: `${tileWidth === 'desktop-tablet' ? '200%' : '400%'}`,
        }}
      >
        <Body className="mb-4">{data.meta.display?.title}</Body>

        <div className="flex gap-4 desktop:flex-row tablet:flex-col mobile:flex-col">
          <div className="flex gap-4 desktop:w-[75%] tablet:w-full mobile:w-full">
            {tileWidth === 'desktop-tablet' ? (
              <>
                <div className="flex flex-col w-full h-full justify-center items-center">
                  <img
                    src={PxLogo}
                    alt="pillar-x-logo"
                    className="flex w-[52px] h-[52px] items-center justify-center p-2.5 rounded-md bg-container_grey mb-8"
                  />
                  <div className="flex items-end mb-6">
                    <p className="desktop:text-[80px] tablet:text-6xl mobile:text-6xl text-white leading-none font-light">
                      {pointsData.address.points.total || ''}
                    </p>
                    <p className="desktop:text-2xl tablet:text-lg mobile:text-lg text-purple_light leading-none desktop:mb-2.5 font-normal">
                      PX
                    </p>
                  </div>
                  <Body>My PX points</Body>
                </div>
                <div className="flex flex-col w-full h-full justify-center items-center">
                  <img
                    src={CrownIcon}
                    alt="crown-icon"
                    className="flex w-[52px] h-[52px] items-center justify-center p-3 rounded-md bg-container_grey mb-8"
                  />
                  <div className="flex items-end mb-6">
                    <p className="desktop:text-2xl tablet:text-lg mobile:text-lg text-purple_light leading-none desktop:mb-2.5 font-normal">
                      #
                    </p>
                    <p className="desktop:text-[80px] tablet:text-6xl mobile:text-6xl text-white leading-none font-light">
                      {pointsData.address.ranking.global || ''}
                    </p>
                  </div>
                  <Body>Current ranking</Body>
                </div>
              </>
            ) : null}

            <div className="flex desktop:flex-col tablet:flex-col mobile:flex-row mobile:flex-wrap desktop:justify-center w-full h-full">
              {tileWidth === 'mobile' ? (
                <>
                  <PointsInfo
                    icon={PxLogo}
                    value={pointsData.address.points.total || ''}
                    afterValue="PX"
                    label="My PX points"
                  />
                  <PointsInfo
                    icon={CrownIcon}
                    value={pointsData.address.ranking.global || ''}
                    beforeValue="#"
                    label="Current ranking"
                  />
                </>
              ) : null}
              <PointsInfo
                icon={CalendarIcon}
                value={pointsData.address.points.lastWeek || ''}
                afterValue="PX"
                label="Earned last week"
              />
              <PointsInfo
                icon={RankingIcon}
                value={pointsData.address.ranking.leaderboardPosition || ''}
                beforeValue="#"
                label="Weekly ranking"
              />
              <PointsInfo
                icon={ClockIcon}
                value={
                  <PointsFormattedTimestamp
                    timestamp={pointsData.drops.upcoming.timestamp || 0}
                  />
                }
                label="Next drop"
                isWhite
              />
            </div>
          </div>

          {pointsData.referrals.code && pointsData.referrals.href && (
            <div
              data-testid="points-tile-referrals-section"
              className="flex desktop:flex-col tablet:flex-row mobile:flex-row desktop:w-[25%] tablet:w-full mobile:w-full h-full bg-container_grey/[.9] rounded-[10px] p-4 pt-8 justify-between gap-4"
            >
              <div className="flex flex-col w-full desktop:gap-6 tablet:gap-4 mobile:gap-4">
                <Body className="desktop:text-base tablet:text-sm mobile:text-sm">
                  Share with friends
                </Body>
                <p className="desktop:text-[15px] tablet:text-[13px] mobile:text-[13px] text-purple_light desktop:leading-[30px] tablet:leading-6 mobile:leading-6">
                  Earn points when your referrals do stuff on PillarX. Plus earn
                  10% of the points your referrals earn.
                </p>
              </div>
              <div className="flex flex-col gap-4 w-full">
                <div className="flex justify-between items-center bg-container_grey rounded-md px-3.5 py-3">
                  <Body>{pointsData.referrals.code || ''}</Body>
                  <div className="flex gap-2 items-center">
                    <BodySmall className="text-purple_light">Copy</BodySmall>
                    <CopyToClipboard
                      text={pointsData.referrals.code || ''}
                      onCopy={onCopyCodeClick}
                    >
                      {copied ? (
                        <CopySuccessIcon
                          size={16}
                          color="#E2DDFF"
                          data-testid="copy-success-icon"
                        />
                      ) : (
                        <CopyIcon
                          size={15}
                          color="#E2DDFF"
                          data-testid="copy-icon"
                        />
                      )}
                    </CopyToClipboard>
                  </div>
                </div>
                <button
                  className="flex w-full bg-purple_medium justify-center items-center gap-2 rounded-md p-3"
                  type="button"
                >
                  <img
                    src={ShareIcon}
                    alt="share-code-icon"
                    className="flex w-[20px] h-[20px]"
                  />
                  Share link
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </TileContainer>
  );
};

export default PointsTile;
