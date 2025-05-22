import React from 'react'

import { Option } from '../Select';
import SelectOption from './SelectOption';

const SelectDropdown: React.FC<{
  options: Option[];
  itemValue: string;
  itemText: string;
  withIcon?: boolean;
  itemIcon?: string;
  handleOptionClick: (option: Option) => void;
}> = ({ options, itemValue, itemText, handleOptionClick, withIcon, itemIcon }) => {
  return (
    <ul className="absolute left-0 right-0 mt-1 rounded-sm bg-bg-2 border border-border shadow-md z-10 max-h-61.25 overflow-y-auto">
      {options.map((option) => (
        <SelectOption
          key={option[itemValue] ?? option["id"]}
          option={option}
          withIcon={withIcon}
          itemIcon={itemIcon}
          onClick={() => handleOptionClick(option)}
          itemText={itemText}
        />
      ))}
    </ul>
  );
};

export default SelectDropdown;