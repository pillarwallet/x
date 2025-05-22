import React, { useState, useRef, useEffect } from "react";

import SelectActivator from './components/SelectActivator';
import SelectDropdown from './components/SelectDropdown';

export interface Option {
   [key: string]: any;
   id?: string | number;
   name?: string;
   icon_url?: string;
}
interface CustomSelectProps {
  options: Option[];
  currentValue: Record<string, any> | null;
  placeholder: string;
  itemValue?: string;
  itemText?: string; // Field for displaying text (default is "name")
  withIcon?: boolean;
  itemIcon?: string;
  className?: string; // Allow additional classes for styling
  onChange?: (value: Option) => void; // Callback when an option is selected
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  placeholder,
  currentValue,
  itemValue = "id",
  itemText = "name",
  onChange,
  withIcon,
  className,
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
    } else {
      setSelected(null)
      setHighlightedIndex(0);
    }
  }, [currentValue, options, itemValue]);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleOptionClick = (option: Option) => {
    setSelected(option);
    onChange?.(option);
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
    } else if (e.key === "Enter" || e.key === " ") {
      if (isOpen) {
        if (options.length > 0) {
          handleOptionClick(options[highlightedIndex]);
        }
      } else {
        setIsOpen(true);
      }
      e.preventDefault(); // Prevent page scroll for Space key
    } else if (e.key === "ArrowDown" && isOpen) {
      if (options.length > 0) {
        setHighlightedIndex((prev) => (prev + 1) % options.length);
      }
      e.preventDefault();
    } else if (e.key === "ArrowUp" && isOpen) {
      if (options.length > 0) {
        setHighlightedIndex((prev) => (prev - 1 + options.length) % options.length);
      }
      e.preventDefault();
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative w-36 ${className || ''}`}
      tabIndex={0} // to allow div to receive focus
      onKeyDown={handleKeyDown}
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-controls="select-listbox"
      aria-activedescendant={
        isOpen && options.length > 0 && options[highlightedIndex]
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
        toggleDropdown={toggleDropdown}
      />

      {isOpen && (
        <SelectDropdown
          id="select-listbox"
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