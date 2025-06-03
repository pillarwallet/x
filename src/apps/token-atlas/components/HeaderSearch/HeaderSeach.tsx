import { useWalletAddress } from '@etherspot/transaction-kit';

// api
import { useRecordPresenceMutation } from '../../../../services/pillarXApiPresence';

// hooks
import { useAppDispatch } from '../../hooks/useReducerHooks';

// reducer
import { setIsSearchTokenModalOpen } from '../../reducer/tokenAtlasSlice';

// images
import SearchLogo from '../../images/circle-search.svg';
import TokenAtlasLogo from '../../images/token-atlas-logo.svg';

// components
import Body from '../Typography/Body';

const HeaderSearch = () => {
  /**
   * Import the recordPresence mutation from the
   * pillarXApiPresence service. We use this to
   * collect data on when the Search Modal gets opened
   */
  const [recordPresence] = useRecordPresenceMutation();

  const accountAddress = useWalletAddress();

  const dispatch = useAppDispatch();

  const handleSearchOpen = async () => {
    dispatch(setIsSearchTokenModalOpen(true));
    recordPresence({
      address: accountAddress,
      action: 'app:tokenAtlas:searchOpen',
      value: 'SEARCH_OPEN',
    });
  };

  return (
    <div id="token-atlas-header-search" className="flex justify-between mb-10">
      <div className="flex items-center">
        <img
          src={TokenAtlasLogo}
          alt="token-atlas-logo"
          className="w-5 mobile:w-4 mr-2"
        />
        <Body className="text-lg text-light_grey mobile:text-base">
          token atlas
        </Body>
      </div>
      <div
        className="flex items-center cursor-pointer"
        onClick={() => handleSearchOpen()}
        id="token-atlas-search-button"
      >
        <Body className="text-base text-light_grey mobile:text-[13px]">
          Search
        </Body>
        <img
          src={SearchLogo}
          alt="search-logo"
          className="w-4 mobile:w-3.5 ml-1.5"
        />
      </div>
    </div>
  );
};

export default HeaderSearch;
