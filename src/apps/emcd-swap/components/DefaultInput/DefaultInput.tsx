import React, { useEffect, useState } from 'react';

interface DefaultInputProps {
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
}

const DefaultInput:React.FC<DefaultInputProps> = ({ value, onChange, placeholder }) => {
  const [stateValue, setStateValue] = useState('');

  useEffect(() => {
    if (value) {
      setStateValue(value)
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStateValue(e.target.value);
    onChange(e.target.value);
  }

  return (
    <div className='w-full'>
      <input placeholder={placeholder} value={stateValue} aria-label={placeholder || "Default input"} onChange={handleChange} className='w-full bg-bg-6 p-4 text-color-1 border border-bg-2 hover:border-brand-hover focus:border-brand-active text-sm outline-none rounded-sm transition-all' />
    </div>
  );
};

export default DefaultInput;