import React from 'react';

interface SelectActivatorProps {
  isOpen: boolean;
  withIcon?: boolean;
  itemIcon?: string;
  itemText?: string;
  placeholder: string;
  option: Record<string, any> | null;
  toggleDropdown: () => void;
}

const SelectActivator:React.FC<SelectActivatorProps> = ({ isOpen, toggleDropdown, withIcon, option, itemIcon, itemText, placeholder }) => {
  return (
    <button
      onClick={toggleDropdown}
      className="w-full rounded-sm bg-bg-8 border border-color-7 hover:border-brand px-3 py-2 text-left flex items-center justify-between"
    >
      <div className={'flex items-center gap-x-2'}>
        {withIcon && (
          <div className={'w-4 h-4'}>
            <img src={option && itemIcon ? option[itemIcon] : ''} alt={option && itemText ? option[itemText] : ''} />
          </div>
        )}
        <span className='text-sm text-color-1'>{ option && itemText  ? option[itemText] : placeholder }</span>
      </div>
      <svg
        className={`w-4 h-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
  );
};

export default SelectActivator;