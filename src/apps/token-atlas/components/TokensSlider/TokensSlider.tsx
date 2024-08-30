import { useLocation, useNavigate } from 'react-router-dom';

// api
import { useGetTrendingTokensQuery } from '../../api/token';

// hooks
import { useAppDispatch, useAppSelector } from '../../hooks/useReducerHooks';

// reducer
import { setIsSearchTokenModalOpen, setSelectedChain, setSelectedToken } from '../../reducer/tokenAtlasSlice';

// types
import { BlockchainData, TokenData } from '../../../../types/api';
import { SelectedTokenType } from '../../types/types';

// components
import SkeletonLoader from '../../../../components/SkeletonLoader';
import TokenCard from '../TokenCard/TokenCard';
import Body from '../Typography/Body';

const TokensSlider = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { data: trendingTokensData, isLoading, isFetching } = useGetTrendingTokensQuery();
    const blockchainList = useAppSelector((state) => state.tokenAtlas.blockchainList as BlockchainData[]);

    // reduce the list the 20 first trending tokens
    const trendingTokens = trendingTokensData?.data.slice(0, 20) || [];

    const handleChooseToken = (token: TokenData) => {
        const tokenData: SelectedTokenType = {
            symbol: token.symbol || '',
            address: '',
            decimals: undefined,
            chainId: undefined,
            name: token.name || '',
            icon: token.logo
        }
        dispatch(setSelectedToken(tokenData));
        dispatch(setIsSearchTokenModalOpen(false));
        dispatch(setSelectedChain({ chainId: 0, chainName: 'all' }));
        if (location.search !== '') {
            navigate('/token-atlas');
        }
    };


    if (isLoading || isFetching) {
        return (
            <div className="flex flex-col overflow-x-scroll">
            <Body className="text-white_light_grey mb-4">Trending tokens</Body>
            <div className="flex">
                <div className="flex gap-4 mb-4">  
                    <SkeletonLoader $height="125px" $width="108px" $radius="9px" />
                    <SkeletonLoader $height="125px" $width="108px" $radius="9px" />
                    <SkeletonLoader $height="125px" $width="108px" $radius="9px" />
                    <SkeletonLoader $height="125px" $width="108px" $radius="9px" />
                    <SkeletonLoader $height="125px" $width="108px" $radius="9px" />
                </div>
            </div>
        </div>
        )   
    } 

    return (
        <div className="flex flex-col overflow-x-scroll">
            <Body className="text-white_light_grey mb-4">Trending tokens</Body>
            <div className="flex">
                <div className="flex gap-4 mb-4">
                    {trendingTokens && trendingTokens.map((token, index) => {   
                        const blockchain = blockchainList.find(
                            (blockchain) =>
                                blockchain.name.toLowerCase() === token.contracts?.[0].blockchain.toLowerCase()
                        );
                        const blockchainLogo = blockchain ? blockchain.logo : undefined;
                        return (
                        <TokenCard key={index} onClick={() => handleChooseToken(token)} tokenLogo={token.logo} tokenName={token.name} tokenSymbol={token.symbol} blockchainLogo={blockchainLogo} />
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default TokensSlider;
