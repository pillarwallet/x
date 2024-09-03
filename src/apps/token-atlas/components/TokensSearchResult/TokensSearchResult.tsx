import { useLocation, useNavigate } from 'react-router-dom';

// hooks
import { useAppDispatch, useAppSelector } from '../../hooks/useReducerHooks';

// reducer
import { 
    setIsSearchTokenModalOpen, 
    setSearchTokenResult, 
    setSelectedChain, 
    setSelectedToken 
} from '../../reducer/tokenAtlasSlice';

// types
import { Token } from '@etherspot/prime-sdk/dist/sdk/data';
import { ChainType } from '../../types/types';

// components
import TokenResultCard from '../TokenResultCard/TokenResultCard';
import Body from '../Typography/Body';

const TokensSearchResult = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const searchTokenResult = useAppSelector((state) => state.tokenAtlas.searchTokenResult as Token[]);
    const selectedChain = useAppSelector((state) => state.tokenAtlas.selectedChain as ChainType);
    const tokenListData = useAppSelector((state) => state.tokenAtlas.tokenListData as Token[]);

    // if there are no tokens being typed searched, we show the token list of tokens
    // which will filter if a chain has been chosen
    const tokenList = searchTokenResult.length
        ? searchTokenResult
        : selectedChain.chainId !== 0
        ? tokenListData.filter((token) => token.chainId === selectedChain.chainId)
        : tokenListData;

    const handleChooseToken = (token: Token) => {
        dispatch(setSelectedToken(token));
        dispatch(setIsSearchTokenModalOpen(false));
        dispatch(setSelectedChain({ chainId: 0, chainName: 'all' }));
        dispatch(setSearchTokenResult([]));
        if (location.search !== '') {
            navigate('/token-atlas');
        }
    };

    return (
        <div id='token-atlas-token-search-result' className="flex flex-col w-full">
            <Body className="text-white_light_grey mb-4">Search tokens</Body>
            <div className="flex flex-col gap-4 max-h-[250px] overflow-auto">
                {!tokenList.length && <Body className="text-base">No tokens found.</Body>}
                {tokenList.map((token, index) => (
                    <TokenResultCard
                        key={index}
                        onClick={() => handleChooseToken(token)}
                        tokenName={token.name}
                        tokenSymbol={token.symbol}
                        tokenChain={token.chainId}
                        tokenLogo={token.icon}
                    />
                ))}
            </div>
        </div>
    );
};

export default TokensSearchResult;
