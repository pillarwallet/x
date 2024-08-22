// hooks
import { useAppDispatch, useAppSelector } from '../../hooks/useReducerHooks';

// reducer
import { setIsSelectChainDropdownOpen } from '../../reducer/tokenAtlasSlice';

// components
import Body from '../Typography/Body';

// images
import ArrowDown from '../../images/arrow-down.svg';

type SelectChainDropdownProps = {
  className?: string;
};

const SelectChainDropdown = ({ className }: SelectChainDropdownProps) => {
    const dispatch = useAppDispatch();
    const isSelectChainDropdownOpen = useAppSelector((state) => state.tokenAtlas.isSelectChainDropdownOpen as boolean);
    
    const handleDropdownToogle = () => {
        dispatch(setIsSelectChainDropdownOpen(!isSelectChainDropdownOpen));
    };

    const DUMMY_CHAIN_LIST = ['ethereum', 'gnosis', 'base', 'polygon'];
    return (
        <div className={`relative ${className}`}>
            <button
                className={`flex justify-between items-center w-full h-full p-4 bg-medium_grey rounded focus:outline-none ${isSelectChainDropdownOpen && 'border-b border-dark_grey'}`}
                onClick={handleDropdownToogle}
            >
                <Body className="text-[17px] mobile:text-[15px] font-medium leading-5 line-clamp-1">Select chain</Body>
                <img src={ArrowDown} className={`transform ${isSelectChainDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isSelectChainDropdownOpen && (
                <div className="absolute top-full left-0 bg-medium_grey rounded-b w-full max-h-[400px] border-[1px] border-dark_grey overflow-y-auto capitalize z-50">
                    <ul>
                        {DUMMY_CHAIN_LIST.map((option) => (
                            <li
                                key={option}
                                className="px-4 py-2 cursor-pointer hover:bg-light_grey hover:text-dark_grey border-b border-dark_grey last:border-none"
                            >
                                <Body className="text-base mobile:text-sm font-medium">{option}</Body>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SelectChainDropdown;
