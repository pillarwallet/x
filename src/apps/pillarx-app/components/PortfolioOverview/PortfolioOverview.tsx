import { useTranslation } from 'react-i18next'

// types
import { WalletPortfolioData } from '../../../../types/api'

// images
import DefaultLogo from '../../images/logo-unknown.png'
import BlendIcon from '../../images/blend-icon.svg'
import RoutingIcon from '../../images/routing-icon.svg'

// components
import Tags from '../Tags/Tags'
import TileContainer from '../TileContainer/TileContainer'
import Body from '../Typography/Body'
import H1 from '../Typography/H1'
import WalletAddressOverview from '../WalletAdddressOverview/WalletAddressOverview'
import TokensList from '../TokensList/TokensList'
import TokensPercentage from '../TokensPercentage/TokensPercentage'
import SkeletonLoader from '../../../../components/SkeletonLoader'
import { getAllUniqueBlockchains } from '../../utils/blockchain'


type PortfolioOverviewProps = {
    data: WalletPortfolioData | undefined;
    isDataLoading: boolean;
}

const PortfolioOverview = ({ data, isDataLoading }: PortfolioOverviewProps) => {
    const [t] = useTranslation();
    const { assets = [], total_pnl_history = {}, total_wallet_balance = 0 } = data || {};
    const { realized: pnl24hRealized = 0, unrealized: pnl24hUnrealized = 0 } = total_pnl_history['24h'] || {};

    const numberOfTokens = assets.length;
    
    const allBlockchains = assets.map((asset) => asset.asset.blockchains).flat();

    const allBlockchainsLogos = assets.map((asset) => asset.asset.logo ? asset.asset.logo : DefaultLogo).flat();

    const numberOfBlockchains = getAllUniqueBlockchains(allBlockchains).length;

    const totalPnl24h = pnl24hRealized + pnl24hUnrealized;
    
    const percentageChange = (totalPnl24h / (total_wallet_balance)) * 100;

if (!data || isDataLoading) {
    return (
    <TileContainer className='p-10 gap-20 tablet:p-5 mobile:p-0 mobile:bg-[#1F1D23] mobile:flex-col mobile:gap-4'>
        <div className='flex flex-col justify-between'>
            <SkeletonLoader $height='40px' $width='200px' $marginBottom='54px' $radius='10px' className='mobile:hidden' />
        <div className='mobile:border mobile:border-[#312F3A] mobile:rounded-[10px] mobile:p-4 mobile:w-full'>
            <SkeletonLoader $height='77px' $width='180px' $radius='10px' />
        </div>
        </div>
            <div className='flex w-full flex-col items-end justify-end mobile:justify-normal gap-5'>
                <div className='flex w-full gap-4 justify-end mobile:flex-row tablet:flex-col tablet:items-end mobile:flex-row mobile:justify-between mobile:items-start'>
                <SkeletonLoader $height='36px' $width='150px' $radius='10px' />
                <SkeletonLoader $height='36px' $width='190px' $radius='10px' />
                </div>
                <SkeletonLoader $height='36px' $width='80px' $radius='10px' />
            </div>
    </TileContainer>)
}

    return (
        <TileContainer className='p-10 gap-20 tablet:p-5 mobile:p-0 mobile:bg-[#1F1D23] mobile:flex-col mobile:gap-4'>
            <div className='flex flex-col justify-between'>
                <WalletAddressOverview address={data?.wallet || ''} className='mobile:hidden mb-[54px]' />
                <div className='mobile:border mobile:border-[#312F3A] mobile:rounded-[10px] mobile:p-4 mobile:w-full'>
                    <Body className='text-purple_light mb-2'>{t`Total balance`}</Body>
                    <div className='flex gap-4 items-end'>
                        <H1 className='text-[50px]'>${data?.total_wallet_balance.toFixed(2)}</H1>
                        <TokensPercentage percentage={percentageChange} />
                    </div>

                </div>
            </div>
            <div className='flex w-full flex-col items-end justify-end mobile:justify-normal gap-5'>
                <div className='flex w-full gap-4 justify-end mobile:flex-row tablet:flex-col tablet:items-end mobile:flex-row mobile:justify-between'>
                    <Tags icon={BlendIcon} tagText={`${numberOfTokens} ${t`Tokens`}`} />
                    <Tags icon={RoutingIcon} tagText={`${t`across`} ${numberOfBlockchains} ${numberOfBlockchains > 1 ? t`chains` : t`chain`}`} />
                </div>
                {allBlockchainsLogos.length ? <TokensList logos={allBlockchainsLogos || []} /> : null}
            </div>
        </TileContainer>
    )
}

export default PortfolioOverview;
