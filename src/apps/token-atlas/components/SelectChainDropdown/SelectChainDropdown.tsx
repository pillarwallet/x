// api
import { useRecordPresenceMutation } from '../../../../services/pillarXApiPresence';

// hooks
import useTransactionKit from '../../../../hooks/useTransactionKit';
import { useAppDispatch, useAppSelector } from '../../hooks/useReducerHooks';

// reducer
import {
  setIsAllChainsVisible,
  setIsSelectChainDropdownOpen,
  setSelectedChain,
} from '../../reducer/tokenAtlasSlice';

// types
import { ChainType } from '../../types/types';

// utils
import { getChainName } from '../../../../utils/blockchain';

// components
import Body from '../Typography/Body';

// images
import ArrowDown from '../../images/arrow-down.svg';

type SelectChainDropdownProps = {
  options: number[];
  className?: string;
};

const SelectChainDropdown = ({
  className,
  options,
}: SelectChainDropdownProps) => {
  /**
   * Import the recordPresence mutation from the
   * pillarXApiPresence service. We use this to
   * collect data on what asset's chain is being selected
   */
  const [recordPresence] = useRecordPresenceMutation();

  const { walletAddress: accountAddress } = useTransactionKit();

  const dispatch = useAppDispatch();
  const isSelectChainDropdownOpen = useAppSelector(
    (state) => state.tokenAtlas.isSelectChainDropdownOpen as boolean
  );
  const selectedChain = useAppSelector(
    (state) => state.tokenAtlas.selectedChain as ChainType
  );

  const allChainsOption: ChainType = {
    chainId: 0,
    chainName: 'all',
  };

  const allOptions = [allChainsOption.chainId, ...options];

  const handleDropdownToggle = () => {
    dispatch(setIsSelectChainDropdownOpen(!isSelectChainDropdownOpen));
  };

  // this will filter the tokens by chain id
  const handleSelectChainId = (option: number) => {
    dispatch(
      setSelectedChain({
        chainId: Number(option),
        chainName: option === 0 ? 'all' : getChainName(option),
      })
    );
    if (accountAddress) {
      recordPresence({
        address: accountAddress,
        action: 'app:tokenAtlas:chainSelect',
        value: { chainId: option },
      });
    }
    dispatch(setIsSelectChainDropdownOpen(false));
    dispatch(setIsAllChainsVisible(false));
  };

  return (
    <div
      id="token-atlas-select-chain-dropdown"
      className={`relative ${className}`}
      data-testid="select-chain-dropdown"
    >
      <button
        type="button"
        className={`flex justify-between items-center w-full h-full p-4 bg-medium_grey rounded focus:outline-none ${
          isSelectChainDropdownOpen && 'border-b border-dark_grey'
        }`}
        onClick={handleDropdownToggle}
      >
        <Body className="text-[17px] mobile:text-[15px] font-medium leading-5 line-clamp-1 capitalize">
          {selectedChain.chainId !== 0
            ? selectedChain.chainName
            : 'Select chain'}
        </Body>
        <img
          src={ArrowDown}
          alt="arrow-down"
          className={`transform ${
            isSelectChainDropdownOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isSelectChainDropdownOpen && (
        <div
          id="token-atlas-select-chain-list"
          className="absolute top-full left-0 bg-medium_grey rounded-b w-full max-h-[400px] border-[1px] border-dark_grey overflow-y-auto capitalize z-50"
        >
          <ul>
            {allOptions.map((option) => (
              // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
              <li
                key={option}
                id={`token-atlas-select-chain-dropdown-${option}`}
                className="px-4 py-2 cursor-pointer hover:bg-light_grey hover:text-dark_grey border-b border-dark_grey last:border-none"
                onClick={() => handleSelectChainId(option)}
              >
                <Body className="text-base mobile:text-sm font-medium">
                  {option === 0 ? 'all' : getChainName(option)}
                </Body>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SelectChainDropdown;
