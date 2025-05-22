import { useState, useRef, useEffect } from "react";

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

const CustomSelect: React.FC<CustomSelectProps> = ({ options, placeholder, currentValue, itemValue = "id", itemText = "name", onChange, withIcon, itemIcon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentValue) {
      setSelected(currentValue);
    }
  }, [currentValue]);

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

  return (
    <div ref={dropdownRef} className="relative w-36">
      {/* Активатор */}
      <SelectActivator
        isOpen={isOpen}
        option={selected}
        placeholder={placeholder}
        itemText={itemText}
        itemIcon={itemIcon}
        withIcon={withIcon}
        toggleDropdown={toggleDropdown}
      />

      {/* Список опций */}
      {isOpen && (
        <SelectDropdown
          options={options}
          itemValue={itemValue}
          itemText={itemText}
          withIcon={withIcon}
          itemIcon={itemIcon}
          handleOptionClick={handleOptionClick}
        />
      )}
    </div>
  );
};

export default CustomSelect;