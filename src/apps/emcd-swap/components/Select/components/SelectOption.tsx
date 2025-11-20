// Интерфейс пропсов
import { Option } from '../Select';

interface SelectOptionProps<T extends Option> {
  option: T;
  itemText: keyof T;
  withIcon?: boolean;
  itemIcon?: keyof T;
}

// Компонент
const SelectOption = <T extends Option>({
  option,
  itemText,
  itemIcon,
  withIcon,
}: SelectOptionProps<T>) => (
  <li
    className="flex items-center gap-x-2 cursor-pointer px-3 py-2"
  >
    {withIcon && (
      <div className='w-4 h-4'>
        <img src={itemIcon && option[itemIcon]} alt={option[itemText]} />
      </div>
    )}
    <div className='text-sm'>{option[itemText]}</div>
  </li>
);

export default SelectOption;
