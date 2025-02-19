import { useWalletAddress } from '@etherspot/transaction-kit';

// api
import { useRecordPresenceMutation } from '../../../../services/pillarXApiPresence';

// reducer
import { setReceiveChain, setSwapChain } from '../../reducer/theExchangeSlice';

// hooks
import { useAppDispatch, useAppSelector } from '../../hooks/useReducerHooks';

// utils
import { convertChainIdtoName } from '../../../../utils/blockchain';

// components
import Body from '../Typography/Body';

// images
import ArrowDown from '../../images/arrow-down.png';
import { ChainType } from '../../utils/types';

type SelectDropdownProps = {
  options: number[];
  onClick: () => void;
  onSelect: () => void;
  isOpen: boolean;
  className?: string;
};

const SelectDropdown = ({
  options,
  onClick,
  onSelect,
  isOpen,
  className,
}: SelectDropdownProps) => {
  /**
   * Import the recordPresence mutation from the
   * pillarXApiPresence service. We use this to
   * collect data on what asset's chain is being selected
   */
  const [recordPresence] = useRecordPresenceMutation();

  const accountAddress = useWalletAddress();

  const dispatch = useAppDispatch();
  const swapChain = useAppSelector(
    (state) => state.swap.swapChain as ChainType
  );
  const receiveChain = useAppSelector(
    (state) => state.swap.receiveChain as ChainType
  );
  const isSwapOpen = useAppSelector(
    (state) => state.swap.isSwapOpen as boolean
  );
  const isReceiveOpen = useAppSelector(
    (state) => state.swap.isReceiveOpen as boolean
  );

  const allChainsOption: ChainType = {
    chainId: 0,
    chainName: 'all',
  };

  const allOptions = [allChainsOption.chainId, ...options];

  // this will filter the tokens by chain id
  const handleSelectChainId = (option: number) => {
    if (isSwapOpen) {
      dispatch(
        setSwapChain({
          chainId: Number(option),
          chainName: option === 0 ? 'all' : convertChainIdtoName(option),
        })
      );
      recordPresence({
        address: accountAddress,
        action: 'app:theExchange:sourceChainSelect',
        value: { chainId: option },
      });
    }
    if (isReceiveOpen) {
      dispatch(
        setReceiveChain({
          chainId: Number(option),
          chainName: option === 0 ? 'all' : convertChainIdtoName(option),
        })
      );
      recordPresence({
        address: accountAddress,
        action: 'app:theExchange:destinationChainSelect',
        value: { chainId: option },
      });
    }
    onSelect();
  };

  return (
    <div
      id="select-chain-dropdown-list-exchange"
      className={`${className} h-[34px] z-20`}
    >
      <button
        type="button"
        className="flex justify-between w-full h-full p-2 bg-white rounded-[3px] focus:outline-none"
        onClick={onClick}
      >
        {isOpen && <Body className="text-[#717171]">Select a chain</Body>}
        <Body className="text-black capitalize">
          {isSwapOpen ? swapChain?.chainName : receiveChain?.chainName}
        </Body>
        <img src={ArrowDown} alt="arrow-down" />
      </button>
      {isOpen && (
        <div className="relative bg-white border border-t-black rounded-[3px] w-full max-h-[344px] overflow-y-auto capitalize">
          <ul>
            {allOptions.map((option) => (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => handleSelectChainId(option)}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-blue-600 border-b last:border-none"
                >
                  <Body className="border-b-[#8C8C8C]/[.1] capitalize">
                    {option === 0 ? 'all' : convertChainIdtoName(option)}
                  </Body>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SelectDropdown;
