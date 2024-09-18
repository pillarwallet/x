import { useTranslation } from 'react-i18next';

// utils
import { getAllUniqueBlockchains } from '../../utils/blockchain';

// types
import { WalletData, WalletPortfolioData } from '../../../../types/api';

// images
import BlendIcon from '../../images/blend-icon.svg';
import RoutingIcon from '../../images/routing-icon.svg';

// components
import SkeletonLoader from '../../../../components/SkeletonLoader';
import Tags from '../Tags/Tags';
import TileContainer from '../TileContainer/TileContainer';
import TokensHorizontalList from '../TokensHorizontalList/TokensHorizontalList';
import TokensPercentage from '../TokensPercentage/TokensPercentage';
import Body from '../Typography/Body';
import H1 from '../Typography/H1';
import WalletAddressOverview from '../WalletAdddressOverview/WalletAddressOverview';

type PortfolioOverviewProps = {
  data: WalletData | undefined;
  isDataLoading: boolean;
};

const PortfolioOverview = ({ data, isDataLoading }: PortfolioOverviewProps) => {
  const [t] = useTranslation();
  const { data: dataPortlioOverview } = data || {};
  const dataWallet = dataPortlioOverview as WalletPortfolioData | undefined;
  const { realized: pnl24hRealized = 0, unrealized: pnl24hUnrealized = 0 } =
    dataWallet?.total_pnl_history?.['24h'] || {};

  const numberOfTokens = dataWallet?.assets?.length || 0;

  const allBlockchains =
    dataWallet?.assets?.map((asset) => asset.asset.blockchains).flat() || [];

  const allBlockchainsLogos =
    dataWallet?.assets
      ?.map((asset) => (asset.asset.logo ? asset.asset.logo : 'random-avatar'))
      .flat() || [];

  const numberOfBlockchains =
    getAllUniqueBlockchains(allBlockchains).length ?? 0;

  const totalPnl24h = pnl24hRealized + pnl24hUnrealized;

  const percentageChange =
    (totalPnl24h / (dataWallet?.total_wallet_balance ?? 0)) * 100;

  if (!data || isDataLoading) {
    return (
      <TileContainer
        id="wallet-portfolio-tile-loader"
        className="p-10 gap-20 tablet:p-5 mobile:p-0 mobile:bg-[#1F1D23] mobile:flex-col mobile:gap-4"
      >
        <div className="flex flex-col justify-between">
          <Body className="animate-pulse mobile:my-4">
            Wallet portfolio data loading...
          </Body>
          <div className="mobile:border mobile:border-medium_grey mobile:rounded-[10px] mobile:p-4 mobile:w-full">
            <SkeletonLoader $height="77px" $width="180px" $radius="10px" />
          </div>
        </div>
        <div className="flex w-full flex-col items-end justify-end mobile:justify-normal gap-5">
          <div className="flex w-full gap-4 justify-end mobile:flex-row tablet:flex-col tablet:items-end mobile:flex-row mobile:justify-between mobile:items-start">
            <SkeletonLoader $height="36px" $width="150px" $radius="10px" />
            <SkeletonLoader $height="36px" $width="190px" $radius="10px" />
          </div>
          <SkeletonLoader $height="36px" $width="80px" $radius="10px" />
        </div>
      </TileContainer>
    );
  }

  return (
    <TileContainer
      id="wallet-portfolio-tile"
      className="p-10 gap-20 tablet:p-5 mobile:p-0 mobile:bg-[#1F1D23] mobile:flex-col mobile:gap-4"
    >
      <div className="flex flex-col justify-between">
        <WalletAddressOverview address={dataWallet?.wallet ?? ''} />
        <div className="mobile:border mobile:border-medium_grey mobile:rounded-[10px] mobile:p-4 mobile:w-full">
          <Body className="text-purple_light mb-2">{t`title.totalBalance`}</Body>
          <div className="flex gap-4 items-end">
            <H1 className="text-[50px]">
              ${dataWallet?.total_wallet_balance?.toFixed(2) || 0}
            </H1>
            <TokensPercentage percentage={percentageChange} />
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-end justify-end mobile:justify-normal gap-5">
        <div className="flex w-full gap-4 justify-end mobile:flex-row tablet:flex-col tablet:items-end mobile:flex-row mobile:justify-between">
          {numberOfTokens > 0 && (
            <Tags
              icon={BlendIcon}
              tagText={`${numberOfTokens} ${t`label.tokens`}`}
            />
          )}
          {numberOfBlockchains > 0 && (
            <Tags
              icon={RoutingIcon}
              tagText={`${t`helper.across`} ${numberOfBlockchains} ${numberOfBlockchains > 1 ? t`helper.chainSeveral` : t`helper.chainOne`}`}
            />
          )}
        </div>
        {allBlockchainsLogos.length > 0 && (
          <TokensHorizontalList logos={allBlockchainsLogos} />
        )}
      </div>
    </TileContainer>
  );
};

export default PortfolioOverview;
