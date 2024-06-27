import { useContext } from 'react';
import ArrowDown from '../../images/arrow-down.png';
import Body from '../Typography/Body';
import { SwapDataContext } from '../../context/SwapDataProvider';

type DropdownProps = {
  options: string[];
  onClick: () => void;
  onSelect: () => void;
  isOpen: boolean;
  className?: string;
};

const SelectDropdown = ({ options, onClick, onSelect, isOpen, className }: DropdownProps) => {
  const { swapChain, setSwapChain, receiveChain, setReceiveChain, isSwapOpen, isReceiveOpen } = useContext(SwapDataContext);

  const handleSelect = (option: string) => {
    if (isSwapOpen) {
      setSwapChain(Number(option));
    }
    if (isReceiveOpen) {
      setReceiveChain(Number(option));
    }
    onSelect();
  };

  return (
    <div className={`${className} h-[34px]`}>
        <button
          type="button"
          className="flex justify-between w-full h-full p-2 bg-white rounded-[3px] focus:outline-none"
          onClick={onClick}
        >
            {isOpen && <Body className='text-[#717171]'>Select a chain</Body>}
            
            <Body className='text-black'>{isSwapOpen ? swapChain : receiveChain}</Body>
            <img src={ArrowDown}/>
        </button>
        {isOpen && (
          <div className="relative bg-white border border-t-black rounded-[3px] w-full max-h-[344px] overflow-y-auto">
            <ul>
              {options.map((option) => (
                <li
                  key={option}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-blue-600 border-b last:border-none"
                  onClick={() => handleSelect(option)}
                >
                  <Body className='border-b-[#8C8C8C]/[.1]'>{option}</Body>
                </li>
              ))}
            </ul>
          </div>
      )}
    </div>
  );
};

export default SelectDropdown;
