// hooks
import { useAppDispatch } from '../../hooks/useReducerHooks';
import usePillarSwapAssets from '../../../the-exchange/hooks/usePillarSwapAssets';

// reducer
import { setIsSearchTokenModalOpen, setTokenListData } from '../../reducer/tokenAtlasSlice';

// images
import TokenAtlasLogo from '../../images/token-atlas-logo.svg';

// components
import Body from '../../components/Typography/Body';
import SearchLogo from '../../images/circle-search.svg';

const HeaderSearch = () => {
    const dispatch = useAppDispatch();
    const { getPillarSwapAssets } = usePillarSwapAssets();

    const handleSearchOpen = async () => {
        dispatch(setIsSearchTokenModalOpen(true));

        const assets = await getPillarSwapAssets();
        dispatch(setTokenListData(assets));
    };

    return (
        <div className="flex justify-between mb-10">
            <div className="flex items-center">
                <img src={TokenAtlasLogo} className="w-5 mobile:w-4 mr-2" />
                <Body className="text-lg text-light_grey mobile:text-base">
                    token atlas
                </Body>
            </div>
            <div
                className="flex items-center cursor-pointer"
                onClick={() => handleSearchOpen()}
            >
                <Body className="text-base text-light_grey mobile:text-[13px]">
                    Search
                </Body>
                <img src={SearchLogo} className="w-4 mobile:w-3.5 ml-1.5" />
            </div>
        </div>
    );
};

export default HeaderSearch;
