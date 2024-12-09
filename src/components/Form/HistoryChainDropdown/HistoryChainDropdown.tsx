import { useState } from 'react';
import { BiCheckboxChecked } from 'react-icons/bi';
import { IoIosArrowDown } from 'react-icons/io';

// hooks
import { useSelectedChains } from '../../../hooks/useSelectedChainsHistory';

// utils
import { getChainName } from '../../../utils/blockchain';

const HistoryChainDropdown = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { selectedChains, setSelectedChains } = useSelectedChains();

  const allChainsOptions = [
    {
      chainId: 1,
      chainName: 'Ethereum',
    },
    {
      chainId: 137,
      chainName: 'Polygon',
    },
    {
      chainId: 8453,
      chainName: 'Base',
    },
    {
      chainId: 100,
      chainName: 'Gnosis',
    },
  ];

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
  };

  const toggleChainSelection = (chainId: number) => {
    setSelectedChains((prevSelected) =>
      prevSelected.includes(chainId)
        ? prevSelected.filter((id) => id !== chainId)
        : [...prevSelected, chainId]
    );
  };

  return (
    <div
      className="relative flex justify-center items-center mb-8"
      onMouseLeave={() => setIsOpen(false)}
      id="history-chain-dropdown"
    >
      <button
        type="button"
        className={`flex justify-between items-center w-[70%] h-full py-2 px-4 ${isOpen ? 'bg-[#120f17] rounded-t-xl border-[1px] border-[#e2ddff1a]' : 'bg-[#e2ddff1a] : rounded-full'} focus:outline-none`}
        onClick={handleDropdownToggle}
      >
        <p className="text-[14px] text-[#e2ddff4d] font-light">Select chain</p>
        <IoIosArrowDown
          size={16}
          color="#e2ddff"
          className={`transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div
          className="absolute left-0 right-0 mx-auto w-[70%] bg-[#120f17] rounded-b-xl border-[1px] border-[#e2ddff1a] border-t-[4px] rounded-t-none  overflow-y-auto capitalize z-50"
          style={{ top: '100%' }}
        >
          <ul>
            {allChainsOptions.map((option) => (
              // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
              <li
                key={option.chainId}
                className="px-4 py-2 cursor-pointer flex items-center justify-between"
                onClick={() => toggleChainSelection(option.chainId)}
              >
                <p
                  className={`text-[14px] font-light ${
                    selectedChains.includes(option.chainId)
                      ? 'text-white'
                      : 'text-[#e2ddff4d]'
                  }`}
                >
                  {getChainName(option.chainId)}
                </p>
                <BiCheckboxChecked
                  size={20}
                  color={`${
                    selectedChains.includes(option.chainId)
                      ? '#8A77FF'
                      : '#e2ddff4d'
                  }`}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HistoryChainDropdown;
