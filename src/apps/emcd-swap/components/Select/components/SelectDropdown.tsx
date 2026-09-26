import React from 'react'

import cx from 'classnames';

import { Option } from '../Select';
import SelectOption from './SelectOption';

const SelectDropdown: React.FC<{
  options: Option[];
  itemValue: string;
  itemText: string;
  withIcon?: boolean;
  itemIcon?: string;
  id: string;
  handleOptionClick: (option: Option) => void;
  highlightedIndex: number;
}> = ({ options, itemValue, itemText, handleOptionClick, withIcon, itemIcon, highlightedIndex, id }) => {
  return (
    <ul
      id={id}
      role="listbox"
      tabIndex={-1}
      className="absolute left-0 right-0 mt-1 rounded-sm bg-bg-2 border border-color-7 shadow-md z-10 max-h-61.25 overflow-y-auto"
    >
      {options.map((option, index) => {
        const isHighlighted = highlightedIndex === index;

        return (
          <li
            key={option[itemValue] ?? option["id"]}
            role="option"
            aria-selected={isHighlighted}
            className={cx(
              'cursor-pointer hover:bg-color-9 px-3 py-2 transition-all',
              { 'bg-color-9': isHighlighted }
            )}
            onClick={() => handleOptionClick(option)}
          >
            <SelectOption
              option={option}
              withIcon={withIcon}
              itemIcon={itemIcon}
              itemText={itemText}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default SelectDropdown;