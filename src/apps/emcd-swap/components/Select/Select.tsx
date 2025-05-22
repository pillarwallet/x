import React, { useState, useRef, useEffect } from "react";

import SelectActivator from './components/SelectActivator';
import SelectDropdown from './components/SelectDropdown';

export type Option = Record<string, any>;

interface CustomSelectProps {
  options: Option[];
  currentValue: Record<string, any> | null;
  placeholder: string;
  itemValue?: string;
  itemText?: string; // Поле для отображения текста (по умолчанию "name")
  withIcon?: boolean;
  itemIcon?: string;
  onChange?: (value: any) => void; // Callback при выборе
}

const CustomSelect: React.FC<CustomSelectProps> = ({
                                                     options,
                                                     placeholder,
                                                     currentValue,
                                                     itemValue = "id",
                                                     itemText = "name",
                                                     onChange,
                                                     withIcon,
                                                     itemIcon,
                                                   }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentValue) {
      setSelected(currentValue);
      const currentIndex = options.findIndex(
        (opt) => opt[itemValue] === currentValue[itemValue]
      );
      if (currentIndex !== -1) setHighlightedIndex(currentIndex);
    }
  }, [currentValue, options, itemValue]);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleOptionClick = (option: Option) => {
    setSelected(option);
    onChange && onChange(option);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape" && isOpen) {
      setIsOpen(false);
    } else if (e.key === "Enter") {
      if (isOpen) {
        handleOptionClick(options[highlightedIndex]);
      } else {
        setIsOpen(true);
      }
    } else if (e.key === "ArrowDown" && isOpen) {
      setHighlightedIndex((prev) => (prev + 1) % options.length);
      e.preventDefault();
    } else if (e.key === "ArrowUp" && isOpen) {
      setHighlightedIndex((prev) => (prev - 1 + options.length) % options.length);
      e.preventDefault();
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="relative w-36"
      tabIndex={0} // чтобы фокус был на div
      onKeyDown={handleKeyDown}
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-controls="select-listbox"
      aria-activedescendant={
        isOpen && options[highlightedIndex]
          ? `option-${options[highlightedIndex][itemValue]}`
          : undefined
      }
    >
      <SelectActivator
        isOpen={isOpen}
        option={selected}
        placeholder={placeholder}
        itemText={itemText}
        itemIcon={itemIcon}
        withIcon={withIcon}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        toggleDropdown={toggleDropdown}
      />

      {isOpen && (
        <SelectDropdown
          options={options}
          itemValue={itemValue}
          itemText={itemText}
          withIcon={withIcon}
          itemIcon={itemIcon}
          handleOptionClick={handleOptionClick}
          highlightedIndex={highlightedIndex}
        />
      )}
    </div>
  );
};

export default CustomSelect;