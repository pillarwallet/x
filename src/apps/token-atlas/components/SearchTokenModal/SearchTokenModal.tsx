// hooks
import { useAppDispatch, useAppSelector } from '../../hooks/useReducerHooks';

// reducer
import {
  setIsAllChainsVisible,
  setIsSearchTokenModalOpen,
  setIsSelectChainDropdownOpen,
  setSearchTokenResult,
  setSelectedChain,
} from '../../reducer/tokenAtlasSlice';

// utils
import { CompatibleChains } from '../../../../utils/blockchain';

// images
import CloseCircle from '../../images/close-circle.svg';

// components
import SelectChainDropdown from '../SelectChainDropdown/SelectChainDropdown';
import TokensSearchInput from '../TokensSearchInput/TokensSearchInput';
import TokensSearchResult from '../TokensSearchResult/TokensSearchResult';
import TokensSlider from '../TokensSlider/TokensSlider';

const SearchTokenModal = () => {
  const dispatch = useAppDispatch();
  const isSearchTokenModalOpen = useAppSelector(
    (state) => state.tokenAtlas.isSearchTokenModalOpen as boolean
  );
  const isSelectChainDropdownOpen = useAppSelector(
    (state) => state.tokenAtlas.isSelectChainDropdownOpen as boolean
  );

  // select all chainsId of tokens available in the list for swap token
  const uniqueChains = CompatibleChains.map((chain) => chain.chainId);

  const handleOnCloseSearchModal = () => {
    dispatch(setIsSearchTokenModalOpen(false));
    dispatch(setSelectedChain({ chainId: 0, chainName: 'all' }));
    dispatch(setSearchTokenResult(undefined));
    dispatch(setIsAllChainsVisible(false));
  };

  if (!isSearchTokenModalOpen) return null;

  return (
    <>
      <div
        id="token-atlas-search-modal"
        className="fixed inset-0 bg-[#222222]/[.4] backdrop-blur-sm z-30"
      >
        <div className="fixed inset-0 flex items-center justify-center z-40 mobile:items-start tablet:items-start mt-20">
          <div className="relative flex flex-col w-full desktop:max-w-[600px] tablet:max-w-[600px] mobile:max-w-full mobile:mx-4 bg-dark_grey border-[1px] border-medium_grey rounded-2xl overflow-y-auto max-h-[75vh] mb-20">
            <div className="flex gap-4 px-8 pt-8 pb-6 border-b-4 border-b-medium_grey">
              <TokensSearchInput
                className={`${
                  !isSelectChainDropdownOpen ? 'basis-3/5' : 'max-w-14'
                }`}
                onClick={() =>
                  isSelectChainDropdownOpen &&
                  dispatch(setIsSelectChainDropdownOpen(false))
                }
              />
              <SelectChainDropdown
                className={`${
                  !isSelectChainDropdownOpen ? 'basis-2/5' : 'w-full'
                }`}
                options={uniqueChains}
              />
            </div>
            <div className="flex px-8 py-4 border-b-[1px] border-b-medium_grey">
              <TokensSlider />
            </div>
            <div className="flex px-8 py-4">
              <TokensSearchResult />
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        id="token-atlas-close-search-modal"
        className="fixed top-0 right-0 w-[50px] h-[50px] mt-10 mr-[60px] mb-20 mobile:mt-4 mobile:mr-4 z-50"
        onClick={() => handleOnCloseSearchModal()}
      >
        <img src={CloseCircle} alt="Close" />
      </button>
    </>
  );
};

export default SearchTokenModal;
